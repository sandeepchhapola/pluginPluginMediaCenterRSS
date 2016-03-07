describe('Unit : pluginPluginMediaCenterRSS widget.media.controller.js', function () {
    var WidgetMedia, $scope, $filter, $rootScope, $controller, $sce, ItemDetailsService, q, itemMockData, $timeout, $httpBackend, Location, DataStore, Buildfire, Underscore, TAG_NAMES, MEDIUM_TYPES;

    beforeEach(module('mediaCenterRSSPluginWidget'));

    beforeEach(inject(function (_$rootScope_, _$controller_, _$q_, _$filter_, _$sce_, _FeedParseService_, _Location_, _$timeout_, _$httpBackend_, _Buildfire_, _Underscore_, _TAG_NAMES_, _MEDIUM_TYPES_) {
        q = _$q_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $filter = _$filter_;
        $sce = _$sce_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        Underscore = _Underscore_;
        Location = _Location_;
        TAG_NAMES = _TAG_NAMES_;
        MEDIUM_TYPES = _MEDIUM_TYPES_;
        Buildfire = {
            services: {
                media: {
                    audioPlayer: {}
                }
            },
            datastore: {
                onRefresh: function () {
                    return{
                        clear:function(){}
                    }
                }
            }
        };
        Buildfire.services.media.audioPlayer = jasmine.createSpyObj('Buildfire.services.media.audioPlayer', ['setTime', 'onEvent', 'play', 'pause']);
        DataStore = {};
        DataStore = jasmine.createSpyObj('DataStore', ['get', 'onUpdate', 'clearListener', 'onRefresh']);
        DataStore.get.and.callFake(function () {
            var deferred = q.defer();
            deferred.resolve({
                data: {
                    "content": {
                        "carouselImages": [],
                        "description": "<p>&nbsp;<br></p>",
                        "rssUrl": ""
                    },
                    "design": {
                        "itemListLayout": '',
                        "itemDetailsLayout": '',
                        "itemListBgImage": '',
                        "itemDetailsBgImage": ''
                    }
                }
            });
            return deferred.promise;
        });
        ItemDetailsService = {};
        ItemDetailsService = jasmine.createSpyObj('ItemDetailsService', ['getData', 'setData']);
        ItemDetailsService.setData.and.callFake(function (data) {
            console.log('ItemDetailsService.setData called with:', data);
        });
        itemMockData = {
            descriptionOnly: {
                "description": "It is a small description."
            },
            imageOnly: {
                "image": {"url": "https://i.vimeocdn.com/video/525756067_295x166.jpg"}
            },
            imageSrcUrlOnly: {
                "imageSrcUrl": "http://buildfire.com/wp-content/uploads/2015/09/11.jpg"
            },
            mediaThumbnailOnly: {
                "media:thumbnail": {
                    "@": {
                        "url": "http://dwgyu36up6iuz.cloudfront.net/heru80fdn/image/upload/c_fill,d_placeho…pg,fl_progressive,g_face,h_360,q_80,w_640/v1442341566/wired_xtra-cycle.jpg",
                        "width": "640",
                        "height": "360"
                    }
                }
            },
            mediaGroupWhichContainsImageThumbnailOnly: {
                "media:group": {
                    "@": {},
                    "media:content": {
                        "@": {},
                        "media:thumbnail": {
                            "@": {
                                "url": "http://yospace-cds1.reuters.com/u/resize~ad1~120x120/0/f/~image_jpeg~9999-1/1/m/u/7/a/g/2oqv/reuters04?videoId=111525779",
                                "time": "00:00:00.000"
                            }
                        }
                    }
                }
            },
            mediaGroupWhichContainsNone: {
                "media:group": {
                    "@": {},
                    "media:content": {
                        "@": {}
                    }
                }
            },
            mediaGroupWhichContainsImageContent: {
                "media:group": {
                    "@": {},
                    "media:content": {
                        "@": {
                            "url": "https://i.vimeocdn.com/video/525756067_295x166.jpg",
                            "type": "image/jpg"
                        }
                    }
                }
            },
            mediaGroupWhichContainsAudioContent: {
                "media:group": {
                    "@": {},
                    "media:content": {
                        "@": {
                            "url": "http://faif.us/cast-media/FaiF_0x52_Legal-Radical.mp3",
                            "type": "audio/mpeg"
                        }
                    }
                }
            },
            mediaGroupWhichContainsVideoContent: {
                "media:group": {
                    "@": {},
                    "media:content": {
                        "@": {
                            "url": "http://dp8hsntg6do36.cloudfront.net/55e4ea4d61646d0c2900001d/3366f317-513a-456b-88d8-7771863b5658low.mp4",
                            "type": "video/mp4"
                        }
                    }
                }
            },
            mediaGroupWhichContainsWebContent: {
                "media:group": {
                    "@": {},
                    "media:content": {
                        "@": {
                            "url": "https://adwords.google.co.uk/KeywordPlanner",
                            "type": "text"
                        }
                    }
                }
            },
            mediaVideoContentOnly: {
                "media:content": {
                    "@": {
                        "url": "http://dp8hsntg6do36.cloudfront.net/55e4ea4d61646d0c2900001d/3366f317-513a-456b-88d8-7771863b5658low.mp4",
                        "type": "video/mp4",
                        "expression": "sample",
                        "duration": "138",
                        "lang": "eng"
                    }
                }
            },
            mediaAudioContentOnly: {
                "media:content": {
                    "@": {
                        "url": "http://faif.us/cast-media/FaiF_0x52_Legal-Radical.mp3",
                        "type": "audio/mpeg"
                    }
                }
            },
            mediaImageContentOnly: {
                "media:content": {
                    "@": {
                        "url": "https://i.vimeocdn.com/video/525756067_295x166.jpg",
                        "type": "image/jpg"
                    }
                }
            },
            mediaWebContentOnly: {
                "media:content": {
                    "@": {
                        "url": "https://adwords.google.co.uk/KeywordPlanner",
                        "type": "text"
                    }
                }
            },
            mediaContentWithPlayerTagOnly: {
                "link": "http://buildfire.com/better-blogger-and-avoid-writing-bad-posts/",
                "media:content": {
                    "@": {},
                    "media:player": {"@": {"url": "https://player.vimeo.com/video/132869617"}},
                    "media:thumbnail": {
                        "@": {
                            "height": "166",
                            "width": "295",
                            "url": "https://i.vimeocdn.com/video/525756067_295x166.jpg"
                        }
                    }
                }
            },
            enclosuresWhichContainsAudio: {
                "enclosures": [{
                    "url": "http://faif.us/cast-media/FaiF_0x52_Legal-Radical.mp3",
                    "type": "audio/mpeg",
                    "length": "62263424"
                }]
            },
            enclosuresWhichContainsVideo: {
                "enclosures": [{
                    "url": "http://dp8hsntg6do36.cloudfront.net/55e4ea4d61646d0c2900001d/3366f317-513a-456b-88d8-7771863b5658low.mp4",
                    "type": "video/mp4"
                }]
            },
            enclosuresWhichContainsWebContent: {
                "enclosures": [{
                    "url": "https://adwords.google.co.uk/KeywordPlanner",
                    "type": "text"
                }]
            },
            enclosuresWhichContainsImage: {
                "enclosures": [{
                    "url": "https://i.vimeocdn.com/video/525756067_295x166.jpg",
                    "type": "image/jpg"
                }]
            }
        }
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

    describe('Unit : widget.media.controller unit tests', function () {
        beforeEach(function () {
            DataStore.onUpdate.and.callFake(function () {
                var deferred = q.defer();
                deferred.notify({
                    tag: TAG_NAMES.RSS_FEED_INFO,
                    data: {
                        "content": {
                            "carouselImages": [],
                            "description": "<p>&nbsp;<br></p>",
                            "rssUrl": "http://feeds.cnevids.com/brand/wired.mrss"
                        },
                        "design": {
                            "itemListLayout": '',
                            "itemDetailsLayout": '',
                            "itemListBgImage": '',
                            "itemDetailsBgImage": ''
                        }
                    }
                });
                return deferred.promise;
            });
            WidgetMedia = $controller('WidgetMediaCtrl', {
                $q: q,
                $scope: $scope,
                $filter: $filter,
                $sce: $sce,
                DataStore: DataStore,
                Buildfire: Buildfire,
                ItemDetailsService: ItemDetailsService,
                Location: Location,
                TAG_NAMES: TAG_NAMES,
                Underscore: Underscore
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
                    //expect(Buildfire.services.media.audioPlayer.play).toHaveBeenCalled();
                });
                it('it should play Audio when WidgetMedia.audio.track is a valid url', function () {
                    Buildfire.services.media.audioPlayer.play.and.callFake(function (data) {
                        console.log('Buildfire.services.media.audioPlayer,play is called when source changed', data);
                    });
                    WidgetMedia.audio.track = 'http://www.stephaniequinn.com/Music/Jazz%20Rag%20Ensemble%20-%2010.mp3';
                    $rootScope.$digest();
                    WidgetMedia.playAudio();
                   // expect(Buildfire.services.media.audioPlayer.play).toHaveBeenCalledWith({url: "http://www.stephaniequinn.com/Music/Jazz%20Rag%20Ensemble%20-%2010.mp3"});
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
                    expect(result).toEqual('<strong>Nike white sports shoes</strong>');
                });
                it('it should remove html and return a substring from summary', function () {
                    var _item = {
                        summary: '<strong>Nike white sports shoes</strong>'
                    };
                    var result = WidgetMedia.getTitle(_item);
                    $rootScope.$digest();
                    expect(result).toEqual('<strong>Nike white sports shoes</strong>');
                });
                it('it should remove html and return a substring from description', function () {
                    var _item = {
                        description: '<strong>Nike white sports shoes</strong>'
                    };
                    var result = WidgetMedia.getTitle(_item);
                    $rootScope.$digest();
                    expect(result).toEqual('<strong>Nike white sports shoes</strong>');
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
                    expect(result).toContain('Sep 16, 2015');
                });
            });
        });

        describe('Unit: WidgetMedia.slider functions', function () {
            describe('Unit: WidgetMedia.slider.onchange function', function () {
                it('it should call audioPlayer.setTime() function ', function () {
                    WidgetMedia.audio.currentTime = 410012;
                    Buildfire.services.media.audioPlayer.setTime.and.callFake(function (_time) {
                        console.log('Buildfire.services.media.audioPlayer,setTime is called', _time);
                    });
                    WidgetMedia.slider.value = 410111;
                    WidgetMedia.slider.onchange();
                    $rootScope.$digest();
                    expect(Buildfire.services.media.audioPlayer.setTime).toHaveBeenCalledWith(410111);
                });
            });
            describe('Unit: WidgetMedia.slider.onmousedown function', function () {
                it('WidgetMedia.slider.stopUpdateing should be true ', function () {
                    WidgetMedia.slider.stopUpdateing = false;
                    WidgetMedia.slider.onmousedown();
                    $rootScope.$digest();
                    expect(WidgetMedia.slider.stopUpdateing).toEqual(true);
                });
            });
            describe('Unit: WidgetMedia.slider.onmouseup function', function () {
                it('WidgetMedia.slider.stopUpdateing should be false ', function () {
                    WidgetMedia.slider.stopUpdateing = true;
                    WidgetMedia.slider.onmouseup();
                    $rootScope.$digest();
                    expect(WidgetMedia.slider.stopUpdateing).toEqual(false);
                });
            });
        });

        describe('$destroy Should be called', function () {
            it('ItemDetailsService.setData should be called', function () {
                $scope.$destroy();
                $rootScope.$digest();
                //expect(ItemDetailsService.setData).toHaveBeenCalled();
            });
        });

    });

    describe('Unit :filter item data unit tests', function () {
        beforeEach(function () {
            DataStore.onUpdate.and.callFake(function () {
                var deferred = q.defer();
                deferred.notify('Event');
                return deferred.promise;
            });
        });
        describe('Unit : Item Have description only', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.descriptionOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.OTHER if type is contents not found*', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.OTHER);
            });
        });
        describe('when item have image object', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.imageOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.IMAGE if image object have url ', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.IMAGE);
            });
        });
        describe('when item have imageSrcUrl property', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.imageSrcUrlOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.IMAGE ', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.IMAGE);
            });
        });
        describe('when item have media:thumbnail property', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.mediaThumbnailOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.IMAGE', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.IMAGE);
            });
        });
        describe('when item have media:group property have image:thumbnail, not \'@\' property', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.mediaGroupWhichContainsImageThumbnailOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.IMAGE', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.IMAGE);
            });
        });
        describe('when item have media:group property have media:content property', function () {
            describe('Unit : No content Found', function () {
                beforeEach(function () {
                    ItemDetailsService.getData.and.callFake(function () {
                        return itemMockData.mediaGroupWhichContainsNone;
                    });
                    WidgetMedia = $controller('WidgetMediaCtrl', {
                        $scope: $scope,
                        DataStore: DataStore,
                        Buildfire: Buildfire,
                        ItemDetailsService: ItemDetailsService,
                        MEDIUM_TYPES: MEDIUM_TYPES
                    });
                });
                it('Widget.medium should be equal to MEDIUM_TYPES.OTHER if type is contents not found*', function () {
                    expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.OTHER);
                });
            });
            describe('Unit : Video content', function () {
                beforeEach(function () {
                    ItemDetailsService.getData.and.callFake(function () {
                        return itemMockData.mediaGroupWhichContainsVideoContent;
                    });
                    WidgetMedia = $controller('WidgetMediaCtrl', {
                        $scope: $scope,
                        DataStore: DataStore,
                        Buildfire: Buildfire,
                        ItemDetailsService: ItemDetailsService,
                        MEDIUM_TYPES: MEDIUM_TYPES
                    });
                });
                it('Widget.medium should be equal to MEDIUM_TYPES.VIDEO if type is video/*', function () {
                    expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.VIDEO);
                });
            });
            describe('Unit : Audio content', function () {
                beforeEach(function () {
                    ItemDetailsService.getData.and.callFake(function () {
                        return itemMockData.mediaGroupWhichContainsAudioContent;
                    });
                    WidgetMedia = $controller('WidgetMediaCtrl', {
                        $scope: $scope,
                        DataStore: DataStore,
                        Buildfire: Buildfire,
                        ItemDetailsService: ItemDetailsService,
                        MEDIUM_TYPES: MEDIUM_TYPES
                    });
                });
                it('Widget.medium should be equal to MEDIUM_TYPES.AUDIO if type is audio/* ', function () {
                    expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.AUDIO);
                });
            });
            describe('Unit : Image content', function () {
                beforeEach(function () {
                    ItemDetailsService.getData.and.callFake(function () {
                        return itemMockData.mediaGroupWhichContainsImageContent;
                    });
                    WidgetMedia = $controller('WidgetMediaCtrl', {
                        $scope: $scope,
                        DataStore: DataStore,
                        Buildfire: Buildfire,
                        ItemDetailsService: ItemDetailsService,
                        MEDIUM_TYPES: MEDIUM_TYPES
                    });
                });
                it('Widget.medium should be equal to MEDIUM_TYPES.IMAGE if if type is image/* ', function () {
                    expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.IMAGE);
                });
            });
            describe('Unit : Web content', function () {
                beforeEach(function () {
                    ItemDetailsService.getData.and.callFake(function () {
                        return itemMockData.mediaGroupWhichContainsWebContent;
                    });
                    WidgetMedia = $controller('WidgetMediaCtrl', {
                        $scope: $scope,
                        DataStore: DataStore,
                        Buildfire: Buildfire,
                        ItemDetailsService: ItemDetailsService,
                        MEDIUM_TYPES: MEDIUM_TYPES
                    });
                });
                it('Widget.medium should be equal to MEDIUM_TYPES.OTHER if type does not match above', function () {
                    expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.OTHER);
                });
            });
        });
        describe('when item have media:content property which contains type video/*', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.mediaVideoContentOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.VIDEO', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.VIDEO);
            });
        });
        describe('when item have media:content property which contains type audio/* ', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.mediaAudioContentOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.AUDIO if [\'media:content\'][\'@\'].type contains \'audio/\' found', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.AUDIO);
            });
        });
        describe('when item have media:content property which contains type image/* ', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.mediaImageContentOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.IMAGE if [\'media:content\'][\'@\'].type contains \'image/\'', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.IMAGE);
            });
        });
        describe('when item have media:content property which which contains type other than above', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.mediaWebContentOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.OTHER if [\'media:content\'][\'@\'].type does not match any image,audio or video type', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.OTHER);
            });
        });
        describe('when item have media:content have media:player property', function () {
            beforeEach(function () {
                ItemDetailsService.getData.and.callFake(function () {
                    return itemMockData.mediaContentWithPlayerTagOnly;
                });
                WidgetMedia = $controller('WidgetMediaCtrl', {
                    $scope: $scope,
                    DataStore: DataStore,
                    Buildfire: Buildfire,
                    ItemDetailsService: ItemDetailsService,
                    MEDIUM_TYPES: MEDIUM_TYPES
                });
            });
            it('Widget.medium should be equal to MEDIUM_TYPES.VIDEO if property contains a valid url', function () {
                expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.VIDEO);
            });
        });
        describe('when item have enclosures property', function () {
            describe('Unit : Audio content', function () {
                beforeEach(function () {
                    ItemDetailsService.getData.and.callFake(function () {
                        return itemMockData.enclosuresWhichContainsAudio;
                    });
                    WidgetMedia = $controller('WidgetMediaCtrl', {
                        $scope: $scope,
                        DataStore: DataStore,
                        Buildfire: Buildfire,
                        ItemDetailsService: ItemDetailsService,
                        MEDIUM_TYPES: MEDIUM_TYPES
                    });
                });
                it('Widget.medium should be equal to MEDIUM_TYPES.AUDIO', function () {
                    expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.AUDIO);
                });
            });
            describe('Unit : Video content', function () {
                beforeEach(function () {
                    ItemDetailsService.getData.and.callFake(function () {
                        return itemMockData.enclosuresWhichContainsVideo;
                    });
                    WidgetMedia = $controller('WidgetMediaCtrl', {
                        $scope: $scope,
                        DataStore: DataStore,
                        Buildfire: Buildfire,
                        ItemDetailsService: ItemDetailsService,
                        MEDIUM_TYPES: MEDIUM_TYPES
                    });
                });
                it('Widget.medium should be equal to MEDIUM_TYPES.VIDEO', function () {
                    expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.VIDEO);
                });
            });
            describe('Unit : Image content', function () {
                beforeEach(function () {
                    ItemDetailsService.getData.and.callFake(function () {
                        return itemMockData.enclosuresWhichContainsImage;
                    });
                    WidgetMedia = $controller('WidgetMediaCtrl', {
                        $scope: $scope,
                        DataStore: DataStore,
                        Buildfire: Buildfire,
                        ItemDetailsService: ItemDetailsService,
                        MEDIUM_TYPES: MEDIUM_TYPES
                    });
                });
                it('Widget.medium should be equal to MEDIUM_TYPES.IMAGE', function () {
                    expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.IMAGE);
                });
            });
            describe('Unit : Web content', function () {
                beforeEach(function () {
                    ItemDetailsService.getData.and.callFake(function () {
                        return itemMockData.enclosuresWhichContainsWebContent;
                    });
                    WidgetMedia = $controller('WidgetMediaCtrl', {
                        $scope: $scope,
                        DataStore: DataStore,
                        Buildfire: Buildfire,
                        ItemDetailsService: ItemDetailsService,
                        MEDIUM_TYPES: MEDIUM_TYPES
                    });
                });
                it('Widget.medium should be equal to MEDIUM_TYPES.OTHER', function () {
                    expect(WidgetMedia.medium).toEqual(MEDIUM_TYPES.OTHER);
                });
            });
        });
    });
});