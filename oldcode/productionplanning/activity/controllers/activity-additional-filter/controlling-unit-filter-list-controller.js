/**
 * Created by anl on 5/7/2018.
 */


(function () {

	'use strict';
	/*global angular */
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityControllingUnitFilterListController', ControllingUnitFilterListController);

	ControllingUnitFilterListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningCommonStructureFilterService',
		'estimateMainCommonUIService',
		'productionplanningActivityControllingUnitFilterDataService',
		'productionplanningActivityAdditionalFilterClipBoardService',
		'productionplanningActivityActivityDataService',
		'estimateCommonControllerFeaturesServiceProvider'];

	function ControllingUnitFilterListController($scope, platformGridControllerService,
												 ppsCommonStructureFilterService,
												 estimateMainCommonUIService,
												 controllingUnitDataService,
												 additionalFilterClipboardService,
												 mainService,
												 estimateCommonControllerFeaturesServiceProvider) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'ControllingunitFk',
			childProp: 'ControllingUnits',
			type: 'ctrlUnit-leadingStructure',
			dragDropService: additionalFilterClipboardService,
			marker: {
				filterService: ppsCommonStructureFilterService,
				filterId: 'productionplanningActivityActivityDataService_ControllingUnit',
				dataService: controllingUnitDataService,
				serviceName: 'productionplanningActivityControllingUnitFilterDataService',
				serviceMethod: 'getList',
				multiSelect: false
			}
		};

		var uiService = estimateMainCommonUIService.createUiService(['Code', 'DescriptionInfo', 'Quantity', 'UomFk', 'Rule', 'Param'],
			{serviceName: 'estimateMainControllingService', itemName: 'EstCtu'});

		controllingUnitDataService.extendByFilter('productionplanningActivityActivityDataService',
			'productionplanningActivityActivityDataService_ControllingUnit', ppsCommonStructureFilterService);
		platformGridControllerService.initListController($scope, uiService, controllingUnitDataService, null, gridConfig);

		estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

		function reloadData() {
			var projectId = mainService.getSelectedProjectId();
			if (projectId > 0) {
				controllingUnitDataService.load();
			}
		}

		var toolItem = _.find($scope.tools.items, {id:'t13'});  //item filter button
		if(toolItem)
		{
			toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
		}

		ppsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
		mainService.PinningContextChanged.register(reloadData);
		mainService.registerRefreshRequested(controllingUnitDataService.refresh);

		$scope.$on('$destroy', function () {
			ppsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
			mainService.unregisterRefreshRequested(controllingUnitDataService.refresh);
			mainService.PinningContextChanged.unregister(reloadData);
		});
	}
})();