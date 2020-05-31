const City = require("../models/city");

exports.getCityById = (req, res, next, id) => {
  City.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "City not found in DB"
      });
    }
    req.city = cate;
    next();
  });
};

exports.createCity = (req, res) => {
  const city = new City(req.body);
  city.save((err, city) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to save city in DB"
      });
    }
    res.json({ city });
  });
};

exports.getCity = (req, res) => {
  return res.json(req.city);
};

exports.getAllCity = (req, res) => {
  City.find().exec((err, city) => {
    if (err) {
      return res.status(400).json({
        error: "NO cities found"
      });
    }
    res.json(city);
  });
};


exports.removeCity = (req, res) => {
  const city = req.city;

  city.remove((err, city) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete this city"
      });
    }
    res.json({
      message: "Successfully deleted"
    });
  });
};
