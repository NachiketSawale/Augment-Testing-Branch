(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningConfigurationValidationService
     * @description provides validation methods for eventtype2restype instances
     */
    angModule.factory('productionplanningConfigurationValidationService', ValidationService);

    ValidationService.$inject = ['platformDataValidationService','productionplanningConfigurationMainService','$http','basicsLookupdataLookupDescriptorService'];

    function ValidationService(platformDataValidationService,dataService,$http,basicsLookupdataLookupDescriptorService) {
        var service = {};

        service.validateCode = function (entity, value, model) {
            var itemList = dataService.getList();
            service.isCodeUnique = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
            return service.isCodeUnique;
        };
        service.asyncValidateCode = function (entity, value, model) {
            var url = globals.webApiBaseUrl + 'productionplanning/configuration/eventtype/isuniquecode?id=' + entity.Id + '&code=' + value;

            //asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
            var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
            //Now the data service knows there is an outstanding asynchronous request.
            asyncMarker.myPromise = $http.get(url).then(function (response) {
                //Interprete result.
                var res = {};
                if (response.data) {
                    res = {apply: true, valid: true, error: ''};
                } else {
                    res.valid = false;
                    res.apply = true;
                    res.error = '...';
                    res.error$tr$ = 'cloud.common.uniqueValueErrorMessage';
                    res.error$tr$param$ = {object:model.toLowerCase()};
                }
                //Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
                platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, service, dataService);
                //Provide result to grid / form container.
                return res;
            });

            return asyncMarker.myPromise;
        };

        service.validateSorting = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        service.validateRubricCategoryFk = function (entity, value) {
            //If a rubric-category is selected , the corresponding rubric is automatically set.
            if(value !== null && value !== 0 && (entity.RubricFk === null||entity.RubricFk === 0) )
            {
                var rubricCategory = basicsLookupdataLookupDescriptorService.getLookupItem('basics.customize.rubriccategory',value);
                entity.RubricFk = rubricCategory.RubricFk;
            }
            return true;
        };

        service.validateRubricFk = function (entity) {
            //If a rubric is selected or resetted, reset rubric-category.
            if(entity.RubricCategoryFk!== null)
            {
                entity.RubricCategoryFk = null;
            }
            return true;
        };

        service.validatePpsEntityFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };

        return service;
    }
})(angular);
