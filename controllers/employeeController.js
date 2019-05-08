const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

const Debug = require("debug")("employee-controller");

const Employee = require("../models/employee");
const Profession = require("../models/profession");
const Report = require("../models/report");

// Display list of all Authors.
exports.employee_list = (req, res, next) => {
  // Find function takes two params
  // Query which when empty returns all docs
  // Projection which can help specify what props you want (so if you don't need all)
  Employee.find()
    .populate("profession")
    .exec((err, employeeList) => {
      if (err) {
        Debug(`Listing error: ${err}`);
        return next(err);
      }
      // No Error then let's render
      res.render("employee_list", { title: "Employees", employeeList });
    });
};

// Display detail page for a specific Employee.
exports.employee_detail = (req, res, next) => {
  Employee.findById(req.params.id)
    .populate("profession")
    .exec((err, employee) => {
      if (err) {
        Debug(`Detailing error: ${err}`);
        return next(err);
      }
      if (employee === null) {
        const missingErr = new Error("Employee not found");
        missingErr.status = 404;
        return next(missingErr);
      }

      res.render("employee_detail", {
        title: "Employee Information",
        employee
      });
    });
};

// Display Employee create form on GET.
exports.employee_create_get = async (req, res, next) => {
  // Find has two params
  // Query which if empty or {} then it gets them all
  // Projection which if empty gets all fields
  Profession.find().exec((err, professions) => {
    if (err) {
      return next(err);
    }
    res.render("employee_form", { title: "Add a new Employee", professions });
  });
};

// Handle Employee create on POST.
exports.employee_create_post = [
  // Double insurance on the trim calls
  body("first_name", "Please enter the first name of the employee")
    .isLength({ min: 1 })
    .isAlpha()
    .trim(),
  body("surname", "Please enter the surname (family name) of the employee")
    .isLength({ min: 1 })
    .isAlpha()
    .trim(),
  body("profession", "Please select a profession for this employee")
    .isLength({ min: 1 })
    .trim(),

  // Escaping helps get rid of bad html
  // trim() gets rid of troublesome whitespace
  sanitizeBody("first_name")
    .trim()
    .escape(),
  sanitizeBody("surname")
    .trim()
    .escape(),
  sanitizeBody("profession")
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const employee = new Employee({
      first_name: req.body.first_name,
      surname: req.body.surname,
      profession: req.body.profession
    });

    if (!errors.isEmpty()) {
      Profession.find().exec((err, professions) => {
        if (err) {
          return next(err);
        }
        res.render("employee_form", {
          title: "Add a New Employee",
          professions,
          employee,
          errors: errors.array()
        });
      });
    } else {
      Employee.findOne({
        first_name: req.body.first_name,
        surname: req.body.surname,
        profession: req.body.profession
      }).exec((err, foundEmployee) => {
        if (err) {
          return next(err);
        }
        if (foundEmployee) {
          res.redirect(foundEmployee.url);
        } else {
          employee.save(err => {
            if (err) {
              return next(err);
            }
            res.redirect(employee.url);
          });
        }
      });
    }
  }
];

// Display Employee delete form on GET.
exports.employee_delete_get = async (req, res, next) => {
  // In this particular case we don't need to consider other models
  // However, if we were deleting professions, then it could screw up our employees that have that profession
  // Therefore for professions we'll make sure to mention employees that must be deleted first!
  try {
    const [employee, reports] = await Promise.all([
      Employee.findById(req.params.id).populate("profession"),
      Report.find({ employee: req.params.id })
    ]);
    if (employee === null) {
      res.redirect("/records/employees");
    }
    res.render("employee_delete", {
      title: "Delete the Employee",
      employee,
      reports
    });
  } catch (err) {
    return next(err);
  }
};

// Handle employee delete on POST.
exports.employee_delete_post = async (req, res, next) => {
  try {
    const [employee, reports] = await Promise.all([
      Employee.findById(req.body.id).populate("profession"),
      Report.find({ employee: req.body, id })
    ]);
    if (reports.length > 0) {
      res.render("employee_delete", {
        title: "Delete the employee",
        employee,
        reports
      });
    } else {
      Employee.findByIdAndDelete(req.body.employeeid, err => {
        if (err) {
          return next(err);
        }
        res.redirect("/records/employees");
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Display employee update form on GET.
exports.employee_update_get = async (req, res, next) => {
  try {
    const [employee, professions] = await Promise.all([
      Employee.findById(req.params.id),
      Profession.find()
    ]);
    if (employee === null) {
      const missingErr = new Error("Employee not found!");
      missingErr.msg = 404;
      return next(missingErr);
    }
    res.render("employee_form", {
      title: "Update Employee Information?",
      employee,
      professions
    });
  } catch (err) {
    return next(err);
  }
};

// Handle employee update on POST.
exports.employee_update_post = [
  // Double insurance on the trim calls
  body("first_name", "Please enter the first name of the employee")
    .isLength({ min: 1 })
    .isAlpha()
    .trim(),
  body("surname", "Please enter the surname (family name) of the employee")
    .isLength({ min: 1 })
    .isAlpha()
    .trim(),
  body("profession", "Please select a profession for this employee")
    .isLength({ min: 1 })
    .trim(),

  // Escaping helps get rid of bad html
  // trim() gets rid of troublesome whitespace
  sanitizeBody("first_name")
    .trim()
    .escape(),
  sanitizeBody("surname")
    .trim()
    .escape(),
  sanitizeBody("profession")
    .trim()
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    // THIS IS WHERE SOMETHING IS DIFFERENT!
    // We add an id based on the get request so we don't create a new object (really just a new id)

    const employee = new Employee({
      first_name: req.body.first_name,
      surname: req.body.surname,
      profession: req.body.profession,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      Profession.find().exec((err, professions) => {
        if (err) {
          return next(err);
        }
        res.render("employee_form", {
          title: "Update Employee Information",
          professions,
          employee,
          errors: errors.array()
        });
      });
    } else {
      Employee.findByIdAndUpdate(
        req.params.id,
        employee,
        {},
        (err, theEmployee) => {
          if (err) {
            return next(err);
          }
          res.redirect(theEmployee.url);
        }
      );
    }
  }
];
