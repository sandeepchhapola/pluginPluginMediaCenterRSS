'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginDesign')
    .controller('DesignHomeCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'LAYOUTS',
      function ($scope, DataStore, TAG_NAMES, LAYOUTS) {

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


        /*
         * Watch for changes in data and trigger the saveDataWithDelay function on change
         * */
        $scope.$watch(function () {
          return DesignHome.data;
        }, saveDataWithDelay, true);
      }]);
})(window.angular);
