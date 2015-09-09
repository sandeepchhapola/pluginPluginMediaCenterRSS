'use strict';

(function (angular) {
    angular
        .module('mediaCenterRSSPluginWidget')
        .controller('WidgetMediaCtrl', ['$scope', '$sce', 'DataStore', 'FeedParseService', 'TAG_NAMES', 'Item','$filter',
            function ($scope, $sce, DataStore, FeedParseService, TAG_NAMES, Item,$filter) {

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


                WidgetMedia.showDescription = function (description) {
                    return !(description == '<p>&nbsp;<br></p>');
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

                WidgetMedia.getItemSummary = function (item) {
                    if (item.summary || item.description) {
                        var html = item.summary ? item.summary : item.description;
                        return html;
                    } else {
                        return '';
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

            }]
    )
})(window.angular);