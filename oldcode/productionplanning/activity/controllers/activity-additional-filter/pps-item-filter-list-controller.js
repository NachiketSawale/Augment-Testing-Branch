/**
 * Created by anl on 5/4/2018.
 */


(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).controller('productionplanningActivityPpsItemFilterListController', PpsItemFilterListController);

	PpsItemFilterListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningActivityPpsItemFilterDataService',
		'productionplanningItemUIStandardService',
		'productionplanningCommonStructureFilterService',
		'productionplanningActivityActivityDataService',
		'estimateCommonControllerFeaturesServiceProvider'];

	function PpsItemFilterListController($scope, platformGridControllerService,
										 ppsItemFilterDataService,
										 uiStandardService,
										 PpsCommonStructureFilterService,
										 mainService,
										 estimateCommonControllerFeaturesServiceProvider) {
		var gridConfig = {
			initCalled: false,
			columns: [], parentProp: 'PPSItemFk',
			childProp: 'ChildItems',
			marker: {
				filterService: PpsCommonStructureFilterService,
				filterId: 'productionplanningActivityActivityDataService_PpsItem',
				dataService: ppsItemFilterDataService,
				serviceName: 'productionplanningActivityPpsItemFilterDataService',
				serviceMethod: 'getList',
				multiSelect: false
			}
		};

		ppsItemFilterDataService.extendByFilter('productionplanningActivityActivityDataService',
			'productionplanningActivityActivityDataService_PpsItem', PpsCommonStructureFilterService);
		platformGridControllerService.initListController($scope, uiStandardService, ppsItemFilterDataService, null, gridConfig);

		estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

		function reloadData() {
			var projectId = mainService.getSelectedProjectId();
			if (projectId > 0) {
				ppsItemFilterDataService.load();
			}
		}

		var toolItem = _.find($scope.tools.items, {id: 't13'});  //item filter button
		if (toolItem) {
			toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
		}

		PpsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
		mainService.PinningContextChanged.register(reloadData);
		mainService.registerRefreshRequested(ppsItemFilterDataService.refresh);

		$scope.$on('$destroy', function () {
			PpsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
			mainService.PinningContextChanged.unregister(reloadData);
			mainService.unregisterRefreshRequested(ppsItemFilterDataService.refresh);
		});

	}

})(angular);