(function (angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name ppsMaterialProductDescValidationService
     * @description provides validation methods for master instances
     */
    var moduleName = 'productionplanning.ppsmaterial';
    angular.module(moduleName).factory('productionplanningPpsMaterialEventTypeValidationService', productionplanningPpsMaterialEventTypeValidationService);

    productionplanningPpsMaterialEventTypeValidationService.$inject = ['platformDataValidationService', 'productionplanningPpsMaterialEventTypeDataService', '$http','$q'];

    function productionplanningPpsMaterialEventTypeValidationService(platformDataValidationService, dataService, $http,$q) {
        var service = {};

        service.validatePpsEventTypeFk = function (entity, value, model) {
            var itemList = dataService.getList();
            service.isCodeUnique = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
            return service.isCodeUnique;
        };

        service.asyncValidatePpsEventTypeFk = function (entity, value) {

            var url = globals.webApiBaseUrl + 'productionplanning/ppsmaterial/materialeventtype/isuniqueppseventtype?currentId=' + entity.Id + '&materialId=' + entity.MaterialFk + '&ppsEventTypeId=' + value;

            var defer = $q.defer();
            $http.get(url).then(function (result) {
                defer.resolve(!result.data ? platformDataValidationService.createErrorObject('productionplanning.ppsmaterial.materialEventType.errorPpsEventTypeMustBeUnique') : true);
            });

            return defer.promise;

        };

        service.validatePpsEventTypeBaseFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };
        service.validateResTypeFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };
        service.validateSiteFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        service.validateEventFor = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };


        return service;
    }
})(angular);
