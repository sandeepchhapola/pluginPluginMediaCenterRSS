'use strict';

(function (angular, buildfire) {
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
          var deferred = $q.defer();
          Buildfire.datastore.get(_tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        onUpdate: function () {
          var deferred = $q.defer();
          var onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
            if (!event) {
              return deferred.notify(new Error({
                code: STATUS_CODE.UNDEFINED_EVENT,
                message: STATUS_MESSAGES.UNDEFINED_EVENT
              }), true);
            } else {
              return deferred.notify(event);
            }
          });
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
        $http.post('http://localhost:3000/validatefeedurl', {
          feedUrl: _feedUrl
        })
          .success(function (response) {
            if (response.data && response.data.items && response.data.items.length > 0) {
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
        getFeedData: getFeedData
      }
    }]);
})(window.angular, window.buildfire);