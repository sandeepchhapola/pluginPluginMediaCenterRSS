'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginContent')
    .controller('ContentHomeCtrl', ['$scope',
      function ($scope) {
        var ContentHome = this;
        ContentHome.isInValidUrl = false;
        ContentHome.isValidUrl = false;
      }]);
})(window.angular);
