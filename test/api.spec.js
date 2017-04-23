var chai = require('chai');
var expect = chai.expect;
var apiUtils = require('../api.util.js');
var machine = require('../machine.util.js');





describe('API Interactions', function() {

  it('NEWS.ORG does not return null', function(done) {
      expect(apiUtils.fetchApi()).isNotNull
      done();

  });

});

it('IBM does not return null', function(done) {
    expect(machine.sentiment({description: "This is cool stuff"})).isnotNull      //not working after using process.env
    done();

});
