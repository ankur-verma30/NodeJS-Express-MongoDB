const AppError = require("./../utils/appError");
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) =>
  new AppError("Invalid token, Please log in again", 401);

const handleJWTError = () => {
  const message = "Invalid token. Please log in again.";
  return new AppError(message, 401);
};

const handleTokenExpiredError = () => {
  const message = "Token has expired. Please log in again.";
  return new AppError(message, 401);
};

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  //Operational trusted error, send message to client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
  //Programming or other unknown error: don't leak error details
  else {
    console.error("ERROR:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    }
    if (err.name === "jsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleTokenExpiredError();
    sendErrorProd(err, res);
  }
};
