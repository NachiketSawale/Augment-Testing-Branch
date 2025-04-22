/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidBidsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of bid (header) entities.
	 **/
	angular.module(moduleName).controller('salesBidBidsListController',
		['_', '$scope', '$injector', 'platformGridAPI', 'platformContainerControllerService', 'salesBidService', 'modelViewerStandardFilterService', 'salesCommonNavigationService',
			function (_, $scope, $injector, platformGridAPI, platformContainerControllerService, dataService, modelViewerStandardFilterService, salesCommonNavigationService) {

				platformContainerControllerService.initController($scope, moduleName, '7001204D7FB04CF48D8771C8971CC1E5');

				// characteristics functionality for dynamic configuration
				var characterColumnService = $injector.get('salesBidCharacteristicColumnService');
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
							id: 't-navigation-to-sales-contract',
							type: 'item',
							caption: $injector.get('platformModuleInfoService').getI18NName('sales.contract'),
							iconClass: 'app-small-icons ico-sales-contract '+_.uniqueId('_navigator'),
							fn: function () {
								var selectedBid = dataService.getSelected();
								if (_.has(selectedBid, 'Id')) {
									$injector.get('platformModuleNavigationService')
										.navigate({moduleName: 'sales.contract'}, selectedBid, 'BidId');
								}
							}
						}]
					},
					disabled: function () {
						var selectedBid = dataService.getSelected();
						return !(selectedBid && _.has(selectedBid, 'Id') && selectedBid.Version > 0);
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

				$scope.addTools(toolbarItems);

				function updateNavigationButton() {
					salesCommonNavigationService.updateNavigationItem($scope, dataService);
				}

				function updateToolBar() {
					$scope.tools.update();
				}
				dataService.onUpdateSucceeded.register(updateToolBar);
				dataService.registerSelectionChanged(updateNavigationButton);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService);

				$scope.$on('$destroy', function () {
					dataService.onUpdateSucceeded.unregister(updateToolBar);
					dataService.unregisterSelectionChanged(updateNavigationButton);
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
				});
			}
		]);
})(angular);
