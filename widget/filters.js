(function (angular, buildfire, location, jQuery) {
  "use strict";
  //created mediaCenterWidget module
  angular
    .module('mediaCenterRSSPluginWidget')
    .filter('resizeImage', [function () {
      return function (url, width, height) {
        return buildfire.imageLib.resizeImage(url, {
          width: width,
          height: height
        });
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
      return function (html) {
        html = html.replace(/<img[^>]+>/, '');
        //-- remove BR tags and replace them with line break
        html = html.replace(/<br>/gi, "\n");
        html = html.replace(/<br\s\/>/gi, "\n");
        html = html.replace(/<br\/>/gi, "\n");

        //-- remove P and A tags but preserve what's inside of them
        html = html.replace(/<p.*>/gi, "\n");
        html = html.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");
        return jQuery.truncate(html, {
          length: 13
        });
      };
    }])
    .filter('extractImgSrc', [function () {
      return function (html) {
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