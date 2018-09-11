(function() {
    'use strict';

    angular.module('3pak')
        .directive('pakNavButton', PakNavButtonDirective);

    /**
     * nav button directive to quickly deploy custom footer buttons for any controller
     * @returns {{replace: boolean, template: string, scope: {buttons: string}}}
     * @constructor
     */
    function PakNavButtonDirective($state) {
        return {
            replace: true,
            template: '<div class="nav-button">' +
                '<div    ng-repeat="button in buttons"' +
                        'ng-click="executeAction(button)"' +
                        'class="color-2-fill"' +
                        'ng-class="{faded: !!button.faded}"' +
            '>{{ ::button.text }}</div>' +
            '</div>',
            scope: {
                buttons: '='
            },
            link: function(vm) {
                /**
                 * now clicking on a nav-button will either redirect or run a function
                 * @param button
                 */
                vm.executeAction = function(button) {
                    if(!!button.target) {
                        $state.go(button.target);
                    } else if(!!button.action) {
                        button.action();
                    } else {
                        console.warn('PakNavButton - No Action', 'Button clicked but no target or action was defined');
                    }
                };
            }
        }
    }
}());
