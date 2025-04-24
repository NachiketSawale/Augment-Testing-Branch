(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningConfigurationEngTypeValidationService
     * @description provides validation methods for EngType instances
     */
    angModule.factory('productionplanningConfigurationEngtypeValidationService', ValidationService);

    ValidationService.$inject = ['platformDataValidationService',
        'productionplanningConfigurationEngtypeDataService'];

    function ValidationService(platformDataValidationService,
                               dataService) {
        var service = {};

        service.validateSorting = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        service.validateRubricCategoryFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        return service;
    }
})(angular);
