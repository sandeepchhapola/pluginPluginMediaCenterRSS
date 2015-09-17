describe('Unit : pluginPluginMediaCenterRSS widget.media.controller.js', function () {
  var WidgetMedia, $scope, $filter, $rootScope, $controller, $sce, ItemDetailsService, q, FeedParseService, $timeout, $httpBackend, Location, DataStore, Buildfire, Underscore, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, MEDIUM_TYPES;

  beforeEach(module('mediaCenterRSSPluginWidget'));

  beforeEach(inject(function (_$rootScope_, _$controller_, _$q_, _$filter_, _$sce_, _FeedParseService_, _ItemDetailsService_, _Location_, _$timeout_, _$httpBackend_, _DataStore_, _Buildfire_, _Underscore_, _TAG_NAMES_, _MEDIUM_TYPES_, _STATUS_CODE_, _STATUS_MESSAGES_) {
    q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $filter = _$filter_;
    $sce = _$sce_;
    FeedParseService = _FeedParseService_;
    ItemDetailsService = _ItemDetailsService_;
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;
    DataStore = _DataStore_;
    Underscore = _Underscore_;
    Location = _Location_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
    Buildfire = {
      services: {
        media: {
          audioPlayer: {}
        }
      }
    };
    Buildfire.services.media.audioPlayer = jasmine.createSpyObj('Buildfire.services.media.audioPlayer', ['setTime', 'onEvent', 'play', 'pause'])
  }));

  describe('Unit : Buildfire.services.media.audioPlayer.onEvent returns "pause" event', function () {
    beforeEach(function () {
      Buildfire.services.media.audioPlayer.onEvent.and.callFake(function (callback) {
        callback({
          event: "pause" //"pause","audioEnded"
        })
      });
      WidgetMedia = $controller('WidgetMediaCtrl', {
        $scope: $scope,
        Buildfire: Buildfire
      });
    });
    it('WidgetMedia.audio.playing should be false', function () {
      expect(WidgetMedia.audio.playing).toEqual(false);
    });
  });

  describe('Unit : Buildfire.services.media.audioPlayer.onEvent returns "audioEnded" event', function () {
    beforeEach(function () {
      Buildfire.services.media.audioPlayer.onEvent.and.callFake(function (callback) {
        callback({
          event: "audioEnded" //"pause","audioEnded"
        })
      });
      WidgetMedia = $controller('WidgetMediaCtrl', {
        $scope: $scope,
        Buildfire: Buildfire
      });
    });
    it('WidgetMedia.audio.playing should be false', function () {
      expect(WidgetMedia.audio.playing).toEqual(false);
    });
  });

  describe('Unit : Buildfire.services.media.audioPlayer.onEvent returns "timeUpdate" event', function () {
    beforeEach(function () {
      Buildfire.services.media.audioPlayer.onEvent.and.callFake(function (callback) {
        callback({
          event: "timeUpdate", //"pause","audioEnded"
          data: {
            duration: 412313,
            currentTime: 410000
          }
        })
      });
      WidgetMedia = $controller('WidgetMediaCtrl', {
        $scope: $scope,
        Buildfire: Buildfire
      });
    });
    it('WidgetMedia.audio.currentTime should be timestamp 410000', function () {
      $rootScope.$digest();
      expect(WidgetMedia.audio.currentTime).toEqual(410000);
    });
  });

  describe('Unit : widget.home.controller unit tests', function () {
    beforeEach(function () {
      WidgetMedia = $controller('WidgetMediaCtrl', {
        $q: q,
        $scope: $scope,
        $filter: $filter,
        $sce: $sce,
        DataStore: DataStore,
        Buildfire: Buildfire,
        FeedParseService: FeedParseService,
        ItemDetailsService: ItemDetailsService,
        Location: Location,
        TAG_NAMES: TAG_NAMES,
        Underscore: Underscore,
        STATUS_CODE: STATUS_CODE,
        STATUS_MESSAGES: STATUS_MESSAGES
      });
    });

    describe('Units Should be defined', function () {
      it('WidgetMedia should be defined', function () {
        expect(WidgetMedia).toBeDefined();
      });
      it('$scope should be defined', function () {
        expect($scope).toBeDefined();
      });
      it('$filter should be defined', function () {
        expect($filter).toBeDefined();
      });
      it('$sce should be defined', function () {
        expect($sce).toBeDefined();
      });
      it('DataStore should be defined', function () {
        expect(DataStore).toBeDefined();
      });
      it('Buildfire should be defined', function () {
        expect(Buildfire).toBeDefined();
      });
      it('FeedParseService should be defined', function () {
        expect(FeedParseService).toBeDefined();
      });
      it('ItemDetailsService should be defined', function () {
        expect(ItemDetailsService).toBeDefined();
      });
      it('Location should be defined', function () {
        expect(Location).toBeDefined();
      });
      it('TAG_NAMES should be defined', function () {
        expect(TAG_NAMES).toBeDefined();
      });
      it('Underscore should be defined', function () {
        expect(Underscore).toBeDefined();
      });
      it('STATUS_CODE should be defined', function () {
        expect(STATUS_CODE).toBeDefined();
      });
      it('STATUS_MESSAGES should be defined', function () {
        expect(STATUS_MESSAGES).toBeDefined();
      });
    });

    describe('Unit: video player functions', function () {

      describe('Unit: WidgetMedia.onPlayerReady function', function () {
        it('WidgetMedia.onPlayerReady should be called', function () {
          WidgetMedia.API = '';
          WidgetMedia.onPlayerReady('$API');
          $rootScope.$digest();
          expect(WidgetMedia.API).toEqual('$API');
        });
      });

      describe('Unit: WidgetMedia.onVideoError and WidgetMedia.sourceChanged functions', function () {
        beforeEach(function () {
          WidgetMedia.API = {};
          WidgetMedia.API = jasmine.createSpyObj('WidgetMedia.API', ['stop'])
        });
        it(' WidgetMedia.API.stop have been called on video error', function () {
          WidgetMedia.API.stop.and.callFake(function () {
            console.log('WidgetMedia.API.stop is called when error occure');
          });
          WidgetMedia.onVideoError('$event');
          $rootScope.$digest();
          expect(WidgetMedia.API.stop).toHaveBeenCalled();
        });
        it(' WidgetMedia.API.stop have been called when source has been changed', function () {
          WidgetMedia.API.stop.and.callFake(function () {
            console.log('WidgetMedia.API.stop is called source when has been changed');
          });
          WidgetMedia.sourceChanged();
          $rootScope.$digest();
          expect(WidgetMedia.API.stop).toHaveBeenCalled();
        });
      });
    });

    describe('Unit: audio player functions', function () {
      describe('Unit: WidgetMedia.playAudio function', function () {
        it('it should play Audio when WidgetMedia.audio.paused is true', function () {
          Buildfire.services.media.audioPlayer.play.and.callFake(function () {
            console.log('Buildfire.services.media.audioPlayer,play is called');
          });
          WidgetMedia.audio.paused = true;
          $rootScope.$digest();
          WidgetMedia.playAudio();
          expect(Buildfire.services.media.audioPlayer.play).toHaveBeenCalled();
        });
        it('it should play Audio when WidgetMedia.audio.track is a valid url', function () {
          Buildfire.services.media.audioPlayer.play.and.callFake(function (data) {
            console.log('Buildfire.services.media.audioPlayer,play is called when source changed', data);
          });
          WidgetMedia.audio.track = 'http://www.stephaniequinn.com/Music/Jazz%20Rag%20Ensemble%20-%2010.mp3';
          $rootScope.$digest();
          WidgetMedia.playAudio();
          expect(Buildfire.services.media.audioPlayer.play).toHaveBeenCalledWith({url: "http://www.stephaniequinn.com/Music/Jazz%20Rag%20Ensemble%20-%2010.mp3"});
        });
      });

      describe('Unit: WidgetMedia.pause function', function () {
        it('it should pause Audio', function () {
          Buildfire.services.media.audioPlayer.pause.and.callFake(function () {
            console.log('Buildfire.services.media.audioPlayer,pause is called');
          });
          WidgetMedia.audio.paused = false;
          $rootScope.$digest();
          WidgetMedia.pause();
          expect(Buildfire.services.media.audioPlayer.pause).toHaveBeenCalled();
          expect(WidgetMedia.audio.paused).toEqual(true);
        });
      });

      describe('Unit: WidgetMedia.seekAudio function', function () {
        it('it should seek Audio by setting current Time', function () {
          Buildfire.services.media.audioPlayer.setTime.and.callFake(function (_time) {
            console.log('Buildfire.services.media.audioPlayer,setTime is called', _time);
          });
          $rootScope.$digest();
          WidgetMedia.seekAudio(410025);
          expect(Buildfire.services.media.audioPlayer.setTime).toHaveBeenCalledWith(410025);
        });
      });
      describe('Unit: WidgetMedia.getTitle function', function () {
        it('it should remove html or styles', function () {
          var _item = {
            title: '<strong>Nike white sports shoes</strong>'
          };
          var result = WidgetMedia.getTitle(_item);
          $rootScope.$digest();
          expect(result).toEqual("Nike white sports shoes");
        });
        it('it should remove html and return a substring from summary', function () {
          var _item = {
            summary: '<strong>Nike white sports shoes</strong>'
          };
          var result = WidgetMedia.getTitle(_item);
          $rootScope.$digest();
          expect(result).toEqual('Nike white spo…');
        });
        it('it should remove html and return a substring from description', function () {
          var _item = {
            description: '<strong>Nike white sports shoes</strong>'
          };
          var result = WidgetMedia.getTitle(_item);
          $rootScope.$digest();
          expect(result).toEqual('Nike white spo…');
        });
      });

      describe('Unit:  WidgetMedia.getItemPublishDate function', function () {
        it('it should empty string if pubDate not available', function () {
          var _item = {
            title: '<strong>Nike white sports shoes</strong>'
          };
          var result = WidgetMedia.getItemPublishDate(_item);
          $rootScope.$digest();
          expect(result).toEqual("");
        });
        it('it should return pubDate', function () {
          var _item = {
            title: '<strong>Nike white sports shoes</strong>',
            pubDate: 1442427730006
          };
          var result = WidgetMedia.getItemPublishDate(_item);
          $rootScope.$digest();
          expect(result).toEqual('Sep 16, 2015 11:52:10 PM');
        });
      });
    });
  });

});