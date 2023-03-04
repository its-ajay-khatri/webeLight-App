const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");        //np need to install crypto, already preinstalled

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minlength: [4,"Name should contain atleast 8 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minLength: [8, "Plassword should contain atleast 8 characters"],
        select: false                                           //wont select passowrd while search() function is called
    },
    avtar:  {
        public_id: {
            type: String,
            required: true 
            }, 
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
});

userSchema.pre("save", async function(next){         //we cannot use this keyword inside arrowfnction, so declaring a normal one
    
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

//JWT token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}


//Compare password
userSchema.methods.comparePassword = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword, this.password);
}

//Generating password reset token
userSchema.methods.getResetPasswordToken = function () {

    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex"); //will generate a string of 20 random characters

    // Hashing and add to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");       

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;   //15 mins expire 

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);