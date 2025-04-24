/**
 * Created by las on 2/1/2018.
 */

(function () {

	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.common';
	var ppsCommonModule = angular.module(moduleName);

	ppsCommonModule.factory('productionplanningCommonLiccostgroupControllerService', ['$injector', 'platformGridControllerService',
		'productionplanningCommonStructureValidationService', 'productionplanningCommonStructureUIStandardService','productionplanningEngineeringTaskClipboardService',
		function ($injector, platformGridControllerService,  structureValidationService,structureUIStandardService,PpsEngineeringTaskClipboardService) {

			var service = {};

			service.initLiccostgroupController = function (scope, licCostGroupNumber, mainService, licGroupService,filterService) {

				var mainServiceName = mainService.getServiceName();
				var gridConfig = {
					initCalled: false,
					columns: [],
					type: 'lic-leadingStructure,' + licCostGroupNumber,
					dragDropService: PpsEngineeringTaskClipboardService,
					sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
					marker : {
						filterService: filterService,
						filterId: mainServiceName + '_Liccostgroups' + licCostGroupNumber,
						dataService: licGroupService,
						serviceName: 'productionplanningCommonLiccostgroupsService',
						serviceMethod: 'getLicCostGroup' + licCostGroupNumber + 'List',
						multiSelect:false
					},
					parentProp: 'LicCostGroupFk', childProp: 'ChildItems', childSort: true
				};

				platformGridControllerService.initListController(scope, structureUIStandardService, licGroupService, structureValidationService, gridConfig);

				// refresh data when task are refreshed
				mainService.registerRefreshRequested(licGroupService.refresh);
				scope.$on('$destroy', function () {
					mainService.unregisterRefreshRequested(licGroupService.refresh);
				});
			};

			return service;
		}]);
})();