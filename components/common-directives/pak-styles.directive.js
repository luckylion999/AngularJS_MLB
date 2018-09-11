(function() {
    'use strict';

    angular.module('3pak')
        .directive('pakStyles', function(CustomerProfileService) {
            return {
                link: function(vm, elem) {
                    //  initialize
                    CustomerProfileService.getStyles()
                        .then(_addStyles);

                    /**
                     * adds styles from customerprofile api response
                     * @param styles
                     * @private
                     */
                    function _addStyles(styles) {
                        //  css to be injected
                        var cssString = '';
                        //  add individual styles to string
                        Object.keys(styles)
                            .forEach(function(element) {
                                cssString += element + ' { ';
                                var properties = styles[element];
                                cssString += Object.keys(properties)
                                    .map(function(property) {
                                        return property + ': ' + properties[property];
                                    })
                                    .join('; ');
                                cssString += '; }\n';
                            });
                        //  injects the style tag for customerprofile
                        elem.append($('<style></style>').text(cssString));
                    }
                }
            };
        });
}());