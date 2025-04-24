(function (angular) {

	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* global _ */
	'use strict';
	var moduleName = 'procurement.contract';

	/**
	 * @ngdoc controller
	 * @name procurementContractHierarchicalListController
	 * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementContractHeaderDataService, procurementContractHeaderGridColumns
	 * @description controller for contract header
	 */
	angular.module(moduleName).controller('procurementContractHierarchicalListController',
		['$injector', '$scope', 'platformGridControllerService', 'procurementContractHeaderDataService','contractHeaderElementValidationService', 'procurementContractHeaderUIStandardService',
			'estimateProjectRateBookConfigDataService', 'procurementCommonNavigationService', 'platformGridAPI',
			'contractHeaderPurchaseOrdersDataService','procurementCommonCreateButtonBySystemOptionService',
			function ($injector, $scope, gridControllerService, dataService, validationService, uiStandardService,
				estimateProjectRateBookConfigDataService, procurementCommonNavigationService, platformGridAPI,
				contractHeaderPurchaseOrdersDataService,procurementCommonCreateButtonBySystemOptionService) {
				var gridConfig = {
					columns: [],
					parentProp: 'ConHeaderFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					rowChangeCallBack: function (/* arg */) {
						dataService.gridRowChangeCallBack();
					},
					cellChangeCallBack: function cellChangeCallBack(arg) {
						dataService.gridCellChangeCallBack(arg);
					},
				};
				gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

				procurementCommonNavigationService.createNavigationItem($scope, dataService);
				updateNavigationButton();

				function updateNavigationButton() {
					procurementCommonNavigationService.updateNavigationItem($scope, dataService);
				}

				function updateToolBar() {
					$scope.tools.update();
				}

				function selectionChangeed(e, entity) {
					dataService.gridSelectionChangeed(entity);
				}

				dataService.registerSelectionChanged(selectionChangeed);
				dataService.registerSelectionChanged(updateNavigationButton);
				dataService.registerUpdateDone(updateToolBar);
				dataService.isFrameworkChanged.register(updateToolBar);

				var characterColumnService = dataService.characterColumnService();
				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 46);

				characteristicDataService.registerItemValueUpdate(onItemUpdate);

				function onItemUpdate(e, item) {
					dataService.characteristicDataOnItemUpdate(item, characteristicDataService, characterColumnService);
				}

				characteristicDataService.registerItemDelete(onItemDelete);

				function onItemDelete(e, items) {
					characterColumnService.deleteColumns(items);
				}

				platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);

				function onActiveCellChanged(e, arg) {
					dataService.gridOnActiveCellChanged(arg, characterColumnService);
				}

				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(selectionChangeed);
					dataService.unregisterSelectionChanged(updateNavigationButton);
					estimateProjectRateBookConfigDataService.clearData();
					dataService.unregisterUpdateDone(updateToolBar);
					dataService.isFrameworkChanged.unregister(updateToolBar);
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
				});

				var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'delete';
				});

				$scope.tools.items.splice(deleteBtnIdx - 1, 0,
					{
						id: 'dContractSub',
						type: 'divider'
					},
					{
						id: 'contractOrderChange',
						caption: 'procurement.contract.createOrderChange',
						type: 'item',
						iconClass: 'tlb-icons ico-new-change-order',
						disabled: function () {
							var selected = dataService.getSelected();
							return !selected || contractHeaderPurchaseOrdersDataService.isFramework(selected);
						},
						fn: function () {
							dataService.createChangeOrder();
						}
					},
					{
						id: 'contractCallOff',
						caption: 'procurement.contract.createCallOff',
						type: 'item',
						iconClass: 'tlb-icons ico-new-call-off',
						disabled: function () {
							var selected = dataService.getSelected();
							return !selected || contractHeaderPurchaseOrdersDataService.isFramework(selected);
						},
						fn: function () {
							dataService.createCallOff();
						}
					}
				);

				let deepCopyIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'createDeepCopy';
				});

				if (deepCopyIdx > -1) {
					$scope.tools.items[deepCopyIdx].permission = {
						'349f4683cd194ebb9af98026ec9a2126': 4
					};
				}
				$scope.tools.update();
				procurementCommonCreateButtonBySystemOptionService.removeGridCreateButton($scope,['create']);
			}]
	);
})(angular);