/**
 * Created by anl on 8/04/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.formwork';

	angular.module(moduleName).controller('productionPlanningFormworkPhaseListController', FormworkPhaseListController);

	FormworkPhaseListController.$inject = ['$scope', '$controller',
		'ppsFormworkDataService',
		'productionplanningPhaseDataServiceFactory',
		'ppsPhaseProductionPlaceFilterService', 'productionplanningCommonActivityDateshiftService'];

	function FormworkPhaseListController($scope, $controller,
		formworkMainService,
		phaseDataServiceFactory,
		ppsPhaseProductionPlaceFilterService, ppsCommonActivityDateshiftService) {

		let formworkPhaseDataService = phaseDataServiceFactory.getService(moduleName, formworkMainService);

		angular.extend(this, $controller('ppsProcessConfigurationPhaseListController', {
			$scope: $scope,
			dataService: formworkPhaseDataService,
			parentService: formworkMainService,
			onParentSelChanged: ppsPhaseProductionPlaceFilterService.onFormworkSelectionChanged}));

		let initDateshiftConfig = { tools: [{ id: 'dateshiftModes', value: 'self' }, { id: 'fullshift', value: false }], configId: 'productionplanning.phase' };
		ppsCommonActivityDateshiftService.initializeDateShiftController(moduleName, formworkPhaseDataService, $scope, initDateshiftConfig);


	}

})(angular);