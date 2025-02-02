const express = require("express");
const tourRouter = require("./routes/tourRoutes");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
const myMiddleware = (req, res, next) => {
  console.log("Hello from my middleware");
  next();
};

app.use(myMiddleware);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//routes
app.use("/api/v1/tours", tourRouter);

module.exports=app;