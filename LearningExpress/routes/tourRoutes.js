const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

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

const { protect, restrictTo } = authController;

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);

router.route("/").get(protect, getAllTours).post(protect, createTour);

router
  .route("/:id")
  .get(protect, getToursById)
  .patch(protect, updatedTours)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTours);

module.exports = router;
