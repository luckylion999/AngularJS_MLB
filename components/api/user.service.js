(function() {
    'use strict';

    angular.module('3pak')
        .service('$user', UserService);

    function UserService($api, $storage, $teams) {
        /**
         * user token for making changes to user session
         * @type {string}
         */
        var _userToken = $storage.getUserToken() || null;

        return {
            create:          create,
            getPicks:        getPicks,
            getDashboard:    getDashboard,
            isAuthenticated: isAuthenticated,
            login:           login,
            forgot:          forgot,
            logout:          logout,
            makePick:        makePick,
            removePick:      removePick,
            setUserToken:    setUserToken
        };

        /**
         * creates user in 3pak system
         * @param user Object {username: {String}, email: {String}, password: {String}}
         * @returns {Q.Promise}
         */
        function create(user) {
            user['customer'] = $storage.getCustomer();
            return $api.post('users/', user)
                .then(function(response) {
                    if(!!response.results && response.results.length > 1) {
                        response.errorMessage = 'Unknown error occurred.';
                        throw response;
                    } else {
                        // if user was created successfully, it will get token
                        heap.identify(response.username);
                        setUserToken(response.AUTHTOKEN);;
                    }
                }, function onError(res) {
                    var data = res.data || {};
                    if(!!data.username && !!data.username.length) {
                        res.errorMessage = 'Nickname: ' + data.username[0];
                    } else if(!!data.email && !!data.email.length) {
                        res.errorMessage = 'Email: ' + data.email[0];
                    } else {
                        res.serverError = true;
                        res.errorMessage = 'Server error occurred. Please try again.';
                    }
                    throw res;
                });
        }

        /**
         * passes user details to change the password
         * @param user Object {username: {String}, email: {String}?, password: {String}}
         * @returns {Q.Promise}
         */
        function forgot(user) {
            console.log(user.username + 'service');
            // user['customer'] = $storage.getCustomer() || 'app';
            // return $api.post('api-token-auth/', user)
            //     .then(function(user) {
            //         setUserToken(user.token);
            //     }, function(res) {
            //         var data = res.data;
            //         if(!!data.non_field_errors && !!data.non_field_errors.length) {
            //             res.errorMessage = data.non_field_errors.pop();
            //         }
            //         res.loginError = true;
            //         throw res;
            //     });
        }

        function getDashboard(id) {
            return $api.post('dashboard/', {"3pak": id}, true, true);
        }

        /**
         * gets current user's picks (pak)
         * @returns {Q.Promise|*}
         */
        function getPicks() {
            return $api.get('my_picks/', true)
                .then(_colorizeTeamPicks)
                .catch(function(response) {
                  console.error('Unable to get picks', response);
                });
        }


        function _colorizeTeamPicks(response) {
            if(response.picks.length) {
                response.picks = response.picks
                    .map(function(p) {
                        if(p.api_type === 2) {
                            return $teams.assignTeamColor(p);
                        }
                        return p;
                    });
            }
            return response;
        }

        /**
         * tells app if user is already authenticated
         * @returns {boolean}
         */
        function isAuthenticated() {
            return !!_userToken;
        }

        /**
         * passes user details to api to receive user-token and verify account credentials
         * @param user Object {username: {String}, email: {String}?, password: {String}}
         * @returns {Q.Promise}
         */
        function login(user) {
            user['customer'] = $storage.getCustomer();
            return $api.post('api-token-auth/', user)
                .then(function(user) {
                    setUserToken(user.token);
                }, function(res) {
                    var data = res.data;
                    if(!!data.non_field_errors && !!data.non_field_errors.length) {
                        res.errorMessage = data.non_field_errors.pop();
                    }
                    res.loginError = true;
                    throw res;
                });
        }

        function logout() {
            $storage.setUserToken('');
        }

        function setUserToken(token) {
            _userToken = token;
            $storage.setUserToken(_userToken);

            // // set user token with customerId as key
            // var customerId = $storage.getCustomer() || 'app';
            //
            // if (customerId) {
            //     var info = $storage.getCustomerData(customerId);
            //
            //     if (!info)
            //         info = {};
            //
            //     info['user-token'] = _userToken;
            //     $storage.setCustomerData(customerId, info);
            // }
        }

        /**
         * picks player over api
         * @param id
         * @param ignore - because removePick should work with the same arguments
         * @param gameType - api type
         * @returns {*}
         */
        function makePick(id, ignore, gameType) {
            return $api.post('make_pick/', {
                type: gameType || 1,
                id: id
            }, true, true)
                .then(_onPickChange);
        }

        /**
         * removes player from pack over api
         * @param id
         * @param pakId
         * @param gameType
         * @returns {*}
         */
        function removePick(id, pakId, gameType) {
            return $api.post('remove_pick/', {
                "3pak": pakId,
                api_type: gameType || 1,
                id: id
            }, true, true)
                .then(_onPickChange);
        }

        /**
         * interprets api response from pick add/remove
         * @param res
         * @returns {*}
         * @private
         */
        function _onPickChange(res) {
            if(!res.success && !!res.error) {
                throw res;
            }            
            return res;
        }
    }
}());