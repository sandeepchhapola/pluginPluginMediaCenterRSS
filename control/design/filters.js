'use strict';

(function (angular) {
  angular.module('mediaCenterRSSPluginDesign')

  /***************
   *   Filters   *
   ***************/

  /**
   * A filter for retrieving cropped image using buildfire.imageLib.cropImage component.
   * @param url
   * @param width
   * @param height
   */
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

  /**
   * A filter for retrieving re-sized image using buildfire.imageLib.resizeImage component.
   * @param url
   * @param width
   * @param height
   */
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