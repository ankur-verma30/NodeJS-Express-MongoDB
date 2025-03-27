const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_IN,
  });

  res.status(201).json({
    status: "success",
    message: "User signed up successfully",
    token,
    user: newUser,
  });
});

exports.login=catchAsync(async (req,res,next)=>{
const {email,password}=req.body;

//1) If email and password exist
//2) check if the user exists and password is correct
//3) if everything is fine,send token to the client

if(!email || !password){
    next(new AppError('Please provide email and password',400));
    const token='';
    res.status(200).json({
        status:'success',
        token
    })
}
});
