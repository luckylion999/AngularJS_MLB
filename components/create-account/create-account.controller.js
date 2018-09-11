(function() {
    'use strict';

    angular.module('3pak')
        .controller('CreateAccountController', CreateAccountController);

    function CreateAccountController($user, $dialog, $state, CustomerProfileService, PickWindowService) {
        var vm = this;
        /**
         * attempts to authenticate user if hideEmail is set else creates user
         * @type {createUser}
         */
        vm.createUser = createUser;
        /**
         * User object for easy passing to the userService
         * @type {{username: string, email: string, password: string}}
         */
        vm.user = {
            username: '',
            email: '',
            password: ''
        };
        /**
         * promo blurb for signing up
         * @type {string}
         */
        vm.promoBlurb = 'PROMO BLURB';

        function createUser() {
            if(!!vm.user.username && !!vm.user.password && !!vm.user.email) {
                return $user.create(vm.user)
                    .then(_goToDrafts, _showAuthError);
            } else {
                $dialog.show({
                    title: 'Missing Info',
                    message: 'Please enter your username, email, and password and try again.'
                })
            }
        }

        /**
         * moves user to the draft-pak screen
         * @private
         */
        function _goToDrafts() {
            $state.go('draft');
        }

        /**
         * shows the appropriate dialog popup
         * @private
         */
        function _showAuthError(err) {
            var message = {
                title: 'Could not add user',
                message: err.errorMessage || 'Please try again.'
            };
            $dialog.show(message);
        }

        CustomerProfileService.getCustomerProfile()
            .then(function(profile) {
                vm.promoBlurb = profile.promoBlurb;
                vm.prize1 = profile.prizes.prize1;
                vm.prize2 = profile.prizes.prize2;
                vm.prize3 = profile.prizes.prize3;
            });
        // PickWindowService.getPickWindow()
        //     .then(function(pickwindow) {
        //         if(pickwindow.demo_mode){
        //             $dialog.show({
        //                 title: 'Welcome to 3PAK DEMO mode',
        //                 message: 'The NFL season is over, but feel free to play a simulated game of 3PAK just for FUN.'
        //             })
        //         }
        //     });
    }
}());