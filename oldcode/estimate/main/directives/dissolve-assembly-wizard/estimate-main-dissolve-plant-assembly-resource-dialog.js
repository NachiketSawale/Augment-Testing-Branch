
/*
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function () {

    'use strict';

    let moduleName = 'estimate.main';
    /**
     * @ngdoc directive
     * @name estimateMainDissolvePlantAssemblyResourceDialog
     * @description
     */
    angular.module(moduleName).directive('estimateMainDissolvePlantAssemblyResourceDialog',
        function () {
            return {
                restrict: 'A',
                templateUrl: window.location.pathname + '/estimate.main/templates/wizard/dissolve-assembly/estimate-main-dissolve-plant-assembly-resource-dialog-grid.html',
            };
        });
})();
