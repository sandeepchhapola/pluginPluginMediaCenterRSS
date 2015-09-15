'use strict';

(function (angular, buildfire, _) {
  angular.module('mediaCenterRSSPluginWidget')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
      var onUpdateListeners = [];
      return {
        get: function (_tagName) {
          var deferred = $q.defer()
            , callback = function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            };
          Buildfire.datastore.get(_tagName, callback);
          return deferred.promise;
        },
        onUpdate: function () {
          var deferred = $q.defer()
            , callback = function (event) {
              if (!event) {
                return deferred.notify(new Error({
                  code: STATUS_CODE.UNDEFINED_EVENT,
                  message: STATUS_MESSAGES.UNDEFINED_EVENT
                }), true);
              } else {
                return deferred.notify(event);
              }
            },
            onUpdateFn = Buildfire.datastore.onUpdate(callback);

          onUpdateListeners.push(onUpdateFn);
          return deferred.promise;
        },
        clearListener: function () {
          onUpdateListeners.forEach(function (listner) {
            listner.clear();
          });
          onUpdateListeners = [];
        }
      }
    }])
    .factory("FeedParseService", ['$q', '$http', function ($q, $http) {
      var getFeedData = function (_feedUrl) {
        var deferred = $q.defer();
        if (!_feedUrl) {
          deferred.reject(new Error('Undefined feed url'));
        }
        $http.post('http://localhost:3000/parsefeedurl', {
          feedUrl: _feedUrl
        })
          .success(function (response) {
            deferred.resolve(response);
          })
          .error(function (error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      return {
        getFeedData: getFeedData
      }
    }])
    .factory('Location', [function () {
      var _location = window.location;
      return {
        goTo: function (path) {
          _location.href = path;
        }
      };
    }])
    .factory('Underscore', [function () {
      return _;
    }])
    .factory("ItemDetailsService", function () {
      var itemData = {}
        , _getData = function () {
          //You could also return specific attribute of the form data instead
          //of the entire data
          return itemData;
        }
        , _setData = function (newData) {
          //You could also set specific attribute of the form data instead
          itemData = newData
        }
        , _resetData = function () {
          //To be called when the data stored needs to be discarded
          itemData = {};
        };
      return {
        getData: _getData,
        setData: _setData,
        resetData: _resetData
      };
    });
})(window.angular, window.buildfire, window._);