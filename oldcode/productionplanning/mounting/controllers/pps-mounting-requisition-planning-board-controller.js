(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingRequisitionPlanningBoardController', ProductionplanningMountingRequisitionPlanningBoardController);

	ProductionplanningMountingRequisitionPlanningBoardController.$inject = ['$scope',
		'platformPlanningBoardDataService',
		'calendarUtilitiesService',
		'mountingRequisitionAssignmentService',
		'platformPlanningBoardGridUiConfigService',
		'mountingRequisitionAssignmentPlanningBoardAssignmentMappingService',
		'productionplanningMountingRequisitionDataService'];

	function ProductionplanningMountingRequisitionPlanningBoardController($scope,
																		  platformPlanningBoardDataService,
																		  calendarUtilitiesService,
																		  mountingRequisitionAssignmentService,
																		  platformPlanningBoardGridUiConfigService,
																		  mountingRequisitionAssignmentPlanningBoardAssignmentMappingService,
																		  productionplanningMountingRequisitionDataService) {

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: '090de8ec555111e98647d663bd873d93',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: '8a4e8ca2602a11e98647d663bd873d93',
				dataService: productionplanningMountingRequisitionDataService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('productionplanningMoungtingRequisitionUIStandardService')
			},
			assignment: {
				dataService: mountingRequisitionAssignmentService,
				mappingService: mountingRequisitionAssignmentPlanningBoardAssignmentMappingService
			},
			toolbarConfig: {
				removeTools: ['createAssignment', 'delAssignment']
			}
		}, $scope);

		// platformPlanningBoardDataService.registerInfoChanged(updateData);

		// mountingRequisitionAssignmentService.statusChanged.register(platformPlanningBoardDataService.load);

		$scope.$on('$destroy',
			function () {
				// platformPlanningBoardDataService.unregisterInfoChanged(updateData);
			});

		//platformPlanningBoardDataService.load();
	}
})();