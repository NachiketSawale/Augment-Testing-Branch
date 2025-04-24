/**
 * Created by anl on 8/04/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.product';

	angular.module(moduleName).controller('productionPlanningProductPhaseListController', ProductPhaseListController);

	ProductPhaseListController.$inject = ['$scope', '$controller',
		'productionplanningProductMainService',
		'productionplanningPhaseDataServiceFactory',
		'ppsPhaseProductionPlaceFilterService',
		'productionplanningCommonActivityDateshiftService'];

	function ProductPhaseListController($scope, $controller,
		productMainService,
		phaseDataServiceFactory,
		ppsPhaseProductionPlaceFilterService,
		ppsCommonActivityDateshiftService) {

		let productPhaseDataService = phaseDataServiceFactory.getService(moduleName, productMainService);

		angular.extend(this, $controller('ppsProcessConfigurationPhaseListController', {
			$scope: $scope,
			dataService: productPhaseDataService,
			parentService: productMainService,
			onParentSelChanged: ppsPhaseProductionPlaceFilterService.onProductSelectionChanged}));
		var initDateshiftConfig = { tools: [{ id: 'fullshift', value: false }], configId: 'productionplanning.phase' };
		ppsCommonActivityDateshiftService.initializeDateShiftController(moduleName, productPhaseDataService, $scope, initDateshiftConfig);
	}

})(angular);