import wishlistModel from "../models/wishlist.model.js";
import productModel from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product or variant not found",
      });
    }

    let wishlist =
      (await wishlistModel.findOne({ user: req.user._id })) ||
      (await wishlistModel.create({ user: req.user._id }));

    const exists = wishlist.items.some(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Item already in wishlist",
      });
    }

    wishlist.items.push({
      product: productId,
      variant: variantId,
    });

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const getWishlist = async (req, res) => {
  try {
    let wishlist = await wishlistModel
      .findOne({ user: req.user._id })
      .populate("items.product");

    if (!wishlist) {
      wishlist = await wishlistModel.create({ user: req.user._id });
    }

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const wishlist = await wishlistModel.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.variant?.toString() === variantId
        )
    );

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};