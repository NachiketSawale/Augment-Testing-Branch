/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'project.material';
	/**
	 * @ngdoc controller
	 * @name projectMaterialDetailController
	 * @description controller for the project Material details form view
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMaterialDetailController', ProjectMaterialDetailController);

	ProjectMaterialDetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjectMaterialDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9b3839487a6445cdb63d307dbf9de780','projectMaterialTranslationService');
	}
})(angular);