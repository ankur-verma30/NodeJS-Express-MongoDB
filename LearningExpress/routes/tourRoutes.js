const express = require("express");
const tourController = require("../controllers/tourController");

const router = express.Router();
const {
  getAllTours,
  createTour,
  getToursById,
  updatedTours,
  deleteTours,
  aliasTopTours,
  getTourStats
} = tourController;

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats)

//only works for id parameter
// router.param("id", checkId);

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getToursById).patch(updatedTours).delete(deleteTours);

module.exports = router;
