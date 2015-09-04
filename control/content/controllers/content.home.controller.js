'use strict';

(function (angular) {
  angular
    .module('mediaCenterRSSPluginContent')
    .controller('ContentHomeCtrl', ['$scope', 'DataStore', 'Buildfire', 'TAG_NAMES', 'LAYOUTS',
      function ($scope, DataStore, Buildfire, TAG_NAMES, LAYOUTS) {

        var ContentHome = this
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
          , tmrDelay = null
          , editor = new Buildfire.components.carousel.editor("#carousel"); // create a new instance of the buildfire carousel editor

        ContentHome.isInValidUrl = false;
        ContentHome.isValidUrl = false;
        ContentHome.descriptionWYSIWYGOptions = {
          plugins: 'advlist autolink link image lists charmap print preview',
          skin: 'lightgray',
          trusted: true,
          theme: 'modern'
        };
        ContentHome.data = angular.copy(_data);
        ContentHome.masterData = null;

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
            if (isUnchanged(newObj) && newObj.content.description !== '<p><br data-mce-bogus="1"></p>') {
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
              ContentHome.data = result.data;
              if (!ContentHome.data.content.carouselImages) {
                editor.loadItems([]);
              }
              else {
                editor.loadItems(ContentHome.data.content.carouselImages);
              }
              updateMasterItem(ContentHome.data);
              if (tmrDelay){clearTimeout(tmrDelay)};
            }
            , error = function (err) {
              console.error('Error while getting data', err);
              if (tmrDelay){clearTimeout(tmrDelay)};
            };
          DataStore.get(TAG_NAMES.RSS_FEED_INFO).then(success, error);
        };

        function updateMasterItem(data) {
          ContentHome.masterData = angular.copy(data);
        }

        function isUnchanged(data) {
          return angular.equals(data, ContentHome.masterData);
        }

        updateMasterItem(_data);

        init();

        // this method will be called when a new item added to the list
        editor.onAddItems = function (items) {
          ContentHome.data.content.carouselImages.push.apply(ContentHome.data.content.carouselImages, items);
          $scope.$digest();
        };
        // this method will be called when an item deleted from the list
        editor.onDeleteItem = function (item, index) {
          ContentHome.data.content.carouselImages.splice(index, 1);
          $scope.$digest();
        };
        // this method will be called when you edit item details
        editor.onItemChange = function (item, index) {
          ContentHome.data.content.carouselImages.splice(index, 1, item);
          $scope.$digest();
        };
        // this method will be called when you change the order of items
        editor.onOrderChange = function (item, oldIndex, newIndex) {
          var temp = ContentHome.data.content.carouselImages[oldIndex];
          ContentHome.data.content.carouselImages[oldIndex] = ContentHome.data.content.carouselImages[newIndex];
          ContentHome.data.content.carouselImages[newIndex] = temp;
          $scope.$digest();
        };

        /*
         * Watch for changes in data and trigger the saveDataWithDelay function on change
         * */
        $scope.$watch(function () {
          return ContentHome.data;
        }, saveDataWithDelay, true);

      }]);
})(window.angular);
