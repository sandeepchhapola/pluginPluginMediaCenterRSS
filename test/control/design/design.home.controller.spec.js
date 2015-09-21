describe('Unit : pluginPluginMediaCenterRSS design.home.controller.js', function () {
  var DesignHome, scope, $rootScope, $timeout, $controller, q, DataStore, TAG_NAMES, LAYOUTS, ImageLibrary, STATUS_MESSAGES, STATUS_CODE;
  beforeEach(module('mediaCenterRSSPluginDesign'));

  beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _$timeout_, _TAG_NAMES_, _LAYOUTS_, _STATUS_CODE_, _STATUS_MESSAGES_) {
    $rootScope = _$rootScope_;
    q = _$q_;
    scope = $rootScope.$new();
    $timeout = _$timeout_;
    $controller = _$controller_;
    TAG_NAMES = _TAG_NAMES_;
    LAYOUTS = _LAYOUTS_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
    STATUS_CODE = _STATUS_CODE_;
    DataStore = {};
    DataStore = jasmine.createSpyObj('DataStore', ['get', 'save']);
    ImageLibrary = jasmine.createSpyObj('ImageLibrary', ['showDialog']);
  }));

  describe('Units: DataStore.save returns error', function () {
    beforeEach(function () {
      DataStore.get.and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          data:  {
            "content": {
              "carouselImages": [],
              "description": "<p>&nbsp;<br></p>",
              "rssUrl": ""
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
      DataStore.save.and.callFake(function () {
        var deferred = q.defer();
        deferred.reject('Error');
        return deferred.promise;
      });
      DesignHome = $controller('DesignHomeCtrl', {
        $scope: scope,
        DataStore: DataStore,
        TAG_NAMES: TAG_NAMES,
        LAYOUTS: LAYOUTS
      });
    });

    it('DesignHome.isNotSaved should be true and false when timeout called', function () {
      $rootScope.$digest();
      DesignHome.data.design.itemListLayout=LAYOUTS.itemListLayouts[3].name;
      $rootScope.$digest();
      $timeout.flush();
      expect(DesignHome.isNotSaved).toEqual(true);
      $timeout.flush();
      expect(DesignHome.isNotSaved).toEqual(false);
    });
  });

  describe('Units: DataStore.save returns success', function () {
    beforeEach(function () {
      DataStore.get.and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          data:  {
            "content": {
              "carouselImages": [],
              "description": "<p>&nbsp;<br></p>",
              "rssUrl": ""
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
      DataStore.save.and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          data:  {
            "content": {
              "carouselImages": [],
              "description": "<p>&nbsp;<br></p>",
              "rssUrl": ""
            },
            "design": {
              "itemListLayout": LAYOUTS.itemListLayouts[3].name,
              "itemDetailsLayout": LAYOUTS.itemDetailsLayouts[0].name,
              "itemListBgImage": "",
              "itemDetailsBgImage": ""
            }
          }
        });
        return deferred.promise;
      });
      DesignHome = $controller('DesignHomeCtrl', {
        $scope: scope,
        DataStore: DataStore,
        TAG_NAMES: TAG_NAMES,
        LAYOUTS: LAYOUTS
      });
    });

    it('DesignHome.isNotSaved should be true and false when timeout called', function () {
      $rootScope.$digest();
      DesignHome.data.design.itemListLayout=LAYOUTS.itemListLayouts[3].name;
      $rootScope.$digest();
      $timeout.flush();
      expect(DesignHome.isSaved).toEqual(true);
      $timeout.flush();
      expect(DesignHome.isSaved).toEqual(false);
    });
  });

  describe('Units: Init()- DataStore.get returns error', function () {
    beforeEach(function () {
      DataStore.get.and.callFake(function () {
        var deferred = q.defer();
        deferred.reject('Error');
        return deferred.promise;
      });
      DesignHome = $controller('DesignHomeCtrl', {
        $scope: scope,
        DataStore: DataStore,
        TAG_NAMES: TAG_NAMES,
        LAYOUTS: LAYOUTS
      });
    });

    it('DataStore.get should be called with error callback', function () {
      $rootScope.$digest();
      expect(DataStore.get).toHaveBeenCalled();
    });
  });

  describe('Units: Init()- DataStore.get returns success but DesignHome.data.design is undefined', function () {
    beforeEach(function () {
      DataStore.get.and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          data: {
            "content": {
              "carouselImages": [],
              "description": "<p>&nbsp;<br></p>",
              "rssUrl": ""
            }
          }
        });
        return deferred.promise;
      });
      DesignHome = $controller('DesignHomeCtrl', {
        $scope: scope,
        DataStore: DataStore,
        TAG_NAMES: TAG_NAMES,
        LAYOUTS: LAYOUTS
      });
    });
    it('DesignHome.data.design should be defined with empty object {}', function () {
      $rootScope.$digest();
      expect(DesignHome.data.design).not.toBeUndefined();
      expect(DesignHome.data.design.itemListLayout).toEqual(LAYOUTS.itemListLayouts[0].name);
      expect(DesignHome.data.design.itemDetailsLayout).toEqual(LAYOUTS.itemDetailsLayouts[0].name);
    });
  });

  describe('Units: Init()- DataStore.get returns success', function () {
    beforeEach(function () {
      DataStore.get.and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve({
          data: {
            "content": {
              "carouselImages": [],
              "description": "<p>&nbsp;<br></p>",
              "rssUrl": ""
            },
            "design": {
              "itemListLayout": LAYOUTS.itemListLayouts[0].name,
              "itemDetailsLayout": LAYOUTS.itemDetailsLayouts[0].name,
              "itemListBgImage": "",
              "itemDetailsBgImage": ""
            }
          }
        });
        return deferred.promise;
      });
      DesignHome = $controller('DesignHomeCtrl', {
        $scope: scope,
        $q: q,
        DataStore: DataStore,
        TAG_NAMES: TAG_NAMES,
        LAYOUTS: LAYOUTS,
        STATUS_MESSAGES: STATUS_MESSAGES,
        STATUS_CODE: STATUS_CODE,
        ImageLibrary: ImageLibrary
      });
    });

    describe('Units: units should be Defined', function () {
      it('it should pass if DesignHome is defined', function () {
        expect(DesignHome).toBeDefined();
      });
      it('it should pass if DataStore is defined', function () {
        expect(DataStore).toBeDefined()
      });
      it('it should pass if TAG_NAMES is defined', function () {
        expect(TAG_NAMES).toBeDefined()
      });
      it('it should pass if LAYOUTS is defined', function () {
        expect(LAYOUTS).toBeDefined()
      });
      it('it should pass if ImageLibrary is defined', function () {
        expect(ImageLibrary).toBeDefined()
      });
      it('it should pass if $timeout is defined', function () {
        expect($timeout).toBeDefined();
      });
    });

    describe('Function :DesignHome.changeListLayout', function () {
      it('DesignHome.changeListLayout should exist and be a function', function () {
        expect(typeof DesignHome.changeListLayout).toEqual('function');
      });
      it('it should pass if DesignHome.data.design.itemListLayout is equals to "List_Layout_3" after passing parameter "List_Layout_3" to DesignHome.changeListLayout', function () {
        $rootScope.$digest();
        DesignHome.changeListLayout('List_Layout_3');
        expect(DesignHome.data.design.itemListLayout).toEqual('List_Layout_3');
      });
    });

    describe('Function :DesignHome.changeItemDetailsLayout', function () {
      it('DesignHome.changeItemDetailsLayout should exist and be a function', function () {
        expect(typeof DesignHome.changeItemDetailsLayout).toEqual('function');
      });
      it('it should pass if DesignHome.data.design.itemDetailsLayout is equals to "List_Layout_2" after passing parameter "List_Layout_2" to DesignHome.changeListLayout', function () {
        $rootScope.$digest();
        DesignHome.changeItemDetailsLayout('List_Layout_2');
        expect(DesignHome.data.design.itemDetailsLayout).toEqual('List_Layout_2');
      });
    });

    describe('Function :DesignHome.addItemDetailsBackgroundImage', function () {
      it('DesignHome.addItemDetailsBackgroundImage should exist and be a function', function () {
        expect(typeof DesignHome.addItemDetailsBackgroundImage).toEqual('function');
      });
      it('it should Fail after DesignHome.addItemDetailsBackgroundImage function call', function () {
        ImageLibrary.showDialog.and.callFake(function () {
          var deferred = q.defer();
          deferred.reject({
            code: STATUS_CODE.UNDEFINED_OPTIONS,
            message: STATUS_MESSAGES.UNDEFINED_OPTIONS
          });
          return deferred.promise;
        });
        DesignHome.addItemDetailsBackgroundImage();
        $rootScope.$digest();
        expect(DesignHome.data.design.itemDetailsBgImage).toEqual('');
      });
      it('it should pass if DesignHome.data.design.itemDetailsBgImage is match the result after DesignHome.addItemDetailsBackgroundImage function call', function () {
        ImageLibrary.showDialog.and.callFake(function () {
          var deferred = q.defer();
          deferred.resolve({
            "selectedFiles": ["https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"],
            "selectedIcons": []
          });
          return deferred.promise;
        });
        DesignHome.addItemDetailsBackgroundImage();
        $rootScope.$digest();
        expect(DesignHome.data.design.itemDetailsBgImage).toEqual('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg');
      });
    });

    describe('Function :DesignHome.removeItemDetailsBackgroundImage', function () {
      it('DesignHome.removeItemDetailsBackgroundImage should exist and be a function', function () {
        expect(typeof DesignHome.removeItemDetailsBackgroundImage).toEqual('function');
      });
      it('it should pass if DesignHome.data.design.itemDetailsBgImage is equals to null after function DesignHome.removeItemDetailsBackgroundImage call', function () {
        DesignHome.removeItemDetailsBackgroundImage();
        expect(DesignHome.data.design.itemDetailsBgImage).toEqual(null);
      });
    });

    describe('Function :DesignHome.addItemListBackgroundImage', function () {
      it('DesignHome.addItemListBackgroundImage should exist and be a function', function () {
        expect(typeof DesignHome.addItemListBackgroundImage).toEqual('function');
      });
      it('it should Fail after DesignHome.addItemListBackgroundImage function call', function () {
        ImageLibrary.showDialog.and.callFake(function () {
          var deferred = q.defer();
          deferred.reject({
            code: STATUS_CODE.UNDEFINED_OPTIONS,
            message: STATUS_MESSAGES.UNDEFINED_OPTIONS
          });
          return deferred.promise;
        });
        DesignHome.addItemListBackgroundImage();
        $rootScope.$digest();
        expect(DesignHome.data.design.itemListBgImage).toEqual('');
      });
      it('it should pass if DesignHome.data.design.itemDetailsBgImage is match the result after DesignHome.addItemListBackgroundImage function call', function () {
        ImageLibrary.showDialog.and.callFake(function () {
          var deferred = q.defer();
          deferred.resolve({
            "selectedFiles": ["https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"],
            "selectedIcons": []
          });
          return deferred.promise;
        });
        DesignHome.addItemListBackgroundImage();
        $rootScope.$digest();
        expect(DesignHome.data.design.itemListBgImage).toEqual('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg');
      });
    });

    describe('Function :DesignHome.removeItemListBackgroundImage', function () {
      it('DesignHome.removeItemListBackgroundImage should exist and be a function', function () {
        expect(typeof DesignHome.removeItemListBackgroundImage).toEqual('function');
      });
      it('it should pass if  DesignHome.data.design.itemListBgImage is equals to null after function DesignHome.removeItemListBackgroundImage call', function () {
        DesignHome.removeItemListBackgroundImage();
        expect(DesignHome.data.design.itemListBgImage).toEqual(null);
      })
    });
  });
});
