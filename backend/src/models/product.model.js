
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },

    stock: {
      type: Number,
      default: 0,
    },

    price: {
      amount: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "JPY", "INR"],
        default: "INR"
      },
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Unisex"],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "T-Shirt",
        "Shirt",
        "Jeans",
        "Pant",
        "Cargo",
        "Hoodie",
        "Sweatshirt",
        "Jacket",
        "Kurta",
        "Dress",
        "Top",
        "Skirt",
        "Saree",
      ],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    variants: [variantSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("product", productSchema);