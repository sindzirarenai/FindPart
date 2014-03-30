var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect('mongodb://localhost/findSpare');

console.log('connect with database');

module.exports = mongoose;