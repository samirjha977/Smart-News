var mongoose = require('mongoose');
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
  createEventListeners: createEventListeners,
  connect: connect,
  disconnect: disconnect
};

function createEventListeners() {
  mongoose.connection.on('connected', function () {
    logger.info('Successfully connected to database.');
  });

  mongoose.connection.on('disconnected', function () {
    logger.info('Database connection closed.');
  });

  mongoose.connection.on('error', function (err) {
    logger.error('There was an issue connecting to the database: ' + err);
  });
}

function connect() {
  mongoose.connect(process.env.DB_PASS);
}

function disconnect() {
  mongoose.disconnect();
}
