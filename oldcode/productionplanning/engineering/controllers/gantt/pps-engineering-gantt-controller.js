/*
 * Created by las on 26/08/2020.
 */

(function () {

	'use strict';
	var moduleName = 'productionplanning.engineering';

	/**
	 * @ngdoc controller
	 * @name ppsEngineeringGanttController
	 * @function
	 *
	 * @description
	 * Controller for the pps item gantt in engineering module.
	 **/
	angular.module(moduleName).controller('ppsEngineeringGanttController', PpsEngineeringGanttController);

	PpsEngineeringGanttController.$inject = ['$scope',
		'$injector',
		'platformGridAPI',
		'platformGanttDataService',
		'ppsEngineeringGanttMappingServiceFactory',
		'productionplanningItemEventUIStandardService',
		'productionplanningCommonEventValidationService',
		'ppsEngineeringGanttRelationshipService',
		'platformDateshiftHelperService'];

	function PpsEngineeringGanttController($scope,
		$injector,
		platformGridAPI,
		platformGanttDataService,
										   ppsEngineeringGanttMappingServiceFactory,
		productionplanningItemEventUIStandardService,
		productionplanningCommonEventValidationService,
										   ppsEngineeringGanttRelationshipService,
		platformDateshiftHelperService) {

		var eventService = $injector.get('ppsEngineeringGanttEventService');

		var ganttConfig = {
			templatemaps: [{templatekey:1, visible:true, type:'planned'}],
			containerId: 0,
			bartype: 'ActivityType',
			barstate: ''
		};

		var ppsEventMappingService = ppsEngineeringGanttMappingServiceFactory.createNewGanttMappingService(ganttConfig);

		var dateshiftConfig =  {
			dateshiftId: 'gridTool'
		};

		platformGanttDataService.setGanttConfig({
			leftGrid: {
				uuid: '17271bb5b62c4443a3ac727d429a5078',
				dataService: eventService,
				dateShiftHelperService: platformDateshiftHelperService,
				validationService: productionplanningCommonEventValidationService.getValidationService(eventService, 'productionplanning.engineering.gantt', dateshiftConfig),
				relationService: ppsEngineeringGanttRelationshipService,
				mappingService: ppsEventMappingService,
				uiStandardService: productionplanningItemEventUIStandardService,
				treeView: {
					parentProp: '',
					childProp: 'ChildItems'
				},
				settings: {
					// first or second value can also be null to set limit only in one direction
					// timeRangeLimit: [moment.duration(3,'M'),moment.duration(3,'M')] // UPPERCASE 'M': months (lowercase 'm' would be minutes). y years d days w weeks
					timeRangeLimit: [null,null], // UPPERCASE 'M': months (lowercase 'm' would be minutes). y years d days w weeks,
					snapToDay: true,
					snapToSmallestUnit: false
				}
			},
			toolsConfig: {
				ganttMoveModes: true
			}
		}, $scope);

		$scope.crudTools = false;

		var dateshiftToolConfig = [
			{
				id: 'fullshift',
				value: false,
				hidden: true
			}
		];
		var dateshiftDefaultModeTool = platformDateshiftHelperService.getDateshiftTools(eventService.getServiceName(), dateshiftToolConfig, 'default', $scope);
		var gridToolConfig = [
			{
				id: 'dateshiftModes',
				excluded: true
			},
			{
				id: 'fullshift',
				value: true
			}
		];
		var gridTool = platformDateshiftHelperService.getDateshiftTools(eventService.getServiceName(), gridToolConfig, dateshiftConfig.dateshiftId, $scope);
		$scope.dateShiftModeTools = gridTool.concat(dateshiftDefaultModeTool);

		$scope.validationService = ppsEventMappingService.getValidationServiceFacade();

		$scope.onRenderCompleted = function() {
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