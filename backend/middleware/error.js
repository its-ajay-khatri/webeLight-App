const ErrorHandler = require('../utils/errorHandler');
const ErorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    //Wrong MongoDB Error
    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400);
    }

    //JSON Webtoken error
    if(err.name === 'JsonWebTokenError'){
        const message = `JSON Web Token is invalid try again`;
        err = new ErrorHandler(message, 400);
    }


    //JWT Expire error
    if(err.name === 'TokenExpiredError'){
        const message = `JSON Web Token is expired, Try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        //error: err.stack                        will provide path
        error: err.message
    })
}