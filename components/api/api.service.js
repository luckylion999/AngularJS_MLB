(function() {
    'use strict';

    angular.module('3pak')
        .service('$api', ApiService);

    /**
     * Api Service for all backend requests
     * @param $http
     * @param $storage
     * @param API_KEY
     * @returns {Object}
     * @constructor
     */
    function ApiService($http, API_KEY, $storage) {
        /**
         * Server location for api requests
         * @type {string}
         */
        // var _URL_PREFIX = 'https://mlb.3pakapi.net/';
        var _URL_PREFIX = 'http://localhost:8000/';

        return {
            getUrl: function() {
                return _URL_PREFIX;
            },
            get:  get,
            post: post
        };

        /**
         * request transformer for simplifying api usage within the ng-app
         * @param url
         * @param data
         * @param useUserToken {Boolean} - uses user's token for auth
         * @param useParams
         * @returns {Q.Promise} - that'll massage the data response
         * @private
         */
        function _apiRequest(url, _data, useUserToken, useParams) {
            return $http({
                url: _URL_PREFIX + url,
                data: _prepareData(_data, useParams),
                method: !!_data ? 'POST' : 'GET',
                headers: {
                    Authorization: 'Token ' + (!useUserToken ? API_KEY : $storage.getUserToken()),
                    "Content-Type": 'application/' + (useParams ? 'x-www-form-urlencoded' : 'json')
                }
            })
                .then(function onSuccess(r) {
                    return r.data;
                });
        }

        function _prepareData(data, serialize) {
            if(!!data && !!serialize) {
                return $.param(data);
            }

            return data;
        }

        /**
         * fires a GET call to specified url
         * @param url
         * @param useUserToken - uses stored user token instead of system apiKey
         * @returns {Q.Promise}
         */
        function get(url, useUserToken) {
            return _apiRequest(url, null, !!useUserToken)
                .then(_validateResponse);
        }

        function _validateResponse(response) {
            if(!!response && !!response.error) {
                throw response;
            }
            return response;
        }

        /**
         * fires a POST with data to specified url
         * @param url
         * @param data - required, if null request will be interpreted as a GET
         * @param useUserToken - ^^
         * @param useParams
         * @returns {Q.Promise}
         */
        function post(url, data, useUserToken, useParams) {
            return _apiRequest(url, data, !!useUserToken, !!useParams)
                .then(_validateResponse);
        }
    }
}());
