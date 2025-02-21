const { json } = require("express");
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = req.query.limit || "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,duration";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      requestedAt: req.requestTime,
      status: "fail",
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    //const newTour=new Tour();
    //newTour.save();

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      requestedAt: req.requestTime,
      status: "success",
      message: "New tour created",
      data: newTour,
    });
  } catch (error) {
    res.status(400).json({
      requestedAt: req.requestTime,
      status: "fail",
      message: error,
    });
  }
};

exports.getToursById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id:req.params.id})
    res.status(200).json({
      requestedAt: req.requestTime,
      status: "success",
      message: "Tour fetched successfully",
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      requestedAt: req.requestTime,
      status: "fail",
      message: error.message,
    });
  }
};

exports.updatedTours = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      requestedAt: req.requestTime,
      status: "success",
      message: "Tour Updated successfully",
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      requestedAt: req.requestTime,
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteTours = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { rating: { $gte: 4.3 } },
      },
      {
        $group: {
          _id: '$rating',
          numTours: { $sum: 1 },
          numRating: { $sum: "$rating" },
          avgRating: { $avg: "$rating" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgRating:1 },
      },
      {
        $match:{_id:{$ne:'4.5'}}
      }
    ]);
    res.status(200).json({
      requestedAt: req.requestTime,
      status: "success",
      message: "Tour fetched successfully",
      data: stats,
    });
    console.log("Aggregation Result:", stats);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
