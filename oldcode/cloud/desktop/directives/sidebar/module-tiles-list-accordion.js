(function () {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopModuleTilesListAccordion', cloudDesktopModuleTilesListAccordion);

	cloudDesktopModuleTilesListAccordion.$inject = ['cloudDesktopQuickstartSettingsService', '$compile'];

	function cloudDesktopModuleTilesListAccordion(cloudDesktopQuickstartSettingsService, $compile) {
		return {
			restrict: 'AE',
			scope: {
				config: '=',
				treeitems: '=?',
				searchmodule: '='
			},
			link: function ($scope, element) {

				function setCopyItems(items) {
					// need for search function. One copy for the iteration.
					$scope.moduleTabItemsItemsForSearching = _.cloneDeep(items);
				}

				function mergeCurrentStatusInOriginData(item, collapsed) {
					var index = _.findIndex($scope.moduleTabItemsItemsForSearching, ['id', item.id]);
					_.merge($scope.moduleTabItemsItemsForSearching[index], item);

					if (collapsed) {
						// if accordion collapsed --> remove tabs-key
						delete $scope.moduleTabItemsItemsForSearching[index].tabs;
					}
				}

				function getTabsById(moduleItem) {
					return cloudDesktopQuickstartSettingsService.getTabsByModuleName(moduleItem.id).then(function (result) {
						moduleItem.tabs = {};
						moduleItem.tabs.items = result;
					});
				}

				function getModuleItemInfos(id, tabId) {
					let moduleTab;
					let moduleItem = _.find($scope.moduleTabItemsItemsForSearching, {'id': id});

					let selectedItem = {
						module: {
							id: id,
							displayName: moduleItem.displayName,
							redirect: moduleItem.redirect
						}
					};

					if (tabId) {

						selectedItem.tab = {
							id: tabId
						};

						if (moduleItem.tabs) {
							moduleTab = _.find(moduleItem.tabs.items, {'Id': tabId});

							selectedItem.tab.displayName = moduleTab.Description;
						}

					}

					return selectedItem;
				}

				function searchTermContainsInModule(item) {
					let _DisplayName = item.displayName.toLowerCase();
					let _DisplayNameEN = item.displayNameEN.toLowerCase();

					return _DisplayName.includes($scope.searchmodule.toLowerCase()) || _DisplayNameEN.includes($scope.searchmodule.toLowerCase());
				}

				function processItemCSSActive(id, tabId) {
					let moduleWithTabs = $scope.allowedModuleItems.filter(function (item) {
						return item['tabs'];
					});

					angular.forEach(moduleWithTabs, function (module) {
						angular.forEach(module.tabs.items, function (tab) {
							if (tab.active) {
								tab.active = false;
							}
						});
					});

					_.find($scope.allowedModuleItems, function (item) {
						if (item.id === id) {
							_.find(item.tabs.items, {'Id': tabId}).active = true;
						}
					});
				}

				$scope.treeOptions = {
					valueMember: 'redirect',
					expandFn: function (id) {
						var index = _.findIndex($scope.allowedModuleItems, ['id', id]);

						if (index > -1 && $scope.allowedModuleItems[index].type === 0 && !$scope.allowedModuleItems[index].expanded) {

							$scope.allowedModuleItems[index].expanded = true;

							// get the tabs of clicked module.
							getTabsById($scope.allowedModuleItems[index]).then(function () {
								mergeCurrentStatusInOriginData($scope.allowedModuleItems[index], false);
							});

							if ($scope.config && $scope.config.expandFn && _.isFunction($scope.config.expandFn)) {
								let selectedItem = getModuleItemInfos(id);
								$scope.config.expandFn(selectedItem, event);
							}
						}
					},
					collapseFn: function (id) {
						var index = _.findIndex($scope.allowedModuleItems, ['id', id]);

						if (index > -1 && $scope.allowedModuleItems[index].expanded) {
							$scope.allowedModuleItems[index].expanded = false;
							$scope.allowedModuleItems[index] = _.omit($scope.allowedModuleItems[index], ['tabs']);

							mergeCurrentStatusInOriginData($scope.allowedModuleItems[index], true);

							if ($scope.config && $scope.config.collapseFn && _.isFunction($scope.config.collapseFn)) {
								let selectedItem = getModuleItemInfos(id);
								$scope.config.collapseFn(selectedItem, event);
							}

						}
					},
					clickHeaderFn: function (id, event) {
						if ($scope.config && $scope.config.clickTabFn && _.isFunction($scope.config.clickTabFn)) {
							let selectedItem = getModuleItemInfos(id);
							$scope.config.clickHeaderFn(selectedItem, event);
						}
					},
					clickTabFn: function (id, event, tabId) {
						if ($scope.config && $scope.config.clickTabFn && _.isFunction($scope.config.clickTabFn)) {
							let selectedItem = getModuleItemInfos(id, tabId);

							processItemCSSActive(id, tabId);

							$scope.config.clickTabFn(selectedItem, event);
						}
					},
					searchhandler: function () {
						let searchString = $scope.searchmodule;

						$scope.allowedModuleItems.forEach((item) => {
							let existWordInTab = false;
							if (item.tabs && item.tabs.items.length > 0) {
								let itemList = item.tabs.items;
								let hideCount = 0;
								itemList.forEach((itemChild) => {
									let _DisplayWizardName = itemChild.Description.toLowerCase();
									if (_DisplayWizardName.includes(searchString)) {
										itemChild.Isvisible = true;
										existWordInTab = true;
									} else {
										itemChild.Isvisible = false;
									}
									if (itemChild.Isvisible) {
										hideCount++;
									}
								});
								item.Isvisible = itemList.length === hideCount;
							}

							item.disabled = (searchTermContainsInModule(item) || (existWordInTab && !searchTermContainsInModule(item))) ? false : true;
						});
					}
				};

				function createHTMLMarkup() {
					setCopyItems($scope.allowedModuleItems); // if in search-modus --> allowed Items is manipulated. Therefore we need a copy
					let template = '<div platform-item-list-tree data-treeitems="allowedModuleItems" data-options="treeOptions" data-searchmodule="searchmodule"></div>';
					element.append($compile(template)($scope));
				}

				function getItems(allItems) {
					if ($scope.config && $scope.config.hasOwnProperty('filterByType')) {
						// allItems = _.filter(allItems, {'type': $scope.config.filterByType });
						allItems = _.filter(allItems, function (item) {
							return (item.type === $scope.config.filterByType) && !item.ribPage;
						});
					}
					return allItems;
				}

				function initAllowedModuleItems(items) {
					$scope.allowedModuleItems = getItems(items);
					createHTMLMarkup();
				}

				if ($scope.treeitems) {
					initAllowedModuleItems($scope.treeitems);
				} else {
					cloudDesktopQuickstartSettingsService.getSettings(false).then(function (result) {
						initAllowedModuleItems(result.desktopItems);
					});
				}

				function watchfn(newVal, oldVal) {
					if (newVal !== oldVal) {
						$scope.treeOptions.searchhandler();
					}
				}

				function watchItemsfn(newVal, oldVal) {
					if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
						$scope.allowedModuleItems = newVal;
						// initAllowedModuleItems(newVal);
					}
				}

				$scope.$watch('searchmodule', watchfn);
				$scope.$watch('treeitems', watchItemsfn);
			} // end link
		};
	}
})();
