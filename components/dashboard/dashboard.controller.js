(function() {
    'use strict';


    angular.module('3pak')
        .controller('DashboardController', DashboardController);

    function DashboardController($user, $dialog, $q, $game, $players, $state, $window, CustomerProfileService, $storage, $interval, $api /*, $geoLocation*/) {
        var vm = this;
        /**
         * throw dashboard title in toolbar
         * @type {{title: {text: string}}}
         */
        vm.toolbar = {
            title: {
                text: 'Dashboard'
            }
        };
        /**
         * collection of picks for current 3pak
         * @type {Array}
         */
        vm.picks = new Array(3);
        /**
         * positions in current 3pak
         * @type {Array}
         */
        vm.url = $api.getUrl();
        vm.competitors = [];
        /**
         * current user's score
         * @type {number}
         */
        /**
         * nav button options for footer button
         * @type {*[]}
         */
        vm.navButtons = [
            {
                text: 'Edit PAK',
                target: 'draft'
            }
        ];
        vm.menuOpen = false;
        vm.logOut = logOut;
        vm.show = show;
        vm.main_profile = {};
        //console.log("Geo gets started!!");
        //$geoLocation.getCurrentPosition();
        /**
         * load the dashboard details
         */
        _initialize();
        /**
         * initialize the controller by getting current picks
         * then getting dashboard
         */
        function getDashboardFor3pak(id) {
            return $q.all([
                $user.getDashboard(id),
                $game.getDetails(id)
            ])
                .then(function(values) {
                    var dashboard = values[0],
                        details = values[1];
                    vm.score = dashboard.my_score;
                    vm.competitors = dashboard.positions;

                    console.log(vm.competitors);

                    if(!!vm.competitors.length) {
                        vm.place = vm.competitors.find(function(p) {
                            return p.pak_id === vm.pakId;
                        }).position;
                    }
                    $.each(vm.picks, function(k, v) {
                        $.each(dashboard.pick_details, function(kk, vv) {
                            if (v.PlayerID==vv.id) {
                                v['score'] = vv.score;
                            }
                        });
                    });
                    // vm.weeks = details.nfl_weeks.join(', ');
                });
        }


        function _initialize() {
            if ($storage.getNextUrl()) {
                $storage.setNextUrl('');
                return $user.getPicks()
                    .then(function(picks) {
                        if(picks.picks.length < 3) {
                            return $state.go('draft');
                        }
                        vm.picks = picks.picks
                            .map($players.transform);
                        vm.pakId = picks['3pak'];

                        return getDashboardFor3pak(vm.pakId);
                    }, function() {
                        $state.go('draft');
                    });
            } else {
                // console.log('gotot splash');
                $storage.setNextUrl('dashboard');
                $state.go('splash');
            }
        }

        function logOut() {
            $user.logout();
            $state.go('login');
        }

        function show(page) {
            var url,
                newTab = true;
            switch(page) {
                case 'rules':
                    url = 'https://s3-us-west-2.amazonaws.com/3pak/rules.html';
                    break;
                case 'terms':
                    url = 'https://s3-us-west-2.amazonaws.com/3pak/toc.html';
                    break;
                case 'policy':
                    url = 'https://s3-us-west-2.amazonaws.com/3pak/privacy-policy.html';
                    break;
                default:
                    url = 'mailto:support@play3pak.com';
                    newTab = false;
            }
            if(newTab) {
                $window.open(url, null, '_blank');
            } else {
                $window.location = url;
            }
        }

         

        CustomerProfileService.getCustomerProfile()
        .then(function(profile) {

           vm.advertisement = profile.advertisement;
           vm.advertisement_uri = profile.advertisement_uri;


            if (profile.advertisement_2) {
                vm.advertisement_2 = profile.advertisement_2;
                vm.advertisement_uri_2 = profile.advertisement_uri_2;
            }
           });
    }
}());
