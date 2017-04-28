var mongoose = require('mongoose');
var winston = require('winston');
var scheduler = require('../scheduler.util.js');
var News = require('../Model/news.model.js');
var api = require('../api.util.js');

var logger = new winston.Logger ({
  transports: [
    new winston.transports.Console ({colorize: true}),
    new winston.transports.File ({
      filename:'./winstonLog.log'
    })
  ]
});

module.exports = {
  createEventListeners: createEventListeners,
  connect: connect,
  disconnect: disconnect
};

function createEventListeners() {
  mongoose.connection.on('connected', function () {
    logger.info('Successfully connected to database.');
    News.remove({}, function (err, cb) {
      console.log("Database empty");
    });
    try {
        api.fetchApi();
        logger.info("News Api fetch complete");
    } catch(err) {
        logger.error('Could not fetch news' + err);
      }
    scheduler.apiFetchScheduler();
  });

  mongoose.connection.on('disconnected', function () {
    logger.info('Database connection closed.');
  });

  mongoose.connection.on('error', function (err) {
    logger.error('There was an issue connecting to the database: ' + err);
  });
}

function connect() {
  // mongoose.connect(process.env.DB_PASS);
  mongoose.connect('mongodb://localhost/NewsPortal');
}

function disconnect() {
  mongoose.disconnect();
}
