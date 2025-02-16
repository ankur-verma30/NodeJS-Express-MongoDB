const { json } = require("express");
const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    console.log("Request Query object", req.query);
    // 1) simple filtering method
    const excludedFields = ["page","sort","limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);

    // 2) Advanced filtering object containing greater than or less than symbols
    const queryStr = JSON.stringify(queryObj);
    const newQueryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$ ${match}`
    );
    // console.log("New Query String object", JSON.parse(newQueryStr));
    const newQueryObj = JSON.parse(newQueryStr);
    let query = Tour.find(newQueryObj);
    
    // {difficulty:'easy',durations:{$gte:5}} in mongoDB
    // { duration: { gte: '5' }, difficulty: 'easy' } we get from req.query
    // 3) Sorting the results on the basis of the certain properties
    if(req.query.sort){
      const sortBy=req.query.sort.split(',').join(' ');
      console.log("Sort by ", sortBy);
      query=query.sort(sortBy);
      //sortby(-price rating) //this is taken by mongoose
    }
    else{
      query=query.sort('_id');
    }
    const tours = await query;

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
