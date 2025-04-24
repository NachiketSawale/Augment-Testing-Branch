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
	 * @name estimateMainPlantDialogController
	 * @function
	 *
	 * @description
	 * Plant group and Plant Master controller
	 **/
	angular.module(moduleName).controller('estimateMainPlantDialogController', [
		'$scope', 'estimateMainPlantDialogService', 'estimateMainPlantDialogConfigService', 'platformGridAPI', 'estimateMainPlantAssemblyDialogService', 'platformTranslateService',
		function ($scope, estimateMainPlantDialogService, estimateMainPlantDialogConfigService, platformGridAPI, estimateMainPlantAssemblyDialogService, platformTranslateService) {
			estimateMainPlantDialogService.init();

			let parentScope = $scope.$parent;
			$scope.gridPlantGroupId = '806215153cb149379eca8221a10ea3c2';
			$scope.gridData = {
				state: $scope.gridPlantGroupId
			};

			if (!platformGridAPI.grids.exist($scope.gridPlantGroupId)){
				let gridConfig = {
					data: [],
					columns: angular.copy(estimateMainPlantDialogConfigService.getStandardConfigForListView().columns),
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
				platformGridAPI.columns.configuration($scope.gridPlantGroupId, angular.copy(estimateMainPlantGroupListColumns.getStandardConfigForListView().columns));

				initialize();
			}

			function initialize(){
				if (parentScope.ngModel && _.isNumber(parentScope.ngModel)){ // entity assembly code is empty.
					platformGridAPI.items.data([]); // data will be set later according to the selected assembly in assembly-controller.
				}else{
					estimateMainPlantAssemblyDialogService.setOptions(parentScope.options);
					estimateMainPlantDialogService.loadAllPlantGroup().then(function(treeList){
						let filteredAssemblyGroups = estimateMainPlantDialogService.filterPlantAssemblyGroup(parentScope.options, parentScope.entity, treeList);

						// workaround, if the dialog is closed quickly, the grid will be destroyed and this line will throw an error
						if (platformGridAPI.grids.exist($scope.gridPlantGroupId)){
							platformGridAPI.items.data($scope.gridPlantGroupId, filteredAssemblyGroups);
							parentScope.isReady = true;
							estimateMainPlantAssemblyDialogService.onFetchPlantAssemblies.fire(filteredAssemblyGroups);
							if ($scope.$root){
								$scope.$root.safeApply();
							}
						}
					});
				}
			}

			parentScope.$watch('isGroupLoading', function(isLoading){
				$scope.isLoading = isLoading;
			});

			function onListLoaded(){
				platformGridAPI.events.unregister($scope.gridPlantGroupId, 'onSelectedRowsChanged', loadGroupAssemblies);

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
				platformGridAPI.events.register($scope.gridPlantGroupId, 'onSelectedRowsChanged', loadGroupAssemblies);
			}

			function loadGroupAssemblies(e, args){
				parentScope.isLoading = true;
				let item = args.grid.getDataItem(args.rows);
				estimateMainPlantDialogService.setSelected(item);

				estimateMainPlantAssemblyDialogService.setOptions(parentScope.options);
				_.forEach(estimateMainPlantDialogService.getChildServices(), function(childService){
					childService.load().then(function(){
						parentScope.isLoading = false;
					});
				});
			}

			platformGridAPI.events.register($scope.gridPlantGroupId, 'onSelectedRowsChanged', loadGroupAssemblies);

			function reset(groupSelected){
				estimateMainPlantAssemblyDialogService.setOptions(parentScope.options);
				estimateMainPlantDialogService.loadAllPlantGroup().then(function(treeList){

					let filteredAssemblyGroups = estimateMainPlantDialogService.filterPlantAssemblyGroup(parentScope.options, parentScope.entity, treeList);

					platformGridAPI.events.unregister($scope.gridPlantGroupId, 'onSelectedRowsChanged', loadGroupAssemblies);

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
					platformGridAPI.events.register($scope.gridPlantGroupId, 'onSelectedRowsChanged', loadGroupAssemblies);
					$scope.isLoading = false;
				});

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

					platformGridAPI.events.unregister($scope.gridPlantGroupId, 'onSelectedRowsChanged', loadGroupAssemblies);
					estimateMainPlantDialogService.enableItemFilter(true); // this will set the filtered list automatically
				}else{
					estimateMainPlantDialogService.setItemFilter(function () {
						return false;
					});
					estimateMainPlantDialogService.enableItemFilter(true); // this will set the filtered list automatically
				}
			}

			estimateMainPlantDialogService.reset.register(reset);
			estimateMainPlantDialogService.registerListLoaded(onListLoaded);

			estimateMainPlantDialogService.filterGroups.register(filterGroups);

			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridPlantGroupId);
				platformGridAPI.events.unregister($scope.gridPlantGroupId, 'onSelectedRowsChanged', loadGroupAssemblies);
				estimateMainPlantDialogService.unregisterListLoaded(onListLoaded);
				estimateMainPlantDialogService.reset.unregister(reset);
				estimateMainPlantDialogService.filterGroups.unregister(filterGroups);
			});
		}]);
})();
