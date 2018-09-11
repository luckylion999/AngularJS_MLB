(function() {
    'use strict';

    angular.module('3pak')
        .service('PickWindowService', PickWindowService);

    function PickWindowService($api, $q) {
        var vm = {
            promise: null,
            window_is_open : null,
            mins_until_open: null
        };

        return {
            getPickWindow: getPickWindow
        };

        function getPickWindow() {
            if(!vm.promise) {
                vm.promise = $api.get('is_pick_window_open/')
                    .then(function (pickwindow) {
                        //  hooking up
                        vm.window_is_open = pickwindow.window_is_open;
                        if (!vm.is_window_open) {
                            vm.mins_until_open = pickwindow.mins_until_open;
                            vm.wednesday = pickwindow.wednesday;
                        }
                        vm.demo_mode = pickwindow.demo_mode
                        return vm;
                    });
            }

            return vm.promise;
        }
    }
}());
