const express = require("express");

const router = express.Router();

// Require controller modules.
const employeeController = require("../controllers/employeeController");
const healthPracticeController = require("../controllers/healthPracticeController");
const locationController = require("../controllers/locationController");
const precautionController = require("../controllers/precautionController");
const professionController = require("../controllers/professionController");
const reportController = require("../controllers/reportController");

// REPORT ROUTES //

// GET catalog home page
router.get("/", reportController.index);

// GET request for creating report.
// NOTE order matters! Must come before routes that display the model
router.get("/report/create", reportController.report_create_get);

// POST request for creating a report
router.post("/report/create", reportController.report_create_post);

// GET req for deleting a report
router.get("/report/:id/delete", reportController.report_delete_get);

// POST req for deleting a report
router.post("/report/:id/delete", reportController.report_delete_post);

// GET req for updating a report
router.get("/report/:id/update", reportController.report_update_get);

// POST req for updating a report
router.post("/report/:id/update", reportController.report_update_post);

// GET req for displaying a single report
router.get("/report/:id", reportController.report_detail);

// GET req for displaying a list of reports.
router.get("/reports", reportController.report_list);

// EMPLOYEE ROUTES //

// GET request for creating employee.
// NOTE order matters! Must come before routes that display the model
router.get("/employee/create", employeeController.employee_create_get);

// POST request for creating a employee
router.post("/employee/create", employeeController.employee_create_post);

// GET req for deleting a employee
router.get("/employee/:id/delete", employeeController.employee_delete_get);

// POST req for deleting a employee
router.post("/employee/:id/delete", employeeController.employee_delete_post);

// GET req for updating a employee
router.get("/employee/:id/update", employeeController.employee_update_get);

// POST req for updating a employee
router.post("/employee/:id/update", employeeController.employee_update_post);

// GET req for displaying a single employee
router.get("/employee/:id", employeeController.employee_detail);

// GET req for displaying a list of employees.
router.get("/employees", employeeController.employee_list);

// HEALTH PRACTICE ROUTES //

// GET request for creating healthPractice.
// NOTE order matters! Must come before routes that display the model
router.get(
  "/health-practices/create",
  healthPracticeController.healthPractice_create_get
);

// POST request for creating a healthPractice
router.post(
  "/health-practices/create",
  healthPracticeController.healthPractice_create_post
);

// GET req for deleting a healthPractice
router.get(
  "/health-practices/:practiceName/delete",
  healthPracticeController.healthPractice_delete_get
);

// POST req for deleting a healthPractice
router.post(
  "/health-practices/:practiceName/delete",
  healthPracticeController.healthPractice_delete_post
);

// GET req for updating a healthPractice
router.get(
  "/health-practices/:practiceName/update",
  healthPracticeController.healthPractice_update_get
);

// POST req for updating a healthPractice
router.post(
  "/health-practices/:practiceName/update",
  healthPracticeController.healthPractice_update_post
);

// GET req for displaying a single healthPractice
router.get(
  "/health-practices/:practiceName",
  healthPracticeController.healthPractice_detail
);

// GET req for displaying a list of healthPractices.
router.get("/health-practices", healthPracticeController.healthPractice_list);

// LOCATION ROUTES //

// GET request for creating location.
// NOTE order matters! Must come before routes that display the model
router.get("/location/create", locationController.location_create_get);

// POST request for creating a location
router.post("/location/create", locationController.location_create_post);

// GET req for deleting a location
router.get("/location/:id/delete", locationController.location_delete_get);

// POST req for deleting a location
router.post("/location/:id/delete", locationController.location_delete_post);

// GET req for updating a location
router.get("/location/:id/update", locationController.location_update_get);

// POST req for updating a location
router.post("/location/:id/update", locationController.location_update_post);

// GET req for displaying a single location
router.get("/location/:id", locationController.location_detail);

// GET req for displaying a list of locations.
router.get("/locations", locationController.location_list);

// PRECAUTION ROUTES //

// GET request for creating precaution.
// NOTE order matters! Must come before routes that display the model
router.get("/precaution/create", precautionController.precaution_create_get);

// POST request for creating a precaution
router.post("/precaution/create", precautionController.precaution_create_post);

// GET req for deleting a precaution
router.get(
  "/precaution/:id/delete",
  precautionController.precaution_delete_get
);

// POST req for deleting a precaution
router.post(
  "/precaution/:id/delete",
  precautionController.precaution_delete_post
);

// GET req for updating a precaution
router.get(
  "/precaution/:id/update",
  precautionController.precaution_update_get
);

// POST req for updating a precaution
router.post(
  "/precaution/:id/update",
  precautionController.precaution_update_post
);

// GET req for displaying a single precaution
router.get("/precaution/:id", precautionController.precaution_detail);

// GET req for displaying a list of precautions.
router.get("/precautions", precautionController.precaution_list);

// PROFESSION ROUTES //

// GET request for creating profession.
// NOTE order matters! Must come before routes that display the model
router.get("/profession/create", professionController.profession_create_get);

// POST request for creating a profession
router.post("/profession/create", professionController.profession_create_post);

// GET req for deleting a profession
router.get(
  "/profession/:id/delete",
  professionController.profession_delete_get
);

// POST req for deleting a profession
router.post(
  "/profession/:id/delete",
  professionController.profession_delete_post
);

// GET req for updating a profession
router.get(
  "/profession/:id/update",
  professionController.profession_update_get
);

// POST req for updating a profession
router.post(
  "/profession/:id/update",
  professionController.profession_update_post
);

// GET req for displaying a single profession
router.get("/profession/:id", professionController.profession_detail);

// GET req for displaying a list of professions.
router.get("/professions", professionController.profession_list);

module.exports = router;
