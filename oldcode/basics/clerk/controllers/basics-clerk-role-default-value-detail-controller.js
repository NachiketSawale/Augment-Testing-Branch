
(function (angular) {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkRoleDefaultValueDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of clerk RoleDefaultValue entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsClerkRoleDefaultValueDetailController', BasicsClerkRoleDefaultValueDetailController);

	BasicsClerkRoleDefaultValueDetailController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsClerkRoleDefaultValueDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '88bddfa6b18e4f6c81960df2fc0e6744','basicsClerkTranslationService');
	}
})(angular);