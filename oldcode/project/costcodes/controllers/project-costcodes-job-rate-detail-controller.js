/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'project.costcodes';
	/**
	 * @ngdoc controller
	 * @name projectCostCodesJobRateDetailController
	 * @description controller for the project costcodes job rate details form view
	 */

	angular.module(moduleName).controller('projectCostCodesJobRateDetailController', ProjectCostCodesJobRateDetailController);

	ProjectCostCodesJobRateDetailController.$inject = ['$scope', '$injector', 'platformContainerControllerService'];

	function ProjectCostCodesJobRateDetailController($scope, $injector, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a6005785aa2b40179b87c8caf833fa9b', 'projectCostCodesTranslationService');

		let projectCostCodesJobRateDynamicUserDefinedColumnService = $injector.get('projectCostCodesJobRateDynamicUserDefinedColumnService');
		projectCostCodesJobRateDynamicUserDefinedColumnService.loadUserDefinedColumnDetail($scope);
	}
})(angular);