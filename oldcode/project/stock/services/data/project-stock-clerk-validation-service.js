/**
 * Created by lcn on 1/03/2024.
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.stock';

	angular.module(moduleName).factory('ProjectStock2ClerkValidationService', ['platformDataValidationService', '$translate',
		'platformRuntimeDataService', 'basicsCustomClerkRoleLookupDataService',
		function (platformDataValidationService, $translate, platformRuntimeDataService, basicsCustomClerkRoleLookupDataService) {
			return function (dataService) {
				var service = {};

				function onEntityCreated(e, item) {
					service.validateBasClerkFk(item, item.BasClerkFk, 'BasClerkFk');
					service.validateBasClerkRoleFk(item, item.BasClerkRoleFk, 'BasClerkRoleFk');
				}

				service.validateBasClerkRoleFk = function validateBasClerkRoleFk(entity, value, model) {
					let result = true;
					const role = basicsCustomClerkRoleLookupDataService.getItemById(value, {lookupType: 'basicsCustomClerkRoleLookupDataService'});
					const isUnSuccess = value === 0 || (role && role.IsUnique && dataService.getList().some(item => item.BasClerkRoleFk === value && item.Id !== entity.Id));

					if (isUnSuccess) {
						const errorMessage = value ? 'basics.common.clerkRoleMustBeUnique' : 'cloud.common.emptyOrNullValueErrorMessage';
						const errorField = $translate.instant('basics.common.entityClerkRole');
						result = {
							error: '...',
							error$tr$: errorMessage,
							error$tr$param$: {fieldName: errorField}
						};
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};



				service.validateBasClerkFk = function (entity, value, model) {
					var result = {apply: true, valid: true};
					if (validationFk(value)) {
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
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.validateValidTo = function validateValidTo(entity, value, model) {
					return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
				};

				service.validateValidFrom = function validateValidFrom(entity, value, model) {
					return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
				};

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
				}

				if (angular.isFunction(dataService.registerEntityCreated)) {
					dataService.registerEntityCreated(onEntityCreated);
				}
				return service;
			};
		}]);

})(angular);