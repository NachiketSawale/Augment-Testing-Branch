/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function () {

	/* global Slick, _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainReplaceResourcePlantAssemblyGidController
	 * @function
	 *
	 * @description
	 * Plant Assembly Dialog lookup controller
	 **/
	angular.module(moduleName).controller('estimateMainReplaceResourcePlantAssemblyGidController', ['$scope', '$injector',
		'estimateMainPlantAssemblyDialogService', 'platformGridAPI', 'estimateMainPlantDialogService', 'platformTranslateService', 'basicsLookupdataLookupControllerFactory', 'basicsLookupdataLookupViewService', 'basicsLookupdataLookupDataService', 'estimateMainPlantAssemblyDialogConfigService',
		function ($scope, $injector, estimateMainPlantAssemblyDialogService, platformGridAPI,estimateMainPlantDialogService, platformTranslateService, basicsLookupdataLookupControllerFactory, basicsLookupdataLookupViewService, lookupDataService, dialogConfigService) {
			estimateMainPlantAssemblyDialogService.init();

			let parentScope = $scope.$parent;
			$scope.gridId =  parentScope.gridDataAssemblyId;
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
						multiSelect: true
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

			parentScope.isReady = true;
			parentScope.isLoading = false;

			function setEnableMultipleSelection(enabled){
				let grid = getGrid();
				if  (grid && grid.instance){
					let selectedItems
						= (getGrid().instance.getSelectedRows() || []).map(function(row){
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

			setTimeout(function(){
				parentScope.isInit = true;
			}, 160);

			parentScope.$watch('isLoading', function(isLoading){
				$scope.isLoading = isLoading;
			});

			function onSelectedRowsChanged(e, args){
				isMultiSelectionEnabled = true;
				$scope.enableMultiSelection = true;
				parentScope.enableMultiSelection= true;
				setEnableMultipleSelection(true);

				let selectedItems = estimateMainPlantAssemblyDialogService.onMultipleSelection(getGrid(), args.rows);
				estimateMainPlantAssemblyDialogService.setMultipleSelectedItems(selectedItems);
			}

			function onListLoaded(){
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.unregister($scope.gridId, 'onScroll', onScroll); // it's not registered on init

				let plantAssemblies = estimateMainPlantAssemblyDialogService.getList();
				platformGridAPI.items.data($scope.gridId, plantAssemblies);

				let groupSelected = estimateMainPlantDialogService.getSelected();
				let rows = [];
				if(groupSelected && groupSelected.IsChecked){
					let ids = _.map(plantAssemblies, 'Id');
					rows = getGrid().dataView.mapIdsToRows(ids);
				}else if($scope.$parent.entity.SelectedPlantAssemblyIds && $scope.$parent.entity.SelectedPlantAssemblyIds.length > 0){
					rows = getGrid().dataView.mapIdsToRows($scope.$parent.entity.SelectedPlantAssemblyIds);
				}

				if(rows && rows.length > 0){
					getGrid().instance.setSelectedRows(rows, false);

					if (!isMultiSelectionEnabled){
						isMultiSelectionEnabled = true;
						$scope.enableMultiSelection = true;
						parentScope.enableMultiSelection= true;
						setEnableMultipleSelection(true);
					}

					estimateMainPlantAssemblyDialogService.onMultipleSelection(getGrid(), rows);
					$scope.modalOptions.disableOkButton = false;
				}else{
					$scope.modalOptions.disableOkButton = true;
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
			estimateMainPlantAssemblyDialogService.registerListLoaded(onListLoaded);
			estimateMainPlantAssemblyDialogService.onFetchPlantAssemblies.register(onFetchPlantAssemblies);
			// remove useless double event
			platformGridAPI.events.unregister($scope.gridId, 'onDblClick', ()=>{});

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onScroll', onScroll);
				platformGridAPI.grids.unregister($scope.gridId);

				estimateMainPlantAssemblyDialogService.unregisterListLoaded(onListLoaded);
				estimateMainPlantAssemblyDialogService.onFetchPlantAssemblies.unregister(onFetchPlantAssemblies);
			});
		}]);
})();