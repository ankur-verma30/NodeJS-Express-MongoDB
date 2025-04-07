const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRATION_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Set cookie with token
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role || "user",
  });

  createAndSendToken(newUser, 201, res);
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
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array  ["admin","lead-guide"]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      ); //Unrestricted access or forbidden
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(AppError("There is no user with email address.", 404));

  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to the user's email
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot a Password? Submit a PATCH request with your new password and password confirm to: ${resetURL}. \n If you didn't forgot your password ignore this email notification`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token",
      message,
    });
    res.status(200).json({
      status: "success",
      resetToken,
      message: "Reset password email sent",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Please try again",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the token
  const hashedPassword = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedPassword,
    passwordResetExpiresAt: { $gt: Date.now() },
  });

  //2)If token has not been expired, and there is a user,set the new password
  if (!user) return next(new AppError("Token is invalid or expired", 400)); //Bad Request

  //3)update the changed password property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();

  //4) Log the user in,send JWT
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)get the user from the collection
  const user = await User.findById(req.user.id).select("+password");

  //2)check if the posted current password is correct
  if (!(await correctPasswords(req.body.password, user.password)))
    return next(new AppError("The current password is incorrect", 400));

  //3)If yes,update the password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  //4)log user in,send JWT
  createAndSendToken(user, 200, res);
});
