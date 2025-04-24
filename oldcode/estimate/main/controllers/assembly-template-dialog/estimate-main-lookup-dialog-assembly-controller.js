/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global Slick, _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc value
	 * @name estimateMainLookupDialogAssemblyListColumns
	 * @function
	 *
	 * @description
	 * Returns the assembly columns and column settings.
	 **/
	angular.module(moduleName).value('estimateMainLookupDialogAssemblyListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'EstAssemblyCatFk',
						field: 'EstAssemblyCatFk',
						name: 'Assembly Category',
						name$tr$: 'estimate.assemblies.estAssemblyCat',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estassemblycat',
							displayMember: 'Code'
						},
						grouping: {
							title: 'Assembly Category',
							title$tr$: 'estimate.assemblies.estAssemblyCat',
							getter: 'EstAssemblyCatFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 150,
						grouping: {
							title: 'Code',
							title$tr$: 'cloud.common.entityCode',
							getter: 'Code',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'DescriptionInfo',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						readonly: true,
						grouping: {
							title: 'Description',
							title$tr$:'cloud.common.entityDescription',
							getter: 'DescriptionInfo',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'uom',
						field: 'BasUomFk',
						name$tr$: 'cloud.common.entityUoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Uom',
							displayMember: 'Unit'
						},
						width: 100,
						grouping: {
							title: 'Uom',
							title$tr$: 'cloud.common.entityUoM',
							getter: 'BasUomFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id : 'costunit',
						name : 'costunit',
						field : 'CostUnit',
						name$tr$ : 'estimate.main.costUnit',
						formatter: 'money',
						grouping: {
							title: 'CostUnit',
							title$tr$: 'estimate.main.costUnit',
							getter: 'CostUnit',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'MdcCostCodeFk',
						field: 'MdcCostCodeFk',
						name: 'Cost Code',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CostCode',
							displayMember: 'Code',
							dataServiceName: 'estimateMainLookupService'
						},
						name$tr$: 'estimate.main.costCode',
						grouping: {
							title: 'Cost Code',
							title$tr$: 'estimate.main.costCode',
							getter: 'MdcCostCodeFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'MdcMaterialFk',
						field: 'MdcMaterialFk',
						name: 'Material Code',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialRecord',
							displayMember: 'Code'
						},
						name$tr$: 'basics.common.entityMaterialCode',
						grouping: {
							title: 'Material Code',
							title$tr$: 'basics.common.entityMaterialCode',
							getter: 'MdcMaterialFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					}
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name estimateMainLookupDialogAssemblyController
	 * @function
	 *
	 * @description
	 * Assembly lookup controller
	 **/
	angular.module(moduleName).controller('estimateMainLookupDialogAssemblyController', [
		'$scope', '$injector', '$q', 'keyCodes', 'estimateMainAssemblyTemplateService', 'estimateMainLookupDialogAssemblyListColumns', 'platformGridAPI', 'estimateMainAssemblycatTemplateService', 'platformTranslateService', 'basicsLookupdataLookupControllerFactory', 'basicsLookupdataLookupViewService', 'basicsLookupdataLookupDataService',
		function ($scope, $injector, $q, keyCodes, estimateMainAssemblyTemplateService, estimateMainLookupDialogAssemblyListColumns, platformGridAPI, estimateMainAssemblycatTemplateService, platformTranslateService, basicsLookupdataLookupControllerFactory, basicsLookupdataLookupViewService, lookupDataService) {
			estimateMainAssemblyTemplateService.init();

			let parentScope = $scope.$parent;
			$scope.gridId = parentScope.gridDataAssemblyId;
			parentScope.isLoading = true;

			if ($scope.options.dataView === undefined) {
				$scope.options.dataView = new basicsLookupdataLookupViewService.LookupDataView();
				$scope.options.dataView.dataPage.size = 100;
				$scope.options.dataView.dataProvider = lookupDataService.registerDataProviderByType('estassemblyfk');
			}

			let gridConfig = {};
			if (!platformGridAPI.grids.exist($scope.gridId)){
				gridConfig = {
					data: [],
					columns: angular.copy(estimateMainLookupDialogAssemblyListColumns.getStandardConfigForListView().columns),
					id: $scope.gridId,
					lazyInit: false,
					// isStaticGrid: true,
					options: {
						indicator: false,
						editorLock: new Slick.EditorLock(),
						multiSelect: false
					},
					enableConfigSave: true
				};

				platformGridAPI.grids.config(gridConfig);
			}else{
				gridConfig.columns = angular.copy(estimateMainLookupDialogAssemblyListColumns.getStandardConfigForListView().columns);
				platformGridAPI.columns.configuration($scope.gridId, gridConfig.columns);
			}
			platformTranslateService.translateGridConfig(gridConfig.columns);

			if (!$scope.tools) {
				basicsLookupdataLookupControllerFactory.create({grid: true,dialog: true,search: false},$scope, gridConfig);
			}

			if (parentScope.ngModel && _.isNumber(parentScope.ngModel)) { // entity assembly code is empty.
				estimateMainAssemblycatTemplateService.loadAllAssemblyCategories().then(function(){ // TODO: Add get category by Id
					let sendHttpRequest = true; // We obtain the assembly from server to get Assembly Category Fk and Up-to-date values
					estimateMainAssemblyTemplateService.getAssemblyByIdAsync(parentScope.ngModel, sendHttpRequest).then(function(assembly) {
						if (assembly && assembly.Id) {
							parentScope.searchValue = assembly[parentScope.options.displayMember];
							estimateMainAssemblyTemplateService.setList([assembly]);

							if(!assembly.EstAssemblyCatFk)
							{
								assembly.EstAssemblyCatFk = -2;
							}

							let cat = estimateMainAssemblycatTemplateService.getItemById(assembly.EstAssemblyCatFk); // TODO: Add get category by Id Async
							if (cat) {
								estimateMainAssemblycatTemplateService.setItemFilter(function (assemblyCatEntity) {
									return assemblyCatEntity.Id === cat.Id;
								});
								estimateMainAssemblycatTemplateService.expandNodeParent(cat);
								// estimateMainAssemblycatTemplateService.setSelected(cat); //this method only saves to data.selectedItem
								estimateMainAssemblycatTemplateService.enableItemFilter(true); // this will set the filtered list automatically

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
						estimateMainAssemblyTemplateService.setMultipleSelectedItems(selectedItems);
					}else{
						let itemToSelect = _.last(selectedItems);
						if (itemToSelect){
							let row = getGrid().dataView.mapIdsToRows([itemToSelect.Id]);
							getGrid().instance.setSelectedRows(row);
							estimateMainAssemblyTemplateService.setSelected(itemToSelect);
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
				estimateMainAssemblyTemplateService.setSelected(selectedItem);
				let selectedItems = estimateMainAssemblyTemplateService.onMultipleSelection(getGrid(), rows);
				estimateMainAssemblyTemplateService.setMultipleSelectedItems(selectedItems);
				parentScope.modalOptions.disableOkButton =  isMultipleSelectActive() ? _.isEmpty(estimateMainAssemblyTemplateService.getMultipleSelectedItems()) : _.isEmpty(rows);
				$scope.$root.safeApply();
			}

			function onDblClick(){
				onOk();
			}

			function onOk() {
				let selectedItems = parentScope.enableMultiSelection ? estimateMainAssemblyTemplateService.getMultipleSelectedItems() : [estimateMainAssemblyTemplateService.getSelected()],
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
				if (usageContext && $scope.entity) {
					let serviceContext = $injector.get(usageContext);
					if (serviceContext && angular.isFunction(serviceContext.getAssemblyLookupSelectedItems)) {
						serviceContext.getAssemblyLookupSelectedItems($scope.entity, selectedItems || []);
					}
				}

				parentScope.onClose(result);
			}

			function onRefresh(){

				// clear cache and reload categories
				estimateMainAssemblycatTemplateService.clearCategoriesCache();

				parentScope.isReady = false;
				$scope.isLoading = $scope.isCatLoading = true;
				let categorySelected = estimateMainAssemblycatTemplateService.getSelected();
				let isLoadCat = estimateMainAssemblycatTemplateService.isLoadCat;

				estimateMainAssemblyTemplateService.init();// First clear assembly //Category info is kept for http data preparation
				estimateMainAssemblyTemplateService.getSearchList(null, null, $scope.entity, null, false, parentScope.options, null, isLoadCat, true).then(function(data){
					estimateMainAssemblyTemplateService.setList(data);
					setTimeout(function(){
						$scope.isLoading = false;
						parentScope.isReady = true;
					}, 300);

					// Let assembly search be triggered first, we reset all at the same time
					// estimateMainAssemblycatTemplateService.init();
					estimateMainAssemblyTemplateService.init(); // Second: clear categories
					estimateMainAssemblycatTemplateService.reset.fire(categorySelected);
				});
			}

			function onSearch(searchValue){
				$scope.isLoading = true;
				if (_.isEmpty(searchValue)){
					estimateMainAssemblycatTemplateService.resetSelectedItem();
					estimateMainAssemblyTemplateService.search(searchValue, $scope.entity, $scope);
					estimateMainAssemblycatTemplateService.reset.fire();
				}else{
					estimateMainAssemblyTemplateService.search(searchValue, $scope.entity, $scope);
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

				platformGridAPI.items.data($scope.gridId, estimateMainAssemblyTemplateService.getList());

				if ($scope.enableMultiSelection){
					let multipleSelectedItems = estimateMainAssemblyTemplateService.getMultipleSelectedItems();

					let ids = _.map(multipleSelectedItems, 'Id');
					let rows = getGrid().dataView.mapIdsToRows(ids);
					getGrid().instance.setSelectedRows(rows, true);
				}else{
					estimateMainAssemblyTemplateService.setMultipleSelectedItems([]);
				}
				// }

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.register($scope.gridId, 'onScroll', onScroll);
			}

			let isScrollLoading = false;
			function onScroll(e, args){
				let searchSettings = estimateMainAssemblyTemplateService.getSearchListResult();

				if (searchSettings){
					let dataHeight = args.grid.getDataLength() * 25;
					let isHeightReadyToLoad = dataHeight - args.scrollTop < args.grid.getGridPosition().height;
					if (isHeightReadyToLoad && !isScrollLoading){

						let dataCount = estimateMainAssemblyTemplateService.getList().length;
						let isAllSearchDataLoaded =  dataCount === searchSettings.ItemsTotalCount;
						if (!isAllSearchDataLoaded){
							isScrollLoading = true;
							estimateMainAssemblyTemplateService.getSearchList(searchSettings.SearchValue, null, $scope.entity, { CurrentPage: searchSettings.CurrentPage }, false, parentScope.options, searchSettings.ItemsTotalCount).then(function(data){
								let list = angular.copy(estimateMainAssemblyTemplateService.getList());
								_.forEach(data, function(assembly){
									list.push(assembly);
								});
								estimateMainAssemblyTemplateService.setList(list);

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

			function onFetchAssemblies(categoriesIds, isLoadCat){
				if (categoriesIds.length === 0){
					$scope.isLoading = parentScope.isLoading = false;
				}else{
					estimateMainAssemblyTemplateService.getSearchList(null, null, $scope.entity, null, false, parentScope.options, undefined, isLoadCat, true).then(function(data){
						estimateMainAssemblyTemplateService.setList(data);
						$scope.isLoading = false;
					});
				}
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);

			estimateMainAssemblyTemplateService.registerListLoaded(onListLoaded);
			estimateMainAssemblyTemplateService.onFetchAssemblies.register(onFetchAssemblies);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onScroll', onScroll);
				platformGridAPI.events.unregister($scope.gridId, 'onDblClick', onDblClick);
				platformGridAPI.grids.unregister($scope.gridId);

				estimateMainAssemblyTemplateService.unregisterListLoaded(onListLoaded);
				estimateMainAssemblyTemplateService.onFetchAssemblies.unregister(onFetchAssemblies);
			});
		}]);
})();
