
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;



var Cookies;

describe('Login Fuctional Test', function() {

  it('should create a valid user session', function(done) {
        request('http://localhost:3000')
        .post('/users/login')
        .send({ 'username': 'test', 'password': 'test' })
        .expect(200)
        .end(function(err, res) {
            done();
        });
  });

  it('should get user session for current user', function(done) {
    var req = request('http://localhost:3000').get('/users/login')
        req.cookies = Cookies;
        req.set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(error, response) {
          expect(response).to.have.body
          done();
        });
  });

});
