/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipWipsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of wip (header) entities.
	 **/
	angular.module(moduleName).controller('salesWipWipsListController',
		['_', '$scope', '$injector', 'platformContainerControllerService', 'salesWipService', 'modelViewerStandardFilterService', 'salesCommonNavigationService', 'platformGridAPI','basicsLookupdataLookupFilterService',
			'$rootScope', '$translate', 'boqMainLinkedDispatchNoteDataService',
			function (_, $scope, $injector, platformContainerControllerService, dataService, modelViewerStandardFilterService, salesCommonNavigationService, platformGridAPI, basicsLookupdataLookupFilterService,
					  $rootScope, $translate, boqMainLinkedDispatchNoteDataService) {

				platformContainerControllerService.initController($scope, moduleName, '689E0886DE554AF89AADD7E7C3B46F25');

				// characteristics functionality for dynamic configuration
				var characterColumnService = $injector.get('salesWipCharacteristicColumnService');
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
							caption: $injector.get('platformModuleInfoService').getNavigatorTitle('sales.contract'),
							iconClass: 'app-small-icons ico-sales-contract '+_.uniqueId('_navigator'),
							fn: function () {
								var mainItem = dataService.getSelected();
								if (_.has(mainItem, 'Id')) {
									$injector.get('platformModuleNavigationService')
										.navigate({moduleName: 'sales.contract'}, mainItem, 'OrdHeaderFk');
								}
							}
						},{
							id: 't-navigation-to-sales-billing',
							type: 'item',
							caption: $injector.get('platformModuleInfoService').getNavigatorTitle('sales.billing'),
							iconClass: 'app-small-icons ico-sales-billing '+_.uniqueId('_navigator'),
							fn: function () {
								var mainItem = dataService.getSelected();
								if (_.has(mainItem, 'Id')) {
									$injector.get('platformModuleNavigationService')
										.navigate({moduleName: 'sales.billing'}, mainItem, 'OrdHeaderFk');
								}
							}
						}]
					},
					disabled: function () {
						var mainItem = dataService.getSelected();
						return !(_.has(mainItem, 'OrdHeaderFk') && mainItem.Version > 0);
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

				// TODO: remove?
				// var platformGridAPI = $injector.get('platformGridAPI');

				dataService.onUpdateSucceeded.register(updateToolBar);
				dataService.registerSelectionChanged(updateNavigationButton);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService);

				const onGridClick = (e, args) => {
					let selectedItem = args.grid.getDataItem(args.row);
					$rootScope.$emit('linked-dispatch-note-parent-grid-click', {
						clickedItem: selectedItem,
						title: $translate.instant('sales.wip.containerTitleWips'),
						uuid: $scope.gridId
					});
				};
				platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);

				boqMainLinkedDispatchNoteDataService.register({
					uuid: $scope.gridId,
					moduleName: moduleName,
					title: $translate.instant('sales.wip.containerTitleWips'),
					parentService: dataService,
				});

				$scope.$on('$destroy', function () {
					dataService.onUpdateSucceeded.unregister(updateToolBar);
					dataService.unregisterSelectionChanged(updateNavigationButton);
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
					//basicsLookupdataLookupFilterService.unregisterFilter(filters);  Error throw
					platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
				});

			}
		]);
})(angular);
