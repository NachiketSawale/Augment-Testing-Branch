/**
 * Created by las on 2/5/2018.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.common';

    angular.module(moduleName).factory('productionplanningCommonStructureValidationService', ppsCommonStructureValidationService);

    ppsCommonStructureValidationService.$inject = ['platformDataValidationService', 'productionplanningCommonLiccostgroupsService'];

    function ppsCommonStructureValidationService(platformDataValidationService, dataService) {
        var service = {};

        service.validateQuantity = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        service.validateUomFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        service.validateCode = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        return service;
    }

})(angular);