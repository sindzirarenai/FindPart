var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect('mongodb://localhost/findSpare');

module.exports = mongoose;