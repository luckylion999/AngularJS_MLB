(function() {
    'use strict';

    angular.module('3pak')
        .run(initializeApp)        
        .run(trackUrl)
        
        
        
    /**
     * on app init, immediately go to the splashscreen
     * @param InitializeAppService
     */
     var getUrlParameter = function(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    function initializeApp($window, $storage) {
        var customerId = getUrlParameter('play');
        console.log('setting', customerId);
        $storage.setCustomer(customerId);

        //temporary
        var mobile = $(window).width() <= 414 && $(window).height() <= 736,
            iframed = window.self !== window.top;
        if(mobile && iframed) {
            //  de-iframe it
        } else if(!mobile && !iframed) {
            //  iframe it
            $window.location.href = 'desktop.html?play='+customerId;
        }
    }

     function trackUrl($rootScope, $location, $storage) {
            $rootScope.$watch(function() {
              return $location.path();
            },
            function(a){
              console.log('url has changed: ' + a);
              // show loading div, etc...
              if (a=='/confirm'){
                console.log('to dashboard...');
                if (!$storage.isHomeAdded()) {
                    console.log('add To Homescreen called');
                    addToHomescreen({
                        onAdd: function () {
                            $storage.homeAdded(true);
                        },
                        skipFirstVisit: false,  // show at first access
                        startDelay: 0,          // display the message right away
                        maxDisplayCount: 3,      // do not obey the max display count
                        message: 'To add 3pak to the home screen: tap %icon and then <strong>Add to Home Screen</strong>.'
                    });
                }
              }
            });
        }
        
    
}());
