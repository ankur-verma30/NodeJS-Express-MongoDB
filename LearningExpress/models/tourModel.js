const mongoose = require("mongoose");
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim:true,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
  },
  price: Number,
  ratingsAverage: { 
    type: Number, 
    default: 4.5 
  },
  ratingQuantity: {
     type: Number, 
     default: 0 
    },
    priceDiscount:{
      type: Number, 
    },
    summary:{
      type: String,
      trim:true,
    },
    description:{
      type: String,
      trim:true,
      required: [true, "A tour must have a description"]
    },
    imageCover:{
      type: String,
      required: [true, "A tour must have a cover image"]
    },
    images:{ 
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
