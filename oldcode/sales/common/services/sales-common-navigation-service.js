/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'sales.common';
	angular.module(moduleName).factory('salesCommonNavigationService', [
		'$translate', '$http', '$injector', '$state', '$q', 'globals', 'cloudDesktopSidebarService', '_', 'platformModuleNavigationService',
		function ($translate, $http, $injector, $state, $q, globals, cloudDesktopSidebarService, _, platformModuleNavigationService) {
			var salesModules = [
				'bid', 'contract', 'wip', 'billing','invoice'
			];
			var salesModuleIcons = [
				'ico-sales-bid', 'ico-sales-contract', 'ico-sales-wip', 'ico-sales-billing', 'ico-invoice'
			];

			function updateNavigationItem(scope, dataService) {
				var modName = getModuleName(dataService);
				var selectedItemId = getSelectedItemId(dataService);
				if (_.isObject(scope.tools) && selectedItemId && modName) {
					var gotoButton = _.find(scope.tools.items, {id: 't-navigation-to'});
					if (gotoButton && gotoButton.list && gotoButton.list.items) {
						scope.tools.navigationUpdating = true;
						var sourceModule = modName;

						var url = globals.webApiBaseUrl + 'sales/common/navigation/list' +
							'?sourceFk=' + selectedItemId +
							'&sourceModule=' + sourceModule;
						$http.get(url)
							.then(function (response) {
								if (response.data) {
									updateNavigationBaseResponseData(gotoButton, response.data);
								}

								if (_.has(scope.tools, 'navigationUpdating')) {
									scope.tools.navigationUpdating = false;
								}

								scope.tools.update();
							});
					}
				}
			}

			function checkScopeToolsAndCreateIfNecessary(scope) {
				if (!scope.tools) {
					var tools = [{
						id: 't1',
						sort: 0,
						caption: 'cloud.common.toolbarMoveUp',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-up',
						fn: function () {
						}
					}, {
						id: 't2',
						sort: 10,
						caption: 'cloud.common.toolbarMoveDown',
						type: 'item',
						fn: function () {
						},
						iconClass: 'tlb-icons ico-grid-row-down'
					}];
					scope.addTools(tools);
				}
				return scope;
			}

			function createNavigationItem(scope, dataService) {
				if (_.isObject(scope.tools)) {
					var navItem = _.find(scope.tools.items, {id: 't-navigation-to'});
				}
				if (navItem) {
					return null;
				}

				var modName = getModuleName(dataService);

				var toolbarNavigationItem, navigationList = [];

				if (modName) {
					_.forEach(salesModules, function (val, key) {
						var iconClass = salesModuleIcons[key];
						var caption;
						if (val==='invoice'){
							caption = $injector.get('platformModuleInfoService').getI18NName('procurement.' + val);
						}else{
							caption = $injector.get('platformModuleInfoService').getI18NName('sales.' + val);
						}
						if (!caption) {
							caption = val;
						}
						navigationList[key] = createNavigationListItem(val, caption, iconClass);
						if (modName.toLowerCase() === 'sales.' + val) {
							navigationList[key].iconClass += ' font-bold plain headline';
						}
					});

					toolbarNavigationItem = {
						id: 't-navigation-to',
						caption: 'cloud.common.Navigator.goTo',
						type: 'dropdown-btn',
						iconClass: 'tlb-icons ico-goto ' + _.uniqueId('_navigator'),
						list: {
							showImages: true,
							cssClass: 'dropdown-menu-right',
							items: navigationList
						},
						disabled: function () {
							var mainItem = dataService.getSelected();
							if (scope.tools) {
								return !(mainItem && _.has(mainItem, 'Id') && mainItem.Version > 0) || scope.tools.navigationUpdating;
							}
							return !(mainItem && _.has(mainItem, 'Id') && mainItem.Version > 0) || scope.tools;
						}
					};

					scope.addTools([toolbarNavigationItem]);
				}

				return toolbarNavigationItem;
			}

			function getModuleName(dataService) {
				var modName, module = dataService.getModule();
				if (module) {
					modName = module.name;
				}
				return modName;
			}

			function getSelectedItemId(dataService) {
				var selectedItemId, selectedItem = dataService.getSelected();
				if (selectedItem) {
					selectedItemId = selectedItem.Id;
				}
				return selectedItemId;
			}

			function createNavigationListItem(navigateTo, caption, iconClass, fn, disabledFn) {
				return {
					id: 't-navigation-to-' + navigateTo,
					type: 'item',
					caption: caption,
					hideItem: false,
					iconClass: 'app-small-icons ' + iconClass + ' ' + _.uniqueId('_navigator'),
					fn: fn === undefined ? function () {
					} : fn,
					disabled: disabledFn === undefined ? true : disabledFn
				};
			}

			function updateNavigationListItem(item, navigateTo, dependentDataVal) {
				var caption;
				var destModule = 'sales.' + navigateTo;
				if (navigateTo === 'invoice') {
					caption = $injector.get('platformModuleInfoService').getI18NName('procurement.' + navigateTo);
					destModule = 'procurement.' + navigateTo;
					item.hideItem = dependentDataVal.length === 0;
				} else {
					caption = $injector.get('platformModuleInfoService').getI18NName('sales.' + navigateTo);
				}
				if (!caption) {
					caption = navigateTo;
				}
				if (dependentDataVal.length) {
					item.caption = caption + '(' + dependentDataVal.length + ')';
				} else {
					item.caption = caption;
				}
				item.disabled = function () {
					return !dependentDataVal.length || !platformModuleNavigationService.hasPermissionForModule(destModule);
				};

				item.navigateTo = dependentDataVal;
				item.fn = function () {
					if (navigateTo === 'invoice') {
						platformModuleNavigationService.navigate({moduleName: destModule},
							{FromGoToBtn: true, 'Ids': _.map(dependentDataVal, 'TargetFk').join(',')}, 'Ids');
					}
					else {
						var ids = _.map(dependentDataVal, function (v) {
							return v.TargetFk;
						});
						var url = globals.defaultState + '.' + destModule.replace('.', '');
						$state.go(url).then(function () {
							cloudDesktopSidebarService.filterSearchFromPKeys(ids);
						});
					}
				};
			}

			function updateNavigationBaseResponseData(gotoButton, responseData) {
				var dependentData = {};

				_.forIn(responseData, function (value, key) {
					dependentData[key.toLowerCase()] = value;
				});

				_.forEach(salesModules, function (val) {
					var navigateTo = val;
					var dependentDataKey = val;
					var dependentDataVal, relatedItem;

					dependentDataVal = dependentData[dependentDataKey] ? dependentData[dependentDataKey] : [];
					relatedItem = _.find(gotoButton.list.items, {id: 't-navigation-to-' + navigateTo});
					if (relatedItem) {
						updateNavigationListItem(relatedItem, navigateTo, dependentDataVal);
					}
				});
			}

			return {
				updateNavigationItem: updateNavigationItem,
				createNavigationItem: createNavigationItem,
				checkScopeToolsAndCreateIfNecessary: checkScopeToolsAndCreateIfNecessary
			};
		}]);
})(angular);
