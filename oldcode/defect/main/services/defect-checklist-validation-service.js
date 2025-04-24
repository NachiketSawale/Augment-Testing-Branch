/* global */
(function (angular) {
	'use strict';

	angular.module('defect.main').service('defectChecklistValidationService', defectChecklistValidationService);

	defectChecklistValidationService.$inject = ['platformDataValidationService', '$translate', '$q', '$http','defectChecklistDataService'];

	function defectChecklistValidationService(platformDataValidationService, $translate, $q, $http,defectChecklistDataService) {

		var service = {};

		//   service.asyncValidateCode = asyncValidateCode;

		service.validateCode = validateCode;
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
                $http.get(globals.webApiBaseUrl + "defect/main/checklist/isunique" + '?id=' + entity.Id + "&code=" + value).then(function(response){
                    var fieldName = $translate.instant("cloud.common.entityReferenceCode");

                    if (response.data === false) {
                        result = createErrorObject('cloud.common.uniqueValueErrorMessage', { object: fieldName });
                    }
                    platformDataValidationService.finishValidation(result, entity, value, model, service, defectChecklistDataService);
                    defer.resolve(result);
                })
            }
            else {
                result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', { fieldName: fieldName });
                platformDataValidationService.finishValidation(result, entity, value, model, service, defectChecklistDataService);
                defer.resolve(result);
            }

            return defer.promise;
        }
*/
		// validate code column
		function validateCode(entity, value, model){
			var result = platformDataValidationService.isUnique(defectChecklistDataService.getList(), 'Code', value, entity.Id);
			platformDataValidationService.finishValidation(result, entity, value, model, service, defectChecklistDataService);
			return result;
		}

		return service;

	}

})(angular);
