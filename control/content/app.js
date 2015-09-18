'use strict';

(function (angular) {

  // Make sure to include the required dependency to the module
  angular.module('mediaCenterRSSPluginContent', ['ngRoute', 'ui.bootstrap', 'ui.tinymce'])

    .config(['$routeProvider', function ($routeProvider) {

      /*****************************
       *  Redirects and Otherwise  *
       *****************************/

        // Use $routeProvider to configure any redirects (when) and invalid urls (otherwise).
      $routeProvider

        //Here we are just setting up some convenience urls
        .when('/', {
          templateUrl: 'templates/home.html',
          controllerAs: 'ContentHome',
          controller: 'ContentHomeCtrl'
        })

        // If the url is invalid then redirect to '/'
        .otherwise('/');
    }]);
})(window.angular);