#! /usr/bin/env node

console.log(
  'This populate the DB with reports as well as inits the employee list, health practices with precaution types, and profession list. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url'
);

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return;
}

let async = require('async');
let Employee = require('./models/employee');
let HealthPractice = require('./models/healthPractice');
let Location = require('./models/location');
let Precaution = require('./models/precaution');
let Profession = require('./models/profession');
let Report = require('./models/report');

let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
    console.log('New Location: ' + newLocation);
    return newLocation;
  } catch (err) {
    console.log('ERROR CREATING location: ' + location);
  }

  // location.save(function (err) {
  //   if (err) {
  //     console.log("Error creating location: " + location)
  //     // cb(err, null)
  //     return
  //   }
  //   else {
  //     console.log('New Location: ' + location)
  //     return location
  //     // locations.push(location)
  //     // cb(null, location)
  //   }
  // })
}

async function professionCreate(occupation, discipline) {
  const profession = new Profession({
    observed_occupation: occupation,
    service_discipline: discipline
  });

  try {
    let newProfession = await profession.save();
    console.log('New Profession: ' + newProfession);
    return newProfession;
  } catch (err) {
    console.log('ERROR CREATING profession: ' + profession);
  }

  // profession.save(function (err) {
  //   if (err) {
  //     console.log('ERROR CREATING Profession: ' + profession)
  //     // cb(err, null)
  //     return
  //   }
  //   console.log('New Profession: ' + profession)
  //   return profession
  //   // professions.push(profession)
  //   // cb(null, profession)
  // })
}

async function healthPracticeCreate(name) {
  const healthPractice = new HealthPractice({
    name: name
  });

  try {
    let newHealthPractice = await healthPractice.save();
    console.log('New health practice: ' + newHealthPractice);
    return newHealthPractice;
  } catch (err) {
    console.log('ERROR CREATING health practice: ' + healthPractice);
  }

  // healthPractice.save(function (err) {
  //   if (err) {
  //     console.log("Error creating health practice: " + healthPractice)
  //     // cb(err, null)
  //     return
  //   }
  //   else {
  //     console.log('New Health Practice: ' + healthPractice)
  //     return healthPractice
  //     // healthPractices.push(healthPractice)
  //     // cb(null, healthPractice)
  //   }
  // })
}

async function employeeCreate(first_name, surname, profession) {
  const employee = new Employee({
    first_name: first_name,
    surname: surname,
    profession: profession
  });
  try {
    let newEmployee = await employee.save();
    console.log('New Employee: ' + newEmployee);
    return newEmployee;
  } catch (err) {
    console.log('ERROR CREATING employee: ' + employee);
  }
}

async function precautionCreate(name, practices) {
  const precaution = new Precaution({
    name: name,
    practices: practices
  });

  try {
    let newPrecaution = await precaution.save();
    console.log('New Precaution: ' + newPrecaution);
    return newPrecaution;
  } catch (err) {
    console.log('ERROR CREATING precaution: ' + precaution);
  }

  // precaution.save(function (err) {
  //   if (err) {
  //     console.log('ERROR CREATING BookInstance: ' + precaution)
  //     // cb(err, null)
  //     return
  //   }
  //   console.log('New Precaution: ' + precaution)
  //   return precaution
  //   // precautions.push(precaution)
  //   // cb(null, precaution)
  // })
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
    console.log('New Report: ' + newReport);
    return newReport;
  } catch (err) {
    console.log('ERROR CREATING report: ' + report);
  }

  // report.save(function (err) {
  //   if (err) {
  //     console.log('ERROR CREATING Report: ' + report)
  //     // cb(err, null)
  //     return
  //   }
  //   console.log('New Report: ' + report)
  //   return report
  //   // reports.push(report)
  //   // cb(null, report)
  // })
}

async function practicePrecautionAdd(practice, precaution) {
  console.log("This is the precaution we're adding: " + precaution + ' to ' + practice);

  try {
    let updatedHealthPractice = await HealthPractice.findOneAndUpdate(
      { name: practice.name },
      { $push: { precautionType: precaution } }
    ).exec();
    console.log('This is practice now: ' + updatedHealthPractice);
    return updatedHealthPractice;
  } catch (err) {
    console.log('ERROR UPDATING practice: ' + practice);
  }

  // HealthPractice.update( { name: practice.name }, { $push: { precautionType: precaution } }, function (err) {
  //   if (err) {
  //     console.log("Error updating practice: " + practice)
  //     // cb(err, null)
  //     return
  //   }
  //   console.log("Health Practice in DB updated to have precaution type: " + precaution)
  //   console.log('\n')
  //   console.log('Proof: ' + practice)

  //   console.log('Health Practice in local array updated: ' + practice)
  //   practice.precautionType = precaution
  //   return practice
  //   // cb(null, practice)
  // })
}

async function createLocationProfessions(cb) {
  locations = await Promise.all([
    locationCreate('HSC', '5', '123'),
    locationCreate('HSC', '3', '321'),
    locationCreate('USC', '2', '123')
  ]);

  console.log('This is locations: ' + locations);

  professions = await Promise.all([
    professionCreate('Clinic', 'Nurse'),
    professionCreate('Clinic', 'Physician')
  ]);

  console.log('This is professions: ' + professions);

  /*
  async.parallel([
    function(callback) {
      locationCreate('HSC', '5', '123', callback)
    },
    function(callback) {
      locationCreate('HSC', '3', '321', callback)
    },
    function(callback) {
      locationCreate('USC', '2', '123', callback)
    },
    function(callback) {
      professionCreate('Clinic', 'Nurse', callback)
    },
    function(callback) {
      professionCreate('Clinic', 'Physician', callback)
    }
    ],
    // optional callback
    cb) */
}

