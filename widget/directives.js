(function (angular, buildfire) {
  angular
    .module('mediaCenterRSSPluginWidget')

  /****************
   *  directives  *
   ****************/

  /**
   * A directive which is used to render ng-repeat when data received.
   */
    .directive("triggerNgRepeatRender", [function () {
      var linker = function (scope, elem, attrs) {
        var a = $(elem).width();
      };
      return {
        restrict: 'A',
        link: linker
      };
    }])
  /**
   * A directive which is used handle background image for layouts.
   */
      .directive('backImg', ["$rootScope", function ($rootScope) {
          return function (scope, element, attrs) {
              attrs.$observe('backImg', function (value) {
                  var img = '';
                  if (value) {
                      buildfire.imageLib.local.cropImage(value, {
                          width: $rootScope.deviceWidth,
                          height: $rootScope.deviceHeight
                      }, function (err, imgUrl) {
                          if(imgUrl) {
                              img = imgUrl;
                              element.attr("style", 'background:url(' + img + ') !important');
                          } else {
                              img = '';
                              element.attr("style", 'background-color:white');
                          }
                          element.css({
                              'background-size': 'cover'
                          });
                      });
//                      img = $filter("cropImage")(value, $rootScope.deviceWidth, $rootScope.deviceHeight, true);
                  }
                  else {
                      img = "";
                      element.attr("style", 'background-color:white');
                      element.css({
                          'background-size': 'cover'
                      });
                  }
              });
          };
      }])

  /**
   * A directive which is used handle background image for layouts.
   */
    /*.directive("backgroundImage", ['$filter', function ($filter) {
      var linker = function (scope, element, attrs) {
        element.css('min-height', '580px');
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
      };
      return {
        restrict: 'A',
        link: linker
      };
    }])*/

  /**
   * A directive which is used to initiate carousel when image items received.
   */
      .directive("buildFireCarousel", ["$rootScope", function ($rootScope) {
          return {
              restrict: 'A',
              link: function (scope, elem, attrs) {
                  $rootScope.$broadcast("Carousel:LOADED");
              }
          };
      }])
      .directive("viewSwitcher", ["ViewStack", "$rootScope", '$compile',
          function (ViewStack, $rootScope, $compile) {
              return {
                  restrict: 'AE',
                  link: function (scope, elem, attrs) {
                      var views = 0,
                          currentView = null;
                      manageDisplay();
                      $rootScope.$on('VIEW_CHANGED', function (e, type, view, noAnimation) {
                          if (type === 'PUSH') {
                              console.log("VIEW_CHANGED>>>>>>>>");
                              currentView = ViewStack.getPreviousView();

                              var _el = $("<a/>").attr("href", "javascript:void(0)"),
                                  oldTemplate = $('#' + currentView.template);

                              oldTemplate.append(_el);

                              oldTemplate.find("input[type=number], input[type=password], input[type=text]").each(function () {
                                  $(this).blur().attr("disabled", "disabled");
                              });

                              $(document.activeElement).blur();
                              _el.focus();

                              var newScope = $rootScope.$new();
                              var _newView = '<div  id="' + view.template + '" ><div class="slide content" data-back-img="{{itemDetailsBackgroundImage}}" ng-include="\'templates/' + view.template + '.html\'"></div></div>';
                              var parTpl = $compile(_newView)(newScope);

                              $(elem).append(parTpl);
                              views++;

                          } else if (type === 'POP') {

                              var _elToRemove = $(elem).find('#' + view.template),
                                  _child = _elToRemove.children("div").eq(0);

                              _child.addClass("ng-leave ng-leave-active");
                              _child.one("webkitTransitionEnd transitionend oTransitionEnd", function (e) {
                                  _elToRemove.remove();
                                  views--;
                              });

                              currentView = ViewStack.getCurrentView();
                              $('#' + currentView.template).find("input[type=number], input[type=password], input[type=text]").each(function () {
                                  $(this).removeAttr("disabled");
                              });

                          } else if (type === 'POPALL') {
                              angular.forEach(view, function (value, key) {
                                  var _elToRemove = $(elem).find('#' + value.template),
                                      _child = _elToRemove.children("div").eq(0);

                                  if (!noAnimation) {
                                      _child.addClass("ng-leave ng-leave-active");
                                      _child.one("webkitTransitionEnd transitionend oTransitionEnd", function (e) {
                                          _elToRemove.remove();
                                          views--;
                                      });
                                  } else {
                                      _elToRemove.remove();
                                      views--;
                                  }
                              });
                          }
                          manageDisplay();
                      });

                      function manageDisplay() {
                          if (views) {
                              $(elem).removeClass("ng-hide");
                          } else {
                              $(elem).addClass("ng-hide");
                          }
                      }

                  }
              };
          }]);
})(window.angular, window.buildfire);
