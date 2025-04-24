(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).controller('ppsEngDetailerPlanningBoardController', PlanningBoardController);

	PlanningBoardController.$inject = ['$scope', 'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'ppsEngDetailerPlanningBoardSupplierService', 'ppsEngDetailerPlanningBoardSupplierMappingService', 'platformPlanningBoardGridUiConfigService',
		'ppsEngDetailerPlanningBoardAssignmentService', 'ppsEngDetailerPlanningBoardAssignmentMappingService',
		'ppsEngDetailerPlanningBoardDemandService', 'ppsEngDetailerPlanningBoardDemandMappingService',
		'ppsEngDetailerPlanningBoardClipboardService',
		'ppsEngineeringDetailerPlanningboardToolbarService'];

	function PlanningBoardController($scope, planningBoardDataService, calendarUtilitiesService,
									 supplierService, supplierMappingService, planningBoardGridUiConfigService,
									 assignmentService, assignmentMappingService,
									 demandService, demandMappingService,
									 clipboardService,
									 ppsEngineeringDetailerPlanningboardToolbarService) {
		let demandUuid = '02adaf5f3ce74ed196326294926bec31';
		demandService.setUuid(demandUuid);

		planningBoardDataService.setPlanningBoardConfiguration({
			uuid: '1bd2af4a2d844fa09cf6eaf01f53b5e0',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: '320cce0b594741db868678136980d57b',
				dataService: supplierService,
				validationService: {},
				mappingService: supplierMappingService,
				uiStandardService: planningBoardGridUiConfigService.getSupplierGridConfigService('basicsClerkUIStandardService')
			},
			assignment: {
				dataService: assignmentService,
				mappingService: assignmentMappingService
			},
			demand: {
				uuid: demandUuid,
				dataService: demandService,
				mappingService: demandMappingService,
				validationService: {},
				uiStandardService: planningBoardGridUiConfigService.getDemandGridConfigService('productionplanningEngineeringTaskUIStandardService'),
				dragDropService: clipboardService,
				dragDropType: 'engTask'
			},
			toolbarConfig: {
				customTools: ppsEngineeringDetailerPlanningboardToolbarService.getCustomTools
			}
		}, $scope);
	}
})();