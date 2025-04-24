/**
 * Created by anl on 3/12/2018.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityPlanningBoardController', ActivityPlanningBoardController);

	ActivityPlanningBoardController.$inject = ['$scope',
		'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'activityResourceService',
		'activityRequisitionService',
		'activityReservationService',
		'productionplanningActivityPlanningBoardRequisitionClipboardService',
		'platformPlanningBoardGridUiConfigService',
		'resourceRequisitionPlanningBoardDemandMappingService',
		'resourceReservationPlanningBoardAssignmentMappingService',
		'resourceMasterPlanningBoardSupplierMappingService'];

	function ActivityPlanningBoardController($scope, platformPlanningBoardDataService, calendarUtilitiesService,
       activityResourceService,
       activityRequisitionService,
       activityReservationService,
       ppsActivityPlanningBoardRequisitionClipboardService,
       platformPlanningBoardGridUiConfigService,
       resourceRequisitionPlanningBoardDemandMappingService,
       resourceReservationPlanningBoardAssignmentMappingService,
	   resourceMasterPlanningBoardSupplierMappingService) {

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: '3fe6fe947a1a4c008bdecd9b09e95197',
			timeScale: calendarUtilitiesService,
			registerOnMainDataServiceReload: true,
			supplier: {
				uuid: 'f3df4308aa5a40e38206c092b7ded287',
				dataService: activityResourceService,
				validationService: {},
				mappingService: resourceMasterPlanningBoardSupplierMappingService,
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('resourceMasterUIStandardService')
			},
			assignment: {
				dataService: activityReservationService,
				mappingService: resourceReservationPlanningBoardAssignmentMappingService
			},
			demand: {
				uuid: '5435fe6bf21e49cfbc70cbfce08c6fdf',
				dataService: activityRequisitionService,
				mappingService: resourceRequisitionPlanningBoardDemandMappingService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getDemandGridConfigService('resourceRequisitionUIStandardService'),
				dragDropService: ppsActivityPlanningBoardRequisitionClipboardService,
				dragDropType: 'resourceRequisition'
			}
		}, $scope);

		// platformPlanningBoardDataService.registerInfoChanged(updateData);

		activityReservationService.statusChanged.register(platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID($scope.getContainerUUID()).load);

		$scope.$on('$destroy',
			function () {
				// platformPlanningBoardDataService.unregisterInfoChanged(updateData);
				activityReservationService.statusChanged.unregister(platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID($scope.getContainerUUID()).load);
			});

		//platformPlanningBoardDataService.load();
	}
})();
