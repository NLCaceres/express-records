const HealthPractice = require('../models/healthPractice');

exports.healthPractice_list = (req, res, next) => {
  // The populate simply fills the specified field
  // Assuming you set up the model properly
  // and your db is in order (filled/proper assignments)
  // then mongo will take care of the rest for rendering
  HealthPractice.find({}, 'name')
    .populate('precautionType')
    .exec((err, healthPracticeList) => {
      if (err) {
        return next(err);
      }
      res.render('healthPractice_list', {
        title: 'List of Offendable Health Practices',
        healthPracticeList
      });
    });
};

exports.healthPractice_detail = (req, res) => {
  //* Grab urlSafe version of health practice name which is in snakecase
  const healthPracticeName = req.params.practiceName.split("_")
    .map((subStr)=>subStr.charAt(0).toUpperCase() + subStr.slice(1))
    .join(" "); //* And turn it from foo_bar to Foo Bar
  HealthPractice.findOne({ name: healthPracticeName }, 'name')
    .populate('precautionType')
    .exec((err, healthPractice) => {
      if (err) {
        return next(err);
      }

      res.render('healthPractice_detail', {
        title: `${healthPractice.name} Definition`,
        healthPractice
      });
    });
};

exports.healthPractice_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};

exports.healthPractice_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};

exports.healthPractice_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};

exports.healthPractice_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};

exports.healthPractice_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};

exports.healthPractice_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: ');
};
