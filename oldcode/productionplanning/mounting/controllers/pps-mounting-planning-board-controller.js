(() => {
	'use strict';

	let moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingPlanningBoardController', ProductionplanningMountingPlanningBoardController);

	ProductionplanningMountingPlanningBoardController.$inject = ['$scope', 'platformPlanningBoardDataService',
		'calendarUtilitiesService', 'mountingResourceService', 'mountingRequisitionService',
		'mountingReservationService', 'ppsMountingPlanningBoardRequisitionClipboardService',
		'platformPlanningBoardGridUiConfigService', 'resourceProjectPlanningBoardReservationService',
		'resourceMasterPlanningBoardSupplierMappingService', 'resourceReservationPlanningBoardAssignmentMappingService',
		'resourceRequisitionPlanningBoardDemandMappingService', 'platformDateshiftHelperService',
		'ppsVirtualDataServiceFactory'];

	function ProductionplanningMountingPlanningBoardController(
		$scope, platformPlanningBoardDataService,
		calendarUtilitiesService, mountingResourceService, mountingRequisitionService,
		mountingReservationService, ppsMountingPlanningBoardRequisitionClipboardService,
		platformPlanningBoardGridUiConfigService, resourceProjectPlanningBoardReservationService,
		resourceMasterPlanningBoardSupplierMappingService, resourceReservationPlanningBoardAssignmentMappingService,
		resourceRequisitionPlanningBoardDemandMappingService, platformDateshiftHelperService,
		ppsVirtualDataServiceFactory) {

		//$scope.resourceGridID = '378b728390df401a9cecccc3bcfb8df7';
		//$scope.requisitionGridID = 'ea6bd9f8d84f4b5f8bf53917e8525888';

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: '58112ccc722e4ef4906a30c0dbe9e1f4',
			timeScale: calendarUtilitiesService,
			registerOnMainDataServiceReload: true,
			supplier: {
				uuid: '378b728390df401a9cecccc3bcfb8df7',
				dataService: mountingResourceService,
				validationService: {},
				mappingService: resourceMasterPlanningBoardSupplierMappingService,
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('resourceMasterUIStandardService')
			},
			assignment: {
				dataService: mountingReservationService,
				mappingService: resourceReservationPlanningBoardAssignmentMappingService
			},
			demand: {
				uuid: 'ea6bd9f8d84f4b5f8bf53917e8525888',
				dataService: mountingRequisitionService,
				mappingService: resourceRequisitionPlanningBoardDemandMappingService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getDemandGridConfigService('resourceRequisitionUIStandardService'),
				dragDropService: ppsMountingPlanningBoardRequisitionClipboardService,
				dragDropType: 'resourceRequisition'
			},
			dateShift: {
				dateShiftHelperService: platformDateshiftHelperService,
				dataService: ppsVirtualDataServiceFactory.getVirtualDataService(mountingReservationService),
				entityName: 'ResReservation',
				dateshiftId: ''
			},
		}, $scope);

		// platformPlanningBoardDataService.registerInfoChanged(updateData);

		mountingReservationService.statusChanged.register(platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID($scope.getContainerUUID()).load);

		$scope.$on('$destroy', () => {
			// platformPlanningBoardDataService.unregisterInfoChanged(updateData);
		});

		//platformPlanningBoardDataService.load();
	}
})();
