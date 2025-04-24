/* global  */
(function (angular) {
	'use strict';

	angular.module('defect.main').service('defectSectionValidationService', defectSectionValidationService);

	defectSectionValidationService.$inject = ['platformDataValidationService', '$translate', '$q', '$http','defectSectionDataService'];

	function defectSectionValidationService(platformDataValidationService, $translate, $q, $http, defectSectionDataService) {

		var service = {};

		// service.asyncValidateCode = asyncValidateCode;

		service.validateCode = validateCode;

		// validate code column
		function validateCode(entity, value, model){
			var result = platformDataValidationService.isUnique(defectSectionDataService.getList(), 'Code', value, entity.Id);
			platformDataValidationService.finishValidation(result, entity, value, model, service, defectSectionDataService);
			return result;
		}
		/*
        function createErrorObject(transMsg, errorParam) {
            return {
                apply: true,
                valid: false,
                error: '...',
                error$tr$: transMsg,
                error$tr$param$: errorParam
            };
        }

        function asyncValidateCode(entity, value, model) {
            var defer = $q.defer();

            var fieldName = model === "Code" ? $translate.instant('cloud.common.entityReferenceCode'):'Reference Code';
            var result = platformDataValidationService.isMandatory(value, model, { fieldName: fieldName });
            if (result.valid === true) {
                var error = $translate.instant('defect.main.entityCodeUniqueError');
                $http.get(globals.webApiBaseUrl + "defect/main/section/isunique" + '?id=' + entity.Id + "&code=" + value).then(function(response) {
                    var fieldName = $translate.instant("cloud.common.entityReferenceCode");

                    if (response.data === false) {
                        result = createErrorObject('cloud.common.uniqueValueErrorMessage', { object: fieldName });
                    }
                    platformDataValidationService.finishValidation(result, entity, value, model, service, defectSectionDataService);
                    defer.resolve(result);
                })
            }
            else {
                result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', { fieldName: fieldName });
                platformDataValidationService.finishValidation(result, entity, value, model, service, defectSectionDataService);
                defer.resolve(result);
            }
            return defer.promise;
        }
*/

		return service;
	}

})(angular);
