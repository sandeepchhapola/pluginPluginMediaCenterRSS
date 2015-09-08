'use strict';

(function (angular) {
    angular
        .module('mediaCenterRSSPluginWidget')
        .controller('WidgetHomeCtrl', ['$scope', 'DataStore', 'Buildfire', 'TAG_NAMES', 'LAYOUTS',
            function ($scope, DataStore, Buildfire, TAG_NAMES, LAYOUTS) {

                var WidgetHome = this;

                //WidgetHome.media = {data:{design:{}}};   WidgetHome.media.data.design.listLayout = 1;

                var init = function () {
                    var success = function (result) {
                            console.info('Widget: Init success result:', result);
                            if (Object.keys(result.data).length > 0) {
                                WidgetHome.data = result.data;
                            }
                        }
                        , error = function (err) {
                            console.error('Widget: Error while getting data', err);
                        };

                    DataStore.get(TAG_NAMES.RSS_FEED_INFO).then(success, error);
                };

                init();

                Buildfire.datastore.onUpdate(function (event) {
                   init();
                });

            }]);
})(window.angular);
