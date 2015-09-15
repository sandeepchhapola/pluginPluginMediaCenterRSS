'use strict';

(function (angular) {
  angular.module('mediaCenterRSSPluginDesign')
    .filter('cropImage', [function () {
      return function (url, width, height) {
        if (!url) {
          return '';
        } else {
          return buildfire.imageLib.cropImage(url, {
            width: width,
            height: height
          });
        }
      };
    }])
    .filter('resizeImage', [function () {
      return function (url, width, height) {
        if (!url) {
          return '';
        } else {
          return buildfire.imageLib.resizeImage(url, {
            width: width,
            height: height
          });
        }
      };
    }]);
})(window.angular);