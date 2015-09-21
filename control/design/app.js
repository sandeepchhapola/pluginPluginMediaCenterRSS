'use strict';

(function (angular) {
  // Make sure to include the required dependency to the module
  angular.module('mediaCenterRSSPluginDesign', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {

      /*****************************
       *  Redirects and Otherwise  *
       *****************************/

        // Use $routeProvider to configure any redirects (when) and invalid urls (otherwise).
      $routeProvider

        //Here we are just setting up some convenience urls
        .when('/', {
          templateUrl: 'templates/home.html',
          controllerAs: 'DesignHome',
          controller: 'DesignHomeCtrl'
        })

        // If the url is invalid then redirect to '/'
        .otherwise('/');
    }]);
})(window.angular);