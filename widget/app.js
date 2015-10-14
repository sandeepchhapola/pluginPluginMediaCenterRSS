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
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile):/);


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
    }]);
})(window.angular);