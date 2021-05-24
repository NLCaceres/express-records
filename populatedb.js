#! /usr/bin/env node

console.log(`This populate the DB with reports as well as inits the employee list, health practices with precaution types, and profession list. 
  Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url`);

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith("mongodb")) {
  console.log("ERROR: You need to specify a valid mongodb URL as the first argument");
  return;
}

let async = require("async"); //* Bit of a dated way to handle async function calls but pretty natural orchestration for series or parallel calls

let Employee = require("./models/employee");
let HealthPractice = require("./models/healthPractice");
let Location = require("./models/location");
let Precaution = require("./models/precaution");
let Profession = require("./models/profession");
let Report = require("./models/report");

let mongoose = require("mongoose");
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});
mongoose.Promise = global.Promise;
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:") );

let employees = [];
let healthPractices = [];
let locations = [];
let precautions = [];
let professions = [];
let reports = [];

async function locationCreate(facilityName, unitNum, roomNum) {
  const location = new Location({
    facilityName: facilityName,
    unitNum: unitNum,
    roomNum: roomNum
  });

  try {
    let newLocation = await location.save();
    console.log("New Location: " + newLocation);
    return newLocation;
  } catch (err) {
    console.log("ERROR CREATING location: " + location);
  }
}

async function professionCreate(occupation, discipline) {
  const profession = new Profession({
    observed_occupation: occupation,
    service_discipline: discipline
  });

  try {
    let newProfession = await profession.save();
    console.log("New Profession: " + newProfession);
    return newProfession;
  } catch (err) {
    console.log("ERROR CREATING profession: " + profession);
  }  
}

async function healthPracticeCreate(name) {
  const healthPractice = new HealthPractice({ name: name });

  try {
    let newHealthPractice = await healthPractice.save();
    console.log("New health practice: " + newHealthPractice);
    return newHealthPractice;
  } catch (err) {
    console.log("ERROR CREATING health practice: " + healthPractice);
  }
}

async function employeeCreate(first_name, surname, profession) {
  const employee = new Employee({
    first_name: first_name,
    surname: surname,
    profession: profession
  });
  try {
    let newEmployee = await employee.save();
    console.log("New Employee: " + newEmployee);
    return newEmployee;
  } catch (err) {
    console.log("ERROR CREATING employee: " + employee);
  }
}

async function precautionCreate(name, practices) {
  const precaution = new Precaution({
    name: name,
    practices: practices
  });

  try {
    let newPrecaution = await precaution.save();
    console.log("New Precaution: " + newPrecaution);
    return newPrecaution;
  } catch (err) {
    console.log("ERROR CREATING precaution: " + precaution);
  }
}

async function reportCreate(employee, healthPractice, location, date_reported) {
  const report = new Report({
    employee: employee,
    healthPractice: healthPractice,
    location: location,
    date_reported: date_reported
  });

  try {
    let newReport = await report.save();
    console.log("New Report: " + newReport);
    return newReport;
  } catch (err) {
    console.log("ERROR CREATING report: " + report);
  }
}

async function practicePrecautionAdd(practice, precaution) {
  console.log("This is the precaution we're adding: " + precaution + " to " + practice);

  try {
    let updatedHealthPractice = await HealthPractice.findOneAndUpdate({ name: practice.name }, { $push: { precautionType: precaution } }).exec();
    console.log("This is practice now: " + updatedHealthPractice);
    return updatedHealthPractice;
  } catch (err) {
    console.log("ERROR UPDATING practice: " + practice);
  }
}

async function createLocationProfessions(cb) {
  locations = await Promise.all([ locationCreate("HSC", "5", "123"), locationCreate("HSC", "3", "321"), locationCreate("USC", "2", "123")]);

  console.log("This is locations: " + locations);

  professions = await Promise.all([ professionCreate("Clinic", "Nurse"), professionCreate("Clinic", "Physician")]);

  console.log("This is professions: " + professions);
}

async function createPracticeEmployees(cb) {
  healthPractices = await Promise.all([
    healthPracticeCreate("Hand Hygiene"),
    healthPracticeCreate("PPE"),
    healthPracticeCreate("Contact"),
    healthPracticeCreate("Droplet"),
    healthPracticeCreate("Airborne"),
    healthPracticeCreate("Contact Enteric")
  ]);

  console.log("This is practices: " + healthPractices);

  employees = await Promise.all([
    employeeCreate("Nicholas", "Caceres", professions[1]),
    employeeCreate("Catherine", "Sazon", professions[0]),
    employeeCreate("Maria", "Caceres", professions[0]),
    employeeCreate("Lionel", "Caceres", professions[0]),
    employeeCreate("Edwin", "Toribio", professions[1])
  ]);

  console.log("This is employees: " + employees);
}

async function createPrecautions(cb) {
  precautions = await Promise.all([ precautionCreate("Standard", healthPractices.slice(0, 2)), precautionCreate("Isolation", healthPractices.slice(2))]);

  console.log("This is precautions: " + precautions);
  //? Following is how async pkg handles calling funcs in parallel vs the newer async await style just above
  /* async.parallel([ function(callback) {
      precautionCreate('Standard', healthPractices.slice(0,2), callback)
    }, function(callback) {
      precautionCreate('Isolation', healthPractices.slice(2), callback)
    }], optional callback cb) */
}

async function finishHealthPractice(cb) {
  console.log("This is health practices to start with: ");
  console.log(healthPractices);

  console.log("This is precautions: " + precautions);

  let prevPractices = healthPractices.splice(0, healthPractices.length);

  console.log("This is health practices now: " + healthPractices);
  console.log("This is prevPractices: " + prevPractices);

  healthPractices = await Promise.all([
    practicePrecautionAdd(prevPractices[0], precautions[0]),
    practicePrecautionAdd(prevPractices[1], precautions[0]),
    practicePrecautionAdd(prevPractices[2], precautions[1]),
    practicePrecautionAdd(prevPractices[3], precautions[1]),
    practicePrecautionAdd(prevPractices[4], precautions[1]),
    practicePrecautionAdd(prevPractices[5], precautions[1])
  ]);

  console.log("This is health practices now: " + healthPractices);
}

async function createReports() {
  reports = await Promise.all([
    reportCreate(employees[0], healthPractices[0], locations[0], new Date()),
    reportCreate(employees[1], healthPractices[2], locations[1], new Date()),
    reportCreate(employees[2], healthPractices[1], locations[2], new Date()),
    reportCreate(employees[3], healthPractices[3], locations[1], new Date()),
    reportCreate(employees[4], healthPractices[0], locations[0], new Date())
  ]);

  console.log("This is reports: " + reports);
}

async.series([createLocationProfessions, createPracticeEmployees, createPrecautions,
    finishHealthPractice, createReports],
  //? Following callback func is optional, but definitely a good indicator for when the seeder finishes!
  function(err, results) {
    if (err) { console.log("FINAL ERR: " + err); } 
    else {
      console.log("Report at zero: " + reports[0]);
      console.log("Employee at zero: " + employees[0]);
      console.log("Location at zero: " + locations[0]);
      console.log("Profession at zero: " + professions[0]);
      console.log("Precaution at zero: " + precautions[0]);
      console.log("Health Practice at zero: " + healthPractices[0]);
    }
    mongoose.connection.close(); //* All done, disconnect from database
  }
);
