var crypto = require('crypto');
var mongoose = require('../lib/db'),
  Schema = mongoose.Schema;
var log = require('../lib/log')(module);

var user = new Schema({
	username:{
    type:String,
    unique:true,
    required:true
  },
  hashedPassword:{
    type:String,
    required:true
  },
  salt:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:['admin','user'],
    default:'user'
  }
});

user.methods.encryptPassword = function(password){
  return crypto.createHmac('sha1',this.salt).update(password).digest('hex');
}

user.virtual('password')
  .set(function(password){
    this._plainPassword = password;
    this.salt = Math.random()+'';
    this.hashedPassword = this.encryptPassword(password)
  })
  .get(function(){
    return this._plainPassword;
  })

user.methods.checkPassword = function(password){
  return this.encryptPassword(password)===this.hashedPassword;
}

user.statics.deleteAll = function(callback){
    User.remove({},callback);
}

user.statics.authenticate=function(user, callback){
  User.findOne({username:user.username}, function (err,res){
    if(res && res.checkPassword(user.password)){
      callback(null, {status:200, user:res});
      log.info('Successful login: '+user.username);
    }else{
      if(err){
        log.error(err);
        callback(err);
      }else {
        log.error('Unsuccessful login attempt: '+user.username);
        callback(null, {status:403, user:null});
      }
    }
  })
}

user.statics.findUser = function(id, callback){
  User.findById(id, callback);
}

user.statics.findByUsername = function(user, callback){
  User.findOne({username:user}, callback);
}

user.statics.addUser = function(username,password,role,callback){
  var user = new User({
    username:username,
    password:password,
    role:role
  });
  user.save(callback);
}

var User = mongoose.model('User', user);
module.exports= mongoose.model('User');