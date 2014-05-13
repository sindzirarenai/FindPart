var winston = require('winston');
var ENV = process.env.NODE_ENV;

function getLogger(module){
  var path = module.filename.split('/').slice(-2).join('/');
  
  return new winston.Logger({
    transports:[
      new winston.transports.Console({
        colorize:true,
        level: 'debug',
        label:path
      }),
      new winston.transports.File({
        filename:'log.txt',
        level: 'error',
        label:path,
        handleExceptions: true
      })
    ]
  })
}

module.exports = getLogger;