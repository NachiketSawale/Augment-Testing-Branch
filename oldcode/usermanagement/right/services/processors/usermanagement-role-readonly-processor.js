
(function (angular) {
	'use strict';
	angular.module('usermanagement.right').factory('userManagementRoleReadOnlyProcessor', userManagementRoleReadOnlyProcessor);
	userManagementRoleReadOnlyProcessor.$inject = ['_', 'platformRuntimeDataService'];

	function userManagementRoleReadOnlyProcessor(_, platformRuntimeDataService) {
		const service = {};

		service.processItem = (item)=> {
			if(item.IsSystem) {
				platformRuntimeDataService.readonly(item, [{
					field: 'IsFunctional',
					readonly: true
				}]);
			}
		};

		return service;
	}
})(angular);