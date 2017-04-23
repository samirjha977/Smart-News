var expect = require('chai').expect;
var News = require('../Model/news.model.js');
var User = require('../Model/users.model.js');

describe('Database testing for News Schema',function () {
  it('should be invalid if no data',function () {
      var newNews = new News();
      newNews.validate(function (err) {
        expect(err.errors).to.exist;
        done();
      });
  });
});
describe('Database testing for Users Schema', function () {
  it('should not allow duplicate username in Users Schema', function () {
    var newUser = new User({
      username: "test"
    });
    newUser.validate(function (err) {
      expect(err).to.exist;
      done()
    });
  });
});
