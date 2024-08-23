import createError from "http-errors";
import OrderModel from "./orderModel.js";
import ProductModel from "../product/productModel.js";
import { stripe } from "../server.js";

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
    //   console.log(req.body);
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

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find({ user: req.user._id });
    if (!orders) {
      return next(createError(404, "No orders found"));
    }

    res.status(201).send({
      status: true,
      message: "Getting all orders fetched successfully",
      totalorders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error in getting all orders", error.stack || error.message);
    console.error("Internal Server Error");
  }
};

export const getSingleOrder = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return next(createError(404, "Order not found"));
    }
    res.status(201).send({
      status: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error(
      "Error in getting single order",
      error.stack || error.message
    );
    console.error("Internal Server Error");
  }
};

export const payment = async (req, res, next) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount) {
      return next(createError(404, "Total Amount is required"));
    }

    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
    });

    res.status(200).send({
      status: true,
      client_secret,
    });
  } catch (error) {
    console.error("", error.stack || error.message);
    console.error("Internal Server Error");
  }
};

export const adminGetAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find({});

    res.status(200).send({
      success: true,
      message: "All orders data",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error();
    console.error(500, "Internal server error");
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return next(createError(404, "Order not found"));
    }
    if (order.orderStatus === "Processing") order.orderStatus = "Shipped";
    else if (order.orderStatus === "Shipped") {
      order.orderStatus = "Delivered";
      order.deliveredAt = Date.now();
    } else {
      return next(
        createError(500, "Order already delivered or invalid status")
      );
    }

    await order.save();

    res.status(200).send({
      status: true,
      message: "order status updated",
    });
  } catch (error) {
    console.error("Error updating order status:", error.stack || error.message);
    console.error(500, "Internal server error");
  }
};
