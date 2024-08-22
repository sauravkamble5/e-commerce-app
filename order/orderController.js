import createError from "http-errors";
import OrderModel from "./orderModel.js";
import ProductModel from "../product/productModel.js";

export const createOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingCharges,
      totalAmount,
    } = req.body;

    // if (
    //   !shippingInfo ||
    //   !orderItems ||
    //   !paymentMethod ||
    //   !paymentInfo ||
    //   !itemsPrice ||
    //   !taxPrice ||
    //   !shippingCharges ||
    //   !totalAmount ||
    //   !orderStatus
    // ) {
    //   console.log(req.body)
    //   return next(createError(400, "All fields are required"));
    // }

    const order = await OrderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingCharges,
      totalAmount,
    });
    console.log(order);

    //Stock update
    for (let i = 0; i < orderItems.length; i++) {
      const product = await ProductModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      status: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error in creating order", error.stack || error.message);
    console.error("Internal server error");
  }
};
