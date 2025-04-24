(function config(angular) {
	'use strict';

	var moduleName = 'basics.assetmaster';

	/**
	 * @ngdoc service
	 * @name basicsAssetMasterValidationService
	 * @description provides validation methods for asset master
	 */
	angular.module(moduleName).factory('basicsAssetMasterValidationService', ['globals', 'basicsAssetMasterService', 'platformDataValidationService', function basicsAssetMasterValidationService(globals, dataService, platformDataValidationService) {

		var service = {};

		service.validateCode = function validateCode(entity, value, model, apply) {
			var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			if (apply) {
				result.apply = true;
			}
			platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			return result;
		};

		service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'basics/assetmaster/isunique', entity, value, model).then(function success(response) {
				if (!entity[model] && angular.isObject(response)) {
					response.apply = true;
				}
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, service, dataService);
			});
		};

		return service;
	}]);

})(angular);
