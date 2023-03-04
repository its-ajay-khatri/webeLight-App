const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require("../utils/ApiFeatures");

//Create Product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id;      //fetching current user's id

    const product = await Product.create(req.body);   //insert query, product will be created      

    res.status(201).json({
        success: true,
        product
    });
});


//get all Product
exports.getAllProducts = catchAsyncErrors(async (req,res) => {

    const resultPerPage = 8;

    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)   //req.query means ?keyword=samosa
    .search()                                                       //,search(), filter(), pagination() comes from /utils/apifeatures
    .filter().pagination(resultPerPage);                      

    //const products = await Product.find()         //fetching all products
    let products = await apiFeature.query;         //fetching all products

    let filteredProductsCount = products.length;      //fetching total number of filtered products

    apiFeature.pagination(resultPerPage);

    //products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        //filteredProductsCount,
    });
});


//Get Product Details

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);      //fetching the single product using the product id

    if(!product){
        return next(new ErrorHandler("Product Not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});

//Update Product  --Admin
exports.updateProduct = catchAsyncErrors(async (req,res, next) => {
    let product = await Product.findById(req.params.id);
    //console.log(product)
    //onsole.log(req.params.id, req.body)

    if(!product){
        return next(new ErrorHandler("Product Not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    });
});



//Delete product 

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not found", 404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Deleted"
    });
});



//--------------------------REVIEWS-------------------------------------------/

//Create New Review or Update the Review

exports.createProductReview = catchAsyncErrors( async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()     //review me jo user he uski id same h ya nai 
    );    

    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user._id.toString())
                (rev.rating = rating),(rev.comment = comment);
            
        });
    }
    else{
        product.reviews.push(review);                               //adding reviews to DB
        product.numOfReviews = product.reviews.length;              //fetching number of reviews(counts)
    }

    let avg = 0;

    product.reviews.forEach((rev) => {          
    avg += rev.rating;                       //total of all reviews(rev.ratings means rating inside reviews table(db))
    })

    product.ratings = avg / product.reviews.length;                      //product.ratings means parent //total reviews that partucular product have


    await product.save({ validateBeforeSave: false });             //saving ratings to db

    res.status(200).json({
        success: true,
        message:"ratings added successfully"
    });
});


//Get all reviews of product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);                //whole product details will be stored as object
    
    if(!product){
        return next( new ErrorHandler("Product Not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});


//Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);                //whole product details will be stored as object
    
    if(!product){
        return next( new ErrorHandler("Product Not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()    //req.query.id is review's id
    );          

    let avg = 0;

    reviews.forEach((rev) => {          
    avg += rev.rating;                       //total of all reviews(rev.ratings means rating inside reviews table(db))
    })

    const ratings = avg / reviews.length;                      //product.ratings means parent //total reviews that partucular product have

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, 
        {   reviews,
            ratings,
            numOfReviews,
        },
        {       //savings changes to db
            new: true,
            runValidators: true,
            useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
        message: "specific Review Deleted",
    });
});