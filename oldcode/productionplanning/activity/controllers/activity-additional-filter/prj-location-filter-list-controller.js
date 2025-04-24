/**
 * Created by anl on 5/4/2018.
 */


(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).controller('productionplanningActivityPrjLocationFilterListController', PrjLocationFilterListController);

	PrjLocationFilterListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningActivityPrjLocationFilterDataService',
		'projectLocationStandardConfigurationService',
		'productionplanningCommonStructureFilterService',
		'productionplanningActivityAdditionalFilterClipBoardService',
		'productionplanningActivityActivityDataService',
		'estimateCommonControllerFeaturesServiceProvider'];

	function PrjLocationFilterListController($scope, platformGridControllerService,
											 prjLocationFilterDataService,
											 uiStandardService,
											 ppsCommonStructureFilterService,
											 additionalFilterClipboardService,
											 mainService,
											 estimateCommonControllerFeaturesServiceProvider) {
		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'LocationParentFk', childProp: 'Locations',
			type: 'prjLocation-leadingStructure',
			dragDropService: additionalFilterClipboardService,
			marker: {
				filterService: ppsCommonStructureFilterService,
				filterId: 'productionplanningActivityActivityDataService_PrjLocation',
				dataService: prjLocationFilterDataService,
				serviceName: 'productionplanningActivityPrjLocationFilterDataService',
				serviceMethod: 'getList',
				multiSelect: false
			}
		};

		prjLocationFilterDataService.extendByFilter('productionplanningActivityActivityDataService',
			'productionplanningActivityActivityDataService_PrjLocation', ppsCommonStructureFilterService);
		platformGridControllerService.initListController($scope, uiStandardService, prjLocationFilterDataService, null, gridConfig);

		estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

		function reloadData() {
			var projectId = mainService.getSelectedProjectId();
			if (projectId > 0) {
				prjLocationFilterDataService.load();
			}
		}
		var toolItem = _.find($scope.tools.items, {id:'t13'});  //item filter button
		if(toolItem)
		{
			toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
		}


		ppsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
		mainService.PinningContextChanged.register(reloadData);
		mainService.registerRefreshRequested(prjLocationFilterDataService.refresh);

		$scope.$on('$destroy', function () {
			ppsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
			mainService.unregisterRefreshRequested(prjLocationFilterDataService.refresh);
			mainService.PinningContextChanged.unregister(reloadData);
		});

	}

})(angular);