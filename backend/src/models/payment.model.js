import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["confirmed", "packed", "shipped", "delivered", "cancelled"],
      default: "confirmed",
    },

    price: {
      amount: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "JPY", "INR"],
        default: "INR",
      },
    },

    razorpay: {
      orderId: {
        type: String,
        required: true,
      },

      paymentId: {
        type: String,
        default: null,
      },

      signature: {
        type: String,
        default: null,
      },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        title: String,

        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },

        variantId: {
          type: mongoose.Schema.Types.ObjectId,
        },

        quantity: {
          type: Number,
          default: 1,
        },

        description: String,

        images: [
          {
            url: String,
          },
        ],

        price: {
          amount: {
            type: Number,
            required: true,
          },

          currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "INR"],
            default: "INR",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const paymentModel = mongoose.model("payment", paymentSchema);

export default paymentModel;


