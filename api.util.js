var request = require('request');
var mongodb = require('./Model/mongodb.utils');
var News = require('./Model/news.model');
var rp = require('request-promise');
var utility = require('./machine.util.js');
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
  fetchApi: fetchApi
};

function fetchApi() {
    logger.info('Fetching News from api.utils.js');
    rp('https://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey='+process.env.NEWS_API)
    .then(function (response) {
      logger.info('Got response from the news.api.org');
      var body = JSON.parse(response);
          return body.articles;
    })
    .then(function (data) {
      var articles = data;
      articles.forEach(function (element) {
        if(element.description === null){
          element.description = "Unknown Item";
        }
        utility.sentiment(element);
      });
    })
    .catch(function (err) {
        console.log(err);
    });
  }
