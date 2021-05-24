const { body, validationResult } = require('express-validator');
const Profession = require('../models/profession');
const Employee = require('../models/employee');

exports.profession_list = (req, res, next) => {
  Profession.find({}).exec((err, professionList) => {
    if (err) {
      return next(err);
    }
    res.render('profession_list', { title: 'Professions with the Hospital', professionList });
  });
};

exports.profession_detail = (req, res, next) => {
  Profession.findById(req.params.id).exec((err, profession) => {
    if (err) {
      return next(err);
    }
    if (profession === null) {
      const missingError = new Error('Profession not found');
      missingError.status = 404;
      return next(err);
    }

    res.render('profession_detail', { title: 'Profession: ', profession });
  });
};

exports.profession_create_get = (req, res) => {
  res.render('profession_form', { title: 'Add Job Title' });
};

exports.profession_create_post = [
  body('observed_occupation', 'Occupation required')
    .isLength({ min: 1 })
    .trim()
    .escape(),
  body('service_discipline', 'Service discipline required')
    .isLength({ min: 1 })
    .trim()
    .escape(),

  // sanitizeBody('observed_occupation')
  //   .trim()
  //   .escape(),
  // sanitizeBody('service_discipline')
  //   .trim()
  //   .escape(),

  (req, res, next) => {
    //* Pipe validation errors into ResultObj with following keys: { msg, param, value, location, nestedErrors } 
    const errors = validationResult(req);

    const profession = new Profession({
      observed_occupation: req.body.observed_occupation,
      service_discipline: req.body.service_discipline
    });

    if (!errors.isEmpty()) {
      res.render('profession_form', {
        title: 'Add Job Title',
        profession,
        errors: errors.array()
      });
    } else {
      Profession.findOne({
        observed_occupation: req.body.observed_occupation,
        service_discipline: req.body.service_discipline
      }).exec((err, foundProfession) => {
        if (err) {
          return next(err);
        }

        if (foundProfession) {
          res.redirect(foundProfession.url);
        } else {
          profession.save(err => {
            if (err) {
              return next(err);
            }
            res.redirect(profession.url);
          });
        }
      });
    }
  }
];

exports.profession_delete_get = async (req, res, next) => {
  // There are a lot of issues we'd cause by deleting this
  // Therefore we need to make sure that we delete
  // all employees that have the profession first!
  // so we find all employees with the profession and list them with their url
  try {
    const [profession, employees] = await Promise.all([
      Profession.findById(req.params.id),
      Employee.find({ profession: req.params.id })
    ]);
    if (profession === null) {
      res.redirect('/records/professions');
    }

    res.render('profession_delete', { title: 'Delete Profession', profession, employees });
  } catch (err) {
    return next(err);
  }
};

exports.profession_delete_post = async (req, res, next) => {
  try {
    const [profession, employees] = await Promise.all([
      Profession.findById(req.body.id),
      Employee.find({ profession: req.body.id })
    ]);
    if (employees.length > 0) {
      res.render('profession_delete', { title: 'Delete Profession', profession, employees });
    } else {
      Profession.findByIdAndDelete(req.body.professionid, err => {
        if (err) {
          return next(err);
        }
        res.redirect('/records/professions');
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.profession_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};

exports.profession_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};
