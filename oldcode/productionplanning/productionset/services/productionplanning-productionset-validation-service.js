(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningProductionsetValidationService
	 * @function
	 *
	 * @description
	 * ProductionsetValidationService is the data service for all Production Set related functionality.
	 * */

	var moduleName = 'productionplanning.productionset';

	angular.module(moduleName).factory('productionplanningProductionsetValidationService', ProductionsetValidationService);

	ProductionsetValidationService.$inject = ['$http', '$q', 'platformDataValidationService', 'productionplanningProductionsetMainService', 'productionplanningCommonEventValidationServiceExtension'];

	function ProductionsetValidationService($http, $q, platformDataValidationService, productionplanningProductionsetMainService, eventValidationServiceExtension) {
		var service = {};

		service.validateCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, productionplanningProductionsetMainService);
		};

		service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
			//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
			//   var asyncMarker = platformDataValidationService.registerAsyncCall(entity,  field, value, productionplanningProductionsetMainService);
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, productionplanningProductionsetMainService);
			//Now the data service knows there is an outstanding asynchronous request.

			var postData = {Id: entity.Id, Code: value};

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/productionset/productionset/isuniquecode', postData).then(function (response) {
				//Interprete result.
				var result = {};
				if (response.data) {
					result = {apply: true, valid: true, error: ''};
				}
				else {
					result.valid = false;
					result.apply = true;
					result.error = '...';
					result.error$tr$ = 'productionplanning.productionset.errors.uniqCode';
				}

				//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
				platformDataValidationService.finishAsyncValidation(result, entity, value, field, asyncMarker, service, productionplanningProductionsetMainService);

				//Provide result to grid / form container.
				return result;
			});

			return asyncMarker.myPromise;
		};


		service.validateSiteFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, productionplanningProductionsetMainService);
		};

		eventValidationServiceExtension.addMethodsForEvent(service, productionplanningProductionsetMainService);

		return service;
	}
})(angular);
