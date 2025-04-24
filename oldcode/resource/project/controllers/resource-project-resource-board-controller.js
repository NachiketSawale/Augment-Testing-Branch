(function () {
	'use strict';

	var moduleName = 'resource.project';

	angular.module(moduleName).controller('resourceProjectResourceBoardController', ResourceProjectResourceBoardController);

	ResourceProjectResourceBoardController.$inject = ['$scope', 'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'resourceProjectDataService', 'resourceProjectPlanningBoardReservedResourcesService',
		'platformPlanningBoardGridUiConfigService', 'resourceReservationResourceAssignmentMappingService'];

	function ResourceProjectResourceBoardController($scope, platformPlanningBoardDataService, calendarUtilitiesService,
		resourceProjectDataService, resourceProjectPlanningBoardReservedResourcesService,
		platformPlanningBoardGridUiConfigService, resourceReservationResourceAssignmentMappingService) {

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: '3ccc094f9ef64fc6b3f6af64bc2d5583',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: '5b6baa14070a4da5892b24f0754612c8',
				dataService: resourceProjectDataService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('resourceMasterUIStandardService')
			},
			assignment: {
				dataService: resourceProjectPlanningBoardReservedResourcesService,
				mappingService: resourceReservationResourceAssignmentMappingService
			}}, $scope);
	}
})();
