/**
 * Created by las on 2/23/2018.
 */

(function () {

	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.common';
	var ppsCommonModule = angular.module(moduleName);

	ppsCommonModule.factory('productionplanningCommonPrjcostgroupControllerService', ['$injector', 'platformGridControllerService',
		'productionplanningCommonStructureValidationService', 'productionplanningCommonStructureUIStandardService','productionplanningEngineeringTaskClipboardService',
		function ($injector, platformGridControllerService,  structureValidationService,structureUIStandardService,PpsEngineeringTaskClipboardService) {

			var service = {};

			service.initLiccostgroupController = function (scope, prjCostGroupNumber, mainService, prjGroupService,filterService) {

				var mainServiceName = mainService.getServiceName();
				var gridConfig = {
					initCalled: false,
					columns: [],
					type: 'prj-leadingStructure,' + prjCostGroupNumber,
					dragDropService: PpsEngineeringTaskClipboardService,
					sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
					marker : {
						filterService: filterService,
						filterId: mainServiceName + '_Prjcostgroup' + prjCostGroupNumber,
						dataService: prjGroupService,
						serviceName: 'productionplanningCommonPrjcostgroupsService',
						serviceMethod: 'getPrjCostGroup' + prjCostGroupNumber + 'List',
						multiSelect:false
					},
					parentProp: 'CostGroupParentFk', childProp: 'SubGroups', childSort: true

				};

				platformGridControllerService.initListController(scope, structureUIStandardService, prjGroupService, structureValidationService, gridConfig);

				// refresh data when task are refreshed
				mainService.registerRefreshRequested(prjGroupService.refresh);
				scope.$on('$destroy', function () {
					mainService.unregisterRefreshRequested(prjGroupService.refresh);
				});
			};

			return service;
		}]);
})();