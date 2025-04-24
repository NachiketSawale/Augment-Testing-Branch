/**
 * Created by anl on 2/6/2018.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.activity';
    angular.module(moduleName).factory('productionplanningActivityTrsRequisitionBundleValidationService', BundleValidationService);

    BundleValidationService.$inject = ['transportplanningBundleValidationServiceFactory', 'productionplanningActivityTrsRequisitionBundleDataService'];

    function BundleValidationService(serviceFactory, dataService) {
        return serviceFactory.createService(dataService);
    }
})(angular);