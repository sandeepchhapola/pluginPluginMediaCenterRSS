'use strict';

(function (angular) {
    angular
        .module('mediaCenterRSSPluginWidget')
        .controller('WidgetMediaCtrl', ['$scope', '$sce', 'DataStore', 'FeedParseService', 'TAG_NAMES', 'Item',
            function ($scope, $sce, DataStore, FeedParseService, TAG_NAMES, Item) {

                var WidgetMedia = this;
                WidgetMedia.item = Item.getData();

                var init = function () {
                    var success = function (result) {
                            WidgetMedia.data = result.data;
                        }
                        , error = function (err) {
                            console.error('Error while getting data', err);
                        };
                    DataStore.get(TAG_NAMES.RSS_FEED_INFO).then(success, error);
                };

                init();
            }]
    )
})(window.angular);