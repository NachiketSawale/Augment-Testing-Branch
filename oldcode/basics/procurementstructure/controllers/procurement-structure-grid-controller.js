(function (angular) {
	/* jshint -W072 */ // many parameters because of dependency injection

	'use strict';
	/**
     * @ngdoc controller
     * @name basics.ProcurementStructureGridController
     * @require $scope
     * @description controller for basics procurement structure grid controller
     */
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementStructureGridController',
		['$scope', 'platformGridControllerService', 'basicsProcurementStructureService',
			'basicsProcurementStructureUIStandardService', 'basicsProcurementStructureValidationService', 'platformGridAPI', '$timeout',
			'$injector',
			function ($scope, gridControllerService, dataService, uiStandardService, validationService, platformGridAPI, $timeout,$injector) {

				var containerInfoService = $injector.get('basicsProcurementstructureContainerInformationService');
				var gridContainerGuid = 'a59c90cf86d14abe98df9cb8601b22a0';
				var gridConfig = {
					initCalled: false,
					columns: [], parentProp: 'PrcStructureFk',
					childProp: 'ChildItems',
					cellChangeCallBack: function (arg) {
						var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 54, gridContainerGuid,containerInfoService);
						if (characterColumnService) {
							var column = arg.grid.getColumns()[arg.cell];
							var field = arg.grid.getColumns()[arg.cell].field;
							characterColumnService.fieldChange(arg.item, field, column);
						}
					}
				};

				function onScrollToItem(entity) {
					$timeout(function () {
						var itemList = dataService.getList();
						if (itemList.length > 0) {
							dataService.setSelected(itemList[0]).then(function () {
								platformGridAPI.rows.expandAllSubNodes($scope.gridId);
								platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, entity);
							});
						}
					}, 100);
				}

				dataService.onScrollToItem.register(onScrollToItem);
				gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

				var tools = [
					{
						id: 't11',
						caption: 'basics.procurementstructure.upgradeStructure',
						type: 'item',
						iconClass: 'tlb-icons ico-promote',
						fn: dataService.upgradeStructure,
						disabled: function () {
							return !dataService.canUpgradeStructure();
						}
					},
					{
						id: 't12',
						caption: 'basics.procurementstructure.downgradeStructure',
						type: 'item',
						iconClass: 'tlb-icons ico-demote',
						fn: dataService.downgradeStructure,
						disabled: function () {
							return !dataService.canDowngradeStructure();
						}
					},
					{
						id: 'd99',
						type: 'divider'
					}
				];

				$scope.addTools(tools);

				var updateTools = function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				};

				dataService.registerSelectionChanged(updateTools);
				//handle characterist
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 54, gridContainerGuid,containerInfoService);

				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 54);

				// dev-10043: fix general performance issue, should be after initListController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToGrid($scope, characterColumnService, characteristicDataService, dataService);

				function setRowSelection(item) {
					platformGridAPI.rows.selection({gridId: $scope.gridId, rows: [item]});
				}

				dataService.upgradeDowngradeActivity.register(setRowSelection);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					dataService.onScrollToItem.unregister(onScrollToItem);
					dataService.upgradeDowngradeActivity.unregister(setRowSelection);
				});
			}

		]);
})(angular);