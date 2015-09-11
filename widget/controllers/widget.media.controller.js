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

        var changeVideoSrc = function (_src, _type) {
          WidgetMedia.videoPlayerConfig.sources = [{
            src: $sce.trustAsResourceUrl(_src),
            type: _type
          }];
        };

        var checkEnclosuresTag = function (_item) {
          if (_item.enclosures && _item.enclosures.length > 0 && _item.enclosures[0].url) {
            if (_item.enclosures[0].type.indexOf('video/') === 0) {
              WidgetMedia.medium = MEDIUM_TYPES.VIDEO;
              return {
                type: _item.enclosures[0].type,
                src: _item.enclosures[0].url
              }
            } else if (_item.enclosures[0].type.indexOf('audio/') === 0) {
              WidgetMedia.medium = MEDIUM_TYPES.AUDIO;
              return {
                type: _item.enclosures[0].type,
                src: _item.enclosures[0].url
              }
            }
            else if (_item.enclosures[0].type.indexOf('image/') === 0) {
              WidgetMedia.medium = MEDIUM_TYPES.IMAGE;
              return {
                type: _item.enclosures[0].type,
                src: _item.enclosures[0].url
              }
            } else {
              WidgetMedia.medium = MEDIUM_TYPES.OTHER;
              return {
                type: _item.enclosures[0].type,
                src: _item.enclosures[0].url
              }
            }
          }
          else {
            return null
          }
        };
        var checkMediaTag = function (_item) {
          // code here to check media:content tag or media:group tag
        };

        var filterItemType = function (_item) {
          console.log(_item);
          var mediaData = checkEnclosuresTag(_item);
          if (!mediaData) {
            mediaData = checkMediaTag(_item)
          }
          if (mediaData) {
            switch (WidgetMedia.medium) {
              case MEDIUM_TYPES.VIDEO:
                changeVideoSrc(mediaData.src, mediaData.type);
                break;
              case MEDIUM_TYPES.AUDIO:
                WidgetMedia.audio.track = mediaData.src;
                //code for audio player
                break;
              case MEDIUM_TYPES.IMAGE:
                //code here if rss feed for images
                break;
              case MEDIUM_TYPES.OTHER:
                //code here if rss feed like web-links or other
                break;
              default :
                //code here for defaults
                break;
            }
          }
          else {
            //check description [CDATA]
          }
        };

        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.RSS_FEED_INFO) {
            WidgetMedia.data = event.data;
            if (WidgetMedia.data.content && (!WidgetMedia.data.content.rssUrl || WidgetMedia.data.content.rssUrl !== currentRssUrl)) {
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
          ItemDetailsService.setData(null);
        });
      }]
  )
})(window.angular);