const Car = require('../models/car')
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");


exports.getCarById = (req, res, next, id) => {
    Car.findById(id).exec((err, car) => {
      if (err) {
        return res.status(400).json({
          error: "Car not found in DB"
        });
      }
      req.car = car;
      next();
    });
  };

exports.createCar = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields,file ) => {
    if(err){
      return res.status(400).json({
        error:"problem with image"
      })
    }

    const {brand, modelName, year, category, price, user, city} = fields;

    let car = new Car(fields)

    if(file.photo) {
      if(file.photo.size > 1500000){
        return res.status(400).json({
          error:"File size too large"
        })
      }
      car.photo.data = fs.readFileSync(file.photo.path)
      car.photo.contentType = file.photo.type;
    }

    car.save((err, car) => {
      if(err){
        res.status(400).json({
          error:"unable to save"
        })
      }
      res.json(car)
    })
  })
}




exports.getCar = (req, res) => {
    return res.json(req.car)
}

exports.getAllCar = (req,res) => {
    Car.find().exec((err, cars) => {
        if(err){
            return res.status(400).json({
                error:"No Car Found"
            })
        }
        res.json(cars)
    })
}

exports.updateCar = (req, res) => {
    Car.findByIdAndUpdate(
      { _id: req.car._id },
      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, car) => {
        if (err) {
          return res.status(400).json({
            error: "You are not authorized to update this car"
          });
        }
        res.json(car);
      }
    );
  };

exports.removeCar = (req, res) => {
    const car = req.car;
    car.remove((err, car) => {
        if(err){
            return res.status(400).json({
                error:"Failed to delete"
            })
        }
        res.json({
            message:"Deleted"
        })
    })
}