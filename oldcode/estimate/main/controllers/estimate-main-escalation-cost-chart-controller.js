/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainEscalationCostChartController',estimateMainEscalationCostChartController);
	estimateMainEscalationCostChartController.$inject = ['$scope','platformContainerControllerService'];
	function estimateMainEscalationCostChartController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName,'96b4926b9fb244b59e85e2642cc6fd5b');
	}
})(angular);


