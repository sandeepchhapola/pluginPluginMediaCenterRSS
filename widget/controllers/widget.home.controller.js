'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginWidget')
    .controller('WidgetHomeCtrl', ['$scope', '$sce', 'DataStore', 'FeedParseService', 'TAG_NAMES', 'ItemDetailsService', 'Location', '$filter', 'Underscore',
      function ($scope, $sce, DataStore, FeedParseService, TAG_NAMES, ItemDetailsService, Location, $filter, Underscore) {
        //create new instance of buildfire carousel viewer
        var view = null
          , _items = []
          , limit = 10
          , chunkData = null
          , nextChunkDataIndex = 0
          , nextChunk = null
          , totalChunks = 0
          , currentRssUrl = null
          , WidgetHome = this;

        WidgetHome.data = null;
        WidgetHome.items = [];
        WidgetHome.busy = false;
        WidgetHome.showSpinner = false;
        WidgetHome.rssMetaData = null;

        var getFeedData = function (rssUrl) {
          var success = function (result) {
              console.info('Feed data: ', result);
              WidgetHome.rssMetaData = result.data ? result.data.meta : null;
              if (result.data && result.data.items.length > 0) {
                _items = result.data.items;
              }
              chunkData = Underscore.chunk(_items, limit);
              totalChunks = chunkData.length;
              WidgetHome.loadMore();
            }
            , error = function (err) {
              console.error('Error while getting feed data', err);
            };
          FeedParseService.getFeedData(rssUrl).then(success, error);
        };
        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.RSS_FEED_INFO) {
            WidgetHome.data = event.data;
            if (WidgetHome.data.content && WidgetHome.data.content.rssUrl && WidgetHome.data.content.rssUrl !== currentRssUrl) {
              currentRssUrl = WidgetHome.data.content.rssUrl;
              getFeedData(WidgetHome.data.content.rssUrl);
            }
          }
        };
        /*
         * Fetch user's data from datastore
         */
        var init = function () {
          var success = function (result) {
              WidgetHome.data = result.data;
              if (WidgetHome.data.content && WidgetHome.data.content.rssUrl) {
                currentRssUrl = WidgetHome.data.content.rssUrl;
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

        WidgetHome.getTitle = function (item) {
          if (!item.title && (item.summary || item.description)) {
            var html = item.summary ? item.summary : item.description;
            item.title = $filter('truncate')(html, 5);
          }
          return item.title;
        };

        WidgetHome.getImageUrl = function (item) {
          var i = 0
            , length = 0
            , imageUrl = '';
          if (item.image && item.image.url) {
            return item.image.url;
          }
          else if (item.enclosures && item.enclosures.length > 0) {
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

        WidgetHome.getItemSummary = function (item) {
          if (item.summary || item.description) {
            var html = item.summary ? item.summary : item.description;
            return $filter('truncate')(html, 13);
          } else {
            return '';
          }
        };

        WidgetHome.getItemPublishDate = function (item) {
          var dateStr = item.pubDate ? item.pubDate : '';
          if (dateStr) {
            return $filter('date')(dateStr, 'medium');
          } else {
            return dateStr;
          }
        };

        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });

        WidgetHome.goToItem = function (index) {
          ItemDetailsService.setData(WidgetHome.items[index]);
          Location.goTo('#/item');
        };

        WidgetHome.loadMore = function () {
          if (WidgetHome.busy || totalChunks === 0) {
            return;
          }
          WidgetHome.busy = true;
          WidgetHome.showSpinner = true;
          if (nextChunkDataIndex < totalChunks) {
            nextChunk = chunkData[nextChunkDataIndex];
            WidgetHome.items.push.apply(WidgetHome.items, nextChunk);
            nextChunkDataIndex = nextChunkDataIndex + 1;
            nextChunk = null;
            WidgetHome.busy = false;
            WidgetHome.showSpinner = false;
          } else {
            WidgetHome.showSpinner = false;
          }
        };
      }]);
})(window.angular);
