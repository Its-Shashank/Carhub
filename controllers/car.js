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
        return res.status(400).json({
          error:"unable to save",
          err
        })
      }
      res.json(car)
    })
  })
}

exports.getCar = (req, res) => {
  req.car.photo = undefined;
  return res.json(req.car);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.car.photo.data) {
    res.set("Content-Type", req.car.photo.contentType);
    return res.send(req.car.photo.data);
  }
  next();
};


// delete controllers
exports.deleteCar = (req, res) => {
  let car = req.car;
  car.remove((err, deletedCar) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the car"
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedCar
    });
  });
};

// update controllers
exports.updateCar = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code
    let car = req.car;
    car = _.extend(car, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      car.photo.data = fs.readFileSync(file.photo.path);
      car.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //save to the DB
    car.save((err, car) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed"
        });
      }
      res.json(car);
    });
  });
};

//event listing

exports.getAllCars = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Car.find()
    .select("-photo")
    .populate("category")
    .populate("user")
    .populate("city")
    .sort([[sortBy, "asc"]])
    .exec((err, cars) => {
      if (err) {
        return res.status(400).json({
          error: "NO car FOUND"
        });
      }
      res.json(cars);
    });
};
