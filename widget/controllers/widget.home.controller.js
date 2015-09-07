'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginWidget')
    .controller('WidgetHomeCtrl', ['$scope', '$sce', 'DataStore', 'FeedParseService', 'TAG_NAMES',
      function ($scope, $sce, DataStore, FeedParseService, TAG_NAMES) {
        //create new instance of buildfire carousel viewer
        var view = null
          , WidgetHome = this;

        WidgetHome.data = null;
        WidgetHome.items = [];

        var getFeedData = function (rssUrl) {
          var success = function (result) {
              console.info('Feed data: ', result);
              if (result.data && result.data.items.length > 0)
                WidgetHome.items = result.data.items;
            }
            , error = function (err) {
              console.error('Error while getting feed data', err);
            };
          FeedParseService.getFeedData(rssUrl).then(success, error);
        };
        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.RSS_FEED_INFO) {
            WidgetHome.data = event.data;
          }
        };
        /*
         * Fetch user's data from datastore
         */
        var init = function () {
          var success = function (result) {
              WidgetHome.data = result.data;
              if (WidgetHome.data.content && WidgetHome.data.content.rssUrl) {
                getFeedData(WidgetHome.data.content.rssUrl);
              }
            }
            , error = function (err) {
              console.error('Error while getting data', err);
            };
          DataStore.get(TAG_NAMES.RSS_FEED_INFO).then(success, error);
        };

        init();

        DataStore.onUpdate().then(null, null, onUpdateCallback);

        WidgetHome.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        WidgetHome.showDescription = function (description) {
          return !(description == '<p>&nbsp;<br></p>');
        };
        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });
      }]);
})(window.angular);
