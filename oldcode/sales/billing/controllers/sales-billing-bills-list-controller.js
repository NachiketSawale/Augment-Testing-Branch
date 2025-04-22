/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingBillsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of billing (header) entities.
	 **/
	angular.module(moduleName).controller('salesBillingBillsListController',
		['_', '$scope', '$injector', 'platformGridAPI', 'platformContainerControllerService', 'salesBillingService', 'modelViewerStandardFilterService', 'salesCommonNavigationService',
			'$rootScope', '$translate', 'boqMainLinkedDispatchNoteDataService',
			function (_, $scope, $injector, platformGridAPI, platformContainerControllerService, salesBillingService, modelViewerStandardFilterService, salesCommonNavigationService,
					  $rootScope, $translate, boqMainLinkedDispatchNoteDataService) {

				platformContainerControllerService.initController($scope, moduleName, '39608924DC884AFEA59FE04CB1434543');

				// characteristics functionality for dynamic configuration
				var characterColumnService = $injector.get('salesBillingCharacteristicColumnService');
				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(salesBillingService, 40);

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
							var lineItem = salesBillingService.getSelected();
							if (lineItem !== null) {
								var col = column.field;
								var colArray = _.split(col, '_');
								if (colArray && colArray.length > 1) {
									var characteristicType = colArray[_.lastIndexOf(colArray) - 2];
									var value = parseInt(characteristicType);
									var isLookup = characteristicTypeService.isLookupType(value);
									var updateColumn = isLookup ? col : undefined;
									salesBillingService.setCharacteristicColumn(updateColumn);
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
					iconClass: 'tlb-icons ico-goto ' + _.uniqueId('_navigator'),
					list: {
						showImages: true,
						cssClass: 'dropdown-menu-right',
						items: [{
							id: 't-navigation-to-sales-contract',
							type: 'item',
							caption: $injector.get('platformModuleInfoService').getI18NName('sales.contract'),
							iconClass: 'app-small-icons ico-sales-contract ' + _.uniqueId('_navigator'),
							fn: function () {
								var selectedBill = salesBillingService.getSelected();
								if (_.has(selectedBill, 'Id')) {
									$injector.get('platformModuleNavigationService')
										.navigate({moduleName: 'sales.contract'}, selectedBill, 'OrdHeaderFk');
								}
							}
						}, {
							id: 't-navigation-to-sales-wip',
							type: 'item',
							caption: $injector.get('platformModuleInfoService').getI18NName('sales.wip'),
							iconClass: 'app-small-icons ico-sales-wip ' + _.uniqueId('_navigator'),
							fn: function () {
								var selectedBill = salesBillingService.getSelected();
								if (_.has(selectedBill, 'Id')) {
									$injector.get('platformModuleNavigationService')
										.navigate({moduleName: 'sales.wip'}, selectedBill, 'OrdHeaderFk');
								}
							}
						}]
					},
					disabled: function () {
						var selectedBill = salesBillingService.getSelected();
						return !(selectedBill && _.has(selectedBill, 'OrdHeaderFk') && selectedBill.Version > 0);
					}
				};

				$scope = salesCommonNavigationService.checkScopeToolsAndCreateIfNecessary($scope);

				salesCommonNavigationService.createNavigationItem($scope, salesBillingService);
				salesCommonNavigationService.updateNavigationItem($scope, salesBillingService);

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
					salesCommonNavigationService.updateNavigationItem($scope, salesBillingService);
				}

				function updateToolBar() {
					$scope.tools.update();
				}

				salesBillingService.onUpdateSucceeded.register(updateToolBar);
				salesBillingService.registerSelectionChanged(updateNavigationButton);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, salesBillingService);

				const onGridClick = (e, args) => {
					let selectedItem = args.grid.getDataItem(args.row);
					$rootScope.$emit('linked-dispatch-note-parent-grid-click', {
						clickedItem: selectedItem,
						title: $translate.instant('sales.billing.containerTitleBills'),
						uuid: $scope.gridId
					});
				};
				platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);

				boqMainLinkedDispatchNoteDataService.register({
					uuid: $scope.gridId,
					moduleName: moduleName,
					title: $translate.instant('sales.billing.containerTitleBills'),
					parentService: salesBillingService,
				});


				$scope.$on('$destroy', function () {
					salesBillingService.onUpdateSucceeded.unregister(updateToolBar);
					salesBillingService.unregisterSelectionChanged(updateNavigationButton);
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
					platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
				});
			}
		]);
})();
