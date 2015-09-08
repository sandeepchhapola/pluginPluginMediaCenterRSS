(function (angular) {
  angular
    .module('mediaCenterRSSPluginWidget')
    .directive('playBtn', function () {
      var linker = function (scope, element, attrs) {
        if (attrs.playBtn == 'true')
          element.addClass('play-btn');
      };
      return {
        restrict: 'A',
        link: linker
      };
    })
    .directive("backgroundImage", ['$filter', function ($filter) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var getImageUrlFilter = $filter("resizeImage");
          var setBackgroundImage = function (backgroundImage) {
            if (backgroundImage) {
              element.css(
                'background', '#010101 url('
                + getImageUrlFilter(backgroundImage, 342, 770, 'resize')
                + ') repeat fixed top center');
            } else {
              element.css('background', 'none');
            }
          };
          attrs.$observe('backgroundImage', function (newValue) {
            setBackgroundImage(newValue);
          });
        }
      };
    }])
    .directive('buildfireCarousel', function ($timeout) {
      return {
        restrict: 'E',
        replace: true,
        link: function (scope, elem, attrs) {
          var view;

          function initCarousel() {
            $timeout(function () {
              var imgs = scope.images || [];
              view = new buildfire.components.carousel.view("#carousel", imgs);
            });

          }

          initCarousel();


          scope.$watch(function () {
            return scope.images;
          }, function (newValue, oldValue) {
            var imgs = angular.copy(newValue);
            if (view)
              view.loadItems(imgs);
          });

        },
        template: "<div id='carousel'></div>",
        scope: {
          images: '='
        }
      }
    });
})(window.angular, undefined);
