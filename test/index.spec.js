var chai = require('chai');
var expect = chai.expect;
var chaiHTTP = require('chai-http');


chai.use(chaiHTTP);

describe('Endpoints Interactions', function() {

  it('returns body of root', function(done) {
    chai.request('http://localhost:3000')
    .get('/')
    .end(function(error, response) {
      expect(response).to.have.body;
      done();
    });
  });

  it('returns news object, fetching all news', function(done) {
    chai.request('http://localhost:3000')
    .get('/news')
    .end(function(error, response) {
      expect(response).to.have.object;
      done();
    });
  });
});
