
const Tour=require('./../models/tourModel');

exports.getAllTours = async(req, res) => {
 res.status(200).json({
   requestedAt: req.requestTime,
   status: "success",
   message: "All tours fetched successfully",
   data: await Tour.find(),
 })
};

exports.createTour = async (req, res) => {
 try {
   //const newTour=new Tour();
  //newTour.save();
  
 const newTour=await Tour.create(req.body)
 res.status(201).json({
   requestedAt:req.requestTime,
   status: "success",
   message: "New tour created",
   data: newTour,
 })
 } catch (error) {
  res.status(400).json({
    requestedAt: req.requestTime,
    status: "fail",
    message: error,
  })
 }
};

// exports.getToursById = (req, res) => {
 
// };

// exports.updatedTours = (req, res) => {
 
// };

// exports.deleteTours = (req, res) => {
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };
