var sentimentAnalysis = require('sentiment');
var mongodb = require('./Model/mongodb.utils');
var News = require('./Model/news.model');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
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

  var nlu = new NaturalLanguageUnderstandingV1({
    username: process.env.IBM_SENTI_USER,
    password: process.env.IBM_SENTI_PASS,
    version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
  });

  var parameters = {
      'text': articles.title,
      'features': {
        'entities': {
          'emotion': true,
          'sentiment': true,
          'limit': 2
        },
        'keywords': {
          'emotion': true,
          'sentiment': true,
          'limit': 2
        }
      }
    }

      nlu.analyze(parameters, function(err, response) {
      if (err)
        console.log('error:', err);
      else
      // console.log("---------------------",JSON.stringify( response.keywords[0], null, 2));
      if(response.hasOwnProperty('keywords') && response.keywords[0] !== undefined) {
          if(response.keywords[0].hasOwnProperty('sentiment')) {
        if(response.keywords[0].sentiment.score > 0) {
          var moodset = 'positive';
        } else if (response.keywords[0].sentiment.score < 0) {
          var moodset = 'negative';
        } else {
          var moodset = "neutral";
        }
      }

        if(response.keywords[0].hasOwnProperty('emotion') && response.keywords[0].emotion !== undefined) {
            var newNews = new News({
            snippet: articles.title,
            description: articles.description,
            sentimentScore: response.keywords[0].sentiment.score,
            date: articles.publishedAt,
            mood: moodset,
            datestamp: new Date(),
            url: articles.url,
            urlimage: articles.urlToImage,
            sadness: response.keywords[0].emotion.sadness,
            Joy: response.keywords[0].emotion.joy,
            fear: response.keywords[0].emotion.fear,
            disgust: response.keywords[0].emotion.disgust,
            anger: response.keywords[0].emotion.anger
          });
          newNews.save()
          .then(function (result) {
              logger.info('ADDED ITEM..................................... \n');
              console.log(result);
          });
        }
      }
    });
};
