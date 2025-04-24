(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceMasterPoolValidationService
	 * @description provides validation methods for master instances
	 */
	var moduleName = 'resource.master';
	angular.module(moduleName).factory('resourceMasterPoolValidationService', resourceMasterPoolValidationService);

	resourceMasterPoolValidationService.$inject = ['_', 'platformDataValidationService', 'resourceMasterPoolDataService', '$http'];

	function resourceMasterPoolValidationService(_, platformDataValidationService, resourceMasterPoolDataService, $http) {
		var service = {};

		service.validateQuantity = function validateQuantity(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, resourceMasterPoolDataService);
		};

		service.validateValidfrom = function validateValidfrom(entity, value, model) {

			return platformDataValidationService.validatePeriod(value, entity.Validto, entity, model, service, resourceMasterPoolDataService, 'Validto');
		};

		service.validateValidto = function validateValidto(entity, value, model) {

			return platformDataValidationService.validatePeriod(entity.Validfrom, value, entity, model, service, resourceMasterPoolDataService, 'Validfrom');
		};

		service.validateResourceSubFk = function validateResourceSubFk(entity, value, model) {

			//null validate
			if (_.isNil(value)) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, resourceMasterPoolDataService);
			}
			//ResourceFkEqualToResourceSubFk Validate
			if (value === entity.ResourceFk) {
				var res = {
					apply: true,
					valid: false,
					error: '...',
					error$tr$: 'resource.master.errors.ResourceFkEqualToResourceSubFk'
				};
				return platformDataValidationService.finishWithError(res, entity, value, model, service, resourceMasterPoolDataService);
			}
			//else {
			//    platformDataValidationService.removeFromErrorList(entity, model, platformDataValidationService, resourceMasterPoolDataService);
			//}

			//unique Validate
			var list = resourceMasterPoolDataService.getList();
			return platformDataValidationService.validateIsUnique(entity, value, model, list, service, resourceMasterPoolDataService);

		};

		service.asyncValidateResourceSubFk = function asyncValidateResourceSubFk(entity, value, model) {
			// Check Circular Dependency
			//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, resourceMasterPoolDataService);
			//Now the data service knows there is an outstanding asynchronous request.
			var url = globals.webApiBaseUrl + 'resource/master/pool/isExistsCircularDependency?resourceFk=' + entity.ResourceFk + '&resourceSubFk=' + value;
			asyncMarker.myPromise = $http.get(url)
				.then(function (response) {
					var res = {};
					if (!response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = '...';
						res.error$tr$ = 'resource.master.errors.ExistCircularDependency';
					}
					//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
					platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, service, resourceMasterPoolDataService);

					//Provide result to grid / form container.
					return res;
				});

			return asyncMarker.myPromise;
		};
		return service;
	}
})(angular);
