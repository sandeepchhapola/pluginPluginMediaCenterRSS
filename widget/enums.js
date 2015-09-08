'use strict';

(function (angular) {
  angular.module('mediaCenterRSSPluginWidget')
    .constant('TAG_NAMES', {
      RSS_FEED_INFO: 'RssFeedInfo'
    })
    .constant('STATUS_CODE', {
      INSERTED: 'inserted',
      UPDATED: 'updated',
      NOT_FOUND: 'NOTFOUND',
      UNDEFINED_DATA: 'UNDEFINED_DATA',
      UNDEFINED_OPTIONS: 'UNDEFINED_OPTIONS',
      UNDEFINED_ID: 'UNDEFINED_ID'
    })
    .constant('STATUS_MESSAGES', {
      UNDEFINED_DATA: 'Undefined data provided',
      UNDEFINED_OPTIONS: 'Undefined options provided',
      UNDEFINED_ID: 'Undefined id provided'
    })
    .constant('LAYOUTS', {
      itemListLayouts: [
        {name: "List_Layout_1"},
        {name: "List_Layout_2"},
        {name: "List_Layout_3"},
        {name: "List_Layout_4"}
      ],
      itemDetailsLayouts: [
        {name: "Feed_Layout_1"},
        {name: "Feed_Layout_2"}
      ]
    });
})(window.angular);