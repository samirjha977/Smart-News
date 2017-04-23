var express = require('express');
var dbService = require('../db.utils.js');
var router = express.Router();
var winston = require('winston');

var logger = new winston.Logger ({
  transports: [
    new winston.transports.Console ({colorize: true}),
    new winston.transports.File ({
      filename:'./winstonLog.log'
    })
  ]
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

router.get('/', ensureAuthenticated, function (req, res) {
  dbService.fetchAll().then(function (fetchedNews) {
        res.status(200).render('index',{newDisplay: fetchedNews});
  			}).catch(function (err) {
    		logger.error(error);
				res.status(500).render('404');
				});
});




router.get('/positive', ensureAuthenticated, function (req, res) {
  dbService.fetchAll().then(function (fetchedNews) {
    var positive = [];
    fetchedNews.forEach(function (element) {
      if (element.mood === 'positive')
      positive.push(element);
    });
    if(positive != []){
			res.status(200).render('index',{newDisplay: positive});
    }
	  }).catch(function (err) {
	    logger.error(error);
			res.status(500).render('404');
	  });
});



router.get('/negative', ensureAuthenticated, function (req, res) {
  dbService.fetchAll().then(function (fetchedNews) {
    var positive = [];
    fetchedNews.forEach(function (element) {
      if (element.mood === 'negative')
      positive.push(element);
    });
		if(positive != []){
			res.status(200).render('index',{newDisplay: positive});
		}
  	}).catch(function (err) {
    logger.error();(error);
		res.status(500).render('404');
  });
});

router.get('/news', function (req, res) {
  dbService.fetchAll().then(function (fetchedNews) {
			res.status(200).send(fetchedNews);
  	}).catch(function (err) {
    logger.error();(error);
		res.status(500).render('404');
  });
});

module.exports = router;
