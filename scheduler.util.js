var schedule = require('node-schedule');
var api = require('./api.util.js');
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
  apiFetchScheduler: apiFetchScheduler
}




function apiFetchScheduler() {
  logger.info('Hourly update initiated');
   schedule.scheduleJob('02 * * * *', function(){
     logger.info('Hourly update initiated executed')
     api.fetchApi();
  });


  schedule.scheduleJob('59 59 23 * * *', function(){
    News.remove({}, function (err, cb) {
      logger.warn('Database Empty');
    });
    api.fetchApi();
 });



}
