(function () {

	'use strict';
	var moduleName = 'productionplanning.item';

	/**
	 * @ngdoc controller
	 * @name ppsItemGanttController
	 * @function
	 *
	 * @description
	 * Controller for the pps item gantt.
	 **/
	angular.module(moduleName).controller('ppsItemGanttController', PpsItemGanttController);

	PpsItemGanttController.$inject = ['$scope',
		'$injector',
		'platformGridAPI',
		'platformGanttDataService',
		'productionplanningCommonEventMainServiceFactory',
		'ppsItemGanttMappingServiceFactory',
		'productionplanningItemEventUIStandardService',
		'productionplanningCommonEventValidationService',
		'productionplanningItemDataService',
		'productionplanningItemRelationshipService',
		'platformDateshiftHelperService',
		'ppsCommonLoggingHelper',
		'productionplanningCommonActivityDateshiftService',
		'ppsVirtualDataServiceFactory'];

	function PpsItemGanttController(
		$scope,
		$injector,
		platformGridAPI,
		platformGanttDataService,
		productionplanningCommonEventMainServiceFactory,
		ppsItemGanttMappingServiceFactory,
		productionplanningItemEventUIStandardService,
		productionplanningCommonEventValidationService,
		productionplanningItemDataService,
		productionplanningItemRelationshipService,
		platformDateshiftHelperService,
		ppsCommonLoggingHelper,
		activityDateshiftService,
		ppsVirtualDataServiceFactory) {

		var eventService = $injector.get('productionplanningItemEventService');

		var ganttConfig = {
			templatemaps: [{templatekey: 1, visible: true, type: 'planned'}],
			containerId: 0,
			bartype: 'ActivityType',
			barstate: ''
		};

		var ppsEventMappingService = ppsItemGanttMappingServiceFactory.createNewGanttMappingService(ganttConfig);

		var dateshiftConfig = {
			dateshiftId: 'productionplanning.item.gantt'
		};

		var validationService = productionplanningCommonEventValidationService.getValidationService(eventService, 'productionplanning.item.gantt', dateshiftConfig);
		// extend validation for logging
		var schemaOption = {
			typeName: 'EventDto',
			moduleSubModule: 'ProductionPlanning.Common'
		};
		ppsCommonLoggingHelper.extendValidationIfNeeded(eventService, validationService, schemaOption);

		var vdsService = ppsVirtualDataServiceFactory.getVirtualDataService(eventService);
		platformGanttDataService.setGanttConfig({
			leftGrid: {
				uuid: 'bd70b528ae0011e9a2a32a2ae2dbcce4',
				dataService: eventService,
				dateShiftHelperService: platformDateshiftHelperService,
				dateshiftConfig: {
					entityName: 'Event',
					dateshiftId: 'productionplanning.item.gantt',
					dataService: vdsService
				},
				validationService: validationService,
				relationService: productionplanningItemRelationshipService,
				mappingService: ppsEventMappingService,
				uiStandardService: productionplanningItemEventUIStandardService,
				treeView: {
					parentProp: '',
					childProp: 'ChildItems'
				},
				settings: {
					// first or second value can also be null to set limit only in one direction
					// timeRangeLimit: [moment.duration(3,'M'),moment.duration(3,'M')] // UPPERCASE 'M': months (lowercase 'm' would be minutes). y years d days w weeks
					timeRangeLimit: [null, null], // UPPERCASE 'M': months (lowercase 'm' would be minutes). y years d days w weeks,
					snapToDay: true,
					snapToSmallestUnit: false
				}
			},
			toolsConfig: {
				ganttMoveModes: true
			}
		}, $scope);

		$scope.crudTools = false;

		let dateshiftToolConfig = [
			{
				id: 'fullshift',
				value: false,
				hidden: false
			}
		];
		$scope.dateShiftModeTools = platformDateshiftHelperService.getDateshiftTools(vdsService.getServiceName(), dateshiftToolConfig, dateshiftConfig.dateshiftId, $scope);

		$scope.validationService = ppsEventMappingService.getValidationServiceFacade();

		$scope.onRenderCompleted = function () {
			platformGridAPI.events.unregister($scope.leftGridId, 'onRenderCompleted', $scope.onRenderCompleted);
			expandAllNodes();
		};

		function listLoaded() {
			platformGridAPI.events.register($scope.leftGridId, 'onRenderCompleted', $scope.onRenderCompleted);
		}

		function expandAllNodes() {
			platformGridAPI.rows.expandAllNodes($scope.leftGridId);
		}

		platformGridAPI.events.register($scope.leftGridId, 'onRenderCompleted', $scope.onRenderCompleted);
		eventService.registerListLoaded(listLoaded);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.leftGridId, 'onRenderCompleted', $scope.onRenderCompleted);
			eventService.unregisterListLoaded(listLoaded);
		});

		// Dummy data for weekends and exception days. to be provided by proper dataservice & mapping service aka ALM 105891
		// $scope.weekends = [1, 7]; // Weekend definitions consist of week day indexes as understood by JavaScript date function
		// $scope.holidays = [{ Start: moment.utc('2019-12-23'), End: moment.utc('2019-12-29'), Color: '2022634'}];
		// End Dummy data
	}

})();
