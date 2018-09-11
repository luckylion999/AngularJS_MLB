(function() {
    'use strict';

    angular.module('3pak')
        .directive('pakDialogBox', PakDialogBox);

    /**
     * <pak-dialog-box></pak-dialog-box>
     * instantiated in index.html, wired to the $dialog service for easy popups from any component
     * @param $dialog
     * @returns {{templateUrl: string, replace: boolean, link: link}}
     * @constructor
     */
    function PakDialogBox($dialog) {
        return {
            templateUrl: 'components/pak-dialog-box/pak-dialog-box.tpl.html',
            replace: true,
            link: function(vm, elem) {
                /**
                 * animation duration upon showing/hiding dialogBox
                 * @type {number}
                 */
                var fadeDuration = 100;

                /**
                 * wires up the $dialog service for future updates
                 * @param dialog
                 */
                $dialog.onUpdate = function(dialog) {
                    vm.$evalAsync(function() {
                        vm.dialog = dialog;
                    });
                    elem.fadeIn(fadeDuration);
                };

                /**
                 * closes/hides the dialogBox
                 */
                vm.close = function() {
                    elem.fadeOut(fadeDuration);
                };

                /**
                 * interprets the button index clicked and handles accordingly
                 * @todo implement button index actions as needed
                 * @param index
                 */
                vm.buttonClicked = function(index) {
                    vm.close();
                };
            }
        };
    }
}());