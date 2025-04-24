/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkForPackageValidationService
	 * @description provides validation methods for basics clerk forPackage entities
	 */
	angular.module(moduleName).service('basicsClerkForPackageValidationService', BasicsClerkForPackageValidationService);

	BasicsClerkForPackageValidationService.$inject = ['platformDataValidationService', 'basicsClerkForPackageDataService', 'platformRuntimeDataService', 'basicsCustomClerkRoleLookupDataService',];

	function BasicsClerkForPackageValidationService(platformDataValidationService, dataService, platformRuntimeDataService, basicsCustomClerkRoleLookupDataService) {
		var service = {};
		service.validateClerkRoleFk = function (entity, value, model) {
			var isSuccess = true, result = null;
			if (value) {
				var role = basicsCustomClerkRoleLookupDataService.getItemById(value, {lookupType: 'basicsCustomClerkRoleLookupDataService'});
				if (role && role.Isunique) {
					var clerks = dataService.getList();
					var sameRoleClerks = _.filter(clerks, function (item) {
						return item.ClerkRoleFk === value;
					});
					if (sameRoleClerks && sameRoleClerks.length > 0) {
						isSuccess = false;
					}
				}
				if (!isSuccess) {
					result = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'basics.common.clerkRoleMustBeUnique'
					};
				}
			} else {
				isSuccess = false;
				result = {
					apply: true,
					valid: false,
					error: '...',
					error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
					error$tr$param$: {
						fieldName: $translate.instant('basics.common.entityClerkRole')
					}
				};
			}
			platformRuntimeDataService.applyValidationResult(isSuccess ? true : result, entity, model);
			return platformDataValidationService.finishValidation((isSuccess ? true : result), entity, value, model, self, dataService);
		};
		return service;
	}

})(angular);
