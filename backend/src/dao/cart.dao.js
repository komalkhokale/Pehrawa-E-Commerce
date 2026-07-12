import cartModel from "../models/card.model.js";
import mongoose from "mongoose";

export async function getCartDetails(userId) {

  
   let cart = await cartModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId) ,
        },
      },

      {
        $unwind: "$items",
      },

      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productData",
        },
      },

      {
        $unwind: "$productData",
      },

      {
        $unwind: "$productData.variants",
      },

      {
        $match: {
          $expr: {
            $eq: [
              "$items.variant",
              "$productData.variants._id",
            ],
          },
        },
      },

      {
        $project: {
          _id: 1,

          product: {
            _id: "$productData._id",
            title: "$productData.title",
            description: "$productData.description",
            gender: "$productData.gender",
            category: "$productData.category",
          },

          variant: {
            _id: "$productData.variants._id",
            color: "$productData.variants.color",
            size: "$productData.variants.size",
            stock: "$productData.variants.stock",
            images: "$productData.variants.images",

            // Current/latest product price
            price: {
              amount: "$productData.variants.price.amount",
              currency: "$productData.variants.price.currency",
            },
          },

          // Price saved when item was added to cart
          cartPrice: {
            amount: "$items.price.amount",
            currency: "$items.price.currency",
          },

          quantity: "$items.quantity",

          // Total current/latest price ke basis par
          total: {
            $multiply: [
              "$items.quantity",
              "$productData.variants.price.amount",
            ],
          },

          currency: "$productData.variants.price.currency",
        },
      },

      {
        $group: {
          _id: "$_id",

          items: {
            $push: {
              product: "$product",
              variant: "$variant",
              cartPrice: "$cartPrice",
              quantity: "$quantity",
              total: "$total",
            },
          },

          totalPrice: {
            $sum: "$total",
          },

          currency: {
            $first: "$currency",
          },
        },
      },

      {
        $project: {
          _id: 0,
          items: 1,
          totalPrice: 1,
          currency: 1,
        },
      },
    ]);

    return cart
}