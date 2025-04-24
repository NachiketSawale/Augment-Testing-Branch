(function (angular) {
    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name ppsExternalConfigurationValidationService
     * @description provides validation methods for pps external configuration
     */
    angModule.factory('ppsExternalConfigurationValidationService', ValidationService);

    ValidationService.$inject = ['platformDataValidationService',
        'ppsExternalConfigurationDataService'];

    function ValidationService(platformDataValidationService,
                               dataService) {
        var service = {};

        service.validateSorting = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        service.validateBasExternalSourceTypeFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        return service;
    }
})(angular);
