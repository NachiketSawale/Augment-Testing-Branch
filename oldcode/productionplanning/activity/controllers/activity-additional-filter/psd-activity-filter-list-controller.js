/**
 * Created by anl on 6/11/2018.
 */


(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).controller('productionplanningActivityPsdActivityFilterListController', PsdActivityFilterListController);

	PsdActivityFilterListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningActivityPsdActivityFilterDataService',
		'schedulingMainActivityStandardConfigurationService',
		'productionplanningCommonStructureFilterService',
		'productionplanningActivityActivityDataService',
		'estimateCommonControllerFeaturesServiceProvider',
		'productionplanningActivityAdditionalFilterClipBoardService'];

	function PsdActivityFilterListController($scope, platformGridControllerService,
											 psdActivityFilterDataService,
											 psdActivityUiStandardService,
											 PpsCommonStructureFilterService,
											 mainService,
											 estimateCommonControllerFeaturesServiceProvider,
											 additionalFilterClipboardService) {
		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'ParentActivityFk',
			childProp: 'Activities',
			type: 'psdActivity-leadingStructure',
			dragDropService: additionalFilterClipboardService,
			marker: {
				filterService: PpsCommonStructureFilterService,
				filterId: 'productionplanningActivityActivityDataService_PsdActivity',
				dataService: psdActivityFilterDataService,
				serviceName: 'productionplanningActivityPsdActivityFilterDataService',
				serviceMethod: 'getList',
				multiSelect: false
			}
		};

		psdActivityFilterDataService.extendByFilter('productionplanningActivityActivityDataService',
			'productionplanningActivityActivityDataService_PsdActivity', PpsCommonStructureFilterService);
		platformGridControllerService.initListController($scope, psdActivityUiStandardService, psdActivityFilterDataService, null, gridConfig);

		estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

		function reloadData() {
			var projectId = mainService.getSelectedProjectId();
			if (projectId > 0) {
				psdActivityFilterDataService.load();
			}
		}

		var toolItem = _.find($scope.tools.items, {id: 't13'});  //item filter button
		if (toolItem) {
			toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
		}

		PpsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
		mainService.PinningContextChanged.register(reloadData);
		mainService.registerRefreshRequested(psdActivityFilterDataService.refresh);

		$scope.$on('$destroy', function () {
			PpsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
			mainService.PinningContextChanged.unregister(reloadData);
			mainService.unregisterRefreshRequested(psdActivityFilterDataService.refresh);
		});

	}

})(angular);