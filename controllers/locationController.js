/* eslint-disable consistent-return */
const { body, validationResult } = require('express-validator');
const Location = require('../models/location');
const Report = require('../models/report');

exports.location_list = (req, res, next) => {
  Location.find()
    .sort([['facilityName', 'ascending']])
    .exec((err, locationList) => {
      if (err) {
        return next(err);
      }
      res.render('location_list', { title: 'Hospital Locations', locationList });
    });
};

exports.location_detail = (req, res, next) => {
  Location.findById(req.params.id).exec((err, location) => {
    if (err) {
      return next(err);
    }
    if (location === null) {
      const missingErr = new Error('Location not found');
      missingErr.status = 404;
      return next(missingErr);
    }

    res.render('location_detail', { title: 'Location Information ', location });
  });
};

exports.location_create_get = (req, res, next) => {
  res.render('location_form', { title: 'Create New On-site Location' });
};

// Interestingly this is an array of middleware functions
// The three steps! = three middleware functions
// The router function will call them in order
exports.location_create_post = [
  //* 1st: Validate incoming data to check for possible improper data that client-side missed
  //* 2nd: Sanitize the validated data, so there's no odd formatting AND more importantly, to prevent attacks (XSS comes to mind)!
  body('facilityName', 'Facility Name Required, USC or HSC')
    .isLength({ min: 1, max: 3 })
    .trim()
    .escape(),
  body('unitNum') //* Validating phase
    .isLength({ min: 1, max: 2 })
    .withMessage('Unit Number required, eg, 1')
    .isNumeric()
    .withMessage('Please enter the unit NUMBER')
    .trim() //* Sanitizing phase
    .escape(),
  body('roomNum')
    .isLength({ min: 1, max: 4 })
    .withMessage('Room number required, eg, 123')
    .isNumeric()
    .withMessage('Please enter the room NUMBER')
    .trim() 
    .escape(),

  // sanitizeBody('facilityName')
  //   .trim()
  //   .escape(),
  // sanitizeBody('unitNum')
  //   .trim()
  //   .escape(),
  // sanitizeBody('roomNum')
  //   .trim()
  //   .escape(),

  //* Process request
  (req, res, next) => {
    //* Pipe validation errors into ResultObj with following keys: { msg, param, value, location, nestedErrors } 
    const errors = validationResult(req);

    const location = new Location({
      facilityName: req.body.facilityName,
      unitNum: req.body.unitNum,
      roomNum: req.body.roomNum
    });

    if (!errors.isEmpty()) {
      // Found errors while processing so now we try to re-render
      res.render('location_form', {
        title: 'Create New On-site Location',
        location,
        errors: errors.array()
      });
    } else {
      // Data is valid
      // Check if location already exists
      Location.findOne({
        facilityName: req.body.facilityName,
        unitNum: req.body.unitNum,
        roomNum: req.body.roomNum
      }).exec((err, foundLocation) => {
        if (err) {
          return next(err);
        }

        if (foundLocation) {
          res.redirect(foundLocation.url);
        } else {
          location.save(err => {
            if (err) {
              return next(err);
            }
            res.redirect(location.url);
          });
        }
      });
    }
  }
];

exports.location_delete_get = async (req, res, next) => {
  try {
    // Similar to profession, consider what uses it
    // In this case, reports use it
    const [location, reports] = await Promise.all([
      Location.findById(req.params.id),
      Report.find({ location: req.params.id }).populate('employee healthPractice location')
    ]);
    if (location === null) {
      res.redirect('/records/locations');
    }
    res.render('location_delete', { title: 'Delete Location?', location, reports });
  } catch (err) {
    return next(err);
  }
};

exports.location_delete_post = async (req, res, next) => {
  try {
    const [location, reports] = await Promise.all([
      Location.findById(req.body.id),
      Report.find({ location: req.body.id }).populate('employee healthPractice location')
    ]);
    if (reports.length > 0) {
      res.render('location_delete', { title: 'Delete Location?', location, reports });
    }
    Location.findByIdAndRemove(req.body.locationid, err => {
      if (err) {
        return next(err);
      }
      res.redirect('/records/locations');
    });
  } catch (err) {
    return next(err);
  }
};

exports.location_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};

exports.location_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};
