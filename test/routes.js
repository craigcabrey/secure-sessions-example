var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000');

describe('routes', function() {
  it('should return a 200 response on valid credentials', function(done) {
    api.get('/users/login')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        user: 'alice',
        password: 'password'
      })
      .expect(200, done);
  });

  it('should return a 401 response on invalid credentials', function(done) {
    api.get('/users/login')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        user: 'bob',
        password: 'password2'
      })
      .expect(401, done);
  });
});
