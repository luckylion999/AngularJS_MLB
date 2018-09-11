(function() {
    'use strict';

    angular.module('3pak')
        .controller('ForgotController', ForgotController);

    function ForgotController($user, $dialog, $state, PickWindowService) {
        var vm = this;

        vm.authenticate = authenticate;

        function authenticate() {
            if(!vm.username || !vm.password || !vm.confirm_password) {
                $dialog.show({
                    title: 'Change password Error',
                    message: 'Complete the fields and try again'
                })
            } else if(vm.password != vm.confirm_password) {
                $dialog.show({
                    title: 'Password not match!',
                    message: 'Please check the password'
                })
            } else {
                $user.forgot({
                    username: vm.username,
                    password: vm.password,
                    confirm_password : vm.confirm_password
                })
                    // .then(function() {
                    //     console.log(vm.username);
                    //     // heap.identify(vm.username);
                    //     // $state.go('login');
                    // }, function(err) {
                    //     $dialog.show({
                    //         title: 'Change password Error',
                    //         message: err.errorMessage || 'Invalid user credentials entered. Please try again.'
                    //     });
                    // });
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