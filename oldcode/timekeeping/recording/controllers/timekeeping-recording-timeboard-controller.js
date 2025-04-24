(function () {
	'use strict';

	var moduleName = 'timekeeping.recording';

	angular.module(moduleName).controller('timekeepingRecordingTimeboardController', TimekeepingRecordingTimeboardController);

	TimekeepingRecordingTimeboardController.$inject = ['platformPlanningBoardDataService', 'calendarUtilitiesService',
		'timekeepingRecordingBoardSupplierService', 'timekeepingShiftModelDataService', 'timekeepingRecordingTimeboardAssignmentService',
		'timekeepingRecordingTimeBoardClipboardService', 'platformPlanningBoardGridUiConfigService', 'timekeepingShiftModelTimeboardDemandDataService', 'timekeepingShiftModelTimeboardDemandMappingService',
		'timekeepingRecordingBoardAssignmentMappingService', '$scope'];

	function TimekeepingRecordingTimeboardController(platformPlanningBoardDataService, calendarUtilitiesService, timekeepingRecordingBoardSupplierService, timekeepingShiftModelDataService, timekeepingRecordingTimeboardAssignmentService, resourceReservationPlanningBoardClipboardService, platformPlanningBoardGridUiConfigService, timekeepingRecordingBoardDemandService, timekeepingShiftModelTimeboardDemandMappingService, timekeepingRecordingBoardAssignmentMappingService, $scope) {

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: '633191b88fb24cf4a36899ce4d5f5c53',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: '91a2b7680c994161b1c8c31dabb8effd',
				dataService: timekeepingRecordingBoardSupplierService,
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('timekeepingEmployeeLayoutService')
			},
			assignment: {
				dataService: timekeepingRecordingTimeboardAssignmentService,
				mappingService: timekeepingRecordingBoardAssignmentMappingService
			},
			demand: {
				uuid: '6abada474bbf4cb9866e59b2c418f0e2',
				dataService: timekeepingRecordingBoardDemandService,
				mappingService: timekeepingShiftModelTimeboardDemandMappingService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getDemandGridConfigService('timekeepingShiftModelWorkingTimeLayoutService'),
				dragDropService: resourceReservationPlanningBoardClipboardService,
				dragDropType: 'shiftWorkingTime'
			}
		}, $scope);
		platformPlanningBoardDataService.load();
	}
})();
