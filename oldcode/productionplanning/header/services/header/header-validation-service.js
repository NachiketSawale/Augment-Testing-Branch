(function (angular) {
	'use strict';
	/* global angular, globals*/
	/**
	 * @ngdoc factory
	 * @name productionplanningHeaderValidationService
	 * @description provides validation methods for master instances
	 */
	var moduleName = 'productionplanning.header';
	angular.module(moduleName).factory('productionplanningHeaderValidationService', ValidationService);

	ValidationService.$inject = ['$http', '$q', 'platformDataValidationService', 'productionplanningHeaderDataService', 'ppsCommonCodGeneratorConstantValue', 'basicsCompanyNumberGenerationInfoService', 'platformRuntimeDataService'];

	function ValidationService($http, $q, platformDataValidationService, dataService, ppsCommonCodGeneratorConstantValue, basicsCompanyNumberGenerationInfoService, platformRuntimeDataService) {

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

		function validateForeignKeyFieldMandatory(entity, value, model) {
			// check if value is invalid
			var invalidValueArray = [0]; // Generally, we set value 0 as the invalid value for foreign key field. At least, PRJ_PROJECT, BAS_CLERK, BAS_SITE and LGM_JOB don't have a record whose ID is 0.
			if (invalidValueArray.indexOf(value) > -1) {
				value = null;
			}
			//validate mandatory of value
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		}

		//service.validatePrjProjectFk = validateForeignKeyFieldMandatory;
		service.validatePrjProjectFk = function validatePrjProjectFk(entity, value, model){
			// check if value is invalid
			var invalidValueArray = [0]; // Generally, we set value 0 as the invalid value for foreign key field. At least, PRJ_PROJECT, BAS_CLERK, BAS_SITE and LGM_JOB don't have a record whose ID is 0.
			if (invalidValueArray.indexOf(value) > -1) {
				value = null;
			}
			//validate mandatory of value
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateBasClerkPrpFk = validateForeignKeyFieldMandatory;
		service.validateBasSiteFk = validateForeignKeyFieldMandatory;
		service.validateLgmJobFk = validateForeignKeyFieldMandatory;

		return service;


	}
})(angular);
