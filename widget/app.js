'use strict';

(function (angular, buildfire) {

    // Make sure to include the required dependency to the module
    angular.module('mediaCenterRSSPluginWidget', [
        'ngRoute',
        'infinite-scroll',
        "ngSanitize",
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "videosharing-embed",
        "ngAnimate",
        "media_RSSModals",
        "ngTouch"
    ])

        .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

            /**
             * To make href urls safe on mobile
             */
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);


            /*****************************
             *  Redirects and Otherwise  *
             *****************************/

                // Use $routeProvider to configure any redirects (when) and invalid urls (otherwise).
            $routeProvider
                .when('/', {
                    template: '<div></div>'
                })
                .when('/item', {
                    templateUrl: 'templates/media.html',
                    controllerAs: 'WidgetMedia',
                    controller: 'WidgetMediaCtrl'
                })
                .when('/nowplaying', {
                    templateUrl: 'templates/now-playing.html',
                    controllerAs: 'NowPlaying',
                    controller: 'NowPlayingCtrl'
                })

                // If the url is invalid then redirect to '/'
                .otherwise('/');
        }])
        .run(['Location', '$location', '$rootScope', function (Location, $location, $rootScope) {
            buildfire.navigation.onBackButtonClick = function () {
                var reg = /^\/item/;
                var reg1 = /^\/nowplaying/;
                if (reg.test($location.path())) {
                    $rootScope.showFeed = true;
                    Location.goTo('#/');
                }
                else if (reg1.test($location.path())) {
                    $rootScope.showFeed = false;
                    Location.goTo('#/item');
                }
                else {
                    buildfire.navigation._goBackOne();
                }
            }
        }])
        .filter('getImageUrl', ['Buildfire', function (Buildfire) {
            return function (url, width, height, type) {
                if (type == 'resize')
                    return Buildfire.imageLib.resizeImage(url, {
                        width: width,
                        height: height
                    });
                else
                    return Buildfire.imageLib.cropImage(url, {
                        width: width,
                        height: height
                    });
            }
        }])
      .directive("loadImage", [function () {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {
            element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

            var elem = $("<img>");
            elem[0].onload = function () {
              element.attr("src", attrs.finalSrc);
              elem.remove();
            };
            elem.attr("src", attrs.finalSrc);
          }
        };
      }]);
})(window.angular, window.buildfire);