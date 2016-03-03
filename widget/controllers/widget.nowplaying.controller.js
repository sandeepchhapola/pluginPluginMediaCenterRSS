(function (angular) {
    angular
        .module('mediaCenterRSSPluginWidget')
        .controller('NowPlayingCtrl', ['$scope', 'Buildfire', '$rootScope', '$timeout', 'Location',
            function ($scope, Buildfire, $rootScope, $timeout, Location) {
                console.log('----------------------------Now Playing controller loaded-------------------');
                $rootScope.blackBackground = true;
                $rootScope.showFeed = false;
                var NowPlaying = this;

                /**
                 * Implementation of pull down to refresh
                 */
                var onRefresh = Buildfire.datastore.onRefresh(function () {
                });

                /**
                 * Unbind the onRefresh
                 */
                $scope.$on('$destroy', function () {
                    $rootScope.blackBackground = false;
                    onRefresh.clear();
                    Buildfire.datastore.onRefresh(function () {
                        Location.goToHome();
                    });
                });
            }
        ])
    ;
})(window.angular);
