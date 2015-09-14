describe('Unit : pluginPluginMediaCenterRSS content.home.controller.js', function () {
  var ContentHome, scope, $rootScope, $controller, q, FeedParseService, $timeout, $httpBackend, DataStore, Buildfire, TAG_NAMES, LAYOUTS, STATUS_CODE, STATUS_MESSAGES;
  beforeEach(module('mediaCenterRSSPluginContent'));

  beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _$httpBackend_, _FeedParseService_, _$timeout_, _Buildfire_, _TAG_NAMES_, _LAYOUTS_, _STATUS_CODE_, _STATUS_MESSAGES_) {
    $rootScope = _$rootScope_;
    q = _$q_;
    scope = $rootScope.$new();
    $controller = _$controller_;
    FeedParseService = _FeedParseService_;
    $timeout = _$timeout_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
    LAYOUTS = _LAYOUTS_;
    $httpBackend = _$httpBackend_;
    DataStore = {};
    DataStore = jasmine.createSpyObj('DataStore', ['get', 'save']);
    DataStore.get.and.callFake(function () {
      var deferred = q.defer();
      deferred.resolve({
        data: {
        }
      });
      return deferred.promise;
    });
    DataStore.save.and.callFake(function () {
      var deferred = q.defer();
      deferred.resolve({
        data: {
          "content": {
            "carouselImages": [],
            "description": "<p>&nbsp;<br></p>",
            "rssUrl": "http://feeds.cnevids.com/brand/wired.mrss"
          },
          "design": {
            "itemListLayout": LAYOUTS.itemListLayouts[1].name,
            "itemDetailsLayout": LAYOUTS.itemDetailsLayouts[0].name,
            "itemListBgImage": "",
            "itemDetailsBgImage": ""
          }
        }
      });
      return deferred.promise;
    });
    Buildfire = {
      spinner: {
        show: function () {
          return true
        },
        hide: function () {
          return true
        }
      },
      components: {
        carousel: {
          editor: function (name) {
            return {
              loadItems:function(){}
            }
          },
          viewer: function (name) {
            return {}
          }
        }
      }
    };
  }));

  beforeEach(function () {
    ContentHome = $controller('ContentHomeCtrl', {
      $scope: scope,
      $q: q,
      Buildfire: Buildfire,
      DataStore: DataStore,
      $timeout: $timeout,
      FeedParseService: FeedParseService,
      STATUS_CODE: STATUS_CODE,
      STATUS_MESSAGES: STATUS_MESSAGES,
      TAG_NAMES: TAG_NAMES,
      LAYOUTS: LAYOUTS
    });
  });

  describe('Units: units should be Defined', function () {
    it('it should pass if ContentHome is defined', function () {
      expect(ContentHome).toBeDefined();
    });
    it('it should pass if Buildfire is defined', function () {
      expect(Buildfire).toBeDefined()
    });
    it('it should pass if FeedParseService is defined', function () {
      expect(FeedParseService).toBeDefined()
    });
    it('it should pass if DataStore is defined', function () {
      expect(DataStore).toBeDefined()
    });
    it('it should pass if TAG_NAMES is defined', function () {
      expect(TAG_NAMES).toBeDefined()
    });
    it('it should pass if STATUS_CODE is defined', function () {
      expect(STATUS_CODE).toBeDefined()
    });
    it('it should pass if STATUS_MESSAGES is defined', function () {
      expect(STATUS_MESSAGES).toBeDefined()
    });
    it('it should pass if LAYOUTS is defined', function () {
      expect(LAYOUTS).toBeDefined()
    });
  });

  describe('Function : ContentHome.clearData ', function () {
    it('ContentHome.clearData  should exist and be a function', function () {
      expect(typeof ContentHome.clearData).toEqual('function');
    });
    it('it should pass if ContentHome.data.content.rssUrl  is equals to "" ', function () {
      ContentHome.data.content.rssUrl = 'http://feeds.cnevids.com/brand/wired.mrss';
      ContentHome.clearData();
      $rootScope.$digest();
      expect(ContentHome.data.content.rssUrl).toEqual('');
    });
  });

  describe('Function : ContentHome.validateFeedUrl ', function () {
    it(' ContentHome.validateFeedUrl  should exist and be a function', function () {
      expect(typeof ContentHome.clearData).toEqual('function');
    });
    describe('Function : ContentHome.validateFeedUrl Error', function () {
      beforeEach(function () {
        $httpBackend.expectPOST("http://localhost:3000/validatefeedurl").respond({
          data: {
            isValidFeedUrl: false
          },
          status: 200
        });
      });
      it('ContentHome.validateFeedUrl should return Error', function () {
        ContentHome.rssFeedUrl = 'https://www.google.co.in/';
        ContentHome.isInValidUrl = false;
        ContentHome.validateFeedUrl();
        $httpBackend.flush();
        $rootScope.$digest();
        expect(ContentHome.isInValidUrl).toEqual(true);
        $timeout.flush();
        expect(ContentHome.isInValidUrl).toEqual(false);
      });
    });
    describe('Function : ContentHome.validateFeedUrl success', function () {
      beforeEach(function () {
        $httpBackend.expectPOST("http://localhost:3000/validatefeedurl").respond({
          data: {
            isValidFeedUrl: true
          },
          status: 200
        });
      });
      it('ContentHome.validateFeedUrl  should return success', function () {
        ContentHome.rssFeedUrl = 'http://feeds.cnevids.com/brand/wired.mrss';
        ContentHome.isValidUrl = false;
        ContentHome.validateFeedUrl();
        $httpBackend.flush();
        $rootScope.$digest();
        expect(ContentHome.isValidUrl).toEqual(true);
        $timeout.flush();
        expect(ContentHome.isValidUrl).toEqual(false);
      });
    });
  });
});