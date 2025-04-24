
(function () {

	'use strict';
	var moduleName = 'basics.clerk';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsClerkRoleDefaultValueListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of clerk RoleDefaultValue entities.
	 **/
	angModule.controller('basicsClerkRoleDefaultValueListController', BasicsClerkRoleDefaultValueListController);

	BasicsClerkRoleDefaultValueListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsClerkRoleDefaultValueListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '087f9e6948a2416e936e7e88f33e46df');
	}
})();