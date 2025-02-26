const express = require("express");
const tourRouter = require("./routes/tourRoutes");
const morgan = require("morgan");

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
  // return res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server.`
  // })
  const error=new Error(`Can't find ${req.originalUrl} on this server`);
  error.status='fail';
  error.statusCode=404;
  next(error);
})

//error handling middleware
app.use((error,req,res,next)=>{
error.statusCode = error.statusCode || 500;
error.status=error.status || 'error';
return res.status(error.statusCode).json({
  status: error.status,
  message: error.message, 
})
})

module.exports = app;
