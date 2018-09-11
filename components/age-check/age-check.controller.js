(function() {
    'use strict';

    angular.module('3pak')
        .controller('AgeCheckController', AgeCheckController);

    function AgeCheckController($dialog, $state, $storage, CustomerProfileService) {
        var vm = this;
        /**
         * collection of month names
         * @type {string[]}
         */
        vm.months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        /**
         * number of years to go back
         * @type {Array}
         */
        vm.years = new Array(100);
        /**
         * slice of years array so we don't need to create a new one
         * @type {Array.<T>}
         */
        vm.days = vm.years.slice(0, 31);
        /**
         * birth month
         * @type {null}
         */
        vm.month = null;
        /**
         * birth day (of the week)
         * @type {null}
         */
        vm.day = null;
        /**
         * birth year
         * @type {null}
         */
        vm.year = null;
        /**
         * confirms birthday is good enough for entry
         */
        vm.validateAge = validateAge;
        /**
         * minimum age to get in
         */
        // vm.minAge = MINIMUM_AGE;
        /**
         * to be populated by the name entered on the customer profile
         * @type {null}
         */
        vm.customerName = '';

        function validateAge() {
            if(!vm.month || !vm.day || !vm.year) {
                $dialog.show({
                    title: 'Birthday Not Set',
                    message: 'Please enter your birthday using the month, day, and year selectors.'
                });
            } else {
                var birthday = new Date(vm.month + '/' + vm.day + '/' + vm.year);
                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);
                var ofAge = (today.getTime() - birthday.getTime()) / 1000 / 365 / 24 / 60 / 60 >= vm.minAge;
                if(ofAge) {
                    $storage.setUserAge(ofAge);

                    if ($storage.getRuleScreenData()) {
                        $state.go('register');
                    } else {
                        $state.go('rule-screen');
                    }


                } else {
                    $dialog.show({
                        title: 'Must Be ' + vm.minAge + ' or Older',
                        message: 'Sorry but you must be at least ' + vm.minAge + ' years of age to use 3pak'
                    });
                }
            }
        }

        CustomerProfileService.getCustomerProfile()
            .then(function(profile) {
                vm.customerName = profile.happy_name;
                vm.minAge = profile.min_age_to_play;
            });
    }
}());