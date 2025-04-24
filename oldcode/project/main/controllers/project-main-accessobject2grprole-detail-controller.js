(function (angular) {

	'use strict';
	var moduleName = 'project.main';
	/**
	 * @ngdoc controller
	 * @name projectMainAccessObject2GrpRoleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainAccessObject2GrpRoleDetailController', projectMainAccessObject2GrpRoleDetailController);

	projectMainAccessObject2GrpRoleDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function projectMainAccessObject2GrpRoleDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '48fa7592f1014230af0b2ca890e5acf3', 'projectMainTranslationService');
	}

})(angular);