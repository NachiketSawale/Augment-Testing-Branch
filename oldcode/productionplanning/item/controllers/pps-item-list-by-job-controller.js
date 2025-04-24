(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningItemListByJobController', ProductionplanningItemListByJobController);

	ProductionplanningItemListByJobController.$inject = ['$scope', '$injector', '$controller', '_', '$timeout', 'productionplanningItemDataService', 'platformDataServiceSelectionExtension',
		'basicsCommonToolbarExtensionService'];

	function ProductionplanningItemListByJobController($scope, $injector, $controller , _, $timeout, dataService, platformDataServiceSelectionExtension,
		basicsCommonToolbarExtensionService) {
		angular.extend(this, $controller('productionplanningItemListController', {$scope: $scope}));

		var sideLoadType = 'byJob';
		var filterLgmJobFk;
		var filterProjectFk;
		dataService.registerSideloadContainer($scope.gridId, sideLoadType);
		dataService.registerByJobContainer($scope.gridId);

		function loadJobData(event, ppsItem) {
			//extend filter here!!
			ppsItem = dataService.getLastSideloadSelection()? dataService.getLastSideloadSelection() : ppsItem;
			if (ppsItem) {
				if (filterLgmJobFk !== ppsItem.LgmJobFk) {
					filterLgmJobFk = ppsItem.LgmJobFk;
					if (filterLgmJobFk) {
						var currentFilter = dataService.getSideloadFilter(sideLoadType);
						if (filterProjectFk !== ppsItem.ProjectFk) {
							filterProjectFk = ppsItem.ProjectFk;
							currentFilter.FurtherFilters = [];
						} else {
							currentFilter.FurtherFilters = currentFilter.FurtherFilters || [];
						}
						var projectFilter = {
							Token: 'productionplanning.jobfk',
							Value: filterLgmJobFk
						};
						_.assign(currentFilter.FurtherFilters, [projectFilter]);
						dataService.setSideloadFilter(sideLoadType, currentFilter);
						if(filterLgmJobFk){
							dataService.sideloadData(sideLoadType);
						}
					}
				}
				if(dataService.loadSubItemsForRefresh){
					dataService.loadSubItems(ppsItem);
					dataService.loadSubItemsForRefresh = false;
				}
			} else {
				filterLgmJobFk = null;
			}
		}
		dataService.registerSelectionChanged(loadJobData);

		function preselectSpecifiedPUs(){
			if(!_.isNil(dataService.itemFksFromNavForPuByJobContainer)){
				var itemList = dataService.getUnfilteredList();
				var mappingItems = _.filter(itemList, function (item) {
					return _.some(dataService.itemFksFromNavForPuByJobContainer, function (itemFk) {
						return item.Id === itemFk;
					});
				});
				platformDataServiceSelectionExtension.doMultiSelect(mappingItems[0], mappingItems, dataService.getContainerData());
				dataService.itemFksFromNavForPuByJobContainer = null;
			}
		}
		dataService.registerSideloadEvent(preselectSpecifiedPUs);

		function resetJobSelection() {
			filterLgmJobFk = null;
		}
		dataService.registerListLoadStarted(resetJobSelection);

		if (dataService.hasSelection()) {
			var ppsItem = dataService.getSelected();
			loadJobData(null, ppsItem);
		}

		const prodDescCharacteristics2Section = 62;
		const containerInfoService = $injector.get('productionplanningItemContainerInformationService');
		const characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
			.getService(dataService, prodDescCharacteristics2Section, '0df56a341a8e48808dd929dc8c2ed88f', containerInfoService);

		$timeout(function () {
			characterColumnService.refresh();
		});

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dataService.unregisterSelectionChanged(loadJobData);
			dataService.unregisterListLoadStarted(resetJobSelection);
			dataService.unregisterSideloadEvent(preselectSpecifiedPUs);
			dataService.unregisterSideloadContainer($scope.gridId, sideLoadType);
		});

	}
})(angular);