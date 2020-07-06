const express = require("express");
const router = express.Router();

const {
    getCarById,
  createCar,
  getCar,
  photo,
  getAllCars,
  updateCar,
  deleteCar
} = require("../controllers/car");
const { isSignedIn, isLender, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("carId", getCarById)
//actual routers goes here

//create
router.post(
  "/car/create/:userId",
  isSignedIn,
  isAuthenticated,
  isLender,
  createCar
);

//read
 router.get("/car/:carId", getCar);
 router.get("/car/photo/:carId", photo);
 router.get("/cars", getAllCars);

//update
router.put(
  "/car/:carId/:userId",
  isSignedIn,
  isAuthenticated,
  isLender,
  updateCar
);

//delete

router.delete(
  "/car/:carId/:userId",
  isSignedIn,
  isAuthenticated,
  isLender,
  deleteCar
);


module.exports = router;