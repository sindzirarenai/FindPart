var User = require('./models/user');
var mongoose = require('./lib/db');
var log = require('./lib/log')(module);

User.deleteAll(function(err,res){
  log.info('deleted all users');
})

user = new User({
  username:'admin',
  password:'16669353',
  role:'admin'
});

user.save(function(err, user, affected){
  log.info('Add admin user');
  mongoose.disconnect();
});
