const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user"
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.getAllUserNames = (req,res) => {
  User.find().exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: "NO User found"
      });
    }

    for(let itr=0;itr<users.length;itr++){
      users[itr].salt = undefined;
      users[itr].encry_password = undefined;
      users[itr].role = undefined;
      users[itr].createdAt = undefined
      users[itr].updatedAt = undefined
    }
    
    res.json(users);
  });
}