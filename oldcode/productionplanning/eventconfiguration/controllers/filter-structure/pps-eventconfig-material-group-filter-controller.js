/**
 * Created by anl on 7/2/2019.
 */

(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).controller('productionplanningEventconfigurationMaterialGroupFilterListController', MaterialGroupFilterListController);

	MaterialGroupFilterListController.$inject = ['$scope',
		'productionplanningEventconfigurationMaterialGroupFilterDataService',
		'productionplanningEventconfigurationSequenceDataService',
		'productionplanningCommonStructureFilterService',
		'platformGridControllerService',
		'basicsMaterialCatalogGroupUIStandardService'];

	function MaterialGroupFilterListController($scope,
										  dataService,
										  mainService,
										  ppsCommonStructureFilterService,
										  platformGridControllerService,
										  uiStandardService) {

		var filterId = 'productionplanningEventconfigurationSequenceDataService_MaterialGroup';
		var gridConfig = {
			initCalled: false,
			columns: [],
			type: 'materialGroup-leadingStructure',
			dragDropService: null,
			parentProp: 'MaterialGroupFk', childProp: 'ChildItems',
			marker: {
				filterService: ppsCommonStructureFilterService,
				filterId: filterId,
				dataService: dataService,
				serviceName: dataService.getServiceName(),
				serviceMethod: 'getList',
				multiSelect: false
			}
		};

		var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
		_.forEach(columns, function(column){
			column.editor = null;
		});

		var uiService = {
			getStandardConfigForListView: () => {
				return {
					addValidationAutomatically: true,
					columns: columns
				};
			}
		};

		dataService.extendByFilter(mainService.getServiceName(), filterId, ppsCommonStructureFilterService);
		platformGridControllerService.initListController($scope, uiService, dataService, null, gridConfig);


		var toolItem = _.find($scope.tools.items, {id: 't13'});  //item filter button
		if (toolItem) {
			toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
		}

		ppsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);

		// refresh data when task are refreshed
		mainService.registerRefreshRequested(dataService.refresh);
		$scope.$on('$destroy', function () {
			ppsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
			mainService.unregisterRefreshRequested(dataService.refresh);
		});

	}
})(angular);