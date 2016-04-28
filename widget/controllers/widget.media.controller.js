'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginWidget')
    .controller('WidgetMediaCtrl', ['$scope', '$sce', 'DataStore', 'Buildfire', 'TAG_NAMES', 'ItemDetailsService', '$filter', 'Location', 'MEDIUM_TYPES', '$rootScope',
      function ($scope, $sce, DataStore, Buildfire, TAG_NAMES, ItemDetailsService, $filter, Location, MEDIUM_TYPES, $rootScope) {

          Buildfire.history.get({'pluginBreadcrumbsOnly':false},
              function(err,data){
                  console.log('Data--************************************ Bui1ldfire.history.get get************----------------',data,'Error-----------------',err);
                  if(data && data.length){
                      var currentLabel=data[data.length-1];
                      if(currentLabel && currentLabel.options && (currentLabel.options.elementToShow!='Media')){
                          Buildfire.history.push('Media', { elementToShow: 'Media'});
                      }
                  }
                  else{
                      Buildfire.history.push('Media', { elementToShow: 'Media'});
                  }
              });

       console.log('Widget.media.controller loaded successfully------------------------------------------->>>>>>>>>>>>>>>>>>>.');
        $rootScope.deviceHeight = window.innerHeight;
        $rootScope.deviceWidth = window.innerWidth;

        /*
         * Private variables
         *
         * currentRssUrl used to hold previously saved rss url.
         * @type {string}
         * @private
         *
         * audioPlayer is an instance of buildfire.services.media.audioPlayer component
         *  @private
         *
         */
        var WidgetMedia = this
          , currentRssUrl = null
          , audioPlayer = Buildfire.services.media.audioPlayer;
        WidgetMedia.loadingVideo = false;

        /**
         * WidgetMedia.slider used to show the slider on now-playing page
         * @type {*|jQuery|HTMLElement}
         */
        WidgetMedia.slider = $('#slider');

        /**
         * WidgetMedia.item used to hold item details object
         * @type {object}
         */
        WidgetMedia.item = ItemDetailsService.getData();

        /*
         * WidgetMedia.data is used to hold user's data object which used throughout the app.
         * @type {object}
         */
        WidgetMedia.data = null;

        /*
         * WidgetMedia.API is used to hold onPlayerReady $API.
         * @type {object}
         */
        WidgetMedia.API = null;

        /**
         * WidgetMedia.medium used to filter item based on media type.
         * @type {string}
         */
        WidgetMedia.medium = '';

        /**
         * WidgetMedia.videoPlayerConfig is configuration setting for video player
         * @type {object}
         */
        WidgetMedia.videoPlayerConfig = {
          autoHide: false,
          preload: "none",
          sources: null,
          tracks: null,
          theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
          }
        };

        /**
         * WidgetMedia.audio used hold values related to audio player
         * @type {object}
         */
        WidgetMedia.audio = {
          playing: false,
          paused: false,
          track: '',
          currentTime: 0,
          duration: 0
        };

        /**
         * WidgetMedia.imageUrl used to hold item image url
         * @type {string}
         */
        WidgetMedia.imageUrl = '';

        /**
         * WidgetMedia.isVideoPlayerSupported used to check that url is supported by videogular or not
         * @type {boolean}
         */
        WidgetMedia.isVideoPlayerSupported = true;

        /**
         * WidgetMedia.videoUrl used to hold video url if it is youtube feed item or vimeo feed item
         * @type {string}
         */
        WidgetMedia.videoUrl = '';

        /**
         * resetDefaults() private method
         * Used to reset default values
         */
        var resetDefaults = function () {
          WidgetMedia.videoPlayerConfig = {
            autoHide: false,
            preload: "none",
            sources: null,
            tracks: null,
            theme: {
              url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            }
          };
          WidgetMedia.audio = {
            playing: false,
            paused: false,
            track: '',
            currentTime: 0,
            duration: 0
          };
          WidgetMedia.isVideoPlayerSupported = true;
          WidgetMedia.imageUrl = '';
          WidgetMedia.videoUrl = '';
          angular.element('#videoPlayer').detach();
        };

        /**
         * changeVideoSrc() private method
         * Used to reset WidgetMedia.videoPlayerConfig.sources
         * @param _src
         * @param _type
         */
        var changeVideoSrc = function (_src, _type) {
          WidgetMedia.videoPlayerConfig.sources = [{
            src: $sce.trustAsResourceUrl(_src),
            type: _type
          }];
        };

        /**
         * checkEnclosuresTag() private method
         * used to check tag eclosures to filter item's media type
         * @param _item
         * @returns {*}
         */
        var checkEnclosuresTag = function (_item) {
          if (_item.enclosures && _item.enclosures.length > 0 && _item.enclosures[0].url && _item.enclosures[0].type) {
            if (_item.enclosures[0].type.indexOf('video/') === 0) {
              WidgetMedia.medium = MEDIUM_TYPES.VIDEO;
            }
            else if (_item.enclosures[0].type.indexOf('audio/') === 0) {
              WidgetMedia.medium = MEDIUM_TYPES.AUDIO;
            }
            else if (_item.enclosures[0].type.indexOf('image/') === 0) {
              WidgetMedia.medium = MEDIUM_TYPES.IMAGE;
            }
            else {
              WidgetMedia.medium = MEDIUM_TYPES.OTHER;
            }
            return {
              type: _item.enclosures[0].type,
              src: _item.enclosures[0].url
            }
          }
          else {
            return null
          }
        };

        /**
         * checkMediaTag() private method
         * used to check media tag to filter item's media type
         * @param _item
         * @returns {*}
         */
        var checkMediaTag = function (_item) {
          if (_item['media:group'] && _item['media:group']['media:content']) {
            if (_item['media:group']['media:content']['@'] && _item['media:group']['media:content']['@'].type && _item['media:group']['media:content']['@'].url) {
              if (_item['media:group']['media:content']['@'].type.indexOf('video/') === 0) {
                WidgetMedia.medium = MEDIUM_TYPES.VIDEO;
              }
              else if (_item['media:group']['media:content']['@'].type.indexOf('audio/') === 0) {
                WidgetMedia.medium = MEDIUM_TYPES.AUDIO;
              }
              else if (_item['media:group']['media:content']['@'].type.indexOf('image/') === 0) {
                WidgetMedia.medium = MEDIUM_TYPES.IMAGE;
              }
              else {
                WidgetMedia.medium = MEDIUM_TYPES.OTHER;
              }
              return {
                type: _item['media:group']['media:content']['@'].type,
                src: _item['media:group']['media:content']['@'].url
              }
            }
            else if (_item['media:group']['media:content']['media:thumbnail'] && _item['media:group']['media:content']['media:thumbnail']['@'] && _item['media:group']['media:content']['media:thumbnail']['@'].url) {
              WidgetMedia.medium = MEDIUM_TYPES.IMAGE;
              return {
                type: 'image/*',
                src: _item['media:group']['media:content']['media:thumbnail']['@'].url
              }
            }
            else {
              return null;
            }
          }
          else if (_item['media:content'] && _item['media:content']['@'] && _item['media:content']['@'].url && _item['media:content']['@'].type) {
            if (_item['media:content']['@'].type.indexOf('video/') === 0) {
              WidgetMedia.medium = MEDIUM_TYPES.VIDEO;
            }
            else if (_item['media:content']['@'].type.indexOf('audio/') === 0) {
              WidgetMedia.medium = MEDIUM_TYPES.AUDIO;
            }
            else if (_item['media:content']['@'].type.indexOf('image/') === 0) {
              WidgetMedia.medium = MEDIUM_TYPES.IMAGE;
            }
            else {
              WidgetMedia.medium = MEDIUM_TYPES.OTHER;
            }
            return {
              type: _item['media:content']['@'].type,
              src: _item['media:content']['@'].url
            }
          }
          else if (_item['media:content'] && _item['media:content']['media:player'] && _item['media:content']['media:player']['@'] && _item['media:content']['media:player']['@'].url) {
            WidgetMedia.medium = MEDIUM_TYPES.VIDEO;
            return {
              type: 'video/*',
              src: _item['media:content']['media:player']['@'].url
            }
          }
          else if (_item['media:thumbnail'] && _item['media:thumbnail']['@'] && _item['media:thumbnail']['@'].url) {
            WidgetMedia.medium = MEDIUM_TYPES.IMAGE;
            return {
              type: 'image/*',
              src: _item['media:thumbnail']['@'].url
            }
          }
          else if (_item.image && _item.image.url) {
            WidgetMedia.medium = MEDIUM_TYPES.IMAGE;
            return {
              type: 'image/*',
              src: _item.image.url
            }
          }
          else if (_item.imageSrcUrl) {
            WidgetMedia.medium = MEDIUM_TYPES.IMAGE;
            return {
              type: 'image/*',
              src: _item.imageSrcUrl
            }
          }
          else {
            return null;
          }
        };

        /**
         * filterItemType() private method
         * used to filter item whether it is image content, audio/video content or other
         * @param _item
         */
        var filterItemType = function (_item) {
          var _src = ''
            , mediaData = checkEnclosuresTag(_item);

          if (!mediaData) {
            mediaData = checkMediaTag(_item)
          }
          if (mediaData) {
            switch (WidgetMedia.medium) {
              case MEDIUM_TYPES.VIDEO:
                _src = mediaData.src.toLowerCase();
                if (_src.indexOf('vimeo') >= 0 || _src.indexOf('youtube') >= 0) {
                  WidgetMedia.isVideoPlayerSupported = false;
                  WidgetMedia.videoUrl = _item.link ? _item.link : null;
                } else {
                  changeVideoSrc(mediaData.src, mediaData.type);
                  WidgetMedia.loadingVideo = true;
                }
                break;
              case MEDIUM_TYPES.AUDIO:
                WidgetMedia.audio.track = mediaData.src;
                break;
              case MEDIUM_TYPES.IMAGE:
                WidgetMedia.imageUrl = mediaData.src;
                break;
              default :
                //code here for defaults
                resetDefaults();
                break;
            }
          }
          else {
            WidgetMedia.medium = MEDIUM_TYPES.OTHER;
          }
        };

        /**
         * onUpdateCallback() private method
         * Will be called when DataStore.onUpdate() have been made.
         * @param event
         */
        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.RSS_FEED_INFO) {
            WidgetMedia.data = event.data;
            if(WidgetMedia.data.design){
              $rootScope.backgroundImage = WidgetMedia.data.design.itemListBgImage;
              $rootScope.backgroundImageItem = WidgetMedia.data.design.itemDetailsBgImage;
            }
            console.log('$rootScope.backgroundImage',$rootScope.backgroundImage);
            console.log('$rootScope.backgroundImageItem',$rootScope.backgroundImageItem);
            if (WidgetMedia.data.content && (!WidgetMedia.data.content.rssUrl || WidgetMedia.data.content.rssUrl !== currentRssUrl)) {
              resetDefaults();
              currentRssUrl = WidgetMedia.data.content.rssUrl;
              $rootScope.showFeed = true;
              Location.goTo('#/');
            }
          }
        };

        /**
         * init() private function
         * It is used to fetch previously saved user's data
         */
        var init = function () {
          var success = function (result) {
              $rootScope.showFeed = false;
                WidgetMedia.data = result.data;
              if(WidgetMedia.data.design){
                $rootScope.backgroundImage = WidgetMedia.data.design.itemListBgImage;
                $rootScope.backgroundImageItem = WidgetMedia.data.design.itemDetailsBgImage;
                console.log('$rootScope.backgroundImage',$rootScope.backgroundImage);
                console.log('$rootScope.backgroundImageItem',$rootScope.backgroundImageItem);
              }
              currentRssUrl = WidgetMedia.data && WidgetMedia.data.content && WidgetMedia.data.content.rssUrl;
            }
            , error = function (err) {
              $rootScope.showFeed = false;
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
         * filterItemType() method will be called if WidgetMedia.item is not null
         */
        if (WidgetMedia.item) {
          console.log('WidgetMedia Item----------------------',WidgetMedia.item);
          filterItemType(WidgetMedia.item);
        }

        /**
         * WidgetMedia.onPlayerReady() method
         * will be called on videogular player ready.
         * @param $API
         */
        WidgetMedia.onPlayerReady = function ($API) {
          WidgetMedia.API = $API;
        };

        /**
         * WidgetMedia.onVideoError() method
         * will be called when videogular player returns error.
         * @param $event
         */
        WidgetMedia.onVideoError = function ($event) {
          console.error('Error While playing:', $event);
          WidgetMedia.API.stop();
        };

        /**
         * WidgetMedia.sourceChanged() method
         * will be called when videogular player source has changed.
         * @param $source
         */
        WidgetMedia.sourceChanged = function ($source) {
          WidgetMedia.API.stop();
        };

                /**
                 * WidgetMedia.getTitle() method
                 * Will used to extract item title
                 * @param item
                 * @returns {item.title|*}
                 */
                WidgetMedia.getTitle = function (item) {
                    /* if (!item.title && (item.summary || item.description)) {
                     var html = item.summary ? item.summary : item.description;
                     item.title = $filter('truncate')(html, 45);
                     } else {
                     item.title = $filter('truncate')(item.title, item.title.length);
                     }
                     return item.title;*/
                    var title = '';
                    if (item && !item.title && (item.summary || item.description)) {
                        title = item.summary ? item.summary : item.description;
                    } else {
                        title = item && item.title;
                    }
                    return title;
                };

        /**
         * WidgetMedia.getItemPublishDate() method
         * Will used to extract item published date
         * @param item
         * @returns {*}
         */
        WidgetMedia.getItemPublishDate = function (item) {
          var dateStr = item.pubDate ? item.pubDate : '';
          if (dateStr) {
            return $filter('date')(dateStr);
          } else {
            return dateStr;
          }
        };

        /**
         * audioPlayer.onEvent(callback) method
         * callback will be called when audio player fires an event
         */
        audioPlayer.onEvent(function (e) {
          if (e.event == "timeUpdate") {
            WidgetMedia.audio.currentTime = e.data.currentTime;
            WidgetMedia.audio.duration = e.data.duration;
            $scope.$apply();
          }
          else if (e.event == "audioEnded") {
            WidgetMedia.audio.playing = false;
            $scope.$apply();
          }
          else if (e.event == "pause") {
            WidgetMedia.audio.playing = false;
            $scope.$apply();
          }
        });

        /**
         * WidgetMedia.playAudio() method
         * will be called when you click play button
         */
        WidgetMedia.playAudio = function () {
          Location.goTo('#/nowplaying');

          /* WidgetMedia.audio.playing = true;
          if (WidgetMedia.audio.paused) {
            audioPlayer.play();
          }
          else if (WidgetMedia.audio.track) {
            audioPlayer.play({url: WidgetMedia.audio.track});
          }*/
        };


        /**
         * WidgetMedia.pause() method
         * will be called when you click pause button
         */
        WidgetMedia.pause = function () {
          WidgetMedia.audio.paused = true;
          audioPlayer.pause();
        };

        /**
         * WidgetMedia.seekAudio() method
         * will be called when you seek audio player slider
         */
        WidgetMedia.seekAudio = function (_time) {
          audioPlayer.setTime(_time);
        };


        /**
         *  WidgetMedia.slider.onchange()
         *  will be called when audio player slider value get changed.
         */
        WidgetMedia.slider.onchange = function () {
          if (Math.abs(this.value - WidgetMedia.audio.currentTime) > 1)
            audioPlayer.setTime(this.value);
        };

        /**
         *  WidgetMedia.slider.onmousedown()
         *  will be called when onmousedown event fired for audio player slider.
         */
        WidgetMedia.slider.onmousedown = function () {
          this.stopUpdateing = true;
        };

        /**
         *  WidgetMedia.slider.onmouseup()
         *  will be called when onmouseup event fired for audio player slider.
         */
        WidgetMedia.slider.onmouseup = function () {
          this.stopUpdateing = false;
        };

        WidgetMedia.openLink = function (link) {
          Buildfire.navigation.openWindow(link,'_system');
        };

        WidgetMedia.videoLoaded = function () {
          WidgetMedia.loadingVideo = false;
        };


        /**
         * Implementation of pull down to refresh
         */
        var onRefresh=Buildfire.datastore.onRefresh(function(){
        });


        /**
         * will called when controller scope has been destroyed.
         */
        $scope.$on("$destroy", function () {
          DataStore.clearListener();
          onRefresh.clear();
          Buildfire.datastore.onRefresh(function(){
            Location.goToHome();
          });
          WidgetMedia.pause();
          //ItemDetailsService.setData(null);
          if (WidgetMedia.data && WidgetMedia.data.design)
            $rootScope.$broadcast('ROUTE_CHANGED', WidgetMedia.data.design.itemListLayout);
        });
      }]
  )
})(window.angular);