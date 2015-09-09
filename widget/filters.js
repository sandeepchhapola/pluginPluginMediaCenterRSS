(function (angular, buildfire, location, jQuery) {
  "use strict";
  //created mediaCenterWidget module
  angular
    .module('mediaCenterRSSPluginWidget')
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
    .filter('cropImage', [function () {
      return function (url, width, height) {
        return buildfire.imageLib.cropImage(url, {
          width: width,
          height: height
        });
      };
    }])
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
    .filter('truncate', [function () {
      return function (html, length) {
        html = html.replace(/<\/?[^>]+(>|$)/g, "");
        return jQuery.truncate(html, {
          length: length
        });
      };
    }])
      .filter('removeHtml', [function () {
        return function (html) {
          html = html.replace(/<\/?[^>]+(>|$)/g, "");
          return html;
        };
      }])
    .filter('extractImgSrc', [function () {
      return function (html) {
        var imgArr = html.match(/<img[^>]+>/i);
        if (!imgArr || imgArr.length === 0) {
          return '';
        }
        var img = html.match(/<img[^>]+>/i)[0]
          , rex = /<img[^>]+src="([^">]+)/g;
        return rex.exec(img)[1];
      };
    }])
    .filter("jsDate", function () {
      return function (x) {
        return new Date(x);
      };
    })
    .filter("timeCorrect", function () {
      return function (x) {
        x = '0' + x.substring(1);
        return x;
      };
    });
})(window.angular, window.buildfire, window.location, jQuery);