(function (angular) {
    'use strict';

    /**
     * @name productionplanningProductionsetController
     * @function
     *
     * */

    var moduleName = 'productionplanning.productionset';
    var productionSetModul = angular.module(moduleName);

    productionSetModul.controller('productionplanningProductionsetController', ProductionSetController);
    ProductionSetController.$inject = ['$scope', 'platformMainControllerService', 'productionplanningProductionsetMainService', 'productionplanningProductionsetTranslationService', 'productionplanningProductionsetWizardService'];

    function ProductionSetController($scope, platformMainControllerService, productionplanningProductionsetMainService, productionplanningProductionsetTranslationService, itemWizardService) {

        var options = {search: true, reports: false};
        var sidebarReports = platformMainControllerService.registerCompletely($scope, productionplanningProductionsetMainService,
            {}, productionplanningProductionsetTranslationService, moduleName, options);

	    itemWizardService.activate();

        //un-register on destroy
        $scope.$on('$destroy', function () {
            platformMainControllerService.unregisterCompletely(productionplanningProductionsetMainService, sidebarReports, productionplanningProductionsetTranslationService, options);
        });

    }

})(angular);