(function () {
    'use strict';

    angular
        .module('3pak')
        .service('$geoLocation', GeoLocationService);

    /**
     * service for updating geolocation
     * @returns {{getCurrentPosition: getCurrentPosition}}
     * @constructor
     */
    function GeoLocationService($window, $dialog, $api, $storage, $timeout) {
        var watchID = null;
        var lat = null;
        var lon = null;
        return {
            getCurrentPosition:     getCurrentPosition
        };     

        function getCurrentPosition() {
            watchID = $window.navigator.geolocation.watchPosition(onSuccess, onError);
        }       
    
        function onSuccess(position) {
            
            var str = 'Latitude: ' + position.coords.latitude + 'Longitude: ' + position.coords.longitude;            
            if(lat != position.coords.latitude && lon != position.coords.longitude) {
                // console.log(str);                
                $api.post('user_in_fence/', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }, true, true)
                    .then(function(res) {
                        if(!res.success && !!res.error) {
                            throw res;
                        }
                    if (res.msg.length) {
                        $dialog.show({
                            title: res.msg,
                            //message: str
                        });      
                    }
                });
            }            
            lat = position.coords.latitude;
            lon = position.coords.longitude;
                
        }
        function onError(error) {
            if  (error.code == error.PERMISSION_DENIED){
                $dialog.show({
                    message: "You have chosen not to allow location sharing. Please change your settings."
                });
                clearWatch();
                $timeout(getCurrentPosition, 10000);
            } else {
                alert('Code: ' + error.code + ' Message:' + error.message);
            }         
        }

        function clearWatch() {
            if (watchID != null) {
                $window.navigator.geolocation.clearWatch(watchID);
                watchID = null;
            }
        }

    }
    
})();
