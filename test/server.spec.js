var request = require('supertest');

describe('Express Startup Test', function () {
  var server;
  beforeEach(function () {
    server = require('../index.js');
  });
  it('should respond to /', function (done) {
    request('http://localhost:3000')
    .get('/')
    .expect(302, done)

  });
  it('should give error for anything else expect defined routes', function (done) {
    request('http://localhost:3000')
    .get('/anything')
    .expect(404,done)
  });
});
