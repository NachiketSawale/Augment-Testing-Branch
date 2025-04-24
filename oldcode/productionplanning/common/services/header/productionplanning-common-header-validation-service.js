(function (angular) {
    'use strict';
    /* global angular, globals*/
    /**
     * @ngdoc service
     * @name productionplanningCommonHeaderValidationService
     * @description provides validation methods for master instances
     */
    var moduleName = 'productionplanning.common';
    angular.module(moduleName).factory('productionplanningCommonHeaderValidationService', ProductionplanningCommonHeaderValidationService);

    ProductionplanningCommonHeaderValidationService.$inject = ['$http', '$q', 'platformDataValidationService', 'basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', 'platformRuntimeDataService' ];

    function ProductionplanningCommonHeaderValidationService($http, $q, platformDataValidationService, basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, platformRuntimeDataService) {
        var mainService = {};
        var serviceCache = {};
        mainService.EditValidation= function (dataService) {
            var service = {};

            service.validateCode = function (entity, value, model) {
                return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
            };

            service.asyncValidateCode = function asyncValidateCode(entity, value, field) {

                //asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
                var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
                //Now the data service knows there is an outstanding asynchronous request.

                var postData = {Id: entity.Id, Code: value, prjProjectFk: entity.PrjProjectFk};

                asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/header/isuniquecode', postData).then(function (response) {
                    //Interprete result.
                    var res = {};
                    if (response.data) {
                        res = {apply: true, valid: true, error: ''};
                    } else {
                        res.valid = false;
                        res.apply = true;
                        res.error = '...';
                        res.error$tr$ = 'productionplanning.common.errors.uniqCode';
                    }

                    //Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
                    platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

                    //Provide result to grid / form container.
                    return res;
                });

                return asyncMarker.myPromise;
            };
            service.validatePrjProjectFk = function (entity, value, model) {
               // return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
                return  platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
            };
            service.validateHeaderStatusFk = function (entity, value, model) {
                return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
            };
            service.validateBasClerkPrpFk = function (entity, value, model) {
                return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
            };
            service.validateBasSiteFk = function (entity, value, model) {
                return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
            };
            service.validateLgmJobFk = function (entity, value, model) {
                return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
            };

            return service;

        };
        mainService.getValidationService= function getValidationService(dataService, moduleId) {
            if (!serviceCache[moduleId]) {
                serviceCache[moduleId] = mainService.EditValidation(dataService);
            }
            return serviceCache[moduleId];
        };
        return mainService;
    }
})(angular);
