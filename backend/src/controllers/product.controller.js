import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";
import paymentModel from "../models/payment.model.js"



export async function createProduct(req, res) {
  try {
    const {
      title,
      description,
      gender,
      category,
      color,
      size,
      stock,
      priceAmount,
      priceCurrency,
    } = req.body;

    const seller = req.user;
    
const images = await Promise.all(
  req.files.map(async (file) => {
    const image = await uploadFile({
      buffer: file.buffer,
      fileName: file.originalname,
    });

    console.log("Uploaded:", image.url);

    return image;
  })
);
console.log("BODY:", req.body);
console.log("FILES:", req.files);

    const product = await productModel.create({
      title,
      description,
      gender,
      category,
      seller: seller._id,

      variants: [
        {
          color,
          size,
          stock: Number(stock),

         price: {
  amount: priceAmount ? Number(priceAmount) : product.variants[0].price.amount,
  currency: priceCurrency || product.variants[0].price.currency || "INR",
},

          images,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getSellerProducts(req, res) {
    

    const seller = req.user;

    const products = await productModel.find({seller: seller._id})

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })

}


export async function getAllProducts(req, res) {

    const products = await productModel.find()

    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })


}


export async function getProductDetails(req, res) {

    const {id} = req.params;

    const product = await productModel.findById(id)

    if(!product){
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
    })
}



export async function addProductVariant(req, res) {
  try {
    const { productId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      color,
      size,
      stock,
      priceAmount,
      priceCurrency,
    } = req.body;

    // Duplicate check
    const variantExists = product.variants.find(
      (variant) =>
        variant.color.toLowerCase() === color.toLowerCase() &&
        variant.size === size
    );

    if (variantExists) {
      return res.status(400).json({
        success: false,
        message: "This variant already exists.",
      });
    }

    const images = req.files?.length
  ? await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      })
    )
  : [];
    product.variants.push({
      color,
      size,
      stock: Number(stock),

      price: {
        amount: Number(priceAmount),
        currency: priceCurrency || "INR",
      },

      images,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Variant added successfully",
      product,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}



export async function updateProduct(req, res) {
  try {
    const { productId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not allowed",
      });
    }

    const {
      title,
      description,
      gender,
      category,
      color,
      size,
      stock,
      priceAmount,
      priceCurrency,
    } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (gender) product.gender = gender;
    if (category) product.category = category;

    if (product.variants?.length > 0) {
      if (color) product.variants[0].color = color;
      if (size) product.variants[0].size = size;
      if (stock !== undefined) product.variants[0].stock = Number(stock);
      if (priceAmount !== undefined) {
        product.variants[0].price.amount = Number(priceAmount);
      }
      if (priceCurrency) {
        product.variants[0].price.currency = priceCurrency;
      }
    }

    if (req.files && req.files.length > 0) {
      const images = await Promise.all(
        req.files.map(async (file) => {
          return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
        })
      );

      product.images = images;
      if (product.variants?.length > 0) {
        product.variants[0].images = images;
      }
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { productId } = req.params;

    const product = await productModel.findOneAndDelete({
      _id: productId,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not allowed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateProductVariant(req, res) {
  try {
    const { productId, variantId } = req.params;
    const { color, size, stock, priceAmount, priceCurrency } = req.body;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    if (color) variant.color = color;
    if (size) variant.size = size;
    if (stock !== undefined) variant.stock = Number(stock);

    if (priceAmount !== undefined) {
      variant.price.amount = Number(priceAmount);
    }

    if (priceCurrency) {
      variant.price.currency = priceCurrency;
    }

    if (req.files && req.files.length > 0) {
      const images = await Promise.all(
        req.files.map(async (file) => {
          return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
        })
      );

      variant.images = images;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Variant updated successfully",
      variant,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteProductVariant(req, res) {
  try {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    product.variants.pull(variantId);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Variant deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}



export async function getSellerDashboard(req, res) {
  try {
    const sellerId = req.user._id.toString();

    // Seller ke saare products
    const products = await productModel.find({
      seller: req.user._id,
    });

    let totalStock = 0;
    let inventoryValue = 0;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach((product) => {
      product.variants.forEach((variant) => {
        const stock = Number(variant.stock || 0);
        const price = Number(variant.price?.amount || 0);

        totalStock += stock;
        inventoryValue += stock * price;

        if (stock === 0) {
          outOfStock += 1;
        } else if (stock <= 5) {
          lowStock += 1;
        }
      });
    });

    // Saare paid payments, product ke seller ke saath
    const paidPayments = await paymentModel
      .find({
        status: "paid",
      })
      .populate({
        path: "orderItems.productId",
        select: "seller",
      })
      .lean();

    let revenue = 0;
    let totalOrders = 0;

    const customerIds = new Set();

    paidPayments.forEach((payment) => {
      let sellerOrderFound = false;

      payment.orderItems.forEach((item) => {
        const productSellerId =
          item.productId?.seller?.toString();

        if (productSellerId === sellerId) {
          const price = Number(item.price?.amount || 0);
          const quantity = Number(item.quantity || 1);

          revenue += price * quantity;
          sellerOrderFound = true;
        }
      });

      if (sellerOrderFound) {
        totalOrders += 1;

        if (payment.user) {
          customerIds.add(payment.user.toString());
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Seller dashboard fetched successfully",

      dashboard: {
        totalProducts: products.length,
        totalStock,
        inventoryValue,
        lowStock,
        outOfStock,

        revenue,
        profit: revenue,
        expenses: 0,

        totalOrders,
        totalCustomers: customerIds.size,
      },
    });
  } catch (error) {
    console.log("Seller dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}