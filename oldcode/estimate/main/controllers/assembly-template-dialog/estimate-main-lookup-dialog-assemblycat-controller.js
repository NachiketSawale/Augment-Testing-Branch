/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global Slick,_ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc value
	 * @name estimateMainLookupDialogAssemblycatListColumns
	 * @function
	 *
	 * @description
	 * Returns the assembly catalog columns and column settings.
	 **/
	angular.module(moduleName).value('estimateMainLookupDialogAssemblycatListColumns', {
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
						width: 130
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
					},
					{
						id: 3,
						field: 'EstAssemblyTypeFk',
						name: 'Assembly Type',
						name$tr$: 'estimate.assemblies.entityEstAssemblyTypeFk',
						readonly: true,
						editor: null,
						formatter: 'lookup',
						formatterOptions: {
							lookupType:'AssemblyType',
							displayMember: 'ShortKeyInfo.Description'
						}
					}
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name estimateMainLookupDialogAssemblycatController
	 * @function
	 *
	 * @description
	 * Assembly lookup category controller
	 **/
	angular.module(moduleName).controller('estimateMainLookupDialogAssemblycatController', [
		'$scope', 'estimateMainAssemblycatTemplateService', 'estimateMainLookupDialogAssemblycatListColumns', 'platformGridAPI', 'estimateMainAssemblyTemplateService', 'platformTranslateService',
		function ($scope, estimateMainAssemblycatTemplateService, estimateMainLookupDialogAssemblycatListColumns, platformGridAPI, estimateMainAssemblyTemplateService, platformTranslateService) {
			estimateMainAssemblycatTemplateService.init();

			let parentScope = $scope.$parent;
			$scope.gridAssemblyCatalogId = '3a55b53e9555453596e83acf9830c76a';
			$scope.gridData = {
				state: $scope.gridAssemblyCatalogId
			};

			if (!platformGridAPI.grids.exist($scope.gridAssemblyCatalogId)){
				let gridConfig = {
					data: [],
					columns: angular.copy(estimateMainLookupDialogAssemblycatListColumns.getStandardConfigForListView().columns),
					id: $scope.gridAssemblyCatalogId,
					lazyInit: false,
					isStaticGrid: true,
					options: {
						tree: true, indicator: false,
						editorLock: new Slick.EditorLock(),
						parentProp: 'EstAssemblyCatFk',
						childProp: 'AssemblyCatChildren',
						multiSelect: false
					},
					enableConfigSave: true
				};

				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);

				initialize();
			}else{
				platformGridAPI.columns.configuration($scope.gridAssemblyCatalogId, angular.copy(estimateMainLookupDialogAssemblycatListColumns.getStandardConfigForListView().columns));

				initialize();
			}

			function initialize(){
				if (parentScope.ngModel && _.isNumber(parentScope.ngModel)){ // entity assembly code is empty.
					platformGridAPI.items.data([]); // data will be set later according to the selected assembly in assembly-controller.
				}else{
					estimateMainAssemblycatTemplateService.loadAllAssemblyCategories().then(function(treeList){
						let filteredAssemblyCategories = estimateMainAssemblycatTemplateService.filterAssemblyCategories(parentScope.options, parentScope.entity, treeList);

						// workaround, if the dialog is closed quickly, the grid will be destroyed and this line will throw an error
						if (platformGridAPI.grids.exist($scope.gridAssemblyCatalogId)){
							platformGridAPI.items.data($scope.gridAssemblyCatalogId, filteredAssemblyCategories);
							parentScope.isReady = true;
							estimateMainAssemblyTemplateService.onFetchAssemblies.fire(filteredAssemblyCategories, true);
							if ($scope.$root){
								$scope.$root.safeApply();
							}
						}
					});
				}
			}

			parentScope.$watch('isCatLoading', function(isLoading){
				$scope.isLoading = isLoading;
			});

			function onListLoaded(){
				platformGridAPI.events.unregister($scope.gridAssemblyCatalogId, 'onSelectedRowsChanged', loadCategoryAssemblies);

				platformGridAPI.items.data($scope.gridAssemblyCatalogId, estimateMainAssemblycatTemplateService.getTree());

				let isItemFiltered = estimateMainAssemblycatTemplateService.isItemFilterEnabled();
				let cat = estimateMainAssemblycatTemplateService.getSelected();
				let catId = _.isEmpty(cat) ? [] : _.map([cat], 'Id');
				let grid = getGrid();
				if (grid && grid.instance){
					let rows = getGrid().dataView.mapIdsToRows(catId);

					if (isItemFiltered){
						getGrid().instance.setSelectedRows(rows);
						estimateMainAssemblycatTemplateService.setItemFilter(null); // clear the filter for next search
					}
				}

				platformGridAPI.events.register($scope.gridAssemblyCatalogId, 'onSelectedRowsChanged', loadCategoryAssemblies);
			}

			function loadCategoryAssemblies(e, args){
				parentScope.isLoading = true;
				let item = args.grid.getDataItem(args.rows);
				estimateMainAssemblycatTemplateService.setSelected(item);

				estimateMainAssemblyTemplateService.setOptions(parentScope.options);
				_.forEach(estimateMainAssemblycatTemplateService.getChildServices(), function(childService){
					childService.load().then(function(){
						parentScope.isLoading = false;
					});
				});
			}

			platformGridAPI.events.register($scope.gridAssemblyCatalogId, 'onSelectedRowsChanged', loadCategoryAssemblies);

			function reset(catSelected){
				estimateMainAssemblycatTemplateService.loadAllAssemblyCategories().then(function(treeList){
					let filteredAssemblyCategories = estimateMainAssemblycatTemplateService.filterAssemblyCategories(parentScope.options, parentScope.entity, treeList);

					platformGridAPI.events.unregister($scope.gridAssemblyCatalogId, 'onSelectedRowsChanged', loadCategoryAssemblies);

					if (_.isEmpty(catSelected)){
						getGrid().instance.setSelectedRows([]);
						platformGridAPI.items.data($scope.gridAssemblyCatalogId, filteredAssemblyCategories);
					}else{
						let itemList = estimateMainAssemblycatTemplateService.getFlattenByTree(filteredAssemblyCategories);
						let cat = _.find(itemList, {'Id': catSelected.Id});
						if (!_.isEmpty(cat)){
							estimateMainAssemblycatTemplateService.expandNodeParent(cat);
							let rows = getGrid().dataView.mapIdsToRows([catSelected.Id]);
							getGrid().instance.setSelectedRows(rows);
							estimateMainAssemblycatTemplateService.setSelected(cat);
							platformGridAPI.items.data($scope.gridAssemblyCatalogId, filteredAssemblyCategories);
							platformGridAPI.rows.scrollIntoViewByItem($scope.gridAssemblyCatalogId, cat);
						}
					}
					platformGridAPI.events.register($scope.gridAssemblyCatalogId, 'onSelectedRowsChanged', loadCategoryAssemblies);
					$scope.isLoading = false;
				});

				parentScope.modalOptions.disableOkButton = parentScope.enableMultiSelection ? _.isEmpty(estimateMainAssemblyTemplateService.getMultipleSelectedItems()) : true;
			}

			function getGrid(){
				return platformGridAPI.grids.element('id', $scope.gridAssemblyCatalogId);
			}

			function filterCategories(filteredAssemblyList){
				if (_.size(filteredAssemblyList) === 1){
					let assembly = _.first(filteredAssemblyList);
					let assemblyCatList = estimateMainAssemblycatTemplateService.getList();
					let cat = assembly.EstAssemblyCatFk > 0 ? _.find(assemblyCatList, function(i){ return i.Id === assembly.EstAssemblyCatFk || i.EstAssemblyCatSourceFk === assembly.EstAssemblyCatFk; }): null;
					if (_.isEmpty(cat) && _.findIndex(filteredAssemblyList, function(fa) {return fa.EstAssemblyCatFk === null;}) > -1){
						cat = estimateMainAssemblycatTemplateService.getItemById(-2); // -2 is noassignment
					}

					estimateMainAssemblycatTemplateService.setItemFilter(function (assemblyCatEntity) {
						if (cat){
							return assemblyCatEntity.Id === cat.Id;
						}
						return true;
					});
					estimateMainAssemblycatTemplateService.expandNodeParent(cat);
					estimateMainAssemblycatTemplateService.setSelected(cat); // this method only saves to data.selectedItem
					estimateMainAssemblycatTemplateService.enableItemFilter(true); // this will set the filtered list automatically
				}else if (_.size(filteredAssemblyList) > 1 ){
					let assemblyCatList = estimateMainAssemblycatTemplateService.getList();
					let cats = _.uniq(_.map(filteredAssemblyList, function(assembly){
						let cat =  assembly.EstAssemblyCatFk > 0 ? _.find(assemblyCatList, function(i){ return i.Id === assembly.EstAssemblyCatFk || i.EstAssemblyCatSourceFk === assembly.EstAssemblyCatFk; }): null;
						if (_.isEmpty(cat) && _.findIndex(filteredAssemblyList, function(fa) {return fa.EstAssemblyCatFk === null;}) > -1){
							cat = estimateMainAssemblycatTemplateService.getItemById(-2); // -2 is noassignment
						}
						return cat ? cat.Id : null; // (cat || {}).Id;
					}));

					let filterResult = estimateMainAssemblyTemplateService.getSearchListResult();
					if (filterResult && Object.prototype.hasOwnProperty.call(filterResult,'AssemblyCatIds') && _.size(filterResult.AssemblyCatIds) > 1) {
						let assemblyCatIds = _.uniq(_.map(assemblyCatList, 'Id'));
						let filterResultAssemblyCatIds = _.map(filterResult.AssemblyCatIds, function(assemblyCatFk){
							let cat = assemblyCatFk > 0 ? _.find(assemblyCatList, function(i){ return i.Id === assemblyCatFk || i.EstAssemblyCatSourceFk === assemblyCatFk; }): null;
							if (_.isEmpty(cat)){
								cat = estimateMainAssemblycatTemplateService.getItemById(-2); // -2 is noassignment
							}

							return cat.Id;
						});
						cats = _.filter(filterResultAssemblyCatIds, function (c) {
							let catValue = c === null ? -2 : c;
							return assemblyCatIds.indexOf(catValue) !== -1;
						});
					}
					let containNoAssignment = _.filter(cats, function(c){ return c === null; });
					if (containNoAssignment.length > 0){
						cats.push(-2);
					}
					estimateMainAssemblycatTemplateService.setItemFilter(function (assemblyCatEntity) {
						return cats.indexOf(assemblyCatEntity.Id) !== -1;
					});
					platformGridAPI.events.unregister($scope.gridAssemblyCatalogId, 'onSelectedRowsChanged', loadCategoryAssemblies);
					estimateMainAssemblycatTemplateService.enableItemFilter(true); // this will set the filtered list automatically
				}else{
					estimateMainAssemblycatTemplateService.setItemFilter(function () {
						return false;
					});
					estimateMainAssemblycatTemplateService.enableItemFilter(true); // this will set the filtered list automatically
				}
			}

			estimateMainAssemblycatTemplateService.reset.register(reset);
			estimateMainAssemblycatTemplateService.registerListLoaded(onListLoaded);

			estimateMainAssemblycatTemplateService.filterCategories.register(filterCategories);

			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridAssemblyCatalogId);
				platformGridAPI.events.unregister($scope.gridAssemblyCatalogId, 'onSelectedRowsChanged', loadCategoryAssemblies);
				estimateMainAssemblycatTemplateService.unregisterListLoaded(onListLoaded);
				estimateMainAssemblycatTemplateService.reset.unregister(reset);
				estimateMainAssemblycatTemplateService.filterCategories.unregister(filterCategories);
				estimateMainAssemblycatTemplateService.setIsLoadCat(false);
			});
		}]);
})();
