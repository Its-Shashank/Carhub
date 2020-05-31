var mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

var carSchema = new mongoose.Schema(
  {
    brand:{
        type:String,
        trim:true,
        required:true
    },
    modelName:{
        type:String,
        trim:true,
        required:true,
    },
    year:{
        type:Number,
        required:true
    },
   
    category:{
        type: ObjectId,
        ref: "Category",
        required: true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    user:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    city:{
        type:ObjectId,
        ref:"City",
        required:true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Car", carSchema);