/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'project.costcodes';
	/**
	 * @ngdoc controller
	 * @name projectCostCodesDetailController
	 * @description controller for the project costcodes details form view
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectCostCodesDetailController', ProjectCostCodesDetailController);

	ProjectCostCodesDetailController.$inject = ['$scope', 'platformContainerControllerService', '$injector'];

	function ProjectCostCodesDetailController($scope, platformContainerControllerService, $injector) {
		platformContainerControllerService.initController($scope, moduleName, 'BAFA6A50E41F11E4B5710800200C9A66', 'projectCostCodesTranslationService');

		let projectCostCodesDynamicUserDefinedColumnService = $injector.get('projectCostCodesDynamicUserDefinedColumnService');
		projectCostCodesDynamicUserDefinedColumnService.loadUserDefinedColumnDetail($scope);

	}
})(angular);