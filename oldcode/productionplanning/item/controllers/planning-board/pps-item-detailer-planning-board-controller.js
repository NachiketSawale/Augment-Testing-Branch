(function () {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsItemDetailerPlanningBoardController', PlanningBoardController);

	PlanningBoardController.$inject = ['$scope', 'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'ppsItemDetailerPlanningBoardSupplierService', 'ppsItemDetailerPlanningBoardSupplierMappingService', 'platformPlanningBoardGridUiConfigService',
		'ppsItemDetailerPlanningBoardAssignmentService', 'ppsItemDetailerPlanningBoardAssignmentMappingService',
		'ppsItemDetailerPlanningBoardDemandService', 'ppsItemDetailerPlanningBoardDemandMappingService',
		'ppsItemDetailerPlanningBoardClipboardService', 'ppsEngineeringDetailerPlanningboardToolbarService'];

	function PlanningBoardController($scope, planningBoardDataService, calendarUtilitiesService,
									 supplierService, supplierMappingService, planningBoardGridUiConfigService,
									 assignmentService, assignmentMappingService,
									 demandService, demandMappingService,
									 clipboardService, toolbarService) {

		let demandUuid = '02adaf5f3ce74ed196326294926bec31';
		demandService.setUuid(demandUuid);

		planningBoardDataService.setPlanningBoardConfiguration({
			uuid: '54ff075f2ad3474f932405091ad74179',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: '17e894edb68f40f29cf97b850754cf35',
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
				dragDropType: 'ppsItem'
			},
			toolbarConfig: {
				customTools: toolbarService.getCustomTools
			}
		}, $scope);
	}
})();