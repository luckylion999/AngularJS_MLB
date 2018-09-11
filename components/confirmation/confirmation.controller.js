(function () {
    'use strict';

    angular
        .module('3pak')
        .controller('ConfirmationController', ConfirmationController);

    function ConfirmationController($storage) {
        var vm = this;

        vm.start_day = $storage.getStartDay();
        vm.end_day = $storage.getEndDay();

        /**
         * buttons for the footer nav-buttons
         * @type {*[]}
         */
        vm.navButtons = [
            {
                text: 'Challenge Three Friends',
                target: 'challenge'
            },
            {
                text: 'Show Me My Dashboard',
                target: 'dashboard'
            }
        ];
    }
})();