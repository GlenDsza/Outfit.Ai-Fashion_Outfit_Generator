const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const { shippingInfo, products, paymentInfo } = req.body;
  const userId = req.user._id;
  const orderExist = await Order.findOne({ paymentInfo });

  if (orderExist) {
    return next(new ErrorHandler("Order Already Placed", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  products.map(async (prod) => {
    var order = await Order.create({
      shippingInfo,
      product: {
        article_id: prod.article_id,
        quantity: prod.quantity,
        price: prod.price,
      },
      paymentInfo,
      paidAt: Date.now(),
      user: user.customer_id,
    });
    if (
      !user.pastPurchases.some(
        (item) => item.article_id === order.product.article_id
      )
    ) {
      user.pastPurchases.push({
        article_id: order.product.article_id,
        purchaseDate: Date.now(),
      });
      await user.save();
      await updateStock(order.product.article_id, order.product.quantity);
    }
  });
  res.status(201).json({
    success: true,
  });
});

// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const orders = await Order.find({ user: user.customer_id });
  if (!orders) {
    return next(new ErrorHandler("Order Not Found", 404));
  }
  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find();

  if (!orders) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

// Update Order Status ---ADMIN
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Already Delivered", 400));
  }

  if (req.body.status === "Shipped") {
    order.shippedAt = Date.now();
    order.orderItems.forEach(async (i) => {
      await updateStock(i.product, i.quantity);
    });
  }

  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findOne({ article_id: id });
  product.stock -= quantity;
  const today = new Date().toDateString();
  const existingEntry = product.purchases.find(
    (entry) => entry.date.toDateString() === today
  );
  if (existingEntry) {
    existingEntry.count += quantity;
  } else {
    product.purchases.push({ date: new Date(today), count: 1 });
  }
  await product.save({ validateBeforeSave: false });
}

// Delete Order ---ADMIN
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
