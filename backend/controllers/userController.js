const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require("../models/userModel");
const sendToken = require('../utils/jwtToken')
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");        //np need to install crypto, already preinstalled
const cloudinary = require('cloudinary');

//Register User
exports.registerUser = catchAsyncErrors( async (req, res, next) => {

    // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: "avatars",
    //     width: 150,
    //     crop: "scale"
    // })

    const {name, email, password} = req.body;

    const user = await User.create({
        name, email, password, 
        avtar:{
            public_id: "this is a sample id",
            url: "ProfilepicUrl",
        },
        // avtar:{
        //     public_id: myCloud.public_id,
        //     url: myCloud.secure_url,
        // },
    });

    sendToken(user, 201, res)
});


//Login User
exports.loginUser = catchAsyncErrors(async (req,res,next) => {

    const {email, password} = req.body;
    // checking if user has given a password and email both

    if(!email && !password) {
        return next(new ErrorHandler("Please enter Email or Password", 400))
    }

    const user = await User.findOne({email: email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const isPasswordMatched  = await user.comparePassword(password);               //compare password is present in userModel.js

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    //if user found/matched
    sendToken(user, 200, res)                                    //sendToken method is defined in utils/jwtToken.js
})


//logout user
exports.logout = catchAsyncErrors(async (req,res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});


//forgot password
exports.forgotPassword = catchAsyncErrors( async (req,res,next) => {

    const user = await User.findOne({email: req.body.email})        //user contains an object of all the values of the perticular user that is fatched from db

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }


    //get reset Password token
    const resetToken = user.getResetPasswordToken();                   //present in userModel.js

    await user.save({validateBeforeSave: false});            //saving token    

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n \n ${resetPasswordUrl} \n\n If you have not requested this email, then please Ignore it`;

    try{
        await sendEmail({             //sendEmail is in utils/sendEmail.js
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `email sent to ${user.email} successfully`
        })
    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});            //saving token    

        return next(new ErrorHandler(error.message, 500));
    }

});

//Reset password
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {
    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex"); 

    const user = await User.findOne({           //finding token fom db
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},          
    });

    if(!user){
        return next(new ErrorHandler("Reset Password token is invalid or has been expired", 400));
    } 

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doest not match", 400));
    }

    user.password = req.body.password;           //resetting the password if all the above conditons are met
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();     //saving resetted password to db

    sendToken(user, 200, res);          //will login
});



//------------------------BACKEND USER Roles ------------------------------------//

//Get User detail(self detail who loggedin)
//user already logged in
exports.getUserDetails = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findById(req.user.id);       //fetching particular user from db
    
    res.status(200).json({
        success: true,
        user,
    }); 
});


//update Password
exports.updatePassword = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");       //fetching particular user from db
 
    const isPasswordMatched  = user.comparePassword(req.body.oldPassword);               //compare password is present in userModel.js

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect", 400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password and Confirm password didn't match", 400))
    }

    user.password == req.body.newPassword;

    await user.save();                  //saving updated password to DB

    sendToken(user, 200, res);               //sendToken method is defined in utils/jwtToken.js
});


//update User Profile
exports.updateProfile = catchAsyncErrors( async (req, res, next) => {

   const newUserData = {
    name: req.body.name,
    email: req.body.email,
   }

   const user = await User.findByIdAndUpdate(req.user.id, newUserData,{     //saving the user data got from frontend by finding current logeedin user's Id
    new: true,
    runValidators: true,
    useFindAndModify: false,
   });             

    res.status(200).json({
        success: true,
    })
});


//get all users(logged as admin)
exports.getAllUser = catchAsyncErrors( async (req, res, next) => {
    const users = await User.find();               //will fetch all users

    res.status(200).json({
        success: true,
        users
    })
});

//get single user while logged as admin
exports.getSingleUser = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);               //will fetch the single particular user, id of the single user will be fetched from Url


    if(!user){
        return next(new ErrorHandler(`user does not exist with id ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
});


//update User Role
exports.updateUserRole = catchAsyncErrors( async (req, res, next) => {

    const newUserData = {
     name: req.body.name,
     email: req.body.email,
     role: req.body.role
    }
 
    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{     //saving the user data got from frontend by finding current logeedin user's Id
     new: true,
     runValidators: true,
     useFindAndModify: false,
    });             
 
     res.status(200).json({
         success: true,
         message: "User Updated Successfully"
     })
 });




 //Delete User Role as Admin
exports.deleteUser = catchAsyncErrors( async (req, res, next) => {
 
    const user = await User.findById(req.params.id);         //fetching the id of particular user from url
 

    if(!user){
        return next( new ErrorHandler(`user does not exist with id ${req.params.id}`, 404));
    }
    await user.remove();                  //will delete particular user from DB

     res.status(200).json({
         success: true,
         message: "User Deleted Successfully"
     })
 });