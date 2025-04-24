/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	let moduleName = 'controlling.configuration';
	angular.module(moduleName).controller('controllingConfigVersionCompareListController',
		['$scope','$injector','$timeout', '_', 'platformGridControllerService', 'controllingConfigVersionCompareDataService', 'controllingConfigVersionCompareConfigurationService',
			'controllingConfigurationColumnDefinitionDataService','platformGridAPI', 'platformModalService',
			function ($scope,$injector,$timeout, _, platformGridControllerService, dataService, configurationService,
				columnDefinitionDataService, platformGridAPI, platformModalService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					skipPermissionCheck: true,
					cellChangeCallBack: function (arg) {
						let col = arg.grid.getColumns()[arg.cell].field;
						if(col === 'IsDefault'){
							let currentItem = arg.item;
							let value = currentItem[col];
							let list = dataService.getList();

							// if current value is false, and all others' value is false, popup out error info and set it back true
							if(!value && !_.find(list, function (item){ return item[col] === true;})){
								currentItem[col] = true;
								platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: currentItem});
								platformModalService.showMsgBox('controlling.configuration.noDefaultVersionCompConfig', 'cloud.common.informationDialogHeader', 'ico-info');

								return;
							}

							_.forEach(list, function (item){
								if(currentItem.Id === item.Id){return;}

								let originalVal = item[col];
								item[col] = false;
								if(originalVal !== item[col]){
									platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: item});
									dataService.markItemAsModified(item);
								}
							});
						}
					}
				};

				platformGridControllerService.initListController($scope, configurationService, dataService, null, myGridConfig);

				let grid = platformGridAPI.grids.element('id', $scope.gridId);
				grid.options.multiSelect = false;

				function refreshFormulaDefinitionListService(){
					let grid = platformGridAPI.grids.element('id', $scope.gridId);

					if(grid){
						grid.instance.setSelectedRows([]);
						dataService.clearSelectedItem();
						dataService.load();
					}
				}

				columnDefinitionDataService.registerRefreshRequested(refreshFormulaDefinitionListService);

				function updateTools() {
					$scope.tools.items = _.filter($scope.tools.items,function (d) {
						return d.id!=='t14' && d.id !=='t199';
					});

					let deleteItem = _.find($scope.tools.items,function (d) {
						return d.id ==='delete';
					});

					if(deleteItem && dataService.getSelectedEntities){
						let selectedItems = dataService.getSelectedEntities();

						deleteItem.disabled = !selectedItems || selectedItems.length <= 0;
					}

					$timeout(function () {
						$scope.tools.update();
					});
				}
				updateTools();

				dataService.load();

				dataService.setGridGuid($scope.gridId);

				$scope.$on ('$destroy', function () {
				});
			}
		]);
})(angular);
