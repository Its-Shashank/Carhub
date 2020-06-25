const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");


exports.signup = (req, res) => {

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields) => {
    if(err){
      return res.status(400).json({
        error:err
      })
    }
    let user = new User(fields)
    
    user.save((err, user) => {
      if(err){
        res.status(400).json({
          error:"unable to save"
        })
      }
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //put token in cookie
      res.cookie("token", token, { expire: new Date() + 9999 });
  
      //send response to front end
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, name, email, role } });
    })
  })
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists"
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match"
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully"
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth"
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  next();
};

exports.isLender = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not a LENDER, Access denied"
    });
  }
  next();
};
