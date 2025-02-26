const express = require("express");
const tourRouter = require("./routes/tourRoutes");
const morgan = require("morgan");
const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController')

const app = express();

// ✅ Debugging middleware to track requests
app.use((req, res, next) => {
  console.log(`📢 Incoming request: ${req.method} ${req.url}`);
  next();
});

// ✅ Enable logging in development mode
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());


// ✅ Use tour routes
app.use("/api/v1/tours", tourRouter);

app.all('*', (req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server.`,404))
})

//error handling middleware
app.use(globalErrorHandler)

module.exports = app;
