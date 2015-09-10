'use strict';

(function (angular, buildfire) {
  angular.module('mediaCenterRSSPluginContent')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
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
          Buildfire.datastore.get(_tagName, callback());
          return deferred.promise;
        },
        save: function (_item, _tagName) {
          var deferred = $q.defer()
            , callback = function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            };
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          Buildfire.datastore.save(_item, _tagName, callback);
          return deferred.promise;
        }
      }
    }])
    .factory("FeedParseService", ['$q', '$http', function ($q, $http) {
      var validateFeedUrl = function (_feedUrl) {
        var deferred = $q.defer();
        if (!_feedUrl) {
          deferred.reject(new Error('Undefined feed url'));
        }
        $http.post('http://localhost:3000/validatefeedurl', {
          feedUrl: _feedUrl
        })
          .success(function (response) {
            if (response.data && response.data.isValidFeedUrl) {
              deferred.resolve(response);
            } else {
              deferred.reject(new Error('Not a feed url'));
            }
          })
          .error(function (error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      return {
        validateFeedUrl: validateFeedUrl
      }
    }]);
})(window.angular, window.buildfire);