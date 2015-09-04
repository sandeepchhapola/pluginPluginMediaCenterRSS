'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginDesign')
    .controller('DesignHomeCtrl', ['$scope', 'DataStore', 'ImageLibrary', 'TAG_NAMES', 'LAYOUTS',
      function ($scope, DataStore, ImageLibrary, TAG_NAMES, LAYOUTS) {

        var DesignHome = this
          , _data = {
            "content": {
              "carouselImages": [],
              "description": "<p>&nbsp;<br></p>",
              "rssUrl": ""
            },
            "design": {
              "itemListLayout": LAYOUTS.itemListLayouts[0].name,
              "itemDetailsLayout": LAYOUTS.itemDetailsLayouts[0].name,
              "itemListBgImage": "",
              "itemDetailsBgImage": ""
            }
          }
          , tmrDelay = null;

        DesignHome.layouts = LAYOUTS;
        DesignHome.data = angular.copy(_data);
        DesignHome.masterData = null;

        /*
         * Call the datastore to save the data object
         */
        var saveData = function (newObj, tag) {
          if (typeof newObj === 'undefined') {
            return;
          }
          var success = function (result) {
              console.info('Saved data result: ', result);
              updateMasterItem(newObj);
            }
            , error = function (err) {
              console.error('Error while saving data : ', err);
            };
          DataStore.save(newObj, tag).then(success, error);
        };
        /*
         * create an artificial delay so api isnt called on every character entered
         * */
        var saveDataWithDelay = function (newObj) {
          if (newObj) {
            if (isUnchanged(newObj)) {
              return;
            }
            if (tmrDelay) {
              clearTimeout(tmrDelay);
            }
            tmrDelay = setTimeout(function () {
              saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.RSS_FEED_INFO);
            }, 500);
          }
        };
        /*
         * Go pull any previously saved data
         * */
        var init = function () {
          var success = function (result) {
              console.info('Init success result:', result);
              DesignHome.data = result.data;
              if (DesignHome.data && !DesignHome.data.design) {
                DesignHome.data.design = {};
              }
              if (DesignHome.data && DesignHome.data.design && !DesignHome.data.design.itemListLayout) {
                DesignHome.data.design.itemListLayout = DesignHome.layouts.itemListLayouts[0].name;
              }
              if (DesignHome.data && DesignHome.data.design && !DesignHome.data.design.itemDetailsLayout) {
                DesignHome.data.design.itemDetailsLayout = DesignHome.layouts.itemDetailsLayouts[0].name;
              }
              updateMasterItem(DesignHome.data);
              if (tmrDelay)clearTimeout(tmrDelay);
            }
            , error = function (err) {
              console.error('Error while getting data', err);
              if (tmrDelay)clearTimeout(tmrDelay);
            };
          DataStore.get(TAG_NAMES.RSS_FEED_INFO).then(success, error);
        };

        function updateMasterItem(data) {
          DesignHome.masterData = angular.copy(data);
        }

        function isUnchanged(data) {
          return angular.equals(data, DesignHome.masterData);
        }

        updateMasterItem(_data);
        init();

        DesignHome.changeListLayout = function (layout) {
          DesignHome.data.design.itemListLayout = layout;
        };

        DesignHome.changeItemDetailsLayout = function (layout) {
          DesignHome.data.design.itemDetailsLayout = layout;
        };

        DesignHome.addItemListBackgroundImage = function () {
          var options = {showIcons: false, multiSelection: false};
          var success = function (result) {
              DesignHome.data.design.itemListBgImage = result.selectedFiles && result.selectedFiles[0] || null;
              if (tmrDelay)clearTimeout(tmrDelay);
            }
            , error = function (err) {
              console.error('Error while selecting item list background image from ImageLibrary', err);
              if (tmrDelay)clearTimeout(tmrDelay);
            };
          ImageLibrary.showDialog(options).then(success, error);
        };

        DesignHome.removeItemListBackgroundImage = function () {
          DesignHome.data.design.itemListBgImage = null;
        };

        DesignHome.addItemDetailsBackgroundImage = function () {
          var options = {showIcons: false, multiSelection: false};
          var success = function (result) {
              DesignHome.data.design.itemDetailsBgImage = result.selectedFiles && result.selectedFiles[0] || null;
              if (tmrDelay)clearTimeout(tmrDelay);
            }
            , error = function (err) {
              console.error('Error while selecting item list background image from ImageLibrary', err);
              if (tmrDelay)clearTimeout(tmrDelay);
            };
          ImageLibrary.showDialog(options).then(success, error);
        };

        DesignHome.removeItemDetailsBackgroundImage = function () {
          DesignHome.data.design.itemDetailsBgImage = null;
        };

        /*
         * Watch for changes in data and trigger the saveDataWithDelay function on change
         * */
        $scope.$watch(function () {
          return DesignHome.data;
        }, saveDataWithDelay, true);
      }]);
})(window.angular);
