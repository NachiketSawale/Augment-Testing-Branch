
(function () {
	'use strict';
	
	let moduleName = 'qto.main';
	angular.module(moduleName).controller('qtoAddressRangeDialogDetailController',
		['$scope', '$timeout', '$injector', 'platformGridAPI', 'qtoAddressRangeDetailUIConfigService', 'qtoAddressRangeDialogDetailDataService', 'platformGridControllerService', 'qtoAddressRangeDialogDetailValidationService',
			function ($scope, $timeout, $injector, platformGridAPI, uiConfigService, dataService, platformGridControllerService, validationService) {
				
				let myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					skipPermissionCheck: true,
					cellChangeCallBack: function (arg) {
						let item = arg.item;
						let col = arg.grid.getColumns()[arg.cell].field;
						if(col ==='LineArea') {
							arg.item.LineArea = arg.item.LineArea ? arg.item.LineArea.toUpperCase() : arg.item.LineArea;
						}
						dataService.setItemToSave(item);
						dataService.refreshGrid();
					}
				};
				
				let parentItem = $scope.$parent.dataItem.QtoAddressRangeDialogDto;
				$scope.gridId = '9158a08ff7474539bffb4a06aeae5a55';
				
				$scope.onContentResized = function () {
					resize();
				};
				
				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.version += 1;
					};
				};
				
				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'copy',
							sort: 0,
							caption: 'cloud.common.toolbarCopy',
							type: 'item',
							iconClass: 'tlb-icons ico-copy',
							fn: function () {
								let selected = angular.copy(dataService.getSelected());
								dataService.createItem(selected);
							},
							disabled: function () {
								return !dataService.getSelected() || !parentItem.IsActive;
							}
						},
						{
							id: 'create',
							sort: 1,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: function () {
								let selected = {};
								selected.BasClerkFk = null;
								selected.BasClerkRoleFk = null;
								selected.IndexArea = null;
								selected.LineArea = null;
								selected.SheetArea = null;
								selected.QtoAddressRangeFk = parentItem.Id;
								dataService.createItem(selected);
							},
							disabled: function () {
								return !parentItem.IsActive;
							}
						},
						{
							id: 'delete',
							sort: 2,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function () {
								let selected = angular.copy(dataService.getSelected());
								dataService.deleteItem(selected);
							},
							disabled: function () {
								return !dataService.getSelected() || !parentItem.IsActive;
							}
						}
					],
					update : function () {return;}
				};
				
				function resize() {
					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
				}
				
				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridControllerService.initListController($scope, uiConfigService, dataService, validationService, myGridConfig);
				}
				
				dataService.setListReadOnly.register(dataService.setListReadOnlyByActive);
				dataService.setListReadOnly.fire(!parentItem.IsActive);
				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					dataService.setSelected(null);
					dataService.clear();
					dataService.setListReadOnly.unregister(dataService.setListReadOnlyByActive);
				});
				
				init();
			}
		]);
})();
