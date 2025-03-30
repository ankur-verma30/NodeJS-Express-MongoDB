const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_IN,
  });
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    message: "All users fetched successfully",
    data: users,
  });
});

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role:req.body.role || "user",
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    message: "User signed up successfully",
    token,
    user: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) If email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2) check if the user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPasswords(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401)); //401 is unauthorized
  }

  //3) if everything is fine,send token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and checking if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("You are not logged in", 401));

  //2) Verification of the token why promisify have used
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  //3) Check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError("User no longer exists", 401));

  //4)Check if the user changed password after the token was issued
  if (currentUser.changedPassword(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again", 401)
    );
  }
  //GRANT Access to the protected route
  req.user = currentUser;
  req.token = token;

  //5) Call the next middleware
  next();
});

exports.restrictTo= (...roles)=>{
return (req,res,next)=>{
  //roles is an array  ["admin","lead-guide"]
  if(!roles.includes(req.user.role)){
    return next(new AppError("You do not have permission to perform this action",403)); //Unrestricted access or forbidden
  }

  next();
}
}
