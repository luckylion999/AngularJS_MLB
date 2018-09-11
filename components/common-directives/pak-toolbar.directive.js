(function() {
    'use strict';

    angular.module('3pak')
        .directive('pakToolbar', PakToolbarDirective);

    /**
     * reusable toolbar directive
     * @returns {{replace: boolean, template: string, scope: {toolbar: string}}}
     * @constructor
     */
    function PakToolbarDirective($window) {
        return {
            replace: true,
            template: '<nav class="toolbar">' +
                '<div class="left button">&nbsp;</div>' +
                '<div class="title">' +
                    '<pak-brand-logo ng-if="!title" small="true"></pak-brand-logo>' +
                    '<p>{{ ::!!title ? title : null }}</p>' +
                '</div>' +
                '<div class="right button" ng-click="showContestRules()">' +
                    '<i class="fa fa-info-circle" ng-hide="!!hideContestRules"></i>' +
                    '{{ ::!hideContestRules ? "Contest Rules" : null }}' +
                '</div>' +
            '</nav>',
            scope: {
                title: '@',
                hideContestRules: '=rules'
            },
            link: function(scope) {

                scope.showContestRules = function() {
                    if(!scope.hideContestRules) {
                        $window.open('https://s3-us-west-2.amazonaws.com/3pak/rules.html', null, '_blank');
                    }
                };
            }
        };
    }
}());