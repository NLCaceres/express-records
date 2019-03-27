const Precaution = require("../models/precaution");

exports.precaution_list = (req, res, next) => {
  Precaution.find({})
    .populate("practices")
    .exec((err, precautionList) => {
      if (err) {
        return next(err);
      }
      res.render("precaution_list", {
        title: "List of Possible Precautionary Concerns",
        precautionList
      });
    });
};

exports.precaution_detail = (req, res) => {
  res.send("NOT IMPLEMENTED: ");
};

exports.precaution_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: ");
};

exports.precaution_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: ");
};

exports.precaution_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: ");
};

exports.precaution_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: ");
};

exports.precaution_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: ");
};

exports.precaution_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: ");
};
