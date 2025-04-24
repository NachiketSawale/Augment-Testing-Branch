/**
 * Created by anl on 8/04/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.product';

	angular.module(moduleName).controller('productionPlanningProductPhaseDetailController', ProductPhaseDetailController);

	ProductPhaseDetailController.$inject = ['$scope', '$controller',
		'productionplanningProductMainService',
		'productionplanningPhaseDataServiceFactory',
		'ppsPhaseProductionPlaceFilterService'];

	function ProductPhaseDetailController($scope, $controller,
		productMainService,
		phaseDataServiceFactory,
		ppsPhaseProductionPlaceFilterService) {

		let productPhaseDataService = phaseDataServiceFactory.getService(moduleName, productMainService);

		angular.extend(this, $controller('ppsProcessConfigurationPhaseDetailController', {
			$scope: $scope,
			dataService: productPhaseDataService,
			parentService: productMainService,
			onParentSelChanged: ppsPhaseProductionPlaceFilterService.onProductSelectionChanged}));
	}

})(angular);