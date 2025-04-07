const express = require("express");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const { default: helmet } = require("helmet");

const app = express();

//1) Set Security HTTP Headers
app.use(helmet());

// ✅ Debugging middleware to track requests
app.use((req, res, next) => {
  console.log(`📢 Incoming request: ${req.method} ${req.url}`);
  next();
});

// ✅ Enable logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//2) Limit Response from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

//3) Parse JSON request body
app.use(
  express.json({
    limit: "10kb",
  })
);

//Data sanitization againsts NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against cross site scripting vulnerabilities XSS
app.use(xssClean());

//4) Track request time and log it
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//Preventing the parameter pollution
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

// ✅ Use tour routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

//error handling middleware
app.use(globalErrorHandler);

module.exports = app;
