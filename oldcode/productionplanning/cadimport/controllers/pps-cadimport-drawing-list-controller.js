(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.cadimport';
	angular.module(moduleName).controller('ppsCadimportDrawingListController', [
		'$scope', '$injector', 'platformGridControllerService',
		'ppsCadimportDrawingUIService', 'ppsCadimportDrawingDataService',
		'basicsCommonToolbarExtensionService', 'platformGridAPI',
		'$timeout', '$translate',
		'platformModuleNavigationService',
		'ppsCommonClipboardService',
		function ($scope, $injector, platformGridControllerService,
				  uiStandardService, dataService,
				  basicsCommonToolbarExtensionService, platformGridAPI,
				  $timeout, $translate,
				  navigationService,
				   ppsCommonClipboardService) {
			let gridConfig = {initCalled: false, columns: [], type: 'productionplanning.cadimport', dragDropService: ppsCommonClipboardService
			};
			platformGridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);
			basicsCommonToolbarExtensionService.insertBefore($scope,
				[{
					id: 'cadChecker',
					caption: 'productionplanning.cadimport.cadChecker',
					type: 'item',
					iconClass: 'tlb-icons ico-select-path',
					fn: function () {
						//$injector.get('basicsWorkflowInstanceService').startWorkflow('1000722', dataService.getSelected().Id, angular.toJson(dataService.getSelected()));
						$injector.get('basicsWorkflowEventService').startWorkflow('5ad64d1339544ebe802aa07e8a6748d3', dataService.getSelected().Id, angular.toJson(dataService.getSelected()));
					},
					disabled: function () {
						return !dataService.getSelected();
					}
				}, {
					id: 'importCadBtn',
					caption: 'productionplanning.cadimport.importCadBtn',
					type: 'item',
					iconClass: 'tlb-icons ico-import',
					fn: function () {
						platformGridAPI.grids.commitEdit($scope.gridId);//commit the cell at first
						dataService.importCad();
					},
					disabled: function () {
						return !dataService.canImportCad();
					}
				},{
					id: 'goto',
					caption: $translate.instant('cloud.common.Navigator.goTo'),
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-goto',
					list: {
						showImages: true,
						listCssClass: 'dropdown-menu-right',
						items: [{
							id: 'engTaskGoto',
							caption: $translate.instant('productionplanning.common.gotoEngineeringTask'),
							type: 'item',
							iconClass: 'app-small-icons ico-engineering-planning',
							fn: function () {
								var selectedItem = dataService.getSelected();
								if (selectedItem && !_.isNil(selectedItem.DrawingId)) {
									var navigator = {moduleName: 'productionplanning.engineering'};
									navigationService.navigate(navigator, {EngDrawingFk: selectedItem.DrawingId}, 'EngDrawingFk');
								}
							}
						}]
					}
				}]);

			var onCellChange = function (e, args) {
				var col = args.grid.getColumns()[args.cell].field;
				if (col !== 'ImportModel') {
					dataService.onPropertyChange({entity: args.item, col: col});
				}
			};
			var onSelectedItemChanged = function (e, args) {
				dataService.onPropertyChange(args);
			};

			var onSelectedRowChanged = function onSelectedRowsChanged() {
				$timeout($scope.tools.update, 0, true);
			};

			var onImporting = function () {
				$timeout($scope.tools.update, 0, true);
			};

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowChanged);
			uiStandardService.onSelectedItemChanged.register(onSelectedItemChanged);
			dataService.onImportingEvent.register(onImporting);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowChanged);
				uiStandardService.onSelectedItemChanged.unregister(onSelectedItemChanged);
				dataService.onImportingEvent.unregister(onImporting);
			});
		}
	]);
})();