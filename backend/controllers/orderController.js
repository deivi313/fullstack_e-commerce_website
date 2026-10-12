import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"

//global variables
const currency = 'usd'
const deliveryCharge = 10

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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
const placeOrderStripe = async (req, res) => {
  try {

    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
    };

    const newOrder = await orderModel.create(orderData);

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }))

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'Delivery Charges'
        },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder.id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder.id}`,
      line_items,
      mode: 'payment',
    })

    res.json({ success: true, session_url: session.url })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body

  try {

    if (success === "true") {
      await orderModel.update({ payment: true }, { where: { id: orderId } })
      await userModel.update({ cartData: {} }, { where: { id: userId } });
      res.json({ success: true })
    } else {
      await orderModel.destroy({ where: { id: orderId } })
      res.json({ success: false })
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


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
  verifyStripe,
};