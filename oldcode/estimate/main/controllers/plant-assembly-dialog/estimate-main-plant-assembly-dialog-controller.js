/**
 * $Id: estimate-main-plant-assembly-dialog-controller.js 106058 2024-01-10 13:29:29Z badugula $
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global Slick, _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainPlantAssemblyDialogController
	 * @function
	 *
	 * @description
	 * Plant Assembly Dialog lookup controller
	 **/
	angular.module(moduleName).controller('estimateMainPlantAssemblyDialogController', ['$scope', '$injector', 'keyCodes',
		'estimateMainPlantAssemblyDialogService', 'platformGridAPI', 'estimateMainPlantDialogService', 'platformTranslateService', 'basicsLookupdataLookupControllerFactory', 'basicsLookupdataLookupViewService', 'basicsLookupdataLookupDataService', 'estimateMainPlantAssemblyDialogConfigService',
		function ($scope, $injector, keyCodes, estimateMainPlantAssemblyDialogService, platformGridAPI,estimateMainPlantDialogService, platformTranslateService, basicsLookupdataLookupControllerFactory, basicsLookupdataLookupViewService, lookupDataService, dialogConfigService) {
			estimateMainPlantAssemblyDialogService.init();

			let parentScope = $scope.$parent;
			$scope.gridId = parentScope.gridDataAssemblyId;
			parentScope.isLoading = true;

			if ($scope.options.dataView === undefined) {
				$scope.options.dataView = new basicsLookupdataLookupViewService.LookupDataView();
				$scope.options.dataView.dataPage.size = 100;
				$scope.options.dataView.dataProvider = lookupDataService.registerDataProviderByType('estassemblyfk');
			}

			let gridConfig = {};

			let isMultiSelectionEnabled= false;

			let columns = dialogConfigService.getStandardConfigForListView().columns;

			if (!platformGridAPI.grids.exist($scope.gridId)){
				gridConfig = {
					data: [],
					columns: angular.copy(columns),
					id: $scope.gridId,
					lazyInit: false,
					options: {
						indicator: false,
						editorLock: new Slick.EditorLock(),
						multiSelect: false
					},
					enableConfigSave: true
				};

				platformGridAPI.grids.config(gridConfig);
			}else{
				gridConfig.columns = angular.copy(columns);
				platformGridAPI.columns.configuration($scope.gridId, gridConfig.columns);
			}
			platformTranslateService.translateGridConfig(gridConfig.columns);

			estimateMainPlantAssemblyDialogService.setOptions(parentScope.options);

			if (!$scope.tools) {
				basicsLookupdataLookupControllerFactory.create({grid: true,dialog: true,search: false},$scope, gridConfig);
			}

			if (parentScope.ngModel && _.isNumber(parentScope.ngModel)) { // entity assembly code is empty.
				estimateMainPlantDialogService.loadAllPlantGroup().then(function(){
					let sendHttpRequest = true; // We obtain the assembly from server to get plant Fk and Up-to-date values
					estimateMainPlantAssemblyDialogService.getAssemblyByIdAsync(parentScope.ngModel, sendHttpRequest).then(function(assembly) {
						if (assembly && assembly.Id) {
							parentScope.searchValue = assembly[parentScope.options.displayMember];
							estimateMainPlantAssemblyDialogService.setList([assembly]);

							if(!assembly.PlantFk)
							{
								assembly.PlantFk = -2;
							}

							let group = estimateMainPlantDialogService.getItemById(assembly.PlantFk); // TODO: Add get category by Id Async
							if (group) {
								estimateMainPlantDialogService.setItemFilter(function (groupEntity) {
									return groupEntity.Id === group.Id;
								});
								estimateMainPlantDialogService.expandNodeParent(group);
								estimateMainPlantDialogService.enableItemFilter(true); // this will set the filtered list automatically
							}
							parentScope.isReady = true;
							parentScope.isLoading = false;
						}
					});
				});
			}

			function setEnableMultipleSelection(enabled){
				let grid = getGrid();
				if  (grid && grid.instance){
					let selectedItems = (getGrid().instance.getSelectedRows() || []).map(function(row){
						return getGrid().instance.getDataItem(row);
					});
					if (enabled){
						parentScope.modalOptions.selectedItems = selectedItems;
						estimateMainPlantAssemblyDialogService.setMultipleSelectedItems(selectedItems);
					}else{
						let itemToSelect = _.last(selectedItems);
						if (itemToSelect){
							let row = getGrid().dataView.mapIdsToRows([itemToSelect.Id]);
							getGrid().instance.setSelectedRows(row);
							estimateMainPlantAssemblyDialogService.setSelected(itemToSelect);
						}
					}
					getGrid().instance.setOptions({ multiSelect: enabled });
					parentScope.modalOptions.disableOkButton = _.isEmpty(selectedItems);
				}
			}

			parentScope.$watch('enableMultiSelection',function(enabled){
				setEnableMultipleSelection(enabled);
			});

			setTimeout(function(){
				setEnableMultipleSelection(false);
			}, 400);

			setTimeout(function(){
				parentScope.isInit = true;
			}, 160);

			parentScope.$watch('isLoading', function(isLoading){
				$scope.isLoading = isLoading;
			});

			angular.extend(parentScope, {
				onOk: onOk,
				onRefresh: onRefresh,
				onSearch: onSearch,
				onSearchInputKeyDown: onSearchInputKeyDown
			});

			function onSelectedRowsChanged(e, args){
				let rows = args.rows;
				let selectedItem = getGrid().instance.getDataItem(_.first(rows));
				estimateMainPlantAssemblyDialogService.setSelected(selectedItem);

				if (!isMultiSelectionEnabled){
					isMultiSelectionEnabled = true;
					$scope.enableMultiSelection = true;
					parentScope.enableMultiSelection= true;
					setEnableMultipleSelection(true);
				}

				let selectedItems = estimateMainPlantAssemblyDialogService.onMultipleSelection(getGrid(), rows);
				estimateMainPlantAssemblyDialogService.setMultipleSelectedItems(selectedItems);
				if ($scope.enableMultiSelection){
					$scope.modalOptions.disableOkButton = _.isEmpty(estimateMainPlantAssemblyDialogService.getMultipleSelectedItems());
					$scope.modalOptions.selectedItems = selectedItems;
				}else{
					$scope.modalOptions.disableOkButton = _.isEmpty(estimateMainPlantAssemblyDialogService.getSelectedEntities());
				}
				$scope.$root.safeApply();
			}

			function onDblClick(){
				onOk();
			}

			function onOk() {
				let selectedItems = parentScope.enableMultiSelection ? estimateMainPlantAssemblyDialogService.getMultipleSelectedItems() : [estimateMainPlantAssemblyDialogService.getSelected()],
					usageContext = parentScope.options.usageContext;

				let result = {isOk: true, selectedItem: _.head(selectedItems) };

				let itemSelected = $scope.ngModel;
				if (itemSelected){
					let items = _.sortBy(selectedItems, 'Id');
					let itemIndexToMove = _.findIndex(items, { Id: itemSelected });
					if (itemIndexToMove > 0){
						items.move(itemIndexToMove, 0);
					}
				}

				// handle selected item in the service, (e.g update other entity fields based on single lookup selection)
				if (usageContext && $scope.entity){
					let serviceContext = $injector.get(usageContext);
					if (serviceContext && angular.isFunction(serviceContext.getPlantAssemblyLookupSelectedItems)){
						serviceContext.getPlantAssemblyLookupSelectedItems($scope.entity, selectedItems || [], false, usageContext === 'estimateMainService');
					}
				}
				parentScope.onClose(result);
			}

			function onRefresh(){
				$scope.isLoading = $scope.isGroupLoading = true;
				// clear cache and reload groups
				estimateMainPlantDialogService.clearGroupsCache();

				parentScope.isReady = false;
				$scope.isLoading = $scope.isCatLoading = true;

				let groupSelected = estimateMainPlantDialogService.getSelected();

				estimateMainPlantAssemblyDialogService.init();// First clear assembly //Category info is kept for http data preparation
				estimateMainPlantAssemblyDialogService.getSearchList(null, null, $scope.entity, null, false, parentScope.options).then(function(data){
					estimateMainPlantAssemblyDialogService.setList(data);
					setTimeout(function(){
						$scope.isLoading = false;
						parentScope.isReady = true;
					}, 300);

					estimateMainPlantAssemblyDialogService.init()
					estimateMainPlantDialogService.reset.fire(groupSelected);
				});
				// Let assembly search be triggered first, we reset all at the same time
				// Second: clear categories
				// clear cache and reload groups
				//estimateMainPlantDialogService.clearGroupsCache();
				// estimateMainPlantDialogService.reset.fire(groupSelected);
			}

			function onSearch(searchValue){
				$scope.isLoading = true;
				if (_.isEmpty(searchValue)){
					estimateMainPlantDialogService.resetSelectedItem();
					estimateMainPlantAssemblyDialogService.search(searchValue, $scope.entity, $scope);
					estimateMainPlantDialogService.reset.fire();
				}else{
					estimateMainPlantAssemblyDialogService.search(searchValue, $scope.entity, $scope);
				}
			}

			function onSearchInputKeyDown(event, searchValue){
				if (event.keyCode === keyCodes.ENTER) {
					onSearch(searchValue);
				}
			}

			function isMultipleSelectActive(){
				return parentScope.enableMultiSelection;
			}

			function onListLoaded(){
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.unregister($scope.gridId, 'onScroll', onScroll); // it's not registered on init

				let plantAssemblies = estimateMainPlantAssemblyDialogService.getList();
				platformGridAPI.items.data($scope.gridId, plantAssemblies);

				let groupSelected = estimateMainPlantDialogService.getSelected();
				if(groupSelected && groupSelected.IsChecked){
					let ids = _.map(plantAssemblies, 'Id');
					let rows = getGrid().dataView.mapIdsToRows(ids);
					getGrid().instance.setSelectedRows(rows, false);

					if (!isMultiSelectionEnabled){
						isMultiSelectionEnabled = true;
						$scope.enableMultiSelection = true;
						parentScope.enableMultiSelection= true;
						setEnableMultipleSelection(true);
					}

					estimateMainPlantAssemblyDialogService.onMultipleSelection(getGrid(), rows);
					$scope.modalOptions.disableOkButton = _.isEmpty(estimateMainPlantAssemblyDialogService.getMultipleSelectedItems());
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.register($scope.gridId, 'onScroll', onScroll);
			}

			let isScrollLoading = false;
			function onScroll(e, args){
				let searchSettings = estimateMainPlantAssemblyDialogService.getSearchListResult();

				if (searchSettings){
					let dataHeight = args.grid.getDataLength() * 25;
					let isHeightReadyToLoad = dataHeight - args.scrollTop < args.grid.getGridPosition().height;
					if (isHeightReadyToLoad && !isScrollLoading){

						let dataCount = estimateMainPlantAssemblyDialogService.getList().length;
						let isAllSearchDataLoaded =  dataCount === searchSettings.ItemsTotalCount;
						if (!isAllSearchDataLoaded){
							isScrollLoading = true;
							estimateMainPlantAssemblyDialogService.getSearchList(searchSettings.SearchValue, null, $scope.entity, { CurrentPage: searchSettings.CurrentPage }, false, parentScope.options,searchSettings.ItemsTotalCount).then(function(data){
								let list = angular.copy(estimateMainPlantAssemblyDialogService.getList());
								_.forEach(data, function(assembly){
									list.push(assembly);
								});
								estimateMainPlantAssemblyDialogService.setList(list);

								setTimeout(function(){
									isScrollLoading = false;
								}, 200);
							});
						}
					}
				}
			}

			function getGrid(){
				return platformGridAPI.grids.element('id', $scope.gridId);
			}


			function onFetchPlantAssemblies(groupIds){
				if (groupIds.length === 0){
					$scope.isLoading = parentScope.isLoading = false;
				}else{
					estimateMainPlantAssemblyDialogService.getSearchList(null, null, $scope.entity, null, false, parentScope.options).then(function(data){
						estimateMainPlantAssemblyDialogService.setList(data);
						$scope.isLoading = false;
					});
				}
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);

			estimateMainPlantAssemblyDialogService.registerListLoaded(onListLoaded);
			estimateMainPlantAssemblyDialogService.onFetchPlantAssemblies.register(onFetchPlantAssemblies);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onScroll', onScroll);
				platformGridAPI.events.unregister($scope.gridId, 'onDblClick', onDblClick);
				platformGridAPI.grids.unregister($scope.gridId);

				estimateMainPlantAssemblyDialogService.unregisterListLoaded(onListLoaded);
				estimateMainPlantAssemblyDialogService.onFetchPlantAssemblies.unregister(onFetchPlantAssemblies);
			});
		}]);
})();