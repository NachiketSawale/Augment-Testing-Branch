/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _, Slick */

	let moduleName = 'estimate.main';

	angular.module(moduleName).value('estimateMainWicGroupControllerListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 1,
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						editor: null,
						width: 80
					},
					{
						id: 2,
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						editor: null,
						readonly: true,
						width: 160
					}
				]
			};
		}
	});

	angular.module(moduleName).controller('estimateMainWicGroupController', [
		'$scope', 'estimateMainWicGroupControllerListColumns', 'platformGridAPI', 'boqWicItemService', 'platformTranslateService','boqWicGroupService', 'estimateProjectRateBookConfigDataService',
		function ($scope, estimateMainWicGroupControllerListColumns, platformGridAPI, boqWicItemService, platformTranslateService,boqWicGroupService, estimateProjectRateBookConfigDataService) {


			let parentScope = $scope.$parent;
			$scope.gridWicGroupId = 'F768B52CBEC94C24BD81C9DA3404BD94';
			$scope.gridData = {
				state: $scope.gridWicGroupId
			};

			let gridConfig = {
				data: [],
				columns: angular.copy(estimateMainWicGroupControllerListColumns.getStandardConfigForListView().columns),
				id: $scope.gridWicGroupId,
				lazyInit: false,
				isStaticGrid: true,
				options: {
					tree: true, indicator: false,
					editorLock: new Slick.EditorLock(),
					parentProp: 'WicGroupFk',
					childProp: 'WicGroups',
					multiSelect: false
				},
				enableConfigSave: true
			};

			platformGridAPI.grids.config(gridConfig);
			platformTranslateService.translateGridConfig(gridConfig.columns);

			if (parentScope.ngModel && _.isNumber(parentScope.ngModel)){
				platformGridAPI.items.data([]);
			}else{
				boqWicGroupService.loadWicGroup().then(function (response) {
					platformGridAPI.items.data($scope.gridWicGroupId, response);
					$scope.$root.safeApply();
				});
			}

			parentScope.$watch('isCatLoading', function(isLoading){
				$scope.isLoading = isLoading;
			});

			function onListLoaded(){
				platformGridAPI.events.unregister($scope.gridWicGroupId, 'onSelectedRowsChanged', loadWicGroups);
				let treeData = boqWicGroupService.getTree();
				if($scope.displayText === '') {
					treeData = estimateProjectRateBookConfigDataService.getFilterData(treeData, 3);
					boqWicGroupService.setDataItems(treeData);
				}
				platformGridAPI.items.data($scope.gridWicGroupId, treeData);

				let isItemFiltered = boqWicGroupService.isItemFilterEnabled();
				let boqItem = boqWicItemService.getSelected();
				let catId = _.isEmpty(boqItem) ? [] : _.map([boqItem], 'BoqWicCatFk');

				if(getGrid()) {
					let rows = getGrid().dataView.mapIdsToRows(catId);

					if (isItemFiltered) {
						getGrid().instance.setSelectedRows(rows);
						boqWicGroupService.setItemFilter(null); // clear the filter for next search
					}
				}
				platformGridAPI.events.register($scope.gridWicGroupId, 'onSelectedRowsChanged', loadWicGroups);
			}

			function loadWicGroups(e, args){
				boqWicGroupService.setShowHeaderAfterSelectionChanged(null);
				parentScope.isLoading = true;
				let item = args.grid.getDataItem(args.rows);
				boqWicGroupService.setSelected(item);
				if (parentScope.enableMultiSelection === false){
					parentScope.modalOptions.disableOkButton = true;
				}

				boqWicItemService.setOptions(parentScope.options);
				boqWicItemService.search(parentScope.searchValue, parentScope, item.Id);
			}



			function reset(wicGroupSelected){
				boqWicGroupService.loadWicGroup().then(function(treeList){

					platformGridAPI.events.unregister($scope.gridWicGroupId, 'onSelectedRowsChanged', loadWicGroups);

					if (_.isEmpty(wicGroupSelected)){
						if(getGrid()) {
							getGrid().instance.setSelectedRows([]);
						}
						// platformGridAPI.items.data($scope.gridId, treeList);
					}else{

						let itemList = boqWicGroupService.getFlattenByTree(treeList);
						let cat = _.find(itemList, {'Id': wicGroupSelected.Id});

						if (!_.isEmpty(cat)){
							boqWicGroupService.expandNodeParent(cat);
							if(getGrid()){
								let rows = getGrid().dataView.mapIdsToRows([wicGroupSelected.Id]);
								getGrid().instance.setSelectedRows(rows);
							}

							boqWicGroupService.setSelected(cat);

							treeList = estimateProjectRateBookConfigDataService.getFilterData(treeList, 3);
							let filterIds = estimateProjectRateBookConfigDataService.getFilterIds(3);
							if(filterIds && filterIds.length > 0 && !_.includes(filterIds, cat.Id)) {
								treeList.push(cat);
							}

							platformGridAPI.items.data($scope.gridWicGroupId, treeList);
							platformGridAPI.rows.scrollIntoViewByItem($scope.gridWicGroupId, cat);
						}
					}

					let  wicItemGrid = boqWicItemService.getGridId();
					let isCollapse = boqWicItemService.getBoqItemIsCollapse();

					if(platformGridAPI.grids.exist(wicItemGrid)) {
						if (!isCollapse) {
							platformGridAPI.rows.expandAllNodes(wicItemGrid);
						} else {
							platformGridAPI.rows.collapseAllNodes(wicItemGrid);
						}
					}
					platformGridAPI.events.register($scope.gridWicGroupId, 'onSelectedRowsChanged', loadWicGroups);
					$scope.isLoading = false;
					$scope.isReady = true;
				});

			}


			platformGridAPI.events.register($scope.gridWicGroupId, 'onSelectedRowsChanged', loadWicGroups);

			function getGrid(){
				return platformGridAPI.grids.element('id', $scope.gridWicGroupId);
			}

			boqWicGroupService.registerListLoaded(onListLoaded);
			boqWicGroupService.reset.register(reset);
			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridWicGroupId);
				platformGridAPI.events.unregister($scope.gridWicGroupId, 'onSelectedRowsChanged', loadWicGroups);
				boqWicGroupService.unregisterListLoaded(onListLoaded);
				boqWicGroupService.reset.unregister(reset);
			});
		}]);
})();
