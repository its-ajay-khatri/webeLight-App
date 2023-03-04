const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {

    const {token} = req.cookies;              //req. cookies is an object, property is used when the user is using cookie-parser middleware. This property is an object that contains cookies sent by the request

    if(!token){
        return next(new ErrorHandler("Please login to access this resource", 401))
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);       //only id instead of _id bcz storing the id in id while creating the token in userModel.js

    next();
});


exports.authorizeRoles = (...roles) => {     //...roles is an array
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){     //if not admin 
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }

        next();
    }
}
