(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.requisition';

    angular.module(moduleName).factory('transportplanningRequisitionBundleValidationService', BundleValidationService);

    BundleValidationService.$inject = ['transportplanningBundleValidationServiceFactory', 'transportplanningRequisitionBundleDataService'];

    function BundleValidationService(serviceFactory, dataService) {
        return serviceFactory.createService(dataService);
    }
})(angular);
