var assert = require('assert')
  , express = require('express')
  , request = require('supertest');

describe('app', function () {
  it('should be callable', function () {
    var app = express();
    assert.equal(typeof app, 'function');
  });
});

describe('/validatefeedurl POST API', function () {
  it('should throw an error', function (done) {
    var app = express();
    app.post('/validatefeedurl', function (req, res, next) {
      return done(new Error('Invalid RSS feed url'));
    });

    request(app)
      .del('/validatefeedurl')
      .expect(404, done);
  });

  it('should be respond with status 200', function (done) {
    var app = express();
    app.post('/validatefeedurl', function (req, res) {
      res.status(200).end();
    });

    request(app)
      .post('/validatefeedurl')
      .expect(200, done);
  });
});

describe('/parsefeedurl POST API', function () {
  it('should throw an error', function (done) {
    var app = express();
    app.post('/parsefeedurl', function (req, res, next) {
      return done(new Error('ERROR: getaddrinfo ENOTFOUND'));
    });

    request(app)
      .del('/parsefeedurl')
      .expect(404, done);
  });

  it('should be respond with status 200', function (done) {
    var app = express();
    app.post('/parsefeedurl', function (req, res) {
      res.status(200).end();
    });

    request(app)
      .post('/parsefeedurl')
      .expect(200, done);
  });
});

describe('in development', function () {
  it('should disable "view cache"', function () {
    process.env.NODE_ENV = 'development';
    var app = express();
    app.enabled('view cache').should.be.false

  })
});

describe('in production', function () {
  it('should enable "view cache"', function () {
    process.env.NODE_ENV = '';
    var app = express();
    app.enabled('view cache').should.be.true;
  })
});