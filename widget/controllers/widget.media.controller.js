'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginWidget')
    .controller('WidgetMediaCtrl', ['$scope', '$sce', 'DataStore', 'FeedParseService', 'TAG_NAMES', 'ItemDetailsService', '$filter', 'Location',
      function ($scope, $sce, DataStore, FeedParseService, TAG_NAMES, ItemDetailsService, $filter, Location) {

        var WidgetMedia = this
          , currentRssUrl = null;

        WidgetMedia.item = ItemDetailsService.getData();
        WidgetMedia.data = null;

        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.RSS_FEED_INFO) {
            WidgetMedia.data = event.data;
            if (WidgetMedia.data.content && WidgetMedia.data.content.rssUrl && WidgetMedia.data.content.rssUrl !== currentRssUrl) {
              currentRssUrl = WidgetMedia.data.content.rssUrl;
              Location.goTo('#/');
            }
          }
        };
        var init = function () {
          var success = function (result) {
              WidgetMedia.data = result.data;
              currentRssUrl = WidgetMedia.data.content.rssUrl;
            }
            , error = function (err) {
              console.error('Error while getting data', err);
            };
          DataStore.get(TAG_NAMES.RSS_FEED_INFO).then(success, error);
        };

        init();

        WidgetMedia.getTitle = function (item) {
          if (!item.title && (item.summary || item.description)) {
            var html = item.summary ? item.summary : item.description;
            item.title = $filter('truncate')(html, 5);
          }
          return item.title;
        };

        WidgetMedia.getImageUrl = function (item) {
          var i = 0
            , length = 0
            , imageUrl = '';
          if (item.image && item.image.url) {
            return item.image.url;
          }
          else if (item.enclosures.length > 0) {
            length = item.enclosures.length;
            for (i = 0; i < length; i++) {
              if (item.enclosures[i].type.indexOf('image/') === 0) {
                imageUrl = item.enclosures[i].url;
                break;
              }
            }
            return imageUrl;
          } else {
            if (item['media:thumbnail']) {
              return item['media:thumbnail']['@'].url;
            } else if (item.summary || item.description) {
              var html = item.summary ? item.summary : item.description;
              return $filter('extractImgSrc')(html);
            }
            else {
              return '';
            }
          }
        };

        WidgetMedia.getItemPublishDate = function (item) {
          var dateStr = item.pubDate ? item.pubDate : '';
          if (dateStr) {
            return $filter('date')(dateStr, 'medium');
          } else {
            return dateStr;
          }
        };

        DataStore.onUpdate().then(null, null, onUpdateCallback);
        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });
      }]
  )
})(window.angular);