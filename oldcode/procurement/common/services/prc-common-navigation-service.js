/**
 * Created by lvy on 2019/10/11.
 * Update by lcn on 2025/02/24.
 * Angular service handling navigation items for procurement modules
 */
(function (angular) {
	'use strict';
	/* global _,globals */

	const moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonNavigationService', [
		'$translate',
		'$http',
		'$injector',
		'$state',
		'cloudDesktopSidebarService',
		'platformModuleNavigationService',
		'procurementContextService',
		function (
			$translate,
			$http,
			$injector,
			$state,
			cloudDesktopSidebarService,
			naviService,
			procurementContextService
		) {

			// Defines the available procurement modules.
			const prcModules = [
				'procurement.package',
				'procurement.requisition',
				'procurement.rfq',
				'procurement.quote',
				'procurement.pricecomparison',
				'procurement.contract',
				'qto.main',
				'procurement.pes',
				'procurement.invoice',
				'sales.billing'
			];
			// Defines the icons corresponding to procurement modules.
			const prcModuleIcons = [
				'ico-package',
				'ico-requisition',
				'ico-rfq',
				'ico-quote',
				'ico-price-compare',
				'ico-contracts',
				'ico-qto',
				'ico-pes',
				'ico-invoice',
				'ico-sales-billing'
			];
			let toolbarNavigationItemCache = {};

			//Retrieves the current module name from the given data service.
			const getModuleName = (dataService) => dataService.getModule()?.name ?? null;
			//Retrieves the selected item ID from the given data service.
			const getSelectedItemId = (dataService) => dataService.getSelected()?.Id ?? null;
			//Creates a navigation list item.
			const createNavigationListItem = (moduleName, caption, iconClass, fn, disabledFn) => ({
				id: `t-navigation-to-${moduleName.split('.')[1]}`,
				type: 'item',
				hideItem: false,
				caption,
				iconClass: `app-small-icons ${iconClass} ${_.uniqueId('_navigator')}`,
				fn,
				disabled: disabledFn
			});

			//Updates the navigation item with new data.
			const updateNavigation = (item, moduleName, dependentDataVal, paramKey) => {
				const caption = $injector.get('platformModuleInfoService').getI18NName(moduleName);

				item.caption = dependentDataVal.length ? `${caption}(${dependentDataVal.length})` : caption;
				item.disabled = () => !dependentDataVal.length || (moduleName !== 'qto.main' && !naviService.hasPermissionForModule(moduleName));
				item.navigateTo = dependentDataVal;

				// Hide the item if it's "sales.billing" and there are no dependent data values.
				item.hideItem = moduleName === 'sales.billing' && dependentDataVal.length === 0;
				item.fn = () => {
					if (moduleName === 'qto.main') {
						naviService.navigate({moduleName}, {[paramKey]: dependentDataVal.join(',')}, paramKey);
					} else {
						const idsStr = _.map(dependentDataVal, 'Targetfk').join(',');
						naviService.navigate({moduleName}, {FromGoToBtn: true, [paramKey]: idsStr}, paramKey);
					}
				};
			};

			//Creates a navigation item and adds it to the scope tools.
			const createNavigationItem = (scope, dataService) => {
				const navItem = _.find(scope.tools.items, {id: 't-navigation-to'});
				if (navItem) {
					navItem.disabled = () => {
						const selectedItem = dataService.getSelected();
						return !selectedItem || !_.has(selectedItem, 'Id') || selectedItem.Version <= 0 || scope.tools.navigationUpdating;
					};
					return null;
				}

				const modName = getModuleName(dataService);
				if (!modName) {
					return null;
				}
				const navigationList = prcModules.map((moduleName, key) => {
					const iconClass = prcModuleIcons[key];
					const caption = $injector.get('platformModuleInfoService').getI18NName(moduleName) || moduleName;
					const listItem = createNavigationListItem(moduleName, caption, iconClass);
					if (modName.toLowerCase() === moduleName) {
						listItem.iconClass += ' font-bold plain headline';
					}
					return listItem;
				});

				const toolbarNavigationItem = {
					id: 't-navigation-to',
					caption: 'cloud.common.Navigator.goTo',
					type: 'dropdown-btn',
					iconClass: `tlb-icons ico-goto ${_.uniqueId('_navigator')}`,
					list: {
						showImages: true,
						cssClass: 'dropdown-menu-right',
						items: navigationList
					},
					disabled: () => {
						const selectedItem = dataService.getSelected();
						return !selectedItem || !_.has(selectedItem, 'Id') || selectedItem.Version <= 0 || scope.tools.navigationUpdating;
					}
				};

				scope.addTools([toolbarNavigationItem]);
				toolbarNavigationItemCache = toolbarNavigationItem;
				return toolbarNavigationItem;
			}

			//Updates an existing navigation item in the scope tools.
			const updateNavigationItem = (scope, dataService) => {
				if (!scope) {
					return;
				}
				const moduleName = getModuleName(dataService);
				const selectedItemId = getSelectedItemId(dataService);

				if (!selectedItemId || !moduleName) {
					return;
				}

				let gotoButton = _.find(scope.tools.items, {id: 't-navigation-to'});
				if (!gotoButton?.list?.items) {
					return;
				}
				toolbarNavigationItemCache = gotoButton;
				scope.tools.navigationUpdating = true;

				let sourceModule = moduleName;
				if (moduleName === 'procurement.quote') {
					enablePriceComparisonItemForQuote(_.find(gotoButton.list.items, {id: 't-navigation-to-pricecomparison'}), dataService);
				} else if (moduleName === 'procurement.pricecomparison') {
					sourceModule = 'procurement.rfq';
				}

				procurementContextService.isGetPrcDependentData = true;

				let url = `${globals.webApiBaseUrl}procurement/common/prcdependentdata/dependentlist?foreignFk=${selectedItemId}&source=${sourceModule}&needQto=true`;
				$http.get(url).then(function (response) {
					if (response.data) {
						updateNavigationBaseResponseData(gotoButton, response.data);
					}
					const itemsToUpdate = [
						{mod: 'procurement.pricecomparison', id: 't-navigation-to-rfq', fn: enableRfqItemForPriceComparison},
						{mod: 'procurement.rfq', id: 't-navigation-to-pricecomparison', fn: enablePriceComparisonItemForRfq, condition: response.data?.Quote?.length > 0},
						{mod: 'procurement.quote', id: 't-navigation-to-pricecomparison', fn: enablePriceComparisonItemForQtn}
					];

					itemsToUpdate.forEach(({mod, id, fn, condition = true}) => {
						if (moduleName === mod && condition) {
							fn(_.find(gotoButton.list.items, {id}), dataService);
						}
					});

					scope.tools.navigationUpdating = false;
					scope.tools.update();
				});
			}

			//Updates a navigation list item after clearing related dependent data.
			const updateNavigationListItemAfterClear = (scope, moduleName, clearDependentDataIds) => {
				let navigateTo = moduleName.split('.')[1];
				let gotoButton = _.find(scope.tools.items, {id: 't-navigation-to'});
				let relatedItem = _.find(gotoButton.list.items, {id: 't-navigation-to-' + navigateTo});
				if (!relatedItem) {
					return;
				}

				relatedItem.navigateTo = _.filter(relatedItem.navigateTo, i => !_.includes(clearDependentDataIds, i.Targetfk));
				updateNavigation(relatedItem, moduleName, relatedItem.navigateTo, 'Ids');
				scope.tools.update();
			}

			//Enables a specific navigation item based on module and field.
			const enableNavigationItem = (item, dataService, moduleName, field, paramKey) => {
				item.disabled = false;
				item.caption = `${$injector.get('platformModuleInfoService').getI18NName(moduleName)}(1)`;

				item.fn = function () {
					const maiItem = dataService.getSelected();
					if (maiItem && _.has(maiItem, field)) {
						naviService.navigate({moduleName}, maiItem, paramKey || field);
					}
				};
			}

			//Enables the Price Comparison item for a Quote module.
			const enablePriceComparisonItemForQuote = (item, dataService) => {
				enableNavigationItem(item, dataService, 'procurement.pricecomparison', 'Id', 'Code');
			}
			//Enables the Price Comparison item for an RFQ module.
			const enablePriceComparisonItemForRfq = (item, dataService) => {
				enableNavigationItem(item, dataService, 'procurement.pricecomparison', 'Id');
			}
			//Enables the Price Comparison item for a Quote (Qtn) module.
			const enablePriceComparisonItemForQtn = (item, dataService) => {
				enableNavigationItem(item, dataService, 'procurement.pricecomparison', 'Code');
			}
			//Enables the RFQ item for a Price Comparison module.
			const enableRfqItemForPriceComparison = (item, dataService) => {
				enableNavigationItem(item, dataService, 'procurement.rfq', 'Id');
			}
			// Updates navigation items based on response data.
			const updateNavigationBaseResponseData = (gotoButton, responseData) => {
				const dependentData = _.mapKeys(responseData, (value, key) => key.toLowerCase());

				_.forEach(prcModules, function (moduleName) {
					let navigateTo = moduleName.split('.')[1];
					let dependentDataKey = navigateTo;

					if (moduleName === 'procurement.pricecomparison' && responseData?.Quote?.length > 0) {
						dependentDataKey = 'rfq';
					} else if (moduleName === 'procurement.contract') {
						dependentDataKey = 'contractitems';
					} else if (moduleName === 'procurement.requisition') {
						dependentDataKey = 'requistionitems';
					} else if (moduleName === 'qto.main') {
						dependentDataKey = 'qtoids';
					} else if (moduleName === 'sales.billing') {
						dependentDataKey = 'salesbilling';
					}

					const dependentDataVal = dependentData[dependentDataKey] || [];
					const relatedItem = _.find(gotoButton.list.items, {id: `t-navigation-to-${navigateTo}`});

					if (relatedItem) {
						if (moduleName === 'qto.main') {
							updateNavigation(relatedItem, moduleName, dependentDataVal, 'QtoHeaderFks');
						} else {
							updateNavigation(relatedItem, moduleName, dependentDataVal, 'Ids');
						}
					}
				});
			}
			//
			const getNavigationItem = () => toolbarNavigationItemCache;

			return {
				updateNavigationItem: updateNavigationItem,
				createNavigationItem: createNavigationItem,
				updateNavigationListItemAfterClear: updateNavigationListItemAfterClear,
				getNavigationItem: getNavigationItem
			};
		}
	])
})
(angular);
