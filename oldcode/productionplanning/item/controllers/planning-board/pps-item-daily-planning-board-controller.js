(() => {
	'use strict';

	let moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsItemDailyPlanningBoardController', DailyPlanningBoardController);

	DailyPlanningBoardController.$inject = [
		'$scope',
		'platformPlanningBoardDataService',
		'calendarUtilitiesService',
		'platformPlanningBoardGridUiConfigService',
		'ppsItemDailyPlanningBoardSupplierService',
		'ppsItemDailyPlanningBoardAssignmentService',
		'ppsItemDailyPlanningBoardAssignmentMappingService',
		'basicsLookupdataLookupFilterService',
		'platformDateshiftHelperService',
		'ppsVirtualDataServiceFactory'
	];

	function DailyPlanningBoardController(
		$scope,
		platformPlanningBoardDataService,
		calendarUtilitiesService,
		platformPlanningBoardGridUiConfigService,
		ppsItemDailyPlanningBoardSupplierService,
		ppsItemDailyPlanningBoardAssignmentService,
		ppsItemDailyPlanningBoardAssignmentMappingService,
		basicsLookupdataLookupFilterService,
		platformDateshiftHelperService,
		ppsVirtualDataServiceFactory
	) {

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: '5f50ec7e7eec4cd4bc1dd9633ed14c8d',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: 'e55ca9644cc344bc96954d1893df1fb8',
				dataService: ppsItemDailyPlanningBoardSupplierService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('basicsSiteUIStandardService')
			},
			assignment: {
				dataService: ppsItemDailyPlanningBoardAssignmentService,
				mappingService: ppsItemDailyPlanningBoardAssignmentMappingService
			},
			toolbarConfig: {
				removeTools: ['createAssignment', 'delAssignment', 'setStatus', 'moveModes'],
				customTools: ppsItemDailyPlanningBoardAssignmentService.getCustomTools
			},
			dateShift: {
				dateShiftHelperService: platformDateshiftHelperService,
				dataService: ppsVirtualDataServiceFactory.getVirtualDataService('productionplanning.common'),
				entityName: 'DailyProduction',
				dateshiftId: 'productionplanning.dailyProduction'
			},
		}, $scope);

		var filters = [
			{
				key: 'pps-daily-supplier-filter',
				serverSide: true,
				fn: function (entity) {
					return {
						IsProductionArea: true,
						SiteFk: entity.SiteFk
					};
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		$scope.$on('$destroy', () => {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		});
	}
})();
