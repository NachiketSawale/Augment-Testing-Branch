(function(angular) {
	'use strict';
	const moduleName = 'productionplanning.item';
	const module = angular.module(moduleName);
	module.controller('ppsItemProductionOverviewListController', ppsItemProductionOverviewListController);

	ppsItemProductionOverviewListController.$inject = ['$scope', 'platformGridControllerService',
		'ppsItemProductionOverviewDataService', 'ppsItemProductionOverviewUIStandardService'];

	function ppsItemProductionOverviewListController($scope, platformGridControllerService, dataService, uiStandardService) {
		let gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'ParentId',
			childProp: 'Children'
		};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);
	}
})(angular);