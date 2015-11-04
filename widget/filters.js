(function (angular, buildfire, location, jQuery) {
  "use strict";

  angular.module('mediaCenterRSSPluginWidget')

  /***************
   *   Filters   *
   ***************/

  /**
   * A filter for retrieving cropped image using buildfire.imageLib.cropImage component.
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
    }])

  /**
   * A filter for retrieving re-sized image using buildfire.imageLib.resizeImage component.
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
   * A filter for retrieving trusty Html using angular $sce service.
   * @param html
   */
    .filter('safeHtml', ['$sce', function ($sce) {
      return function (html) {
        if (html) {
          return $sce.trustAsHtml(html);
        }
        else {
          return "";
        }
      };
    }])

  /**
   * A filter for retrieving truncate Html of given length using jQuery.truncate method.
   * @param html
   * @param length
   */
    .filter('truncate', [function () {
      return function (html, length) {
        if (typeof html === 'string') {
          html = html.replace(/<[^>]+>/gm, '');
          return jQuery.truncate(html, {
            length: length
          });
        } else {
          return 'aa';
        }
      };
    }])

  /**
   * A filter will remove styles from Html and add attribute 'target=_blank' to all anchor tags available in html.
   * @param html
   */
    .filter('removeHtmlStyle', [function () {
      return function (html) {
        if (html) {
          html = html.replace(/(<[^>]+) style=".*?"/i, '$1', "");
          html = html.replace(/<iframe.+?<\/iframe>/g, '');
          html = html.replace(/(<a\b[^><]*)>/ig, '$1 target="_blank">');
        }
        return html;
      };
    }])

  /**
   * A filter will return src url of first found image tag in html..
   * @param html
   */
    .filter('extractImgSrc', [function () {
      return function (html) {
        var imgArr = html.match(/<img[^>]+>/i);
        if (!imgArr || imgArr.length === 0) {
          return '';
        }
        var img = imgArr[0]
          , rex = /^<img[^>].*src=['"]([\/:a-zA-Z0-9\._-]+)['"].*$/i
          , result = img.match(rex);
        return (result && result[1]) ? result[1] : '';
      };
    }])

  /**
   * A filter to correct time.
   * @param html
   */
    .filter("timeCorrect", function () {
      return function (x) {
        x = '0' + x.substring(1);
        return x;
      };
    })
    .filter('secondsToDateTime', [function() {
      return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
      };
    }]);
})(window.angular, window.buildfire, window.location, jQuery);