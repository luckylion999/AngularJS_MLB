(function() {
    'use strict';

    angular.module('3pak')
        .controller('ChallengeController', ChallengeController);

    function ChallengeController($state, $dialog, $api) {
        var vm = this;
        /**
         * nav buttons to fire off emails
         * @type {*[]}
         */
        vm.navButtons = [
            {
                text: 'Let\'s Play',
                action: sendEmailChallenges
            },
            {
                text: 'Cancel',
                target: 'dashboard',
                faded: true
            }
        ];

        /**
         * send email challenges
         * @todo use $api to do this.
         */
        function sendEmailChallenges() {
            if(vm.friend1 || vm.friend2 || vm.friend3) {
                var inviteData = {};
                if (vm.friend1) {
                    inviteData['email1'] = vm.friend1;
                }
                if (vm.friend2) {
                    inviteData['email2'] = vm.friend2;
                }
                if (vm.friend3) {
                    inviteData['email3'] = vm.friend3;
                }
                return $api.post('invite_user/', inviteData, true, true)
                .then(function(response) {
                    if(!!response.results && response.results.length > 1) {
                        $dialog.show({
                            title: 'Unknown Error',
                            message: 'Unknown error occurred. Please try again.'
                        })
                    } else {
                        heap.track('Email Challenge Custom', {
                            count: Object.getOwnPropertyNames(inviteData).length, 
                            item: inviteData
                        });
                        $state.go('dashboard');
                    }
                }, function onError(res) {
                    console.log(res);
                    $dialog.show({
                        title: 'Email Error',
                        message: 'Please enter valid email address.'
                    })
                });
            } else {
                $dialog.show({
                    title: 'Missing Info',
                    message: "Please enter your friends' email addresses and try again or Cancel."
                })
            }
        }
    }
}());
