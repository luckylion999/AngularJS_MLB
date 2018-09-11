(function() {
    'use strict';

    angular.module('3pak')
        .controller('RuleController', RuleController);

    function RuleController($state, $storage) {
        var vm = this;

        vm.updateRuleScreenData = function() {
            $storage.setRuleScreenData(true);
            $state.go('register');
        };
        
    }
}());