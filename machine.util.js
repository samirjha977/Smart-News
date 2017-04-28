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
        if(response.keywords[0].sentiment.score > 0) {
          var moodset = 'positive';
        } else if (response.keywords[0].sentiment.score < 0) {
          var moodset = 'negative';
        } else {
          var moodset = "neutral";
        }
        if(response.keywords[1].hasOwnProperty('emotion')) {
            var newNews = new News({
            snippet: articles.title,
            description: articles.description,
            sentimentScore: response.keywords[0].sentiment.score,
            date: articles.publishedAt,
            mood: moodset,
            datestamp: new Date(),
            url: articles.url,
            urlimage: articles.urlToImage,
            sadness: response.keywords[1].emotion.sadness,
            Joy: response.keywords[1].emotion.joy,
            fear: response.keywords[1].emotion.fear,
            disgust: response.keywords[1].emotion.disgust,
            anger: response.keywords[1].emotion.anger
          });
          newNews.save()
          .then(function (result) {
              logger.info('ADDED ITEM..................................... \n');
              console.log(result);
          });

        } else
        {
              var newNews = new News({
              snippet: articles.title,
              description: articles.description,
              sentimentScore: response.keywords[0].sentiment.score,
              date: articles.publishedAt,
              mood: moodset,
              datestamp: new Date(),
              url: articles.url,
              urlimage: articles.urlToImage,
              sadness: 0,
              Joy: 0,
              fear: 0,
              disgust: 0,
              anger: 0
            });
            newNews.save()
            .then(function (result) {
                logger.info('ADDED ITEM..................................... \n');
                console.log(result);
            });
        }
      });
};
