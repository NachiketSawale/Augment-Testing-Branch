(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'project.main';
	/**
	 * @ngdoc controller
	 * @name projectMainAccessObject2GrpRoleListController
	 * @function
	 *
	 * @description
	 * List Controller
	 **/
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('projectMainAccessObject2GrpRoleListController', ProjectMainAccessObject2GrpRoleListController);

	ProjectMainAccessObject2GrpRoleListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainAccessObject2GrpRoleListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '31505e1e84e84626ad5ff43a038f5a79');
	}
})();