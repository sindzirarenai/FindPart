var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.get("mongoose:url"));

module.exports = mongoose;