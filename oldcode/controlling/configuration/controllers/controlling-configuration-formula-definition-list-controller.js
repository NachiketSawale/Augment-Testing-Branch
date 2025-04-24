(function (angular) {
	'use strict';

	let moduleName = 'controlling.configuration';
	angular.module(moduleName).controller('controllingConfigurationFormulaDefinitionListController',
		['$scope','$injector','$timeout', '_',
			'platformGridControllerService',
			'platformModalService',
			'controllingConfigurationFormulaDefinitionDataService',
			'controllingConfigurationFormulaDefinitionConfigurationService',
			'platformGridAPI',
			'controllingConfigurationColumnDefinitionDataService',
			'controllingConfigFormulaDefValidationService',
			'contrConfigFormulaTypeHelper',
			'basicsLookupdataLookupFilterService',
			'contrConfigFormulaImageService',
			function ($scope,$injector,$timeout, _,
				platformGridControllerService,
				platformModalService,
				dataService,
				configurationService,
				platformGridAPI,
				columnDefinitionDataService,
				validateService,
				contrConfigFormulaTypeHelper,
				basicsLookupdataLookupFilterService,
				contrConfigFormulaImageService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function (arg) {
						let currentItem = arg.item;
						let list = dataService.getList();

						let col = arg.grid.getColumns()[arg.cell].field;
						if(col === 'IsDefault' && contrConfigFormulaTypeHelper.isDefaultEditable(arg.item.BasContrColumnTypeFk)){
							if(!currentItem.IsDefault &&
								(contrConfigFormulaTypeHelper.isCac_m(currentItem.BasContrColumnTypeFk) || contrConfigFormulaTypeHelper.isSac(currentItem.BasContrColumnTypeFk))){
								currentItem.IsDefault= true;
								platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: currentItem});
								// dataService.markItemAsModified(currentItem);
								platformModalService.showMsgBox('controlling.configuration.noDefault4CurrFormula', 'cloud.common.informationDialogHeader', 'ico-info');
								return;
							}

							_.forEach(list, function (item){
								if(currentItem.Id === item.Id || currentItem.BasContrColumnTypeFk !== item.BasContrColumnTypeFk){return;}

								let originalVal = item[col];
								item[col] = false;
								if(originalVal !== item[col]){
									platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: item});
									dataService.markItemAsModified(item);
								}
							});
						}else if(col === 'IsVisible' &&  !contrConfigFormulaTypeHelper.isCustomType(arg.item.BasContrColumnTypeFk)){
							checkIsVisible(list,currentItem,'IsVisible');
						}
						else if(col === 'BasContrColumnTypeFk' && !contrConfigFormulaTypeHelper.isCustomType(arg.item.BasContrColumnTypeFk)){
							checkIsVisible(list,currentItem,'IsVisible');
						}
					},
					sortOptions: {
						initialSortColumn: {field: 'code', id: 'code'},
						isAsc: true
					}
				};

				validateService.loadColumnDef();

				platformGridControllerService.initListController($scope, configurationService, dataService, validateService, myGridConfig);

				/*
				* Check the current column and the existing data column logic
				* */
				function checkIsVisible(list,currentItem,col){
					_.forEach(list, function (item){
						if(currentItem.Id === item.Id || currentItem.BasContrColumnTypeFk !== item.BasContrColumnTypeFk){return;}

						let originalVal = item[col];
						item[col] = false;
						if(originalVal !== item[col]){
							platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: item});
							dataService.markItemAsModified(item);
						}
					});
				}
				function updateTools() {
					$scope.tools.items = _.filter($scope.tools.items,function (d) {
						return d.id!=='t14' && d.id !=='t199';
					});

					let deleteItem = _.find($scope.tools.items,function (d) {
						return d.id ==='delete';
					});

					if(deleteItem && dataService.getSelectedEntities){
						let selectedItems = dataService.getSelectedEntities();

						deleteItem.disabled = !selectedItems || selectedItems.length <= 0 || _.filter(selectedItems, {IsBaseConfigData: true}).length > 0;
					}

					$timeout(function () {
						$scope.tools.update();
					});
				}
				updateTools();

				function refreshFormulaDefinitionListService(){
					let grid = platformGridAPI.grids.element('id', $scope.gridId);
					if(grid){
						grid.instance.setSelectedRows([]);
						dataService.clearSelectedItem();
						dataService.load();
					}
				}

				columnDefinitionDataService.registerRefreshRequested(refreshFormulaDefinitionListService);

				function init(){
					if(!dataService.getList().length){
						dataService.load();
					}
				}
				init();

				let filters = [
					{
						key: 'bas-controlling-formula-column-type',
						fn: function (type) {
							return !contrConfigFormulaTypeHelper.isWcfOrBcf(type.Id) && !contrConfigFormulaTypeHelper.isSac(type.Id) && !contrConfigFormulaTypeHelper.isCAC(type.Id);
						}
					}
				];

				function onSelectedRowsChanged(e, args) {
					let rows = args.rows;
					let selectedItem = platformGridAPI.grids.element('id', $scope.gridId).instance.getDataItem(_.first(rows));
					contrConfigFormulaImageService.changeFormulaContent(selectedItem);
				}

				basicsLookupdataLookupFilterService.registerFilter(filters);

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				$scope.$on ('$destroy', function () {
					columnDefinitionDataService.unregisterRefreshRequested(refreshFormulaDefinitionListService);
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				});
			}
		]);
})(angular);
