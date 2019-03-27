const express = require("express");

const router = express.Router();

// Require controller modules.
const Employee = require("../models/employee");
const HealthPractice = require("../models/healthPractice");
const Location = require("../models/location");
const Precaution = require("../models/precaution");
const Profession = require("../models/profession");
const Report = require("../models/report");

// REPORT ROUTES //

// GET catalog home page
router.get("/", (req, res) => {
  res.json({});
});

// GET request for creating report.
// NOTE order matters! Must come before routes that display the model
router.get("/report/create", (req, res) => {
  res.json({});
});

// POST request for creating a report
router.post("/report/create", (req, res) => {
  res.json({});
});

// GET req for deleting a report
router.get("/report/:id/delete", (req, res) => {
  res.json({});
});

// POST req for deleting a report
router.post("/report/:id/delete", (req, res) => {
  res.json({});
});

// GET req for updating a report
router.get("/report/:id/update", (req, res) => {
  res.json({});
});

// POST req for updating a report
router.post("/report/:id/update", (req, res) => {
  res.json({});
});

// GET req for displaying a single report
router.get("/report/:id", (req, res) => {
  res.json({});
});

// GET req for displaying a list of reports.
router.get("/reports", (req, res) => {
  Report.find().exec((err, reports) => {
    res.json(reports);
  });
});

// EMPLOYEE ROUTES //

// GET request for creating employee.
// NOTE order matters! Must come before routes that display the model
router.get("/employee/create", (req, res) => {
  res.json({});
});

// POST request for creating a employee
router.post("/employee/create", (req, res) => {
  res.json({});
});

// GET req for deleting a employee
router.get("/employee/:id/delete", (req, res) => {
  res.json({});
});

// POST req for deleting a employee
router.post("/employee/:id/delete", (req, res) => {
  res.json({});
});

// GET req for updating a employee
router.get("/employee/:id/update", (req, res) => {
  res.json({});
});

// POST req for updating a employee
router.post("/employee/:id/update", (req, res) => {
  res.json({});
});

// GET req for displaying a single employee
router.get("/employee/:id", (req, res) => {
  res.json({});
});

// GET req for displaying a list of employees.
router.get("/employees", (req, res) => {
  res.json({});
});

// HEALTH PRACTICE ROUTES //

// GET request for creating healthPractice.
// NOTE order matters! Must come before routes that display the model
router.get("/healthPractice/create", (req, res) => {
  res.json({});
});

// POST request for creating a healthPractice
router.post("/healthPractice/create", (req, res) => {
  res.json({});
});

// GET req for deleting a healthPractice
router.get("/healthPractice/:id/delete", (req, res) => {
  res.json({});
});

// POST req for deleting a healthPractice
router.post("/healthPractice/:id/delete", (req, res) => {
  res.json({});
});

// GET req for updating a healthPractice
router.get("/healthPractice/:id/update", (req, res) => {
  res.json({});
});

// POST req for updating a healthPractice
router.post("/healthPractice/:id/update", (req, res) => {
  res.json({});
});

// GET req for displaying a single healthPractice
router.get("/healthPractice/:id", (req, res) => {
  res.json({});
});

// GET req for displaying a list of healthPractices.
router.get("/healthPractices", (req, res) => {
  res.json({});
});

// LOCATION ROUTES //

// GET request for creating location.
// NOTE order matters! Must come before routes that display the model
router.get("/location/create", (req, res) => {
  res.json({});
});

// POST request for creating a location
router.post("/location/create", (req, res) => {
  res.json({});
});

// GET req for deleting a location
router.get("/location/:id/delete", (req, res) => {
  res.json({});
});

// POST req for deleting a location
router.post("/location/:id/delete", (req, res) => {
  res.json({});
});

// GET req for updating a location
router.get("/location/:id/update", (req, res) => {
  res.json({});
});

// POST req for updating a location
router.post("/location/:id/update", (req, res) => {
  res.json({});
});

// GET req for displaying a single location
router.get("/location/:id", (req, res) => {
  res.json({});
});

// GET req for displaying a list of locations.
router.get("/locations", (req, res) => {
  res.json({});
});

// PRECAUTION ROUTES //

// GET request for creating precaution.
// NOTE order matters! Must come before routes that display the model
router.get("/precaution/create", (req, res) => {
  res.json({});
});

// POST request for creating a precaution
router.post("/precaution/create", (req, res) => {
  res.json({});
});

// GET req for deleting a precaution
router.get("/precaution/:id/delete", (req, res) => {
  res.json({});
});

// POST req for deleting a precaution
router.post("/precaution/:id/delete", (req, res) => {
  res.json({});
});

// GET req for updating a precaution
router.get("/precaution/:id/update", (req, res) => {
  res.json({});
});

// POST req for updating a precaution
router.post("/precaution/:id/update", (req, res) => {
  res.json({});
});

// GET req for displaying a single precaution
router.get("/precaution/:id", (req, res) => {
  res.json({});
});

// GET req for displaying a list of precautions.
router.get("/precautions", (req, res) => {
  res.json({});
});

// PROFESSION ROUTES //
// POST request for creating a profession
router.post("/professions/create", (req, res) => {
  const newProfession = new Profession({
    observed_occupation: req.body.observed_occupation,
    service_discipline: req.body.service_discipline
  });
  newProfession.save(err => {
    if (err) {
      return next(err);
    }
    // ! No Content code
    // ! Currently sending as workaround for response bug
    res.sendStatus(204);
  });
});

// DELETE req for deleting a profession
router.delete("/profession/:id", (req, res) => {
  Profession.findByIdAndDelete(req.params.id, err => {
    if (err) {
      return next(err);
    }
    // ! No Content status code, enacted and no further info needed
    res.sendStatus(204);
  });
});

// PUT req for updating a profession
router.put("/profession/:id", (req, res) => {
  Profession.findByIdAndUpdate(req.params.id, { $set: req.body }, err => {
    if (err) {
      return next(err);
    }
    // ! OK status code
    res.sendStatus(200);
  });
});

// GET req for displaying a single profession
router.get("/profession/:id", (req, res) => {
  Profession.findById(req.params.id).exec((err, professionFound) => {
    res.json(professionFound);
  });
});

// GET req for displaying a list of professions.
router.get("/professions", (req, res) => {
  // ! Handle search queries
  if (req.query.label) {
    // ! Using regEx pays off to search for all similarites
    const regExStr = new RegExp(req.query.label, "i");
    // ! Using mongo's $or extends that functionality as an extra benefit
    // ! build comparative expressions against each field
    // ! Virtual fields don't allow comparison since they aren't in the DB
    Profession.find({
      $or: [{ service_discipline: regExStr }, { observed_occupation: regExStr }]
    }).exec((err, foundProfessions) => {
      if (err) {
        return next(err);
      }
      res.json(foundProfessions);
    });
    return;
  }

  Profession.find({}, "observed_occupation service_discipline label").exec(
    (err, professions) => {
      if (err) {
        return next(err);
      }
      res.json(professions);
    }
  );
});

module.exports = router;
