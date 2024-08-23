import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Product name is required"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required [ORDER_MODEL]"],
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required [ORDER_MODEL]"],
          min: [1, "Quantity cannot be less than 1 "],
        },
        image: {
          type: String,
          required: [true, "Product image is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User ID is required"],
    },
    paidAt: Date,
    paymentInfo: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
    },
    itemsPrice: {
      type: Number,
      required: [true, "Items price is required"],
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: [true, "Tax price is required"],
      default: 0.0,
    },
    shippingCharges: {
      type: Number,
      required: [true, "Shipping charges is reqiured"],
      default: 0.0,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      default: 0.0,
    },
    orderStatus: {
      type: String,
      required: [true, "Order status is required"],
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Processing",
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

const OrderModel =
  mongoose.models.Orders || mongoose.model("Orders", orderSchema);
export default OrderModel;
