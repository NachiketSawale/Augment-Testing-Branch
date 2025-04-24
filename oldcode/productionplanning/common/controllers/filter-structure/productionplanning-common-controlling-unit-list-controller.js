/**
 * Created by las on 7/31/2018.
 */


(function () {

	'use strict';
	/*global angular */
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('productionplanningCommonControllingUnitFilterListController', CommonControllingUnitFilterListController);

	CommonControllingUnitFilterListController.$inject = ['$scope', '$injector','platformGridControllerService',
		'productionplanningCommonStructureFilterService',
		'estimateMainCommonUIService',
		'cloudDesktopPinningContextService',
		'productionplanningEngineeringTaskClipboardService',
		'productionplanningCommonControllingUnitFilterDataServiceFactory',
		'estimateCommonControllerFeaturesServiceProvider'];

	function CommonControllingUnitFilterListController($scope, $injector, platformGridControllerService,
		ppsCommonStructureFilterService,
		estimateMainCommonUIService,
		cloudDesktopPinningContextService,
		engineeringTaskClipboardService,
		CommonControllingUnitFilterDataServiceFactory,
		estimateCommonControllerFeaturesServiceProvider) {

		var mainServiceName = $scope.getContentValue('mainService');
		var mainService = $injector.get(mainServiceName);

		var controllingUnitDataService = CommonControllingUnitFilterDataServiceFactory.createCtrlUnitFilterService(mainService);

		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'ControllingunitFk',
			childProp: 'ControllingUnits',
			type: 'ctrlUnit-leadingStructure',
			dragDropService: engineeringTaskClipboardService,
			marker: {
				filterService: ppsCommonStructureFilterService,
				filterId:  mainServiceName + '_ControllingUnit',
				dataService: controllingUnitDataService,
				serviceName: mainServiceName,
				serviceMethod: 'getCtrlUnitList',
				multiSelect: false
			}
		};

		var uiService = estimateMainCommonUIService.createUiService(['Code', 'DescriptionInfo', 'Quantity', 'UomFk', 'Rule', 'Param'],
			{serviceName: 'estimateMainControllingService', itemName: 'EstCtu'});

		CommonControllingUnitFilterDataServiceFactory.extendByFilter(mainServiceName, controllingUnitDataService, mainServiceName + '_ControllingUnit', ppsCommonStructureFilterService);
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
		cloudDesktopPinningContextService.onSetPinningContext.register(reloadData);

		$scope.$on('$destroy', function () {
			ppsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
			cloudDesktopPinningContextService.onSetPinningContext.unregister(reloadData);
		});
	}
})();