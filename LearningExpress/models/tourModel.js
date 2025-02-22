const mongoose = require("mongoose");
const slugify=require("slugify");
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim:true,
  },
  slug: {
    type: String,
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
      // required: [true, "A tour must have a cover image"]
    },
    images:{ 
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function(){
  return this.duration/7;
})

//Document middleware before .save() and .create() but not befor the .insertMany() command
tourSchema.pre('save',async function(next){
this.slug=slugify(this.name,{lower:true})
next();
})
//can have multiple pre and post middlware commands
tourSchema.post('save',async function(doc,next){
  console.log(doc);
next();
})
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
