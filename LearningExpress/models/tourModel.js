const mongoose = require("mongoose");
const slugify = require("slugify");
const validator=require("validator");
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40,'A tour must have a name less than 40 characters'],
      minlength:[5, 'A tour must have more than 5 characters'],
      validate:[validator.isAlpha,'Must have all characters']
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
      min: [1, "A tour must have a duration of at least 1 day"],
      max: [30, "A tour must have a duration of no more than 30 days"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either easy, medium, or difficult",
      },
    },
    price: Number,
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type:Number,
      validate:{
        validator:function(val){
          //does not work when updation takes place
          return val<this.price;
        },
       message:"Price discount ({VALUE}) should be lower than the actual price"
      }
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      // required: [true, "A tour must have a cover image"]
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//Document middleware before .save() and .create() but not befor the .insertMany() command
tourSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//can have multiple pre and post middlware commands
tourSchema.post("save", async function (doc, next) {
  console.log(doc);
  next();
});

//Query Middleware this doesn't work for find one or findbyId
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log("Query executed in ", Date.now() - this.start, "milliseconds");
  console.log("Results found:", docs);

  this.find({ secretTour: { $ne: true } });
  next();
});

//Aggregation middleware
tourSchema.pre('aggregate',function(next){
  this.pipeline().unshift({$match:{secretTour: { $ne:true}}})
  console.log("Before performing Aggregation",this);
  next();
  })
 
  tourSchema.post('aggregate',function(docs,next){
  console.log("After performing Aggregation",docs);
  next();
  })

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
