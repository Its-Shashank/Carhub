const express = require("express");
const router = express.Router();

const {
    getCarById,
  createCar,
  getCar,
  getAllCar,
  updateCar,
  removeCar,
  photo
} = require("../controllers/car");
const { isLender, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("carId", getCarById)
//actual routers goes here

//create
router.post(
  "/car/create/:userId",
  isAuthenticated,
  isLender,
  createCar
);

//read
router.get("/car/:carId", getCar);
router.get("/cars", getAllCar);
router.get("/car/photo/:carId", photo)

//update
router.put(
  "/car/:carId/:userId",
  isAuthenticated,
  isLender,
  updateCar
);

//delete

router.delete(
  "/car/:carId/:userId",
  isAuthenticated,
  isLender,
  removeCar
);


module.exports = router;
