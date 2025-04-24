/**
 * Created by anl on 8/04/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.formwork';

	angular.module(moduleName).controller('productionPlanningFormworkPhaseDetailController', FormworkPhaseDetailController);

	FormworkPhaseDetailController.$inject = ['$scope', '$controller',
		'ppsFormworkDataService',
		'productionplanningPhaseDataServiceFactory',
		'ppsPhaseProductionPlaceFilterService'];

	function FormworkPhaseDetailController($scope, $controller,
		formworkMainService,
		phaseDataServiceFactory,
		ppsPhaseProductionPlaceFilterService) {

		let formworkPhaseDataService = phaseDataServiceFactory.getService(moduleName, formworkMainService);

		angular.extend(this, $controller('ppsProcessConfigurationPhaseDetailController', {
			$scope: $scope,
			dataService: formworkPhaseDataService,
			parentService: formworkMainService,
			onParentSelChanged: ppsPhaseProductionPlaceFilterService.onFormworkSelectionChanged}));
	}

})(angular);