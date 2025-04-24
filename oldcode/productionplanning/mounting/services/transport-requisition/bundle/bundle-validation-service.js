/**
 * Created by waz on 1/31/2018.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';
    angular.module(moduleName).factory('productionplanningMountingTrsRequisitionBundleValidationService', BundleValidationService);

    BundleValidationService.$inject = ['transportplanningBundleValidationServiceFactory', 'productionplanningMountingTrsRequisitionBundleDataService'];

    function BundleValidationService(serviceFactory, dataService) {
        return serviceFactory.createService(dataService);
    }
})(angular);