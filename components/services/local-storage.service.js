(function() {
    'use strict';

    angular.module('3pak')
        .service('$storage', LocalStorageService);

    /**
     * simple service for setting/getting simple and complex values in LocalStorage
     * @param $window
     * @returns {{getUserToken: getUserToken, setUserToken: setUserToken}}
     * @constructor
     */
    function LocalStorageService($window) {
        /**
         * key to store user token in localStorage
         * @type {string}
         */
        var USER_TOKEN_KEY = '3pak-user';
        var USER_AGE = '3pak-user-age';
        var HOME_ADDED = '3pak-user-home';
        var CURRENT_WEEK = '3pak-current-week';
        var PLAYER_DATA = '3pak-player-data';
        var CUSTOMER = '3pak-customer';
        var RULE_SCREEN = '3pak-rule-screen';
        var START_DAY = '3pak-start-day';
        var END_DAY = '3pak-end-day';
        var CURRENT_URL = '3pak-current-url';
        var NEXT_URL = '3pak-next-url';


        //  exported methods
        return {
            getUserToken: getUserToken,
            setUserToken: setUserToken,
            getUserAge: getUserAge,
            setUserAge: setUserAge,
            getCurrentWeek: getCurrentWeek,
            setCurrentWeek: setCurrentWeek,
            getStartDay: getStartDay,
            setStartDay: setStartDay,
            getEndDay: getEndDay,
            setEndDay: setEndDay,
            getPlayerData: getPlayerData,
            setPlayerData: setPlayerData,
            isHomeAdded: isHomeAdded,
            homeAdded: homeAdded,
            getCustomer: getCustomer,
            setCustomer: setCustomer,
            setCustomerData: setCustomerData,
            getCustomerData: getCustomerData,
            setRuleScreenData: setRuleScreenData,
            getRuleScreenData: getRuleScreenData,

            setCurrentUrl: setCurrentUrl,
            getCurrentUrl: getCurrentUrl,
            setNextUrl: setNextUrl,
            getNextUrl: getNextUrl,
        };

        /**
         * convenience method for getting items out of LS
         * @todo add json parsing for complex objects
         * @param key
         * @private
         */
        function _get(key) {
            return $window.localStorage.getItem(key);
        }

        /**
         * convenience method for setting items in LS
         * @todo ^^
         * @param key
         * @param value
         * @private
         */
        function _set(key, value) {
            return $window.localStorage.setItem(key, value);
        }


        function getCurrentUrl() {
            return _get(CURRENT_URL);
        }

        function setCurrentUrl(value) {
            return _set(CURRENT_URL, value);
        }

        function getNextUrl() {
            return _get(NEXT_URL);
        }

        function setNextUrl(value) {
            return _set(NEXT_URL, value);
        }


        /**
         * quick call to get stored user token
         * @returns {*}
         */
        function getUserToken() {

            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();

            var info = this.getCustomerData(customerId);

            return info ? info[USER_TOKEN_KEY] : null;

            // return _get(USER_TOKEN_KEY);
        }

        /**
         * quick call to save user token
         * @param token
         */
        function setUserToken(token) {

            // set user token with customerId as key
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();
            var info = this.getCustomerData(customerId);

            if (!info)
                info = {};

            info[USER_TOKEN_KEY] = token;
            this.setCustomerData(customerId, info);


            // _set(USER_TOKEN_KEY, token);
        }

        /**
         * quick call to get stored user age
         * @returns {*}
         */
        function getUserAge() {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();

            var info = this.getCustomerData(customerId);

            return info ? info[USER_AGE] : null;

            // return _get(USER_AGE);
        }

        /**
         * quick call to save user age
         * @param token
         */
        function setUserAge(token) {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();

            var info = this.getCustomerData(customerId);

            if (!info)
                info = {};

            info[USER_AGE] = token;
            this.setCustomerData(customerId, info);
        }

        /**
         * quick call to get rule screen data
         * @returns {*}
         */
        function getRuleScreenData() {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();

            var info = this.getCustomerData(customerId);

            return info ? info[RULE_SCREEN] : null;
        }

        /**
         * quick call to save rule screen data
         * @param token
         */
        function setRuleScreenData(showed) {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();

            var info = this.getCustomerData(customerId);

            if (!info)
                info = {};

            info[RULE_SCREEN] = showed;
            this.setCustomerData(customerId, info);
        }

        function getStartDay() {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();
            var info = this.getCustomerData(customerId);
            return info ? info[START_DAY] : null;
        }
        function setStartDay(d) {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();
            var info = this.getCustomerData(customerId);
            if (!info)
                info = {};
            info[START_DAY] = d;
            this.setCustomerData(customerId, info);
        }
        function getEndDay() {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();
            var info = this.getCustomerData(customerId);
            return info ? info[END_DAY] : null;
        }
        function setEndDay(d) {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();
            var info = this.getCustomerData(customerId);
            if (!info)
                info = {};
            info[END_DAY] = d;
            this.setCustomerData(customerId, info);
        }

        function getCurrentWeek() {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();
            var info = this.getCustomerData(customerId);
            return info ? info[CURRENT_WEEK] : null;
        }

        function setCurrentWeek(week) {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();
            var info = this.getCustomerData(customerId);
            if (!info)
                info = {};

            info[CURRENT_WEEK] = week;
            this.setCustomerData(customerId, info);
        }

        function getCustomer() {
            var res = _get(CUSTOMER);
            if (res && res.length > 0) {
                return JSON.parse(res);
            } else {
                return;
            }
        }

        function setCustomer(customer) {
            if (customer) {
                _set(CUSTOMER, JSON.stringify(customer));
            }
        }

        function getPlayerData() {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();

            var info = this.getCustomerData(customerId);

            return info ? info[PLAYER_DATA] : null;

            // var res = _get(PLAYER_DATA);
            // if (res && res.length > 0) {
            //     return JSON.parse(res);
            // } else {
            //     return;
            // }
        }

        function setPlayerData(playerData) {

            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();

            var info = this.getCustomerData(customerId);

            if (!info)
                info = {};

            info[PLAYER_DATA] = playerData;

            // if (playerData) {
            //     _set(PLAYER_DATA, JSON.stringify(playerData));
            // }
        }
        /**
         * quick call to get stored home info
         * @returns {*}
         */
        function isHomeAdded() {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();

            var info = this.getCustomerData(customerId);

            return info ? info[HOME_ADDED] : null;

            // return _get(HOME_ADDED);
        }

        /**
         * quick call to save home info
         * @param token
         */
        function homeAdded(token) {
            // var customerId = this.getCustomer() || 'app';
            var customerId = this.getCustomer();

            var info = this.getCustomerData(customerId);

            if (!info)
                info = {};

            info[HOME_ADDED] = token;
            console.log(info[HOME_ADDED])

            // _set(HOME_ADDED, token);
        }

        /**
         * get data from customer id
         * @param customerId
         * @returns {null}
         */

        function getCustomerData(customerId) {
            var res = _get(customerId);
            if (res && res.length > 0) {
                return JSON.parse(res);
            } else {
                return null;
            }
        }


        /**
         * set customer data
         * @param customer
         */
        function setCustomerData(customerId, data) {
            if (customerId) {
                _set(customerId, JSON.stringify(data));
            }
        }
    }
}());