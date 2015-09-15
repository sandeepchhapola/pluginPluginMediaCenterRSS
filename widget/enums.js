'use strict';

(function (angular) {
  angular.module('mediaCenterRSSPluginWidget')
    .constant('TAG_NAMES', {
      RSS_FEED_INFO: 'RssFeedInfo'
    })
    .constant('STATUS_CODE', {
      UNDEFINED_EVENT: 'UNDEFINED_EVENT'
    })
    .constant('STATUS_MESSAGES', {
      UNDEFINED_EVENT: 'Undefined event provided'
    })
    .constant('MEDIUM_TYPES', {
      VIDEO: 'VIDEO',
      AUDIO: 'AUDIO',
      IMAGE: 'IMAGE',
      OTHER: 'OTHER'
    });
})(window.angular);