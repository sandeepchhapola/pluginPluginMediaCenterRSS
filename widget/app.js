'use strict';

(function (angular) {

    // Make sure to include the required dependency to the module
    angular.module('mediaCenterRSSPluginWidget', [
        'ngRoute',
        'infinite-scroll',
        "ngSanitize",
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "videosharing-embed"
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
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetHome',
                    controller: 'WidgetHomeCtrl'
                })
                .when('/item', {
                    templateUrl: 'templates/media.html',
                    controllerAs: 'WidgetMedia',
                    controller: 'WidgetMediaCtrl'
                })

                // If the url is invalid then redirect to '/'
                .otherwise('/');
        }])
        .run(['Location', '$location', function (Location, $location) {
            buildfire.navigation.onBackButtonClick = function () {
                var path = $location.path();
                if (path.indexOf('/item') == 0)
                    Location.goTo('#/');
                else
                    buildfire.navigation.navigateHome();
            }
        }])
    ;
})(window.angular);