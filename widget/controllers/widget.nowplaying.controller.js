(function (angular) {
    angular
        .module('mediaCenterRSSPluginWidget')
        .controller('NowPlayingCtrl', ['$scope', 'Buildfire', '$rootScope', '$timeout', 'Location', 'ItemDetailsService',
            function ($scope, Buildfire, $rootScope, $timeout, Location, ItemDetailsService) {
                console.log('----------------------------Now Playing controller loaded-------------------');
                //$rootScope.blackBackground = true;
                $rootScope.showFeed = false;
                var NowPlaying = this;

                /**
                 * WidgetMedia.item used to hold item details object
                 * @type {object}
                 */
                NowPlaying.item=ItemDetailsService.getData();
                if(NowPlaying.item)
                NowPlaying.currentTrack = new Track(NowPlaying.item);

                console.log('NowPlaying.Item--------------------------------------------',NowPlaying.item);

                /**
                 * audioPlayer is Buildfire.services.media.audioPlayer.
                 */
                var audioPlayer = Buildfire.services.media.audioPlayer;
                audioPlayer.settings.get(function (err, setting) {
                    NowPlaying.settings=setting;
                    NowPlaying.volume = setting.volume;
                });

                /**
                 * audioPlayer.onEvent callback calls when audioPlayer event fires.
                 */
                audioPlayer.onEvent(function (e) {
                    switch (e.event) {
                        case 'timeUpdate':
                            NowPlaying.currentTime = e.data.currentTime;
                            NowPlaying.duration = e.data.duration;
                            break;
                        case 'audioEnded':
                            NowPlaying.playing = false;
                            NowPlaying.paused = false;
                            break;
                        case 'pause':
                            NowPlaying.playing = false;
                            break;
                        case 'next':
                            NowPlaying.currentTrack = e.data.track;
                            NowPlaying.playing = true;
                            break;
                        case 'removeFromPlaylist':
                            Modals.removeTrackModal();
                            NowPlaying.playList = e.data && e.data.newPlaylist && e.data.newPlaylist.tracks;
                            break;

                    }
                    $scope.$digest();
                });

                /**
                 * Player related method and variables
                 */
                NowPlaying.playTrack = function () {
                    NowPlaying.playing = true;
                    if (NowPlaying.paused) {
                        audioPlayer.play();
                    } else {
                        audioPlayer.play(NowPlaying.currentTrack);
                    }
                };
                NowPlaying.playlistPlay = function (track) {
                    NowPlaying.playing = true;
                    if (track) {
                        audioPlayer.play({url: track.url});
                        track.playing = true;
                    }
                };
                NowPlaying.pauseTrack = function () {
                    NowPlaying.playing = false;
                    NowPlaying.paused = true;
                    audioPlayer.pause();
                };
                NowPlaying.playlistPause = function (track) {
                    track.playing = false;
                    NowPlaying.playing = false;
                    NowPlaying.paused = true;
                    audioPlayer.pause();
                };
                NowPlaying.forward = function () {
                    if (NowPlaying.currentTime + 5 >= NowPlaying.currentTrack.duration)
                        audioPlayer.setTime(NowPlaying.currentTrack.duration);
                    else
                        audioPlayer.setTime(NowPlaying.currentTime + 5);
                };

                NowPlaying.backward = function () {
                    if (NowPlaying.currentTime - 5 > 0)
                        audioPlayer.setTime(NowPlaying.currentTime - 5);
                    else
                        audioPlayer.setTime(0);
                };
                NowPlaying.shufflePlaylist = function () {
                    if (NowPlaying.settings) {
                        NowPlaying.settings.shufflePlaylist = NowPlaying.settings.shufflePlaylist ? false : true;
                    }
                    audioPlayer.settings.set(NowPlaying.settings);
                };

                NowPlaying.loopPlaylist = function () {
                    if (NowPlaying.settings) {
                        NowPlaying.settings.loopPlaylist = NowPlaying.settings.loopPlaylist ? false : true;
                    }
                    audioPlayer.settings.set(NowPlaying.settings);
                };
                NowPlaying.addToPlaylist = function (track) {
                    if (track)
                        audioPlayer.addToPlaylist(track);
                };
                NowPlaying.removeFromPlaylist = function (track) {
                    if (NowPlaying.playList) {
                        NowPlaying.playList.filter(function (val, index) {
                            if (val.url == track.url)
                                audioPlayer.removeFromPlaylist(index);
                            return index;

                        });
                    }
                };
                NowPlaying.removeTrackFromPlayList = function (index) {
                    audioPlayer.removeFromPlaylist(index);

                };
                NowPlaying.getFromPlaylist = function () {
                    audioPlayer.getPlaylist(function (err, data) {
                        if (data && data.tracks) {
                            NowPlaying.playList = data.tracks;
                            $scope.$digest();
                        }
                    });
                    NowPlaying.openMoreInfo = false;
                    NowPlaying.openPlaylist = true;
                };
                NowPlaying.changeTime = function (time) {
                    audioPlayer.setTime(time);
                };
                NowPlaying.getSettings = function () {
                    NowPlaying.openSettings = true;
                    audioPlayer.settings.get(function (err, data) {
                        if (data) {
                            NowPlaying.settings = data;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        }
                    });
                };
                NowPlaying.setSettings = function (settings) {
                    var newSettings = new AudioSettings(settings);
                    audioPlayer.settings.set(newSettings);
                };
                NowPlaying.addEvents = function (e, i, toggle) {
                    toggle ? NowPlaying.swiped[i] = true : NowPlaying.swiped[i] = false;
                };
                NowPlaying.openMoreInfoOverlay = function () {
                    NowPlaying.openMoreInfo = true;
                };
                NowPlaying.closeSettingsOverlay = function () {
                    NowPlaying.openSettings = false;
                };
                NowPlaying.closePlayListOverlay = function () {
                    NowPlaying.openPlaylist = false;
                };
                NowPlaying.closeMoreInfoOverlay = function () {
                    NowPlaying.openMoreInfo = false;
                };

                NowPlaying.addEvents = function (e, i, toggle) {
                    toggle ? NowPlaying.swiped[i] = true : NowPlaying.swiped[i] = false;
                };


                /**
                 * Track Smaple
                 * @param title
                 * @param url
                 * @param image
                 * @param album
                 * @param artist
                 * @constructor
                 */

                function Track(track) {
                    console.log('Track-----------------------------------------------------',track);
                    this.title = track && track.title;
                    this.url = track && track['media:content'] && track['media:content'] && track['media:content']['@'] && track['media:content']['@'].url;
                    this.image = track && track.imageSrcUrl;
                    this.album = '';
                    this.artist = track && track.author;
                    this.startAt = 0; // where to begin playing
                    this.lastPosition = 0; // last played to
                }

                /**
                 * AudioSettings sample
                 * @param autoPlayNext
                 * @param loop
                 * @param autoJumpToLastPosition
                 * @param shufflePlaylist
                 * @constructor
                 */
                function AudioSettings(settings) {
                    this.autoPlayNext = settings.autoPlayNext; // once a track is finished playing go to the next track in the play list and play it
                    this.loopPlaylist = settings.loopPlaylist; // once the end of the playlist has been reached start over again
                    this.autoJumpToLastPosition = settings.autoJumpToLastPosition; //If a track has [lastPosition] use it to start playing the audio from there
                    this.shufflePlaylist = settings.shufflePlaylist;// shuffle the playlist
                }


                /**
                 * auto play the song
                 */
                $timeout(function(){
                    console.log('Auto play called-------------------------');
                    NowPlaying.playTrack();
                },100);

                /**
                 * Implementation of pull down to refresh
                 */
                var onRefresh = Buildfire.datastore.onRefresh(function () {
                });

                /**
                 * Unbind the onRefresh
                 */
                $scope.$on('$destroy', function () {
                    $rootScope.blackBackground = false;
                    onRefresh.clear();
                    Buildfire.datastore.onRefresh(function () {
                    });
                });
            }
        ])
    ;
})(window.angular);
