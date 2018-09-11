(function() {
    'use strict';

    angular.module('3pak')
        .service('CustomerProfileService', CustomerProfileService);

    function CustomerProfileService($api, $q, $storage, $user) {

        var vm = {
            customerId: ($storage.getCustomer()) ,
            logo: {
                small: null,
                large: null
            },
            onLogoUpdateListeners: [],
            promise: null,
            league: null,
            promoBlurb: null,
            prizes: {
                prize1: null,
                prize2: null,
                prize3: null
            },
            styles: null,
            advertisement: null
        };

        return {
            getCustomerProfile: getCustomerProfile,
            getLogoUrl:         getLogoUrl,
            getPrizes:          getPrizes,
            getPromoBlurb:      getPromoBlurb,
            getStyles:          getStyles,
        };

        function getCustomerProfile() {
            // var custId = 'app';
            var custId = vm.customerId;
            if(!vm.promise) {
                // if($user.isAuthenticated()){
                //     custId = vm.customerId;
                // } 
                // vm.promise = $api.get('customerprofiles/' + vm.customerId + '/')
                vm.promise = $api.get('customerprofiles/' + custId + '/')
                    .then(function (profile) {
                        //  hooking up logo urls
                    	if (profile.league)
                    		vm.league = profile.league;
                    	if (profile.bleague)
                    		vm.league = profile.bleague;
                    	
                    	vm.logo.small = profile.logo_small;
                        vm.logo.large = profile.logo_large;
                        vm.promoBlurb = profile.promo_blurb;
                        vm.advertisement = profile.advertisement;
                        vm.advertisement_uri = profile.advertisement_uri;
                        vm.advertisement_2 = profile.advertisement_2;
                        vm.advertisement_uri_2 = profile.advertisement_uri_2;
                        vm.name = profile.name;
                        vm.happy_name = profile.happy_name;
                        vm.prizes.prize1 = {
                            imageUrl: profile.prize_1,
                            text: profile.prize_label_1,
                            topText: profile.prize_top_label_1
                        };
                        vm.prizes.prize2 = {    
                            imageUrl: profile.prize_2,
                            text: profile.prize_label_2,
                            topText: profile.prize_top_label_2
                        };
                        vm.prizes.prize3 = {
                            imageUrl: profile.prize_3,
                            text: profile.prize_label_3,
                            topText: profile.prize_top_label_3
                        };
                        vm.styles = _interpretStyles(profile);
                        vm.min_age_to_play = profile.min_age_to_play;
                        return vm;
                    }, function(errResponse) {
                           console.log('We were unable to fetch the customer profile');
                           console.log(errResponse);
                           window.location = 'http://3pak.com';
                    });
            }

            return vm.promise;
        }

        /**
         * creates object for applying customerprofile style
         * @returns {*}
         */
        function _interpretStyles(profile) {
            //  building the background gradient
            var darkerColor = profile.color_primary,
                lighterColor = !!profile.color_3 ? profile.color_3 : _adjustColorBrightness(profile.color_primary, -0.5);
                
            //  styles to be added to page
            return {
                body: {
                    display: 'block',
                    'background-image': 'linear-gradient(to left, ' +
                    darkerColor + ' 0%, ' + lighterColor + ' 50%, ' +
                    darkerColor + ' 100%)',
                    color: !profile.dark_fonts ? 'white' : 'black'
                },
                '.color-1': {
                    color: profile.color_primary
                },
                '.color-1-fill': {
                    'background-color': profile.color_primary
                },
                '.color-2': {
                    color: profile.color_secondary
                },
                '.color-2-fill': {
                    'background-color': profile.color_secondary
                },
                '.profile-button-color': {
                    'color': profile.button_font_color
                },
                '.from': {
                    color: !profile.dark_fonts ? 'white' : 'black',
                    fill: !profile.dark_fonts ? 'white' : 'black'
                }
            };
        }

        /**
         * brightens/darkens colors
         * @link http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors#answer-13542669
         * @param color
         * @param percent
         * @returns {string}
         * @private
         */
        function _adjustColorBrightness(color, percent) {
            var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
            return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
        }

        function getLogoUrl(small) {
            return getCustomerProfile()
                .then(function() {
                    return vm.logo[!small ? 'large' : 'small'];
                }, function(errResponse) {
                    console.log(errResponse);
                    window.location = 'http://3pak.com';
                });
        }


        function getPromoBlurb() {
            return getCustomerProfile()
                .then(function() {
                    return vm.promoBlurb;
                }, function(errResponse) {
                    console.log(errResponse);
                    window.location = 'http://3pak.com';
                });
        }

        function getPrizes() {
            return getCustomerProfile()
                .then(function() {
                    return vm.prizes;
                }, function(errResponse) {
                    console.log(errResponse);
                    window.location = 'http://3pak.com';
                });
        }

        function getStyles() {
            return getCustomerProfile()
                .then(function() {
                    return vm.styles;
                }, function(errResponse) {
                    console.log(errResponse);
                    window.location = 'http://3pak.com';
                });
        }
    }
}());