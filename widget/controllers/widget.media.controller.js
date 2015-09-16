'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginWidget')
    .controller('WidgetMediaCtrl', ['$scope', '$sce', 'DataStore', 'Buildfire', 'FeedParseService', 'TAG_NAMES', 'ItemDetailsService', '$filter', 'Location', 'MEDIUM_TYPES',
      function ($scope, $sce, DataStore, Buildfire, FeedParseService, TAG_NAMES, ItemDetailsService, $filter, Location, MEDIUM_TYPES) {

        var WidgetMedia = this
          , currentRssUrl = null
          , audioPlayer = Buildfire.services.media.audioPlayer // audioPlayer is Buildfire.services.media.audioPlayer.
          , slider = $('#slider'); //slider to show the slider on now-playing page.

        WidgetMedia.item = ItemDetailsService.getData();
        WidgetMedia.data = null;
        WidgetMedia.API = null;
        WidgetMedia.medium = '';
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
        WidgetMedia.imageUrl = '';
        WidgetMedia.isVideoPlayerSupported = true;
        WidgetMedia.videoUrl = '';


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
          }
          , changeVideoSrc = function (_src, _type) {
            WidgetMedia.videoPlayerConfig.sources = [{
              src: $sce.trustAsResourceUrl(_src),
              type: _type
            }];
          }
          , checkEnclosuresTag = function (_item) {
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
          }
          , checkMediaTag = function (_item) {
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
          }
          , filterItemType = function (_item) {
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
                  }
                  break;
                case MEDIUM_TYPES.AUDIO:
                  WidgetMedia.audio.track = mediaData.src;
                  break;
                case MEDIUM_TYPES.IMAGE:
                  WidgetMedia.imageUrl = mediaData.src;
                  break;
                case MEDIUM_TYPES.OTHER:
                  resetDefaults();
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
          }
          , onUpdateCallback = function (event) {
            if (event && event.tag === TAG_NAMES.RSS_FEED_INFO) {
              WidgetMedia.data = event.data;
              if (WidgetMedia.data.content && (!WidgetMedia.data.content.rssUrl || WidgetMedia.data.content.rssUrl !== currentRssUrl)) {
                resetDefaults();
                currentRssUrl = WidgetMedia.data.content.rssUrl;
                Location.goTo('#/');
              }
            }
          }
          , init = function () {
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

        if (WidgetMedia.item) {
          filterItemType(WidgetMedia.item);
        }

        WidgetMedia.onPlayerReady = function ($API) {
          WidgetMedia.API = $API;
        };
        WidgetMedia.onVideoError = function ($event) {
          console.error('Error While playing:', $event);
          WidgetMedia.API.stop();
        };
        WidgetMedia.sourceChanged = function ($source) {
          WidgetMedia.API.stop();
        };
        WidgetMedia.seekAudio = function (_time) {
          audioPlayer.setTime(_time);
        };

        WidgetMedia.getTitle = function (item) {
          if (!item.title && (item.summary || item.description)) {
            var html = item.summary ? item.summary : item.description;
            item.title = $filter('truncate')(html, 15);
          } else {
            item.title = $filter('truncate')(item.title, item.title.length);
          }
          return item.title;
        };

        WidgetMedia.getItemPublishDate = function (item) {
          var dateStr = item.pubDate ? item.pubDate : '';
          if (dateStr) {
            return $filter('date')(dateStr, 'medium');
          } else {
            return dateStr;
          }
        };

        /**
         * audioPlayer.onEvent callback calls when audioPlayer event fires.
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
         * WidgetMedia.playAudio() plays audioPlayer service.
         */
        WidgetMedia.playAudio = function () {
          WidgetMedia.audio.playing = true;
          if (WidgetMedia.audio.paused) {
            audioPlayer.play();
          }
          else if (WidgetMedia.audio.track) {
            audioPlayer.play({url: WidgetMedia.audio.track});
          }
        };
        WidgetMedia.pause = function () {
          WidgetMedia.audio.paused = true;
          audioPlayer.pause();
        };

        /**
         * slider to show the slider on now-playing page.
         * @type {*|jQuery|HTMLElement}
         */
        slider.onchange = function () {
          if (Math.abs(this.value - WidgetMedia.audio.currentTime) > 1)
            audioPlayer.setTime(this.value);
        };
        slider.onmousedown = function () {
          this.stopUpdateing = true;
        };
        slider.onmouseup = function () {
          this.stopUpdateing = false;
        };

        DataStore.onUpdate().then(null, null, onUpdateCallback);
        $scope.$on("$destroy", function () {
          DataStore.clearListener();
          WidgetMedia.pause();
          ItemDetailsService.setData(null);
        });
      }]
  )
})(window.angular);