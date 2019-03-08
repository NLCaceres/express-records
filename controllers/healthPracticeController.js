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
  res.send('NOT IMPLEMENTED: ');
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
