(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonApprovalValidationServiceFactory', ['_', 'platformDataValidationService', 'platformRuntimeDataService',  '$translate', function (_, platformDataValidationService, platformRuntimeDataService,  $translate) {

		const service = {}, instanceCache = {};

		function ValidationService(dataService) {

			const self = this;

			// validators ClerkFk
			this.validateClerkFk = function validateClerkFk(entity, value, model) {
				let result = true;
				if (value === 0 || value === null) {
					const error = $translate.instant('cloud.common.entityClerk');
					result = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
						error$tr$param$: {fieldName: error}
					};
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, self, dataService);
				return result;
			};


		}

		service.getService = function (qualifier, dataService) {
			const cacheKey = dataService.getServiceName().toLowerCase();
			if (instanceCache[cacheKey]) {
				return instanceCache[cacheKey];
			} else {
				const instance = new ValidationService(dataService);
				instanceCache[cacheKey] = instance;
				return instance;
			}
		};

		return service;

	}]);

})(angular);