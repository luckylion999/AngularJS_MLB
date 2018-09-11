(function() {
    'use strict';

    angular.module('3pak')
        .directive('pakBrandLogo', PakBrandLogoDirective);

    /**
     * injects default brand logo image in template placeholder
     * @param CustomerProfileService - api service for retrieving white label assets
     * @returns {{template: string, replace: boolean, compile: compile}}
     * @constructor
     */
    function PakBrandLogoDirective(CustomerProfileService) {
        return {
            template: '<img class="brand logo">',
            replace: true,
            compile: function() {
                return {
                    scope: {},
                    post: function PakBrandLogoPostLink(scope, elem, attrs) {
                        //  load in logo url
                        CustomerProfileService.getLogoUrl(!!attrs.small && attrs.small == 'true')
                            .then(function(logoUrl) {
                                elem.attr('src', logoUrl);
                            });
                    }
                };
            }
        }
    }

}());