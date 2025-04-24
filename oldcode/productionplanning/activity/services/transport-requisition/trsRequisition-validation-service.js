(function (angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name productionplanningActivityTrsRequisitionValidationService
     * @function
     *
     * @description
     * RequisitionValidationService is the data service for all Requisition related functionality.
     * */

    var moduleName = 'productionplanning.activity';

    angular.module(moduleName).factory('productionplanningActivityTrsRequisitionValidationService', RequisitionValidationService);

    RequisitionValidationService.$inject = ['$http', '$q', 'platformDataValidationService', 'productionplanningActivityTrsRequisitionDataService'];

    function RequisitionValidationService($http, $q, platformDataValidationService, dataService) {
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

        return service;
    }
})(angular);
