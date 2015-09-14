describe('Unit : pluginPluginMediaCenterRSS design services', function () {
  describe('Unit: Buildfire Provider', function () {
    var Buildfire;
    beforeEach(module('mediaCenterRSSPluginDesign'));
    beforeEach(inject(function (_Buildfire_) {
      Buildfire = _Buildfire_;
    }));

    it('Buildfire should exist and be an object', function () {
      expect(typeof Buildfire).toEqual('object');
    });
  });

  describe('Unit : DataStore Factory', function () {
    var DataStore, Buildfire, $rootScope, TAG_NAMES, STATUS_MESSAGES, STATUS_CODE, q;
    beforeEach(module('mediaCenterRSSPluginDesign', function ($provide) {
      $provide.service('Buildfire', function () {
        this.datastore = jasmine.createSpyObj('datastore', ['get', 'save']);
        this.datastore.get.and.callFake(function (_tagName, callback) {
          if (_tagName) {
            callback(null, 'Success');
          } else {
            callback('Error', null);
          }
        });
        this.datastore.save.and.callFake(function (_item, _tagName, callback) {
          if (!_item || !typeof callback === 'function') {
            callback('Error', null);
          } else {
            callback(null, 'Success');
          }
        });
      });
    }));
    beforeEach(inject(function (_$rootScope_, _DataStore_, _Buildfire_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      $rootScope = _$rootScope_;
      DataStore = _DataStore_;
      Buildfire = _Buildfire_;
      TAG_NAMES = _TAG_NAMES_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
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

    it('DataStore.get should return error', function () {
      var result = ''
        , success = function (response) {
          result = response;
        }
        , error = function (err) {
          result = err;
        };
      DataStore.get(null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Error');
    });
    it('DataStore.get should return success', function () {
      var result = ''
        , success = function (response) {
          result = response;
        }
        , error = function (err) {
          result = err;
        };
      DataStore.get(TAG_NAMES.RSS_FEED_INFO).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Success');
    });

    it('DataStore.save should return error', function () {
      var result = ''
        , success = function (response) {
          result = response;
        }
        , error = function (err) {
          result = 'Error';
        };
      DataStore.save(null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Error');
    });
    it('DataStore.save should return success', function () {
      var result = ''
        , success = function (response) {
          result = response;
        }
        , error = function (err) {
          result = err;
        };
      DataStore.save({name: 'Sandeep Kumar'}).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Success');
    });
  });

  describe('Unit : ImageLibrary Factory', function () {
    var ImageLibrary, Buildfire, $rootScope;
    beforeEach(module('mediaCenterRSSPluginDesign', function ($provide) {
      $provide.service('Buildfire', function () {
        this.imageLib = jasmine.createSpyObj('imageLib', ['showDialog']);
        this.imageLib.showDialog.and.callFake(function (_options, callback) {
          if (_options) {
            callback(null, 'Success');
          } else {
            callback('Error', null);
          }
        });
      })
    }));

    beforeEach(inject(function (_$rootScope_, _ImageLibrary_, _Buildfire_) {
      $rootScope = _$rootScope_;
      Buildfire = _Buildfire_;
      ImageLibrary = _ImageLibrary_;
    }));

    it('Buildfire should exist and be an object', function () {
      expect(typeof Buildfire).toEqual('object');
    });
    it('Buildfire.imageLib should exist and be an object', function () {
      expect(typeof Buildfire.imageLib).toEqual('object');
    });
    it('ImageLibrary should exist and be an object', function () {
      expect(typeof ImageLibrary).toEqual('object');
    });
    it('ImageLibrary.showDialog should exist and be an function', function () {
      expect(typeof ImageLibrary.showDialog).toEqual('function');
    });

    it('ImageLibrary.showDialog should return success', function () {
      var options = {showIcons: false, multiSelection: false}
        , result = ''
        , success = function (response) {
          result = response;
        }
        , error = function (err) {
          result = err;
        };
      ImageLibrary.showDialog(options).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Success');
    });
    it('ImageLibrary.showDialog should return fail', function () {
      var result = ''
        , success = function (response) {
          result = response;
        }
        , error = function (err) {
          result = 'Error';
        };
      ImageLibrary.showDialog(null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Error');
    });
  });
});

