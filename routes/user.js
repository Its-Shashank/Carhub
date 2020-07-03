const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  getAllUserNames
} = require("../controllers/user");
const { isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);
router.get("/user/:userId", isAuthenticated, getUser);
router.put("/user/:userId", isAuthenticated, updateUser);
router.get("/users",getAllUserNames)
module.exports = router;
