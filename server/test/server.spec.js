var assert = require("chai").assert;
var request = require("supertest");
var server = require("../server");
var app;

describe('Server API Test Suite', function () {
  before(function (done) {
    this.timeout(15000);
    app = server();
    done();
  });

  describe('Server Root API Test', function () {
    it('should return welcome', function (done) {
      request(app)
        .get("/")
        .end(function (err, res) {
          assert.isTrue(res.text === 'Welcome!');
          done();
        });
    });
  });

  describe('/validatefeedurl POST API Test Suite', function () {
    it('should be respond an error', function (done) {
      request(app)
        .post("/validatefeedurl")
        .send({'feedUrl': ''})
        .end(function (err, res) {
          var resObj = JSON.parse(res.text);
          assert.equal(404, res.statusCode);
          assert.isTrue(resObj.code === 'RSS_FEED_URL_NOT_FOUND');
          done();
        });
    });

    it('res.data.isValidFeedUrl should be true', function (done) {
      request(app)
        .post("/validatefeedurl")
        .send({'feedUrl': 'https://vimeo.com/feeds/videos/rss'})
        .end(function (err, res) {
          var resObj = JSON.parse(res.text);
          assert.equal(200, res.statusCode);
          assert.isTrue(resObj.data.isValidFeedUrl === true);
          done();
        });
    });

    it('res.data.isValidFeedUrl should be false', function (done) {
      request(app)
        .post("/validatefeedurl")
        .send({'feedUrl': 'https://www.youtube.com/watch?v=OA-0O09TsNI'})
        .end(function (err, res) {
          var resObj = JSON.parse(res.text);
          assert.equal(200, res.statusCode);
          assert.isTrue(resObj.data.isValidFeedUrl === false);
          done();
        });
    });
  });

  describe('/parsefeedurl POST API Test Suite', function () {
    it('should be respond an error', function (done) {
      request(app)
        .post("/parsefeedurl")
        .send({'feedUrl': ''})
        .end(function (err, res) {
          var resObj = JSON.parse(res.text);
          assert.equal(404, res.statusCode);
          assert.isTrue(resObj.code === 'RSS_FEED_URL_NOT_FOUND');
          done();
        });
    });

    it('res.statusCode should be 200', function (done) {
      request(app)
        .post("/parsefeedurl")
        .send({'feedUrl': 'https://vimeo.com/feeds/videos/rss'})
        .end(function (err, res) {
          assert.equal(200, res.statusCode);
          done();
        });
    });
  });

  describe('in development', function () {
    it('should disable "view cache"', function () {
      process.env.NODE_ENV = 'development';
      require('express')().enabled('view cache').should.be.false;
    })
  });

  describe('in production', function () {
    it('should enable "view cache"', function () {
      process.env.NODE_ENV = '';
      require('express')().enabled('view cache').should.be.true;
    })
  })

});