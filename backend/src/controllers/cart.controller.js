import cartModel from "../models/card.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import  mongoose  from "mongoose";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";


export const addToCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body;

    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product or variant not found",
        success: false,
      });
    }

    const variant = product.variants.id(variantId);

    const stock = variant.stock;

    let cart =
      (await cartModel.findOne({ user: req.user._id })) ||
      (await cartModel.create({ user: req.user._id }));

    const cartItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId
    );

    if (cartItem) {
      if (cartItem.quantity + Number(quantity) > stock) {
        return res.status(400).json({
          message: `Only ${stock - cartItem.quantity} items left in stock. You already have ${cartItem.quantity} items in your cart`,
          success: false,
        });
      }

      cartItem.quantity += Number(quantity);
      await cart.save();

      return res.status(200).json({
        message: "Cart updated successfully",
        success: true,
        cart,
      });
    }

    if (Number(quantity) > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock`,
        success: false,
      });
    }

    cart.items.push({
      product: productId,
      variant: variantId,
      quantity: Number(quantity),
      price: {
        amount: variant.price.amount,
        currency: variant.price.currency || "INR",
      },
    });

    await cart.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const result = await getCartDetails(req.user._id);

    // Aggregation array return karti hai
    let cart = Array.isArray(result) ? result[0] : result;

    if (!cart) {
      await cartModel.create({
        user: req.user._id,
        items: [],
      });

      cart = {
        items: [],
        totalPrice: 0,
        currency: "INR",
      };
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Get cart error:", error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const incrementCartItemQuantity = async (req, res) => {

  const {productId, variantId} = req.params

  const product = await productModel.findOne({

    _id: productId,
    "variants._id": variantId

  })

  if(!product){
    return res.status(404).json({
      message: "Product or variant not found",
      success: false
    })
  }

  const cart = await cartModel.findOne({user: req.user._id})

  if(!cart){
    return res.status(404).json({
      message: "Cart not found",
      success: false
    })
  }

  const stock = await stockOfVariant(productId, variantId)

  const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && 
  item.variant?.toString() == variantId)?.quantity || 0

  if(itemQuantityInCart + 1> stock){
    return res.status(400).json({
      message: `Only ${stock} items left in stock, and you already have ${itemQuantityInCart} item.`,
      success: true
    })
  }

const updatedCart = await cartModel.findOneAndUpdate(
  {
    user: req.user._id,
    "items.product": productId,
    "items.variant": variantId,
  },
  {
    $inc: { "items.$.quantity": 1 },
  },
  { new: true }
);

 return res.status(200).json({
  message: "Cart item quantity incremented successfully.",
  success: true,
  cart: updatedCart,
});

}

export const decrementCartItemQuantity = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // quantity 1 hai to item remove kar do
    if (item.quantity === 1) {
      cart.items = cart.items.filter(
        (i) =>
          !(
            i.product.toString() === productId &&
            i.variant?.toString() === variantId
          )
      );
    } else {
      item.quantity -= 1;
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity decremented successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const removeCartItem = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.variant?.toString() === variantId
        )
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createOrderController = async (req, res) => {
  try {
    const result = await getCartDetails(req.user._id);

    const cart = Array.isArray(result) ? result[0] : result;

    if (!cart || !cart.items?.length) {
      return res.status(400).json({
        message: "Cart is empty",
        success: false,
      });
    }

    const order = await createOrder({
      amount: cart.totalPrice,
      currency: cart.currency || "INR",
    });

    const payment = await paymentModel.create({
      user: req.user._id,

      razorpay: {
        orderId: order.id,
      },

      price: {
        amount: cart.totalPrice,
        currency: cart.currency || "INR",
      },

      orderItems: cart.items.map((item) => ({
        title: item.product?.title,

        productId: item.product?._id,

        variantId: item.variant?._id,

        quantity: item.quantity,

        images:
          item.variant?.images?.length > 0
            ? item.variant.images
            : item.product?.images || [],

        description: item.product?.description,

        price: {
          amount:
            item.variant?.price?.amount ??
            item.cartPrice?.amount ??
            item.price?.amount,

          currency:
            item.variant?.price?.currency ??
            item.cartPrice?.currency ??
            item.price?.currency ??
            "INR",
        },
      })),
    });

    return res.status(200).json({
      message: "Order created successfully",
      success: true,
      order,
      paymentId: payment._id,
    });
  } catch (error) {
    console.log("Create order error:", error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const verifyOrderController = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    })

    if (!payment) {
        return res.status(400).json({
            message: "Payment not found",
            success: false
        })
    }

    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, config.RAZORPAY_KEY_SECRET)

    if (!isPaymentValid) {
        payment.status = "failed"
        await payment.save()

        return res.status(400).json({
            message: "Payment verification failed",
            success: false
        })
    }

    payment.status = "paid"

    payment.razorpay.paymentId = razorpay_payment_id
    payment.razorpay.signature = razorpay_signature

    await payment.save()

   return res.status(200).json({
  message: "Payment verified successfully",
  success: true,
  order: payment,
});
}


export const getMyOrdersController = async (req, res) => {
  try {
    const orders = await paymentModel
      .find({
        user: req.user._id,
        status: "paid",
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Get my orders error:", error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};



export const getSellerOrdersController = async (req, res) => {
  try {
    const sellerId = req.user._id.toString();

    const paidOrders = await paymentModel
      .find({
        status: "paid",
      })
      .populate({
        path: "user",
        select: "fullname email contact",
      })
      .populate({
        path: "orderItems.productId",
        select: "title seller",
      })
      .sort({ createdAt: -1 })
      .lean();

    const sellerOrders = paidOrders
      .map((order) => {
        const sellerItems = order.orderItems.filter((item) => {
          return (
            item.productId?.seller?.toString() === sellerId
          );
        });

        if (sellerItems.length === 0) {
          return null;
        }

        const sellerTotal = sellerItems.reduce((total, item) => {
          const price = Number(item.price?.amount || 0);
          const quantity = Number(item.quantity || 1);

          return total + price * quantity;
        }, 0);

        return {
          _id: order._id,

          razorpayOrderId: order.razorpay?.orderId,
          razorpayPaymentId: order.razorpay?.paymentId,

          paymentStatus: order.status,
          orderStatus: order.orderStatus,

          customer: order.user,

          items: sellerItems.map((item) => ({
            title: item.title,
            productId: item.productId?._id,
            variantId: item.variantId,
            quantity: item.quantity,
            description: item.description,
            images: item.images,
            price: item.price,
          })),

          totalAmount: sellerTotal,
          currency: sellerItems[0]?.price?.currency || "INR",

          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      message: "Seller orders fetched successfully",
      totalOrders: sellerOrders.length,
      orders: sellerOrders,
    });
  } catch (error) {
    console.log("Get seller orders error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSellerAnalyticsController = async (req, res) => {
  try {
    const sellerId = req.user._id.toString();

    const paidOrders = await paymentModel
      .find({
        status: "paid",
      })
      .populate({
        path: "orderItems.productId",
        select: "title category seller",
      })
      .sort({ createdAt: 1 })
      .lean();

    const now = new Date();

    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      return {
        date,
        key: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString("en-IN", {
          weekday: "short",
        }),
        revenue: 0,
        orders: 0,
      };
    });

    const weeklyMap = new Map(
      last7Days.map((day) => [day.key, day]),
    );

    const monthlyMap = new Map();
    const categoryMap = new Map();
    const productMap = new Map();
    const customerIds = new Set();

    let totalRevenue = 0;
    let totalOrders = 0;
    let totalProductsSold = 0;

    paidOrders.forEach((order) => {
      let sellerOrderFound = false;
      let sellerOrderRevenue = 0;

      const orderDate = new Date(order.createdAt);
      const dayKey = orderDate.toISOString().slice(0, 10);

      const monthKey = `${orderDate.getFullYear()}-${String(
        orderDate.getMonth() + 1,
      ).padStart(2, "0")}`;

      const monthLabel = orderDate.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      });

      order.orderItems.forEach((item) => {
        const product = item.productId;

        if (!product?.seller) return;

        if (product.seller.toString() !== sellerId) return;

        sellerOrderFound = true;

        const quantity = Number(item.quantity || 1);
        const price = Number(item.price?.amount || 0);
        const itemRevenue = price * quantity;

        totalRevenue += itemRevenue;
        totalProductsSold += quantity;
        sellerOrderRevenue += itemRevenue;

        const category = product.category || "Other";

        categoryMap.set(
          category,
          (categoryMap.get(category) || 0) + itemRevenue,
        );

        const productId = product._id.toString();

        if (!productMap.has(productId)) {
          productMap.set(productId, {
            productId,
            title: item.title || product.title || "Product",
            sold: 0,
            revenue: 0,
          });
        }

        const productStats = productMap.get(productId);

        productStats.sold += quantity;
        productStats.revenue += itemRevenue;
      });

      if (!sellerOrderFound) return;

      totalOrders += 1;

      if (order.user) {
        customerIds.add(order.user.toString());
      }

      if (weeklyMap.has(dayKey)) {
        const day = weeklyMap.get(dayKey);
        day.revenue += sellerOrderRevenue;
        day.orders += 1;
      }

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          key: monthKey,
          label: monthLabel,
          revenue: 0,
          orders: 0,
        });
      }

      const month = monthlyMap.get(monthKey);

      month.revenue += sellerOrderRevenue;
      month.orders += 1;
    });

    const weeklyData = last7Days.map((day) => ({
      date: day.key,
      label: day.label,
      revenue: day.revenue,
      orders: day.orders,
    }));

    const monthlyData = Array.from(monthlyMap.values())
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-6);

    const categoryData = Array.from(categoryMap.entries())
      .map(([name, revenue]) => ({
        name,
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      message: "Seller analytics fetched successfully",

      analytics: {
        summary: {
          totalRevenue,
          totalOrders,
          totalProductsSold,
          totalCustomers: customerIds.size,
        },

        weeklyData,
        monthlyData,
        categoryData,
        topProducts,
      },
    });
  } catch (error) {
    console.log("Seller analytics error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};