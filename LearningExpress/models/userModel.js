const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must be less than 50 characters long"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: {
    type: String,
  },
  role:{
    type: String,
    enum: ["user","guide","lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works when CREATE and SAVE operation is run
      validator: function (passwordConfirm) {
        return this.password === passwordConfirm;
      },
      message: "Passwords do not match",
    },
  },
  passwordChangedAt:Date,
});

//instance function available to all the documents
userSchema.methods.correctPasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPassword=function(JWTTimestamp){

  if(this.passwordChangedAt){
    const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
    console.log(this.passwordChangedAt,JWTTimestamp);
    return JWTTimestamp < changedTimestamp; //changed password
  }
  return false; //not changed password
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 15);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
