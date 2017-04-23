var sentimentAnalysis = require('sentiment');
var mongodb = require('./Model/mongodb.utils');
var News = require('./Model/news.model');
var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');
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
  sentiment: sentiment
};



function sentiment(articles) {
    var alchemy_language = new AlchemyLanguageV1({
      api_key: process.env.IBM_SENTI_API
    });
    var params = {
      text: articles.description
    };

    alchemy_language.sentiment(params, function (err, response) {
      if (err)
        console.log('error:', err);
      else
      var newNews = new News({
      snippet: articles.title,
      description: articles.description,
      sentimentScore: response.docSentiment.score,
      date: articles.publishedAt,
      mood: response.docSentiment.type ,
      datestamp: new Date(),
      url: articles.url,
      urlimage: articles.urlToImage
    });
    newNews.save()
    .then(function (result) {
        logger.info('ADDED ITEM..................................... \n');
        console.log(result);
    });

  });
};
