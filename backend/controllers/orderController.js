const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body; 

    const order = await Order.create({                 //storing order in DB
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    })
});


//get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {

    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user", "name email");     //req,params.id will fetch order id, now from the fetched orderid, user field's value will be taken, populate function will take the fetched value of user field from order id, and find it in user table, will only fetch name and email properties from the user table of the particular user whose id we fatched from order id's user field value

    if(!order){
        return next( new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success:true,
        order,
    })
});


//get LoggedIn user orders(person who loggedin can see only his/her orders)
exports.myOrders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find({user: req.user._id});      //will find all the orders of that user who logged in, will match the logged in user's id with the ids present in each order, if id matches, will fetch

    res.status(200).json({
        success:true,
        orders,
    })
});

//get all orders as admin
exports.getAllorders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find();      //will fetch all orders


    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice          //total amount will store the total sum of all the orders received
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    });
});

//update orders status --- admin only
exports.updateOrder = catchAsyncErrors( async (req, res, next) => {

    const order = await Order.findById(req.params.id);      //will fetch orderid from url and then will find in db

    if(!order){
        return next( new ErrorHandler("Order not found with this Id", 404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You Have already delivered this Product", 400));
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);           //order.product, order.quantity fetching from DB, from that particular order
    });

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
        message: "Product Updated"
    });
});


async function updateStock(id, quantity){
    const product = await Product.findById(id);              //id getting from ref from order table

    product.Stock = product.Stock - quantity;

    await product.save({ validateBeforeSave: false});       //saving to DB
}



//delete Order as admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id);      //will fetch all order from url

    if(!order){
        return next( new ErrorHandler("Order not found with this Id", 404));
    }

    await order.remove();             //delete query

    res.status(200).json({
        success:true,
        message: "Product deleted Successfully",
    });
});