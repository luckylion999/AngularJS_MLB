(function() {
    'use strict';

    angular.module('3pak')
        .service('$players', PlayersService);

    /**
     * handles players api actions
     * @param $api
     * @constructor
     */
    function PlayersService($api, $storage) {
        /**
         * storing the players request for future calls
         * @type {Q.Promise}
         * @private
         */
        var _playersPromise = null;
        /**
         * regex for parsing the first name
         * @type {RegExp}
         * @private
         */
        var _truncateNameRegex = /^(\w+)\s/;

        return {
            get:       getPlayers,
            transform: transformMLBPlayer
        };

        /**
         * gets list of current players for the active game
         * @returns {Q.Promise}
         */
        function getPlayers() {

            _playersPromise = $api.get('mlb_player_game_projections/', true)
                    .then(_parsePlayerResponse);

            return _playersPromise;
        }

        // function _check_week_or_fetch_player(response) {
        //     var localStoredData = $storage.getPlayerData();
        //     if (response.week == $storage.getCurrentWeek() && localStoredData) {                
        //         _playersPromise = localStoredData;
        //     } else {
        //         $storage.setCurrentWeek(response.week);
        //         $storage.setStartDay(response.start_day);
        //         $storage.setEndDay(response.end_day);
        //         _playersPromise = $api.get('mlb_player_games/')
        //             .then(_parsePlayerResponse);
        //     }
        //     return _playersPromise;
        // }

        /**
         * takes raw api response and adds necessary properties to keep ui up-to-date
         * @param response - json response from api
         * @returns {Array} - with massaged data
         * @private
         */

        function _parsePlayerResponse(response) {
            var result = null;
            if (response.results){ 
                result = response.results
                .map(transformMLBPlayer)
                .sort(_bySalary);
            }
            else {
                result = response
                .map(transformMLBPlayer)
                .sort(_bySalary);
            }      
            // console.log(result)      
            $storage.setPlayerData(result);
            return result;
        }

        /**
         * runs several data transforming functions to normalize player data for ui
         * @param player
         * @returns {*}
         * @private
         */

        function transformMLBPlayer(result) {          
            result = _truncateMLBName(result);
            result = _addMLBTeams(result)
            
            //  temporary until score works for dashboard
            //  this is for defensive ridiculously long ppgs
            result = _normalizeMLBPPG(result);
            return result;
        }     

        /**
         * determines teams by parsing api response data and giving a flag for bolding player's home team
         * @param player
         * @returns {*}
         * @private
         */        
        function _addMLBTeams(player) {           
            player.fromHome = player.HomeOrAway === "HOME";
            player.fromAway = player.HomeOrAway === "AWAY";
            return player;
        }

        /**
         * prettifies the player's name by reducing the first name to the first letter
         * @param player
         * @returns {*}
         * @private
         */
        function _truncateMLBName(result) {
            try {
                var firstName = result.Name.match(_truncateNameRegex)[1];
                result.displayName = result.Name.replace(firstName, firstName.substr(0, 1) + '.');
            } catch(ignore) {
                //  in the event that there's weirdness with the name
                result.displayName = result.Name;
            }
            return result;
        }
        

        function _normalizeMLBPPG(result) {
            var ppg = result.FantasyPointsFanDuel;
            result.FantasyPointsFanDuel = Math.round(ppg * 100) / 100;
            return result;
        }

        function _bySalary(a, b) {
            return b.FanDuelSalary - a.FanDuelSalary;
        }
    }

}());
