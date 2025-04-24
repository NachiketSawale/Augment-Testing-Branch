(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringHeaderValidationService
	 * @description provides validation methods for engineering header instances
	 */
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('productionplanningEngineeringHeaderValidationService', productionplanningEngineeringHeaderValidationService);

	productionplanningEngineeringHeaderValidationService.$inject = ['platformDataValidationService', 'productionplanningEngineeringHeaderDataService', '$http'];

	function productionplanningEngineeringHeaderValidationService(platformDataValidationService, dataService, $http) {
		var service = {};

		function validateForeignKeyFieldMandatory(entity, value, model) {
			// check if value is invalid
			var invalidValueArray = [0]; // Generally, we set value 0 as the invalid value for foreign key field. At least, PRJ_PROJECT, BAS_CLERK, BAS_SITE and LGM_JOB don't have a record whose ID is 0.
			if (invalidValueArray.indexOf(value) > -1) {
				value = null;
			}
			//validate mandatory of value
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		}

		//validate mandatory and unique for Code
		service.validateCode = function (entity, value, model) {
			var itemList = dataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
		};
		//async validate unique for Code
		service.asyncValidateCode = function (entity, value, model) {
			//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			//Now the data service knows there is an outstanding asynchronous request.
			var url = globals.webApiBaseUrl + 'productionplanning/engineering/header/isuniquecode?id=' + entity.Id + '&&projectid=' + entity.ProjectFk + '&&code=' + value;
			asyncMarker.myPromise = $http.get(url).then(function (response) {
				//Interprete result.
				var res = {};
				if (response.data) {
					res = {apply: true, valid: true, error: ''};
				} else {
					res.valid = false;
					res.apply = true;
					res.error = '...';
					res.error$tr$ = 'productionplanning.engineering.errors.uniqHeaderCode';
				}
				//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
				platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, service, dataService);
				//Provide result to grid / form container.
				return res;
			});

			return asyncMarker.myPromise;
		};

		service.validateEngTypeFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateProjectFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateClerkFk = validateForeignKeyFieldMandatory;

		return service;
	}
})(angular);
