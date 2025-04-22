/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractContractsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of contract (header) entities.
	 **/
	angular.module(moduleName).controller('salesContractContractsListController',
		['_', '$scope', '$injector', 'platformGridAPI', 'platformContainerControllerService', 'salesContractService', 'modelViewerStandardFilterService', 'salesCommonNavigationService', 'basicsLookupdataLookupFilterService',
			function (_, $scope, $injector, platformGridAPI, platformContainerControllerService, dataService, modelViewerStandardFilterService, salesCommonNavigationService, basicsLookupdataLookupFilterService) {

				platformContainerControllerService.initController($scope, moduleName, '34D0A7ECE4F34F2091F7BA6C622FF04D');

				// characteristics functionality for dynamic configuration
				var characterColumnService = $injector.get('salesBillingCharacteristicColumnService');
				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 40);

				characteristicDataService.registerItemValueUpdate(onItemUpdate);
				characteristicDataService.registerItemDelete(onItemDelete);
				platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);

				function onItemUpdate(e, item) {
					characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function (data) {
						if(item.CharacteristicEntity === null){
							item.CharacteristicEntity = data;
						}
						characterColumnService.checkColumn(item);
					});
				}
				function onItemDelete(e, items) {
					characterColumnService.deleteColumns(items);
				}
				function onActiveCellChanged(e, arg) {
					var column = arg.grid.getColumns()[arg.cell];
					if (column) {
						var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
						var isCharacteristic = characterColumnService.isCharacteristicColumn(column);
						if (isCharacteristic) {
							var lineItem = dataService.getSelected();
							if (lineItem !== null) {
								var col = column.field;
								var colArray = _.split(col, '_');
								if (colArray && colArray.length > 1) {
									var characteristicType = colArray[_.lastIndexOf(colArray) - 2];
									var value = parseInt(characteristicType);
									var isLookup = characteristicTypeService.isLookupType(value);
									var updateColumn = isLookup ? col : undefined;
									dataService.setCharacteristicColumn(updateColumn);
								}
							}
						}
					}
				}
				var toolbarItems = [];
				var navigationItem = {
					id: 't-navigation-to',
					caption: 'cloud.common.Navigator.goTo',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-goto '+_.uniqueId('_navigator'),
					list: {
						showImages: true,
						cssClass: 'dropdown-menu-right',
						items: [{
							id: 't-navigation-to-sales-wip',
							type: 'item',
							caption: $injector.get('platformModuleInfoService').getI18NName('sales.wip'),
							iconClass: 'app-small-icons ico-sales-wip '+_.uniqueId('_navigator'),
							fn: function () {
								var mainItem = dataService.getSelected();
								if (_.has(mainItem, 'Id')) {
									$injector.get('platformModuleNavigationService')
										.navigate({moduleName: 'sales.wip'}, mainItem, 'ContractId');
								}
							}
						},{
							id: 't-navigation-to-sales-billing',
							type: 'item',
							caption: $injector.get('platformModuleInfoService').getI18NName('sales.billing'),
							iconClass: 'app-small-icons ico-sales-billing '+_.uniqueId('_navigator'),
							fn: function () {
								var mainItem = dataService.getSelected();
								if (_.has(mainItem, 'Id')) {
									$injector.get('platformModuleNavigationService')
										.navigate({moduleName: 'sales.billing'}, mainItem, 'ContractId');
								}
							}
						},{
							id: 't-navigation-to-sales-bid',
							type: 'item',
							caption: $injector.get('platformModuleInfoService').getI18NName('sales.bid'),
							iconClass: 'app-small-icons ico-sales-bid '+_.uniqueId('_navigator'),
							fn: function () {
								var mainItem = dataService.getSelected();
								if (_.has(mainItem, 'Id') && mainItem.BidHeaderFk) {
									$injector.get('platformModuleNavigationService')
										.navigate({moduleName: 'sales.bid'}, mainItem, 'BidHeaderFk');
								}
							}
						}]
					},
					disabled: function () {
						var mainItem = dataService.getSelected();
						return !(_.has(mainItem, 'Id') && mainItem.Version > 0);
					}
				};

				$scope = salesCommonNavigationService.checkScopeToolsAndCreateIfNecessary($scope);

				salesCommonNavigationService.createNavigationItem($scope, dataService);
				salesCommonNavigationService.updateNavigationItem($scope, dataService);

				if (_.isObject($scope.tools)) {
					var navItem = _.find($scope.tools.items, {id: 't-navigation-to'});
					if (!navItem) {
						toolbarItems.push(navigationItem);
					}
				} else {
					console.log('HINT: scope or scope.tools is not defined -> navigation functionality not working properly.');
				}

				function updateNavigationButton() {
					salesCommonNavigationService.updateNavigationItem($scope, dataService);
				}

				dataService.registerSelectionChanged(updateNavigationButton);

				$scope.addTools(toolbarItems);

				function updateToolBar() {
					$scope.tools.update();
				}
				dataService.onUpdateSucceeded.register(updateToolBar);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService);

				$scope.$on('$destroy', function () {
					dataService.onUpdateSucceeded.unregister(updateToolBar);
					dataService.unregisterSelectionChanged(updateNavigationButton);
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
				});
			}
		]);
})();
