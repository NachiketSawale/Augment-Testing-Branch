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
	 * @name estimateMainReplaceResourcePlantGidController
	 * @function
	 *
	 * @description
	 * Plant group and Plant Master controller
	 **/
	angular.module(moduleName).controller('estimateMainReplaceResourcePlantGidController', [
		'$scope', '$timeout', '$translate', 'keyCodes', 'estimateMainPlantDialogService', 'estimateMainPlantDialogConfigService', 'platformGridAPI', 'estimateMainPlantAssemblyDialogService', 'platformTranslateService',
		function ($scope, $timeout, $translate, keyCodes, estimateMainPlantDialogService, estimateMainPlantDialogConfigService, platformGridAPI, estimateMainPlantAssemblyDialogService, platformTranslateService) {
			estimateMainPlantDialogService.init();

			let parentScope = $scope.$parent;
			$scope.gridPlantGroupId = '896215153cb149379eca8221a10ea427';
			$scope.gridData = {
				state: $scope.gridPlantGroupId
			};

			let columns = angular.copy(estimateMainPlantDialogConfigService.getStandardConfigForListView().columns);
			let checkCol = _.find(columns, {id: 'Selected'});
			if(checkCol){
				let validator = checkCol.validator;
				checkCol.validator = function (item, value){
					validator(item, value);
					updateSelectCheckBox(item, value)
				}
			}
			if (!platformGridAPI.grids.exist($scope.gridPlantGroupId)){
				let gridConfig = {
					data: [],
					columns: columns,
					id: $scope.gridPlantGroupId,
					lazyInit: false,
					isStaticGrid: true,
					options: {
						tree: true, indicator: false,
						editorLock: new Slick.EditorLock(),
						parentProp: 'EquipmentGroupFk',
						childProp: 'SubGroups',
						multiSelect: false
					},
					enableConfigSave: true
				};

				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);

				initialize();
			}else{
				platformGridAPI.columns.configuration($scope.gridPlantGroupId, columns);

				initialize();
			}

			function initialize(){
				estimateMainPlantDialogService.clearGroupsCache();
				estimateMainPlantAssemblyDialogService.setOptions(parentScope.options);
				estimateMainPlantDialogService.loadAllPlantGroup().then(function(treeList){
					let filteredAssemblyGroups = estimateMainPlantDialogService.filterPlantAssemblyGroup(parentScope.options, parentScope.entity, treeList);

					// workaround, if the dialog is closed quickly, the grid will be destroyed and this line will throw an error
					if (platformGridAPI.grids.exist($scope.gridPlantGroupId)){
						platformGridAPI.items.data($scope.gridPlantGroupId, filteredAssemblyGroups);
						parentScope.isReady = true;

						if (parentScope.ngModel && _.isNumber(parentScope.ngModel)){
							let grid = getGrid();
							if (grid && grid.instance){
								let rows = getGrid().dataView.mapIdsToRows([parentScope.ngModel]);

								getGrid().instance.setSelectedRows(rows);
							}
						}

						if ($scope.$root){
							$scope.$root.safeApply();
						}
					}
				});
			}

			parentScope.$watch('isGroupLoading', function(isLoading){
				$scope.isLoading = isLoading;
			});

			function onListLoaded(){
				platformGridAPI.events.unregister($scope.gridPlantGroupId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				platformGridAPI.items.data($scope.gridPlantGroupId, estimateMainPlantDialogService.getTree());

				let isItemFiltered = estimateMainPlantDialogService.isItemFilterEnabled();
				let group = estimateMainPlantDialogService.getSelected();
				let groupId = _.isEmpty(group) ? [] : _.map([group], 'Id');
				let grid = getGrid();
				if (grid && grid.instance){
					let rows = getGrid().dataView.mapIdsToRows(groupId);

					if (isItemFiltered){
						getGrid().instance.setSelectedRows(rows);
						estimateMainPlantDialogService.setItemFilter(null); // clear the filter for next search
					}
				}
				platformGridAPI.events.register($scope.gridPlantGroupId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			}

			function updateSelectCheckBox(item, value){
				if(value){
					let list = estimateMainPlantDialogService.getList();
					_.forEach(list, i =>{
						if(i.Id !== item.Id && i.IsChecked){
							i.IsChecked = false;
							platformGridAPI.rows.refreshRow({gridId: $scope.gridPlantGroupId, item: i});
						}
					});
				}
			}

			function onSelectedRowsChanged(e, args){
				$timeout(function() {
					let item = args.grid.getDataItem(args.rows);
					parentScope.isLoading = true;
					estimateMainPlantDialogService.setSelected(item);

					estimateMainPlantAssemblyDialogService.setMultipleSelectedItems([]);
					estimateMainPlantAssemblyDialogService.setOptions(parentScope.options);
					updateSelectCheckBox(item, true);
					estimateMainPlantAssemblyDialogService.load().then(function(){
						parentScope.isLoading = false;
					});
				});
			}

			platformGridAPI.events.register($scope.gridPlantGroupId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			function reset(treeList, groupSelected){
				estimateMainPlantAssemblyDialogService.setOptions(parentScope.options);
				let filteredAssemblyGroups = estimateMainPlantDialogService.filterPlantAssemblyGroup(parentScope.options, parentScope.entity, treeList);

				platformGridAPI.events.unregister($scope.gridPlantGroupId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				if (_.isEmpty(groupSelected)){
					getGrid().instance.setSelectedRows([]);
					platformGridAPI.items.data($scope.gridPlantGroupId, filteredAssemblyGroups);
				}else{
					let itemList = estimateMainPlantDialogService.getFlattenByTree(filteredAssemblyGroups);
					let groupItem = _.find(itemList, {'Id': groupSelected.Id});
					if (!_.isEmpty(groupItem)){
						estimateMainPlantDialogService.expandNodeParent(groupItem);
						let rows = getGrid().dataView.mapIdsToRows([groupSelected.Id]);
						getGrid().instance.setSelectedRows(rows);
						estimateMainPlantDialogService.setSelected(groupItem);
						platformGridAPI.items.data($scope.gridPlantGroupId, filteredAssemblyGroups);
						platformGridAPI.rows.scrollIntoViewByItem($scope.gridPlantGroupId, groupItem);
					}
				}
				platformGridAPI.events.register($scope.gridPlantGroupId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				$scope.isLoading = false;

				parentScope.modalOptions.disableOkButton = parentScope.enableMultiSelection ? _.isEmpty(estimateMainPlantAssemblyDialogService.getMultipleSelectedItems()) : true;

			}

			function getGrid(){
				return platformGridAPI.grids.element('id', $scope.gridPlantGroupId);
			}

			function filterGroups(filteredAssemblyList){
				if (_.size(filteredAssemblyList) === 1){
					let assembly = _.first(filteredAssemblyList);
					let assemblyPlantList = estimateMainPlantDialogService.getList();
					let plant = assembly.PlantFk > 0 ? _.find(assemblyPlantList, function(i){ return i.Id === assembly.PlantFk; }): null;
					if (_.isEmpty(plant) && _.findIndex(filteredAssemblyList, function(fa) {return fa.PlantFk === null;}) > -1){
						plant = estimateMainPlantDialogService.getItemById(-2); // -2 is noassignment
					}

					estimateMainPlantDialogService.setItemFilter(function (plantEntity) {
						if (plant){
							return plantEntity.Id === plant.Id;
						}
						return true;
					});

					plant = !plant && assembly.PlantFk === -2 ? estimateMainPlantDialogService.getItemById(-2) : plant;
					estimateMainPlantDialogService.expandNodeParent(plant);
					estimateMainPlantDialogService.setSelected(plant); // this method only saves to data.selectedItem
					estimateMainPlantDialogService.enableItemFilter(true); // this will set the filtered list automatically
				}else if (_.size(filteredAssemblyList) > 1 ){

					let assemblyPlantList = estimateMainPlantDialogService.getList();
					let plantIds = _.uniq(_.map(filteredAssemblyList, function(assembly){
						let plant =  assembly.PlantFk !== null ? _.find(assemblyPlantList, function(i){ return i.Id === assembly.PlantFk; }): null;
						if ((plant === null || _.isEmpty(plant)) && _.findIndex(filteredAssemblyList, function(fa) {return fa.PlantFk === null;}) > -1){
							plant = estimateMainPlantDialogService.getItemById(-2); // -2 is noassignment
						}
						return plant ? plant.Id : -2;
					}));

					estimateMainPlantDialogService.setItemFilter(function (plantEntity) {
						return plantIds.indexOf(plantEntity.Id) !== -1;
					});

					platformGridAPI.events.unregister($scope.gridPlantGroupId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					estimateMainPlantDialogService.enableItemFilter(true); // this will set the filtered list automatically
				}else{
					estimateMainPlantDialogService.setItemFilter(function () {
						return false;
					});
					estimateMainPlantDialogService.enableItemFilter(true); // this will set the filtered list automatically
				}
			}


			function onDblClick(){
				let selectAssemblies = estimateMainPlantAssemblyDialogService.getMultipleSelectedItems();

				if(!selectAssemblies || !selectAssemblies.length){
					selectAssemblies = estimateMainPlantAssemblyDialogService.getList();
				}

				if(selectAssemblies && selectAssemblies.length){
					onOk();
				}
			}

			angular.extend(parentScope, {
				onOk: onOk,
				onSearch: onSearch,
				onSearchInputKeyDown: onSearchInputKeyDown,
				onRefresh: onRefresh
			});

			function onOk() {
				let selectedPlant = estimateMainPlantDialogService.getSelected();

				let result = {isOk: true, selectedItem: selectedPlant };
				let selectAssemblies = estimateMainPlantAssemblyDialogService.getMultipleSelectedItems();
				let allList = estimateMainPlantAssemblyDialogService.getList();
				let selectedAll = selectAssemblies && selectAssemblies.length && selectAssemblies.length === allList.length;
				let showCodes = $translate.instant('estimate.main.replaceResourceWizard.selectedAllEaCode');
				if(!selectedAll && selectAssemblies && selectAssemblies.length){
					parentScope.$parent.entity.SelectedPlantAssemblyCodes = (_.map(selectAssemblies, 'Code')).join(', ');
					parentScope.$parent.entity.SelectedPlantAssemblyIds = _.map(selectAssemblies, 'Id');
				}else{
					parentScope.$parent.entity.SelectedPlantAssemblyCodes = showCodes;
					parentScope.$parent.entity.SelectedPlantAssemblyIds = _.map(allList, 'Id');
				}

				parentScope.onClose(result);
			}

			function onSearch(searchValue){
				let selectedPlant = estimateMainPlantDialogService.getSelected();
				estimateMainPlantDialogService.cacheList = estimateMainPlantDialogService.cacheList || estimateMainPlantDialogService.getList();

				let list = estimateMainPlantDialogService.cacheList;
				if(searchValue){
					let key = searchValue.toLowerCase();
					list = _.filter(list, item=> {
						if(item.Code && item.Code.toLowerCase().indexOf(key)>=0){
							return true;
						}
						if(item.DescriptionInfo && item.DescriptionInfo.Description && item.DescriptionInfo.Description.toLowerCase().indexOf(key)>=0){
							return true;
						}
						return !!(item.DescriptionInfo && item.DescriptionInfo.Translated && item.DescriptionInfo.Translated.toLowerCase().indexOf(key) >= 0);
					});
				}

				let selectedItemIncludedSearch = selectedPlant && _.find(list, {Id: selectedPlant.Id});
				if(!selectedItemIncludedSearch){
					estimateMainPlantAssemblyDialogService.setMultipleSelectedItems([]);
					platformGridAPI.items.data(parentScope.gridDataAssemblyId, []);
					estimateMainPlantDialogService.resetSelectedItem();
				}

				reset(list, selectedItemIncludedSearch ? selectedPlant : null);
			}

			function onSearchInputKeyDown(event, searchValue){
				if (event.keyCode === keyCodes.ENTER) {
					onSearch(searchValue);
				}
			}

			function onRefresh(){
				$scope.isLoading = $scope.isGroupLoading = true;
				// clear cache and reload groups
				estimateMainPlantDialogService.clearGroupsCache();

				parentScope.isReady = false;
				$scope.isLoading = $scope.isCatLoading = true;

				let groupSelected = estimateMainPlantDialogService.getSelected();

				estimateMainPlantDialogService.loadAllPlantGroup().then(response => {

					estimateMainPlantDialogService.cacheList = response;
					onSearch();

					setTimeout(function(){
						$scope.isLoading = false;
						parentScope.isReady = true;
					}, 300);

				});
			}

			estimateMainPlantDialogService.registerListLoaded(onListLoaded);

			estimateMainPlantDialogService.filterGroups.register(filterGroups);
			platformGridAPI.events.register($scope.gridPlantGroupId, 'onDblClick', onDblClick);

			$scope.$on('$destroy', function () {
				estimateMainPlantAssemblyDialogService.setMultipleSelectedItems({});
				platformGridAPI.grids.unregister($scope.gridPlantGroupId);
				platformGridAPI.events.unregister($scope.gridPlantGroupId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				estimateMainPlantDialogService.unregisterListLoaded(onListLoaded);
				estimateMainPlantDialogService.filterGroups.unregister(filterGroups);
				platformGridAPI.events.unregister($scope.gridPlantGroupId, 'onDblClick', onDblClick);
			});
		}]);
})();
