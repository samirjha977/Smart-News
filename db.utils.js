var News = require('./Model/news.model');
var winston = require('winston');

var logger = new winston.Logger ({
  transports: [
    new winston.transports.Console ({colorize: true}),
    new winston.transports.File ({
      filename:'./winstonLog.log'
    })
  ]
});



module.exports = {
  fetchAll: fetchAll
}

function fetchAll() {
return News.find({}).sort({ datestamp: -1 }).exec().then(function (result) {
      return result;
}).catch(function (err) {
      logger.error("Something wrong in FetchAll() in db.utils.js \n" + err);
    });
}
