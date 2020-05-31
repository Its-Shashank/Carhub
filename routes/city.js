const express = require("express");
const router = express.Router();

const {
  getCityById,
  createCity,
  getCity,
  getAllCity,
  removeCity
} = require("../controllers/city");
const { isSignedIn, isLender, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("cityId", getCityById);

//actual routers goes here

//create
router.post(
  "/city/create/:userId",
  isSignedIn,
  isAuthenticated,
  isLender,
  createCity
);

//read
router.get("/city/:cityId", getCity);
router.get("/cities", getAllCity);



//delete

router.delete(
  "/city/:cityId/:userId",
  isSignedIn,
  isAuthenticated,
  isLender,
  removeCity
);

module.exports = router;
