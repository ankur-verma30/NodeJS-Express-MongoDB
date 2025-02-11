const express = require("express");
const tourController = require("../controllers/tourController");

const {
  getAllTours,
  createTour,
  getToursById,
  updatedTours,
  deleteTours,
  checkId,
  checBody,
} = tourController;

const router = express.Router();

//only works for id parameter
router.param("id", checkId);

router.route("/").get(getAllTours).post(checBody, createTour);
router.route("/:id").get(getToursById).patch(updatedTours).delete(deleteTours);

module.exports = router;
