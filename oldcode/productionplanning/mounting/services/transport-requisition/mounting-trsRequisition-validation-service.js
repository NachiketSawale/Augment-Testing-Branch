(function (angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name productionplanningMountingTrsRequisitionValidationService
     * @function
     *
     * @description
     * RequisitionValidationService is the data service for all Requisition related functionality.
     * */

    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).factory('productionplanningMountingTrsRequisitionValidationService', RequisitionValidationService);

    RequisitionValidationService.$inject = ['$http', '$q', 'platformDataValidationService', 'productionplanningMountingTrsRequisitionDataService', 'productionplanningCommonEventValidationServiceExtension'];

    function RequisitionValidationService($http, $q, platformDataValidationService, dataService, eventValidationServiceExtension) {
        var service = {};

        service.validateCode = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        service.validateProjectFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        service.validateClerkFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        service.validateDate = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

	    eventValidationServiceExtension.addMethodsForEvent(service, dataService, 'transportplanning.requisition', true);

        return service;
    }
})(angular);
