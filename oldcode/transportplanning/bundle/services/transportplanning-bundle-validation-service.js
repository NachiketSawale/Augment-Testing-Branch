(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.bundle';

    angular.module(moduleName).factory('transportplanningBundleValidationService', BundleValidationService);

    BundleValidationService.$inject = ['transportplanningBundleValidationServiceFactory', 'transportplanningBundleMainService'];

    function BundleValidationService(validationSeviceFactory, dataService) {
        return validationSeviceFactory.createService(dataService);
    }
})(angular);
