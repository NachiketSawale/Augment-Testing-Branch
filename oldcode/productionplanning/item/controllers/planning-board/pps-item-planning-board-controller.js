(() => {
	'use strict';

	let moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemPlanningBoardController', ProductionplanningItemPlanningBoardController);

	ProductionplanningItemPlanningBoardController.$inject = ['$scope',
		'platformPlanningBoardDataService', 'calendarUtilitiesService', 'platformPlanningBoardGridUiConfigService',
		'ppsItemPlanningBoardSiteSupplierService', 'ppsItemPlanningBoardProductionSetAssignmentService',
		'ppsItemPlanningBoardAssignmentMappingService', 'platformDateshiftHelperService',
		'productionplanningCommonEventValidationService', 'ppsCommonLoggingHelper', 'ppsVirtualDataServiceFactory'];

	function ProductionplanningItemPlanningBoardController(
		$scope, platformPlanningBoardDataService,
		calendarUtilitiesService,
		platformPlanningBoardGridUiConfigService,
		ppsItemPlanningBoardSiteSupplierService,
		ppsItemPlanningBoardProductionSetAssignmentService,
		ppsItemPlanningBoardAssignmentMappingService,
		platformDateshiftHelperService,
		productionplanningCommonEventValidationService,
		ppsCommonLoggingHelper,
		ppsVirtualDataServiceFactory) {

		let dateshiftConfig = {
			dateshiftId: 'PlanningBoardContainer'
		};
		let validationService = productionplanningCommonEventValidationService.getValidationService(ppsItemPlanningBoardProductionSetAssignmentService, 'productionplanning.item.planningboard', dateshiftConfig);
		// extend validation for logging
		let schemaOption = {
			typeName: 'EventDto',
			moduleSubModule: 'ProductionPlanning.Common'
		};
		ppsCommonLoggingHelper.extendValidationIfNeeded(ppsItemPlanningBoardProductionSetAssignmentService, validationService, schemaOption);

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: '7208fb7296494c2b9742547862db8649',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: '479e8e5666db47e8b2352e2d89f518c7',
				dataService: ppsItemPlanningBoardSiteSupplierService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('basicsSiteUIStandardService')
			},
			assignment: {
				dataService: ppsItemPlanningBoardProductionSetAssignmentService,
				mappingService: ppsItemPlanningBoardAssignmentMappingService
			},
			dateShift: {
				dateShiftHelperService: platformDateshiftHelperService,
				dataService: ppsVirtualDataServiceFactory.getVirtualDataService(ppsItemPlanningBoardProductionSetAssignmentService),
				entityName: 'Event',
				dateshiftId: 'productionplanning.item.planningboard',
				dateShiftToolConfig : { tools : [ { id: 'fullshift', value: false, hidden: true } ], configId: 'productionplanning.item.planningboard' }
			},
			toolbarConfig: {
				customTools: ppsItemPlanningBoardProductionSetAssignmentService.getCustomTools(),
				removeTools: ['delAssignment', 'createAssignment']
			}
		}, $scope);

		if(!$scope.gridId && $scope.getContainerUUID){
			$scope.gridId = $scope.getContainerUUID();
		}

	}
})();
