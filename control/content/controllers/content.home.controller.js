'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginContent')
    .controller('ContentHomeCtrl', ['$scope',
      function ($scope) {
        var ContentHome = this;
        ContentHome.isInValidUrl = false;
        ContentHome.isValidUrl = false;
        ContentHome.descriptionWYSIWYGOptions = {
          plugins: 'advlist autolink link image lists charmap print preview',
          skin: 'lightgray',
          trusted: true,
          theme: 'modern'
        };
        ContentHome.description='Hi! how are you?';

      }]);
})(window.angular);
