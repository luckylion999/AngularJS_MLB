(function() {
    'use strict';

    angular.module('3pak')
        .service('$game', GameService);

    function GameService($api) {
        return {
            getDetails: getDetails,
            startContest: startContest
        };

        function getDetails(id) {
            return $api.get('game_details/?3pak=' + id);
        }

        function startContest(id) {
            return $api.get('start_contest/?3pak=' + id);
        }
    }
}());