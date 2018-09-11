(function() {
    'use strict';

    angular.module('3pak')
        .controller('DraftPakController', DraftPakController);

    /**
     * Controller for Draft-Pak screen (url: /draft)
     * @param $user
     * @param $q
     * @param $state
     * @param $players
     * @param $teams
     * @param $dialog
     * @constructor
     */
    function DraftPakController($user, $q, $state, $players, $teams, $game, $dialog, PickWindowService) {
        var vm = this;
        /**
         * view this as isReturningUser - if true then authenticate only
         * @type {boolean}
         */
        vm.hideEmail = false;
        /**
         * collection of the players that have been drafted in user's pak
         * @type {Array<Object>}
         */
        vm.picks = new Array(3);
        /**
         * 3pak id for the current pak
         * @type {null}
         */
        vm.pakId = null;
        /**
         * user's remaining salary after the picks
         * @type {number}
         */
        vm.remainingSalary = 17000;
        /**
         * collection of players for drafting
         * @type {Array<Object>}
         */
        vm.players = [];
        /**
         * internal collection to hold all players' records
         * @type {Array}
         * @private
         */
        var _players = [];
        /**
         * how many players to add per load
         * @type {number}
         * @private
         */
        var _playersIncrement = 20;
        /**
         * collection of unique player positions
         * @type {Array}
         */
        vm.playerPositions = [
            {
                value: 'all',
                text: 'All Positions'
            }
        ];
        /**
         * selecting the first option for all
         * @type {*}
         */
        vm.filter = 'all';
        /**
         * button for progressing to the confirm screen
         * @type {*[]}
         */
        vm.navButtons = [
            {
                text: 'Let\'s Play',
                action: goToConfirmationScreen
            }
        ];
        /**
         * move forward to the confirmation screen
         * @type {goToConfirmationScreen}
         */
        vm.goToConfirmationScreen = goToConfirmationScreen;
        /**
         * try to draft player, else remove them
         * @type {playerAction}
         */
        vm.playerAction = playerAction;

        /**
         * try to draft player, else remove them
         * @type {playerAction}
         */
        vm.isDrafted = isDrafted;

        /**
         * removes pick from the my_pack section
         * @type {removePick}
         */
        vm.removePick = removePick;
        /**
         * applies the currently selected filter
         */
        vm.applyFilter = applyFilter;

        vm.search = search;

        /**
         * adds more players to the display collection
         * @type {showMorePlayers}
         */

        vm.showMorePlayers = showMorePlayers;

        /**
         * shows the search input
         * @type {toggleSearch}
         */

        vm.toggleSearch = toggleSearch;

        /**
         * set is_window_open value
         */

        vm.is_window_open = null;



        /**
         * player position lookup to give a description to the positions in the available players
         * @type {Object}
         * @private
         * 1B; 2B; 3B; C; CF; DH; IF; LF; OF; P; PH; PR; RF; RP; SP; SS
         */

        var _playerPositionLookup = {
            "1B": "1st Baseman",
            "2B": "2nd Baseman",
            "3B": "3rd Baseman",
            "C": "Catcher",
            "CF": "Center Field",
            "DH": "Designated Hitter",
            "IF": "-IF",
            "LF": "Left Field",
            "OF": "-OF",
            "P": "Pitcher",
            "PH": "Pinch Hitter",
            "PR": "Pinch Runner",
            "RF": "Right Field",
            "RP": "Relief-pitcher",
            "SP": "Starting-pitcher",
            "SS": "Short Stop",
        };

        vm.playerMsg = 'Loading...';

        _initialize();

        /**
         * mins until open
         */

        vm.mins_until_open = null;

        function getTimeRemaining(endtime) {
          var t = Date.parse(endtime) - Date.parse(new Date());
          var seconds = Math.floor((t / 1000) % 60);
          var minutes = Math.floor((t / 1000 / 60) % 60);
          var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
          var days = Math.floor(t / (1000 * 60 * 60 * 24));
          return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
          };
        }

        function initializeClock(id, endtime) {
          var clock = document.getElementById(id);
          var daysSpan = clock.querySelector('.days');
          var hoursSpan = clock.querySelector('.hours');
          var minutesSpan = clock.querySelector('.minutes');
          var secondsSpan = clock.querySelector('.seconds');

          function updateClock() {
            var t = getTimeRemaining(endtime);

            daysSpan.innerHTML = t.days;
            hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.total <= 0) {
              clearInterval(timeinterval);
            }
          }

          updateClock();
          var timeinterval = setInterval(updateClock, 1000);
        }



        /**
         * loads api data, picks, and available players, as well as calculates salary surplus
         * @returns {*}
         */

        function _initialize() {
            return $q.all([
                    $user.getPicks()
                        .then(function(r) { return r;}, function(f) { return f || {}; }),
                    $players.get()
                ])
                .then(function(values) {
                    //  picks list from api, or empty array if pak doesn't exist yet
                    if (values.length ) {
                        var picks = values[0].picks || [],
                            //  list of available players
                            players = values[1],
                            //  budget for pak
                            amountToSpend = 17000,
                            //  this stores picked player ids into a quick lookup array and subtracts salaries
                            pickIds = picks.map(function(player) {
                                amountToSpend -= player.FanDuelSalary;
                                return player.id;
                            });
                    } else {
                        picks = new Array(3);
                        vm.playerMsg = 'No game for today.  Check back tomorrow!'
                    }
                    if (players.length ==0) {
                        vm.playerMsg = 'No players are available for selection. Check back next MLB game day!';
                    } else {
                        vm.playerMsg = 'Loading ' + players.length + ' players';
                    }

                    //  this stores pak id for making changes
                    vm.pakId = values[0]['3pak'];
                    //  keep array with 3 items so ngRepeat can do its thing
                    vm.picks = angular.extend([false, false, false], picks);
                    //  wire remaining salary to newly determined surplus
                    vm.remainingSalary = amountToSpend;
                    //  wire available players for list, adding the drafted boolean for picked players
                    _players = players
                        .map(function(player) {
                            player.drafted = pickIds.indexOf(player.id) !== -1;
                            player.show = true;
                            return player;
                        });
                    showMorePlayers();
                    //  populates the filter for player list
                    vm.playerPositions = _players
                        .reduce(function(coll, p) {
                            // var position = p.player.position;
                            var position = p.Position;
                            if(coll.indexOf(position) === -1 && !!_playerPositionLookup[position]) {
                                coll.push(position);
                            }
                            return coll;
                        }, [])
                        .map(function(p) {
                            return {
                                value: p,
                                text: _playerPositionLookup[p]
                            };
                        });
                });
        }
        /**
         * takes the next increment of players from master list and pushes them to the display list
         */
        function showMorePlayers() {
            var source = vm.filter === 'all' ? _players : _players.filter(function(p) { return p.show; });
            if(source.length > vm.players.length) {
                vm.players = vm.players
                    .concat(source.slice(vm.players.length, vm.players.length + _playersIncrement));
            }
        }
        /**
         * checks pick count and will send user to confirm screen if they have full 3pak
         */
        function goToConfirmationScreen() {
            if(vm.picks.some(function(p) { return !p; })) {
                $dialog.show({
                    title: 'Pick Error',
                    message: 'You must pick 3 players before continuing'
                });
            } else {
                $game.startContest(vm.pakId)
                .then(function (res) {
                    $state.go('confirm');
                }, function(res) {
                    $dialog.show({
                        title: 'Start Contest Error',
                        message: res.error
                    });
                })
            }
        }

        function isDrafted(player) {
            return player.drafted; 
        }
        /**
         * action fired when the user clicks the draft/remove action button as well as the x on the pick's avatar
         * @param player
         * @returns {*}
         */

        function playerAction(player) {
            if (player.locked)
                return "";
                 
            var id = player.id,
                addingPick = !_isPlayerInPicks(id),
                userMethod = $user[(addingPick ? 'make' : 'remove') + 'Pick'],
                onSuccess = addingPick ? _addPlayerToPicks : _removePlayerFromPicks,
                gameType = vm.filter === 'defensive' ? 2 : 1;
            console.log(id)
            return userMethod(id, vm.pakId, gameType)
                .then(function(res) {
                    onSuccess(res, player);
                }, _onPickChangeError);
        }

        /**
         * shortcut to remove a pick using the playerAction method
         * @param pick
         */

        function removePick(pick) {
            var player = Object;
            _players.map(function(p) {
                if(p.id === pick.id) player = p
            });
            if ($.isEmptyObject(player)) {
                var id = pick.id;
                player = pick;
            } else {
                var id = player.id;
            }
            var userPickRemove = $user['removePick'];

            // vm.playerAction(player);
            return userPickRemove(id, vm.pakId, pick.api_type)
                .then(function(res) {
                    _removePlayerFromPicks(res, player);
                }, _onPickChangeError);
        }

        /**
         * parses api response for adding/removing players, handles errors
         * @param res
         * @returns {*}
         * @private
         */

        function _onPickChangeError(res) {
            $dialog.show({
                title: 'Pick Error',
                message: res.error
            });
        }

        /**
         * convenience function to see if player is already in picks
         * @param playerId
         * @returns {boolean}
         * @private
         */

        function _isPlayerInPicks(id) {
            return vm.picks.some(function(player) {
                return !!player && player.id === id;
            });
        }

        /**
         * this happens the api has added a player, it updates ui
         * @param player
         * @private
         */

        function _addPlayerToPicks(res, player) {
            player.drafted = true;
            vm.remainingSalary -= player.FanDuelSalary;
            _setPakId(res["3pak"])
            for(var i = 0, len = vm.picks.length; i < len; i++) {
                if(!vm.picks[i]) {
                    vm.picks[i] = player;
                    break;
                }
            }
        }


        function _setPakId(pakId) {
            if (!vm.pakId) {
                vm.pakId = pakId;
            }
        }


        /**
         * this happens after the api has removed a player, this updates the ui
         * @param player
         * @private
         */
        function _removePlayerFromPicks(res, player) {
            // get index of remved player in currently slected players
            var i = vm.picks.map(function(p) {
                if (p && p.PlayerID) {
                    return p.PlayerID;
                } else {
                    return 'NA';
                }
                return p.PlayerID;
            }).indexOf(player.PlayerID);
            vm.picks[i] = null;
            player.drafted = false;
            vm.remainingSalary += player.FanDuelSalary;
        }
        /**
         * when the filter select changes this adjusts the show property on players
         */
        function applyFilter() {
            //  apply filter to source list
            _players.forEach(_applyFilterToPlayer);
            //  clear out old display list
            vm.players = [];
            if(vm.filter === 'defensive') {
                $teams.getTeams()
                    .then(function(teams) {
                        vm.players = teams;
                        vm.playerMsg = vm.players.length == 0 ? 'No players are available for selection.' : '';
                    });
            } else {
                //  add in next batch of players to display
                showMorePlayers();
            }
        }

        /**
         * filters the players to find relevant names
         */
        function search() {
            var query = vm.query.toLowerCase();
                vm.players = _players
                    .filter(function(p) {
                        return p.Name.toLowerCase().indexOf(query) > 0 || p.displayName.toLowerCase().indexOf(query) > 0;
                    });
            // var regex = new RegExp(vm.query.toLowerCase());
            //     vm.players = _players
            //         .filter(function(p) {
            //             return regex.test(p.player.Name.toLowerCase()) || regex.test(p.displayName.toLowerCase());
            //         });
        }
        /**
         * toggles the search bool and clears the filters
         */
        function toggleSearch() {
            vm.showingSearch = !vm.showingSearch;
            if(vm.showingSearch) {
                vm.filter = 'all';
            } else {
                vm.query = '';
            }
            applyFilter();
        }
        /**
         * named function for applying filter to players collection
         * @param p
         * @private
         */
        function _applyFilterToPlayer(p) {
            p.show = vm.filter === 'all' || p.Position === vm.filter;
        }

        /**
         * named function for applying is_window_open value to players collection view before show playere list
         * @param p
         * @private
         */


        PickWindowService.getPickWindow()
            .then(function(pickwindow) {
                    vm.is_window_open = pickwindow.window_is_open;
                    if (!vm.is_window_open) {
                        vm.mins_until_open = pickwindow.mins_until_open;
                        vm.wednesday = pickwindow.wednesday;

                        var deadline = new Date(vm.wednesday);
                        initializeClock('clockdiv', deadline);
                    }
            });
    }
}());
