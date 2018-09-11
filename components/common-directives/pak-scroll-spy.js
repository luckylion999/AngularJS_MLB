(function() {
    'use strict';

    angular.module('3pak')
        .directive('pakScrollSpy', PakScrollSpyDirective);

    function PakScrollSpyDirective($window) {
        return {
            template: '<div style="float: left;">&nbsp;</div>',
            replace: true,
            scope: {
                action: '&'
            },
            link: function(scope, elem) {
                var _parent = elem.parent()
                    .on('scroll', checkIfSpyIsVisible);

                function checkIfSpyIsVisible() {
                    if($($window).height() > elem.offset().top) {
                        scope.$evalAsync(executeAction);
                    }
                }

                function executeAction() {
                    scope.action();
                }
            }
        };
    }
}());