async function createPracticeEmployees(cb) {
  healthPractices = await Promise.all([
    healthPracticeCreate('Hand Hygiene'),
    healthPracticeCreate('PPO'),
    healthPracticeCreate('Mask'),
    healthPracticeCreate('Quarantine')
  ]);

  console.log('This is practices: ' + healthPractices);

  employees = await Promise.all([
    employeeCreate('Nicholas', 'Caceres', professions[1]),
    employeeCreate('Catherine', 'Sazon', professions[0]),
    employeeCreate('Maria', 'Caceres', professions[0]),
    employeeCreate('Lionel', 'Caceres', professions[0]),
    employeeCreate('Edwin', 'Toribio', professions[1])
  ]);

  console.log('This is employees: ' + employees);

  /*
  async.parallel([
    function(callback) {
      healthPracticeCreate('Hand Hygiene', callback)
    },
    function(callback) {
      healthPracticeCreate('PPO', callback)
    },
    function(callback) {
      healthPracticeCreate('Mask', callback)
    },
    function(callback) {
      healthPracticeCreate('Quarantine', callback)
    },
    function(callback) {
      employeeCreate('Nicholas', 'Caceres', professions[1], callback)
    },
    function(callback) {
      employeeCreate('Catherine', 'Sazon', professions[0], callback)
    },
    function(callback) {
      employeeCreate('Maria', 'Caceres', professions[0], callback)
    },
    function(callback) {
      employeeCreate('Lionel', 'Caceres', professions[0], callback)
    },
    function(callback) {
      employeeCreate('Edwin', 'Toribio', professions[1], callback)
    }
    ],
    // optional callback
    cb) */
}

async function createPrecautions(cb) {
  precautions = await Promise.all([
    precautionCreate('Standard', healthPractices.slice(0, 2)),
    precautionCreate('Isolation', healthPractices.slice(2))
  ]);

  console.log('This is precautions: ' + precautions);
  /*
  async.parallel([
    function(callback) {
      precautionCreate('Standard', healthPractices.slice(0,2), callback)
    },
    function(callback) {
      precautionCreate('Isolation', healthPractices.slice(2), callback)
    }
  ],
  // optional callback
  cb) */
}

async function finishHealthPractice(cb) {
  console.log('This is health practices to start with: ');
  console.log(healthPractices);

  console.log('This is precautions: ' + precautions);

  let prevPractices = healthPractices.splice(0, healthPractices.length);

  console.log('This is health practices now: ' + healthPractices);
  console.log('This is prevPractices: ' + prevPractices);

  healthPractices = await Promise.all([
    practicePrecautionAdd(prevPractices[0], precautions[0]),
    practicePrecautionAdd(prevPractices[1], precautions[0]),
    practicePrecautionAdd(prevPractices[2], precautions[1]),
    practicePrecautionAdd(prevPractices[3], precautions[1])
  ]);

  console.log('This is health practices now: ' + healthPractices);

  // async.parallel([
  //   function(callback) {
  //     practicePrecautionAdd(healthPractices[0], precautions[0], callback)
  //   },
  //   function(callback) {
  //     practicePrecautionAdd(healthPractices[1], precautions[0], callback)
  //   },
  //   function(callback) {
  //     practicePrecautionAdd(healthPractices[2], precautions[1], callback)
  //   },
  //   function(callback) {
  //     practicePrecautionAdd(healthPractices[3], precautions[1], callback)
  //   }
  // ],
  // // optional callback
  // cb)
}

async function createReports() {
  reports = await Promise.all([
    reportCreate(employees[0], healthPractices[0], locations[0], new Date()),
    reportCreate(employees[1], healthPractices[2], locations[1], new Date()),
    reportCreate(employees[2], healthPractices[1], locations[2], new Date()),
    reportCreate(employees[3], healthPractices[3], locations[1], new Date()),
    reportCreate(employees[4], healthPractices[0], locations[0], new Date())
  ]);

  console.log('This is reports: ' + reports);

  /*
  async.parallel([
    function(callback) {
      reportCreate(employees[0], healthPractices[0], locations[0], new Date(), callback)
    },
    function(callback) {
      reportCreate(employees[1], healthPractices[2], locations[1], new Date(), callback)
    },
    function(callback) {
      reportCreate(employees[2], healthPractices[1], locations[2], new Date(), callback)
    },
    function(callback) {
      reportCreate(employees[3], healthPractices[3], locations[1], new Date(), callback)
    },
    function(callback) {
      reportCreate(employees[4], healthPractices[0], locations[0], new Date(), callback)
    }
    ],
    // Optional callback
    cb) */
}

// let functionsInSeries = [
//   createLocationProfessions,
//   createPracticeEmployees,
//   createPrecautions,
//   finishHealthPractice,
//   createReports
// ]

// for (const functions of functionsInSeries) {
//   functions()
// }

async.series(
  [
    createLocationProfessions,
    createPracticeEmployees,
    createPrecautions,
    finishHealthPractice,
    createReports
  ],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Report at zero: ' + reports[0]);
      console.log('Employee at zero: ' + employees[0]);
      console.log('Location at zero: ' + locations[0]);
      console.log('Profession at zero: ' + professions[0]);
      console.log('Precaution at zero: ' + precautions[0]);
      console.log('Health Practice at zero: ' + healthPractices[0]);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);

// mongodb://NLCaceres:9MivZcw9@ds031108.mlab.com:31108/local-records
