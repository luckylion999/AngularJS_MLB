(function() {
    'use strict';

    angular.module('3pak')
        .controller('LoginController', LoginController);

    function LoginController($user, $dialog, $state, PickWindowService) {
        var vm = this;

        vm.authenticate = authenticate;

        function authenticate() {
            if(!vm.username || !vm.password) {
                $dialog.show({
                    title: 'Login Error',
                    message: 'Enter your username and password and try again'
                })
            } else {
                $user.login({
                    username: vm.username,
                    password: vm.password
                })
                    .then(function() {
                        heap.identify(vm.username);
                        $state.go('dashboard');
                    }, function(err) {
                        $dialog.show({
                            title: 'Login Error',
                            message: err.errorMessage || 'Invalid user credentials entered. Please try again.'
                        });
                    });
            }
        }
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