(function () {
    /* global globals */
    'use strict';
    let moduleName = 'basics.material';

    /**
     * @ngdoc directive
     * @name materialRoundingConfigDetailGrid
     * @requires
     * @description display a gridview to configure rounding
     */

    angular.module(moduleName).directive('materialRoundingConfigDetailGrid', [
        function () {
            return {
                restrict: 'A',
                templateUrl: globals.appBaseUrl + '/basics.material/templates/material-rounding-config-details.html'
            };
        }
    ]);

})();