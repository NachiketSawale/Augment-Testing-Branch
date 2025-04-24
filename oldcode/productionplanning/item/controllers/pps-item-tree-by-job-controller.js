(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningItemTreeByJobController', TreeByJobController);

	TreeByJobController.$inject = ['$scope', '$controller', '$injector', '$timeout', 'platformGridAPI','_',
		'productionplanningItemDataService', 'platformDataServiceSelectionExtension'];

	function TreeByJobController($scope, $controller, $injector, $timeout, platformGridAPI , _,
		dataService, platformDataServiceSelectionExtension) {
		angular.extend(this, $controller('productionplanningItemTreeController', {$scope: $scope}));

		var sideLoadType = 'treeByJob';
		var filterLgmJobFk;
		var filterProjectFk;
		dataService.registerSideloadContainer($scope.gridId, sideLoadType, 'PPSItemFk');

		function loadJobData(event, ppsItem) {
			//extend filter here!!
			ppsItem = dataService.getLastSideloadSelection() ? dataService.getLastSideloadSelection() : ppsItem;
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
							dataService.sideloadData(sideLoadType, 'PPSItemFk');
						}
					}
				}
				if (dataService.loadSubItemForRefresh) {
					dataService.loadSubItems(ppsItem);
					dataService.loadSubItemForRefresh = false;
				}
			} else {
				filterLgmJobFk = null;
			}
		}
		dataService.registerSelectionChanged(loadJobData);

		function preselectSpecifiedPUs(){
			if(!_.isNil(dataService.itemFksFromNavForTreePuByJobContainer)){
				var mappingLeafItems = preselectRecordsOnPpsItemTreeContainer();
				preselectRecordsOnPpsItemTreeByJobContainer(mappingLeafItems);
				// Remark: If the selected PU is 'leaf', when we set selected record on ppsItemTreeContoller, the relative 'leaf' record on ppsItemTreeByJobController cannot be triggered.
				//         So here we still need to set selection for case of 'leaf' PU.(by zwz 2021/08/11)

				dataService.itemFksFromNavForTreePuByJobContainer = null;
			}
		}

		function preselectRecordsOnPpsItemTreeContainer(){
				var itemList = dataService.getUnfilteredList();
				var mappingItems = _.filter(itemList, function (item) {
					return _.some(dataService.itemFksFromNavForTreePuByJobContainer, function (itemFk) {
						return item.Id === itemFk;
					});
				});
				platformDataServiceSelectionExtension.doMultiSelect(mappingItems[0], mappingItems, dataService.getContainerData());

				return _.filter(mappingItems, function (item) {
						return !_.isNil(item.PPSItemFk);
				});
		}

		function preselectRecordsOnPpsItemTreeByJobContainer(mappingLeafItems){
			function flatten(input, output, childProp) {
				var i;
				for (i = 0; i < input.length; i++) {
					output.push(input[i]);
					if (input[i][childProp] && input[i][childProp].length > 0) {
						flatten(input[i][childProp], output, childProp);
					}
				}
				return output;
			}

			function getAncestor(currentNode, nodeList) {
				if(currentNode.PPSItemFk){
					var parentNode = _.find(nodeList, {Id: currentNode.PPSItemFk});
					if(parentNode){
						return getAncestor(parentNode, nodeList);
					}
					else{
						return;
					}
				}
				else{
					return currentNode;
				}
			}

			if(_.isArray(mappingLeafItems) && mappingLeafItems.length > 0){
				// to make it simple, we only select the first one
				var mappingLeafItem = mappingLeafItems[0];

				var rowTree = platformGridAPI.rows.getRows($scope.gridId);
				var rowList = [];
				flatten(rowTree, rowList, 'ChildItems');

				var mappingRow = _.find(rowList, {Id: mappingLeafItem.Id});
				var rootRow = getAncestor(mappingRow, rowList);

				// select the root row, then expand all subRows of the root row
				platformGridAPI.rows.selection({
									gridId: $scope.gridId,
									wantsArray: true,
									rows:[rootRow]
								});
				platformGridAPI.rows.expandAllSubNodes($scope.gridId);

				// select the mappingRow
				rowTree = platformGridAPI.rows.getRows($scope.gridId); // after expanding, the mapping row is showed on the UI, so rowTree include it now.
				mappingRow = _.find(rowTree, {Id: mappingLeafItem.Id}); // reget mappingRow again, because after expanding, data have been refresh
				platformGridAPI.rows.selection({
									gridId: $scope.gridId,
									wantsArray: true,
									rows:[mappingRow]
								});
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
			.getService(dataService, prodDescCharacteristics2Section, '475a5d3fec674e2dbe4675e0f935c20e', containerInfoService);

		$timeout(function () {
			characterColumnService.refresh();
		});

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dataService.unregisterSelectionChanged(loadJobData);
			dataService.unregisterSideloadEvent(preselectSpecifiedPUs);
			dataService.unregisterSideloadContainer($scope.gridId, sideLoadType, 'PPSItemFk');
		});

	}
})(angular);