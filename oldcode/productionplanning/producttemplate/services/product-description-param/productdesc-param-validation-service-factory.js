/**
 * Created by zov on 7/16/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    /**
     * @ngdoc service
     * @name productionplanningProducttemplateProductDescParamValidationService
     * @description provides validation methods for Product Description Param
     */

    var moduleName = 'productionplanning.producttemplate';

    angular.module(moduleName).factory('ppsProducttemplateProductDescParamValidationServiceFactory', validationServiceFactory);

    validationServiceFactory.$inject = ['$http',
        'platformDataValidationService',
        '$injector'];

    function validationServiceFactory($http,
                                      platformDataValidationService,
                                      $injector) {

        function createValidationService(dataService) {
            var service = {};

            service.validateVariableName = function (entity, value, model) {
                var itemList = dataService.getList();
                return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
            };

            service.asyncValidateVariableName = function (entity, value, field) {

                var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);

                var postData = {Id: entity.Id, Name: value, DescriptionFk: entity.ProductDescriptionFk};

                asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescparam/checkname',
                    postData).then(function (response) {
                    //Interprete result.
                    var res = {};
                    if (response.data) {
                        res = {apply: true, valid: true, error: ''};
                    } else {
                        res.valid = false;
                        res.apply = true;
                        res.error = 'Variable Name should be unique over all entries of the same product template';
                        res.error$tr$ = 'productionplanning.producttemplate.errors.uniqVariableName';
                    }
                    platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

                    return res;
                });

                return asyncMarker.myPromise;
            };


            return service;
        }


        var serviceCache = {};
        return {
            getService: function getService(dataService) {
                if (typeof dataService === 'string') {
                    dataService = $injector.get(dataService);
                }
                var serviceKey = dataService.getServiceName();
                if (!serviceCache[serviceKey]) {
                    serviceCache[serviceKey] = createValidationService(dataService);
                }
                return serviceCache[serviceKey];
            }
        };

    }
})();