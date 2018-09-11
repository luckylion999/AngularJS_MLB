(function() {
    'use strict';

    angular.module('3pak')
        .service('$teams', TeamsService);

    function TeamsService($api) {
        var _teamColors = {
            "Arizona Cardinals": "#9B2743",
            "Atlanta Falcons": "#BD0D18",
            "Baltimore Ravens": "#280353",
            "Buffalo Bills": "#00338D",
            "Carolina Panthers": "#0088CE",
            "Chicago Bears": "#DD4814",
            "Cincinnati Bengals": "#FB4F14",
            "Cleveland Browns": "#FE3C00",
            "Dallas Cowboys": "#0D254C",
            "Denver Broncos": "#FB4F14",
            "Detroit Lions": "#006DB0",
            "Green Bay Packers": "#203731",
            "Houston Texans": "#02253A",
            "Indianapolis Colts": "#003B7B",
            "Jacksonville Jaguars": "#006778",
            "Kansas City Chiefs": "#B20032",
            "Miami Dolphins": "#008D97",
            "Minnesota Vikings": "#3B0160",
            "New England Patriots": "#C80815",
            "New Orleans Saints": "#D3A205",
            "New York Giants": "#192F6B",
            "New York Jets": "#0C371D",
            "Oakland Raiders": "#000000",
            "Philadelphia Eagles": "#003B48",
            "Pittsburgh Steelers": "#000000",
            "LosAngeles Rams": "#13264B",
            "Los Angeles Chargers": "#0C2340",
            "San Francisco 49ers": "#AF1E2C",
            "Seattle Seahawks": "#002244",
            "Tampa Bay Buccaneers": "#D60A0B",
            "Tennessee Titans": "#648FCC",
            "Washington Redskins": "#773141"
        },
            _teamsPromise = null;

        return {
            getTeams:        getTeams,
            assignTeamColor: assignTeamColor
        };

        function getTeams() {
            if(!_teamsPromise) {
                _teamsPromise = $api.get('teamgames/')
                    .then(function(response) {
                        var resCopy = response.results.slice(0);
                        resCopy.sort(function(a,b) {
                            return b.FanDuelSalary-a.FanDuelSalary;
                        });
                        return resCopy.map(_normalizeTeamData);
                    });
            }
            return _teamsPromise;
        }

        function _normalizeTeamData(team) {
            team = assignTeamColor(team);
            team = _addGameInfo(team);
            team = _shrinkPPG(team);
            return team;
        }

        function assignTeamColor(team) {
            team.displayName = team.team.City + ' ' + team.team.Name;
            team.color = _teamColors[team.displayName];
            return team;
        }

        function _addGameInfo(team) {
            var teams = team.game.vs.split(' ');
            team.game.home = teams[0];
            team.game.away = teams[2];
            team.isHome = team.team.abbr === team.game.home;
            team.isAway = team.team.abbr === team.game.away;
            return team;
        }

        function _shrinkPPG(team) {
            team.originalFantasyPointsFanDuelProjection = team.FantasyPointsFanDuelProjection;
            team.FantasyPointsFanDuelProjection = Math.round(team.FantasyPointsFanDuelProjection * 100) / 100;
            return team;
        }
    }
}());
