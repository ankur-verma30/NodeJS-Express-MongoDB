const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = req.query.limit || "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,duration";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limiting()
    .pagination();
  const tours = await features.query;
  res.status(200).json({
    requestedAt: req.requestTime,
    status: "success",
    message: "All tours fetched successfully",
    data: tours,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    requestedAt: req.requestTime,
    status: "success",
    message: "New tour created",
    data: newTour,
  });
});

exports.getToursById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  //Tour.findOne({_id:req.params.id})
  if (!tour) {
    return next(new AppError("No Tour found with that ID", 404));
  }
  res.status(200).json({
    requestedAt: req.requestTime,
    status: "success",
    message: "Tour fetched successfully",
    data: tour,
  });
});

exports.updatedTours = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError("No Tour found with that ID", 404));
  }
  return res.status(200).json({
    requestedAt: req.requestTime,
    status: "success",
    message: "Tour Updated successfully",
    data: tour,
  });
});

exports.deleteTours = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError("No Tour found with that ID", 404));
  }
  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { rating: { $gte: 4.3 } },
    },
    {
      $group: {
        _id: "$rating",
        numTours: { $sum: 1 },
        numRating: { $sum: "$rating" },
        avgRating: { $avg: "$rating" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgRating: 1 },
    },
    {
      $match: { _id: { $ne: "4.5" } },
    },
  ]);
  res.status(200).json({
    requestedAt: req.requestTime,
    status: "success",
    message: "Tour fetched successfully",
    data: stats,
  });
  console.log("Aggregation Result:", stats);
});
