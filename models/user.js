const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const {ObjectId} = mongoose.Schema;

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    encry_password: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: Number,
      default: 1
    },
    car:{
      type:ObjectId,
      ref:"Car"
    },
    order: {
      type: ObjectId,
      ref:"Car"
    },
    orderDateFrom:{
      type:String
    },
    orderDateExpire:{
      type:String
    },
    totalOrderCost:{
      type:Number
    }
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  autheticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function(plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);