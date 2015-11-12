'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginWidget')
    .controller('WidgetHomeCtrl', ['$scope', 'DataStore', 'Buildfire', 'FeedParseService', 'TAG_NAMES', 'ItemDetailsService', 'Location', '$filter', 'Underscore',
      function ($scope, DataStore, Buildfire, FeedParseService, TAG_NAMES, ItemDetailsService, Location, $filter, Underscore) {

        /*
         * Private variables
         *
         * _items used to hold RSS feed items and helps in lazy loading.
         * @type {object}
         * @private
         *
         * limit used to load a number of items in list on scroll
         * @type {number}
         * @private
         *
         * chunkData used to hold chunks of _items.
         * @type {object}
         * @private
         *
         * nextChunkDataIndex used to hold index of next chunk.
         * @type {number}
         * @private
         *
         * nextChunk used to hold chunk based on nextChunkDataIndex token.
         * @type {object}
         * @private
         *
         * totalChunks used to hold number of available chunks i.e. chunkData.length.
         * @type {number}
         * @private
         *
         * currentRssUrl used to hold previously saved rss url.
         * @type {string}
         * @private
         *
         *  */
        var view = null
          , _items = []
          , limit = 15
          , chunkData = null
          , nextChunkDataIndex = 0
          , nextChunk = null
          , totalChunks = 0
          , currentRssUrl = null
          , WidgetHome = this;

        /*
         * WidgetHome.data is used to hold user's data object which used throughout the app.
         * @type {object}
         */
        WidgetHome.data = null;

        /*
         * WidgetHome.items is used to listing items.
         * @type {object}
         */
        WidgetHome.items = [];

        /*
         * WidgetHome.busy is used to disable ng-infinite scroll when more data not available to show.
         * @type {boolean}
         */
        WidgetHome.busy = false;

        /*
         * WidgetHome.isItems is used to show info message when _items.length == 0.
         * @type {boolean}
         */
        WidgetHome.isItems = true;

        /**
         * resetDefaults() private method
         * Used to reset default values
         */
        var resetDefaults = function () {
          chunkData = null;
          nextChunkDataIndex = 0;
          nextChunk = null;
          totalChunks = 0;
          _items = [];
          WidgetHome.items = [];
          WidgetHome.busy = false;
          WidgetHome.isItems = true;
          ItemDetailsService.setData(null);
        };

        /**
         * getImageUrl() private method
         * Used to extract image url
         * @param item
         * @returns {*}
         */
        var getImageUrl = function (item) {
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
            if (item['media:thumbnail'] && item['media:thumbnail']['@'] && item['media:thumbnail']['@'].url) {
              return item['media:thumbnail']['@'].url;
            } else if (item['media:group'] && item['media:group']['media:content'] && item['media:group']['media:content']['media:thumbnail']['@'] && item['media:group']['media:content']['media:thumbnail']['@'].url) {
              return item['media:group']['media:content']['media:thumbnail']['@'].url;
            } else if (item.description) {
              return $filter('extractImgSrc')(item.description);
            }
            else {
              return '';
            }
          }
        };

        /**
         * getFeedData() private method
         * used to fetch RSS feed Data object if a valid RSS feed url provided
         * @param rssUrl
         */
        var getFeedData = function (rssUrl) {
          resetDefaults();
          Buildfire.spinner.show();
          var success = function (result) {
              console.info('Feed data: ', result);
              Buildfire.spinner.hide();
              if (result.data && result.data.items.length > 0) {
                result.data.items.forEach(function (item) {
                  item.imageSrcUrl = getImageUrl(item);
                });
                _items = result.data.items;
                WidgetHome.isItems = true;
              } else {
                WidgetHome.isItems = false;
              }
              chunkData = Underscore.chunk(_items, limit);
              totalChunks = chunkData.length;
              WidgetHome.loadMore();
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.error('Error while getting feed data', err);
            };
          FeedParseService.getFeedData(rssUrl).then(success, error);
        };

        /**
         * onUpdateCallback() private method
         * Will be called when DataStore.onUpdate() have been made.
         * @param event
         */
        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.RSS_FEED_INFO) {
            WidgetHome.data = event.data;
            if (WidgetHome.data.content && WidgetHome.data.content.rssUrl) {
              if (WidgetHome.data.content.rssUrl !== currentRssUrl) {
                currentRssUrl = WidgetHome.data.content.rssUrl;
                getFeedData(WidgetHome.data.content.rssUrl);
              }
            } else {
              resetDefaults();
            }
          }
        };

        /**
         * init() private function
         * It is used to fetch previously saved user's data
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

        /**
         * init() function invocation to fetch previously saved user's data from datastore.
         */
        init();

        /**
         * DataStore.onUpdate() will invoked when there is some change in datastore
         */
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        /**
         * WidgetHome.showDescription() method
         * will be called to check whether the description have text to show or no.
         * @param description
         * @returns {boolean}
         */
        WidgetHome.showDescription = function (description) {
          return ((description !== '<p><br data-mce-bogus="1"></p>') && (description !== '<p>&nbsp;<br></p>'));
        };

        /**
         * WidgetHome.getTitle() method
         * Will used to extract item title
         * @param item
         * @returns {item.title|*}
         */
        WidgetHome.getTitle = function (item) {
          if (item) {
            if (!item.title && (item.summary || item.description)) {
              var html = item.summary ? item.summary : item.description;
              item.title = $filter('truncate')(html, 20);
            }
            item.title = $filter('truncate')(item.title, 20);
            return item.title;
          }
        };

        /**
         * WidgetHome.getItemSummary() method
         * Will used to extract item summary
         * @param item
         * @returns {*}
         */
        WidgetHome.getItemSummary = function (item) {
          if (item.summary || item.description) {
            var html = item.summary ? item.summary : item.description;
            return $filter('truncate')(html, 100);
          } else {
            return '';
          }
        };

        /**
         * WidgetHome.getItemPublishDate() method
         * Will used to extract item published date
         * @param item
         * @returns {*}
         */
        WidgetHome.getItemPublishDate = function (item) {
          if (item) {
            var dateStr = item.pubDate ? item.pubDate : '';
            if (dateStr) {
              return $filter('date')(dateStr, 'MMM dd, yyyy');
            } else {
              return dateStr;
            }
          }
        };

        /**
         * WidgetHome.goToItem() method
         * will used to redirect on details page
         * @param index
         */
        WidgetHome.goToItem = function (index) {
          ItemDetailsService.setData(WidgetHome.items[index]);
          Location.goTo('#/item');
        };

        /**
         * WidgetHome.loadMore() function
         * will used to load more items on scroll to implement lazy loading
         */
        WidgetHome.loadMore = function () {

          if (WidgetHome.busy || totalChunks === 0) {
            return;
          }
          WidgetHome.busy = true;
          Buildfire.spinner.show();
          if (nextChunkDataIndex < totalChunks) {
            nextChunk = chunkData[nextChunkDataIndex];
            WidgetHome.items.push.apply(WidgetHome.items, nextChunk);
            nextChunkDataIndex = nextChunkDataIndex + 1;
            nextChunk = null;
            WidgetHome.busy = false;
            Buildfire.spinner.hide();
          } else {
            Buildfire.spinner.hide();
          }
        };

        /**
         * will called when controller scope has been destroyed.
         */
        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });
      }]);
})(window.angular);
