(function() {
    'use strict';

    angular.module('3pak')
        .config(configRoutes)
        .factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
                return {
                    response: function(response){
                        if (response.status === 401) {
                            console.log("Response 401");
                        }
                        return response || $q.when(response);
                    },
                    responseError: function(rejection) {
                        if (rejection.status === 401) {
                            console.log("Response Error 401",rejection);
                            // invalidate any out of date token
                            localStorage['3pak-user'] = '';
                            $location.path('/register').search('returnTo', $location.path());
                        }
                        return $q.reject(rejection);
                    }
                };
            }])
        .config(['$httpProvider',function($httpProvider) {
            //Http Intercpetor to check auth failures for xhr requests
            $httpProvider.interceptors.push('authHttpResponseInterceptor');
        }]);

    /**
     * config for wiring up URLs
     * @param $stateProvider
     * @param $urlRouterProvider
     */

    function configRoutes($stateProvider, $urlRouterProvider) {


        //  forward to splash screen on landing
        $urlRouterProvider.otherwise("/loading");
        //  map views
        $stateProvider
            .state('splash', {
                url: '/loading',
                templateUrl: 'components/splashscreen/splashscreen.tpl.html',
                controller: 'SplashScreenController'
            })
            // .state('age-check', {
            //     url: '/age-check',
            //     templateUrl: 'components/age-check/age-check.tpl.html',
            //     controller: 'AgeCheckController',
            //     controllerAs: 'age'
            // })
            // .state('rule-screen', {
            //     url: '/rule-screen',
            //     templateUrl: 'components/rule/rule.tpl.html',
            //     controller: 'RuleController',
            //     controllerAs: 'rule'
            // })
            .state('register', {
                url: '/register',
                templateUrl: 'components/create-account/create-account.tpl.html',
                controller: 'CreateAccountController',
                controllerAs: 'register'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'components/login/login.tpl.html',
                controller: 'LoginController',
                controllerAs: 'login'
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'components/forgot/forgot.tpl.html',
                controller: 'ForgotController',
                controllerAs: 'forgot'
            })            
            .state('draft', {
                url: '/draft',
                templateUrl: 'components/draft-pak/draft-pak.tpl.html',
                controller: 'DraftPakController',
                controllerAs: 'game'
            })
            .state('confirm', {
                url: '/confirm',
                templateUrl: 'components/confirmation/confirmation.tpl.html',
                controller: 'ConfirmationController',
                controllerAs: 'confirm'
            })
            .state('other-games', {
                url: '/other-games',
                templateUrl: 'components/other-games/other-games.tpl.html',
                controller: 'OtherGamesController',
                controllerAs: 'games'
            })
            .state('challenge', {
                url: '/challenge',
                templateUrl: 'components/challenge/challenge.tpl.html',
                controller: 'ChallengeController',
                controllerAs: 'challenge'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'components/dashboard/dashboard.tpl.html',
                controller: 'DashboardController',
                controllerAs: 'dashboard'
            })
            .state('purl', {
                url: '/dashboard/:userToken',
                templateUrl: 'components/splashscreen/splashscreen.tpl.html',
                controller: 'SplashScreenController'
            });
    }
}());