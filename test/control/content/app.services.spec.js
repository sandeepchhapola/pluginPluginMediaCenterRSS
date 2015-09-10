describe('Unit : pluginPluginMediaCenterRSS content services', function () {
  describe('Unit: Buildfire Provider', function () {
    var Buildfire;
    beforeEach(module('mediaCenterRSSPluginContent'));
    beforeEach(inject(function (_Buildfire_) {
      Buildfire = _Buildfire_;
    }));

    it('Buildfire should exist and be an object', function () {
      expect(typeof Buildfire).toEqual('object');
    });
  });

  describe('Unit : DataStore Factory', function () {
    var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
    beforeEach(module('mediaCenterRSSPluginContent'));
    beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      DataStore = _DataStore_;
      Buildfire = {
        datastore: {}
      };
      Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'save']);
    }));
    it('DataStore should exist and be an object', function () {
      expect(typeof DataStore).toEqual('object');
    });
    it('DataStore.get should exist and be a function', function () {
      expect(typeof DataStore.get).toEqual('function');
    });
    it('DataStore.save should exist and be a function', function () {
      expect(typeof DataStore.save).toEqual('function');
    });
  });

  describe('Unit : FeedParseService Factory', function () {
    var STATUS_MESSAGES, STATUS_CODE, $httpBackend, q, FeedParseService, $rootScope;
    beforeEach(module('mediaCenterRSSPluginContent'));
    beforeEach(inject(function (_FeedParseService_, _$rootScope_, _$q_, _$httpBackend_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      q = _$q_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      FeedParseService = _FeedParseService_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
    }));
    it('FeedParseService should exist and be an object', function () {
      expect(typeof FeedParseService).toEqual('object');
    });
    it('FeedParseService.validateFeedUrl should exist and be a function', function () {
      expect(typeof FeedParseService.validateFeedUrl).toEqual('function');
    });
    describe('Unit : FeedParseService.validateFeedUrl Success', function () {
      beforeEach(function () {
        $httpBackend.expectPOST("http://localhost:3000/validatefeedurl").respond({
          data: {
            isValidFeedUrl: true
          },
          status: 200
        });
      });
      it('FeedParseService.validateFeedUrl should return success', function () {
        var url = 'http://feeds.reuters.com/reuters/USVideoBreakingviews'
          , result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            console.log('Error: ',err);
            result = err;
          };
        FeedParseService.validateFeedUrl(url).then(success, error);
        $httpBackend.flush();
        $rootScope.$digest();
        expect(result).toEqual({data: {isValidFeedUrl: true}, status: 200});
      });
    });
    describe('Unit : FeedParseService.validateFeedUrl Error', function () {
      beforeEach(function () {
        $httpBackend.expectPOST("http://localhost:3000/validatefeedurl").respond({
          data: {
            isValidFeedUrl: false
          },
          status: 200
        });
      });
      it('FeedParseService.validateFeedUrl should return error', function () {
        var url = 'https://www.youtube.com/watch?v=OA-0O09TsNI'
          , result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            console.log('FeedParseService.validateFeedUrl Error: ',err);
            result = err.message;
          };
        FeedParseService.validateFeedUrl(url).then(success, error);
        $httpBackend.flush();
        $rootScope.$digest();
        expect(result).toEqual('Not a feed url');
      });
    });
    describe('Unit : FeedParseService.validateFeedUrl Error when Undefined feed url provided', function () {
      beforeEach(function () {
        $httpBackend.expectPOST("http://localhost:3000/validatefeedurl").respond({
          data: {
            isValidFeedUrl: false
          },
          status: 200
        });
      });
      it('FeedParseService.validateFeedUrl should return error "Undefined feed url"', function () {
        var url = ''
          , result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            console.log('FeedParseService.validateFeedUrl Error: ',err);
            result = err.message;
          };
        FeedParseService.validateFeedUrl(url).then(success, error);
        $httpBackend.flush();
        $rootScope.$digest();
        expect(result).toEqual('Undefined feed url');
      });
    });
    describe('Unit : FeedParseService.validateFeedUrl Server Error', function () {
      beforeEach(function () {
        $httpBackend.expectPOST("http://localhost:3000/validatefeedurl").respond(500, 'internal server error');
      });
      it('FeedParseService.validateFeedUrl should return server error', function () {
        var url = 'http://feeds.reuters.com/reuters/USVideoBreakingviews'
          , result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            console.log('FeedParseService.validateFeedUrl Error: ',err);
            result = err;
          };
        FeedParseService.validateFeedUrl(url).then(success, error);
        $httpBackend.flush();
        $rootScope.$digest();
        expect(result).toEqual('internal server error');
      });
    });
  });
});

