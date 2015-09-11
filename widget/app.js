'use strict';

(function (angular) {
  angular.module('mediaCenterRSSPluginWidget', [
    'ngRoute',
    'infinite-scroll',
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "videosharing-embed"
  ])
    //injected ngRoute for routing
    .config(['$routeProvider', function ($routeProvider) {
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
        .otherwise('/');
    }]);
})(window.angular);