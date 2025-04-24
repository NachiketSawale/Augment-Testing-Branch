
(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkRoleDefaultValueValidationService
	 * @description provides validation methods for basics clerk RoleDefaultValue entities
	 */
	angular.module(moduleName).service('basicsClerkRoleDefaultValueValidationService', BasicsClerkRoleDefaultValueValidationService);

	BasicsClerkRoleDefaultValueValidationService.$inject = ['platformDataValidationService', 'basicsClerkRoleDefaultValueDataService'];

	function BasicsClerkRoleDefaultValueValidationService() {
	}

})(angular);
