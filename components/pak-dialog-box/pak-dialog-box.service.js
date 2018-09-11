(function () {
    'use strict';

    angular
        .module('3pak')
        .service('$dialog', PakDialogBoxService);

    /**
     * service for updating contents of the dialogBox modal
     * @returns {{onUpdate: null, show: show}}
     * @constructor
     */
    function PakDialogBoxService() {

        return {
            onUpdate: null,
            show:     show
        };

        /**
         * attempts to forward options to the pakDialogBox directive
         * @param options
         */
        function show(options) {
            if(!!this.onUpdate) {
                this.onUpdate(options);
            }
        }
    }
})();