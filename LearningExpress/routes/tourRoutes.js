const express = require("express");
const tourController = require("../controllers/tourController");
const authController=require("../controllers/authController");

const router = express.Router();
const {
  getAllTours,
  createTour,
  getToursById,
  updatedTours,
  deleteTours,
  aliasTopTours,
  getTourStats,
} = tourController;

const {protect}=authController;

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);

router
.route("/")
.get(protect,getAllTours)
.post(protect,createTour);

router
.route("/:id")
.get(protect,getToursById)
.patch(protect,updatedTours)
.delete(protect,deleteTours);

module.exports = router;
