/**
 * Created by henkel
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyCreateRoleValidationProcessor', basicsCompanyCreateRoleValidationProcessor);
	basicsCompanyCreateRoleValidationProcessor.$inject = ['$injector'];
	function basicsCompanyCreateRoleValidationProcessor($injector) {
		var service = {};

		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsCompanyCreateRoleValidationService', function (basicsCompanyCreateRoleValidationService) {
					basicsCompanyCreateRoleValidationService.validateClerkRoleFk(items, null, 'ClerkRoleFk');
					basicsCompanyCreateRoleValidationService.validateAccessRoleFk(items, null, 'AccessRoleFk');
				}]);
			}
		};




		return service;
	}
})(angular);