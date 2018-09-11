(function() {
    'use strict';

    angular.module('3pak')
        .controller('SplashScreenController', SplashScreenController);

    /**
     * SplashScreenCtrl - shows splash screen while attempting to pre-load necessary data then sends user to next step
     * @param $user
     * @param $timeout
     * @param $state
     * @param $players
     * @constructor
     */
    function SplashScreenController($user, $timeout, $state, $players, $stateParams,  $storage) {
        /**
         * the longest we'll display the splash screen for now
         * @type {number}
         */
        /**
         * where the user will go after splash screen's timer
         * @type {string}
         * @default login because the user will need to create user/login on first visit
         */
        var targetState;
        // if ($storage.getUserAge()) {
            // if ($storage.getRuleScreenData()){
                targetState = 'register';
            // }
            // else {
            //     targetState = 'rule-screen';
            // }

        // } else {
        //     targetState = 'age-check';
        // }

        _initialize();

        /**
         * check if logged in, send to draft screen else login
         */
        function _initialize() {

            // var playersPromise = $players.get();
            if($stateParams && !!$stateParams.userToken) {
                $user.setUserToken($stateParams.userToken);
            }

            if($user.isAuthenticated()) {
                var playersPromise = $players.get();
                if ($storage.getNextUrl()) {
                    // console.log('splash: next url found', $storage.getNextUrl());
                    setTimeout(function () {
                        $state.go($storage.getNextUrl());
                    }, 3500);
                } else {
                    // console.log('splash: next url not found');
                    playersPromise.then(function() {
                        return $user.getPicks();
                    }, function(errResponse) {
                        console.log(errResponse);
                        window.location = 'http://3pak.com';
                    })
                    .then(function(picks) {
                        if(picks.picks.length === 3) {
                            targetState = 'dashboard';
                        } else {
                            targetState = 'draft';
                        }
                    }, function(errResponse) {
                        console.log(errResponse);
                        window.location = 'http://3pak.com';
                    })
                    .then(_nextScreen);
                }
            } else {
                _nextScreen();
            }
        }

        /**
         * sends user to login/create user screen
         * this is the default destination
         */
        function _nextScreen() {
            console.log('nextScreen called');
            setTimeout(function () {
                $state.go(targetState);
            }, 2500);

        }
    }
}());