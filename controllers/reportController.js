const mongoose = require('mongoose');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const Debug = require('debug')('report-controller');

const Report = require('../models/report');
const Employee = require('../models/employee');
const Location = require('../models/location');
const Precaution = require('../models/precaution');
const Profession = require('../models/profession');
const HealthPractice = require('../models/healthPractice');

exports.index = async (req, res) => {
  let error;
  let reportCount;
  let employeeCount;
  let locationCount;
  let healthPracticeCount;
  let precautionCount;
  let professionCount;
  try {
    [
      reportCount,
      employeeCount,
      locationCount,
      healthPracticeCount,
      precautionCount,
      professionCount
    ] = await Promise.all([
      Report.countDocuments(),
      Employee.countDocuments(),
      Location.countDocuments(),
      HealthPractice.countDocuments(),
      Precaution.countDocuments(),
      Profession.countDocuments()
    ]);
  } catch (err) {
    error = err;
  }

  // This function takes several params
  // In this case we are playing with two
  // Template
  // and a data object that we will use to define the template
  // This data object is important since we create any random
  // set of variables that we personally define and then use (like normal sort of)
  res.render('index', {
    title: 'Local Health Records',
    reportCount,
    employeeCount,
    locationCount,
    healthPracticeCount,
    precautionCount,
    professionCount,
    error
  });
};

exports.report_list = (req, res, next) => {
  Report.find()
    .populate('employee healthPractice location')
    .sort([['date', 'desc']])
    .exec((err, reportList) => {
      if (err) {
        Debug(`Listing error: ${err}`);
        return next(err);
      }
      res.render('report_list', { title: 'A list of reported incidences', reportList });
    });
};

exports.report_detail = async (req, res, next) => {
  Report.findById(req.params.id)
    .populate('employee location')
    .populate({ path: 'healthPractice', populate: { path: 'precautionType', model: 'Precaution' } })
    .exec((err, report) => {
      if (err) {
        Debug(`Detailing error: ${err}`);
        return next(err);
      }
      if (report === null) {
        const missingErr = new Error('Report not found');
        missingErr.status = 404;
        return next(missingErr);
      }
      res.render('report_detail', { title: 'Report Information', report });
    });
};

exports.report_create_get = async (req, res, next) => {
  try {
    const [employees, locations, healthPractices] = await Promise.all([
      Employee.find(),
      Location.find(),
      HealthPractice.find()
    ]);
    res.render('report_form', {
      title: 'Create new Report',
      employees,
      locations,
      healthPractices
    });
  } catch (err) {
    return next(err);
  }
};

exports.report_create_post = [
  body('employee')
    .isLength({ min: 1 })
    .trim(),
  body('healthPractice')
    .isLength({ min: 1 })
    .trim(),
  body('location')
    .isLength({ min: 1 })
    .trim(),
  body('date')
    .isDataURI()
    .trim(),

  sanitizeBody('employee')
    .trim()
    .escape(),
  sanitizeBody('healthPractice')
    .trim()
    .escape(),
  sanitizeBody('location')
    .trim()
    .escape(),
  sanitizeBody('date')
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const report = new Report({
      employee: req.body.employee,
      healthPractice: req.body.healthPractice,
      location: req.body.location,
      date_reported: req.body.date
    });

    if (!errors.isEmpty()) {
      res.render('report_form', { title: 'Create a new Report', report, errors: errors.array() });
    } else {
      Report.findOne({
        employee: req.body.employee,
        healthPractice: req.body.healthPractice,
        location: req.body.location,
        date_reported: req.body.date
      }).exec((err, foundReport) => {
        if (err) {
          return next(err);
        }
        if (foundReport) {
          res.redirect(foundReport.url);
        } else {
          report.save(err => {
            if (err) {
              return next(err);
            }
            res.redirect(report.url);
          });
        }
      });
    }
  }
];

// With deletes, don't forget how models relate to each other
// Nothing actually depends on reports but the other way around is true!
// Reports rely on a lot of things (employees, healthPractices, etc.)
// This version is the easier one!
exports.report_delete_get = (req, res, next) => {
  Report.findById(req.params.id)
    .populate('employee healthPractice location')
    .exec((err, report) => {
      if (err) {
        return next(err);
      }
      if (report === null) {
        res.redirect('/records/reports');
      }
      res.render('report_delete', { title: 'Delete this report?', report });
    });
};

exports.report_delete_post = (req, res, next) => {
  Report.findById(req.body.reportid).exec((err, report) => {
    if (err) {
      return next(err);
    }
    // Difference between this particular delete and others
    // Is that we do NOT have to worry about other models
    // Since we don't, we don't bother checking if other models
    // were found that would present an issue by deleting this doc
    Report.findByIdAndDelete(req.body.reportid, err => {
      if (err) {
        return next(err);
      }
      res.redirect('/records/reports');
    });
  });
};

exports.report_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};

exports.report_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};
