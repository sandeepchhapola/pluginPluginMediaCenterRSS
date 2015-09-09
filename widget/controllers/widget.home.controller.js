'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginWidget')
    .controller('WidgetHomeCtrl', ['$scope', '$sce', 'DataStore', 'FeedParseService', 'TAG_NAMES','Item','$window','$filter',
      function ($scope, $sce, DataStore, FeedParseService, TAG_NAMES,Item,$window,$filter) {
        //create new instance of buildfire carousel viewer
        var view = null
          , currentRssUrl = null
          , WidgetHome = this;

        WidgetHome.data = null;
        WidgetHome.items = [];
        WidgetHome.rssMetaData = null;

        var getFeedData = function (rssUrl) {
          var success = function (result) {
              console.info('Feed data: ', result);
              WidgetHome.rssMetaData = result.data.meta;
              if (result.data && result.data.items.length > 0) {
                WidgetHome.items = result.data.items;
              }
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
          Item.setData(WidgetHome.items[index]);
          $window.location = '#item';
        };
        
      }]);
})(window.angular);
