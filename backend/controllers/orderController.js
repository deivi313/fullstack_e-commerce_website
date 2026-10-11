import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing orders using cash on delivery method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
    };

    await orderModel.create(orderData);

    await userModel.update({ cartData: {} }, { where: { id: userId } });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe method
const placeOrderStripe = async (req, res) => { };

// Placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => { };

// All orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.findAll();
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User orders data
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.findAll({ where: { userId } });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order Status from Admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.update({ status }, { where: { id: orderId } });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};