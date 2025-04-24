/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformListSelectionDialogBody
	 * @element div
	 * @restrict A
	 * @description Displays the body of a list selection dialog.
	 */
	angular.module('platform').directive('platformListSelectionDialogBody',
		platformListSelectionDialogBody);

	platformListSelectionDialogBody.$inject = ['platformGridAPI', '$compile', '$timeout', '_',
		'basicsCommonUtilities', 'platformCollectionUtilitiesService'];

	function platformListSelectionDialogBody(platformGridAPI, $compile, $timeout, _,
		basicsCommonUtilities, platformCollectionUtilitiesService) {

		return {
			restrict: 'A',
			scope: false,
			templateUrl: globals.appBaseUrl + 'app/components/listselectiondialog/partials/list-selection-dialog-body-template.html',
			link: function ($scope, elem) {
				const finalizers = [];
				const dlgData = $scope.dialog ? $scope.dialog.modalOptions.dataItem : $scope.modalOptions.dataItem;

				const baseGridId = '10bec8bb26ef49e391d76f4c89210478';

				function updateState() {
					$scope.$evalAsync();
				}

				function prepareGrid(name, adaptConfig) {
					const gridId = baseGridId + '-' + dlgData.id + name.charAt(0);

					$scope[name + 'GridId'] = gridId;
					$scope[name + 'GridData'] = {
						state: gridId
					};

					if (!platformGridAPI.grids.exist(gridId)) {
						const gridConfig = {
							columns: _.cloneDeep(dlgData.cfg[name + 'Columns']),
							data: [],
							id: gridId,
							lazyInit: true,
							enableConfigSave: false,
							options: {
								indicator: dlgData.cfg.showIndicator,
								allowRowDrag: false,
								skipPermissionCheck: true,
								showMainTopPanel: true
							}
						};
						if (_.isFunction(adaptConfig)) {
							adaptConfig(gridConfig);
						}

						platformGridAPI.grids.config(gridConfig);

						platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', updateState);
						finalizers.push(function () {
							platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', updateState);
						});
					}

					const placeholderEl = elem.find('div#' + name + 'List');
					if (placeholderEl.length !== 1) {
						throw new Error('Unexpectedly found ' + placeholderEl.length + ' placeholder elements for list ' + name + '.');
					}
					placeholderEl.append($compile('<platform-grid data-data="' + name + 'GridData"></platform-grid>')($scope));

					finalizers.push(function () {
						platformGridAPI.grids.unregister(gridId);
					});
				}

				prepareGrid('available', function (gridConfig) {
					gridConfig.options.idProperty = dlgData.cfg.idProperty;
					if (dlgData.availableItemsTree) {
						gridConfig.options.tree = true;
						gridConfig.options.childProp = dlgData.cfg.childrenProperty;
					} else {
						gridConfig.options.tree = false;
					}
				});
				prepareGrid('selected', function (gridConfig) {
					gridConfig.options.idProperty = dlgData.cfg.temporarySelectedIdProperty;
				});

				platformGridAPI.events.register($scope.availableGridId, 'onDblClick', function () {
					$scope.$evalAsync(function () {
						$scope.addItems(false);
					});
				});
				platformGridAPI.events.register($scope.selectedGridId, 'onDblClick', function () {
					$scope.$evalAsync(function () {
						$scope.removeItems(false);
					});
				});

				dlgData.addItemSettingsFromUi = function (item) {
					if (_.isFunction(dlgData.copyItemProperties)) {
						const existingSelItemList = platformGridAPI.items.data($scope.selectedGridId);
						if (_.isArray(existingSelItemList)) {
							const existingItem = _.find(existingSelItemList, function (exItem) {
								return exItem[dlgData.cfg.temporarySelectedIdProperty] === item[dlgData.cfg.temporarySelectedIdProperty];
							});
							if (_.isObject(existingItem)) {
								dlgData.copyItemProperties(existingItem, item);
							}
						}
					}
				};

				$scope.isAvailableItemSelected = function isAvailableItemSelected() {
					const selected = platformGridAPI.rows.selection({
						gridId: $scope.availableGridId,
						wantsArray: true
					});
					return selected && (_.filter(selected, function (item) {
						return dlgData.cfg.isSelectable(item);
					}).length > 0);
				};

				$scope.isSelectedItemSelected = function isSelectedItemSelected() {
					const selected = platformGridAPI.rows.selection({
						gridId: $scope.selectedGridId,
						wantsArray: true
					});
					return selected && (selected.length > 0);
				};

				function retrieveSelectedSelectedItemIds() {
					return _.map(platformGridAPI.rows.selection({
						gridId: $scope.selectedGridId,
						wantsArray: true
					}), function (selItem) {
						return dlgData.getSelectedItemId(selItem);
					});
				}

				function setSelectedAvailableIds(ids) {
					const idMap = {};
					ids.forEach(function (id) {
						idMap[id] = true;
					});

					const currentAvailableItems = platformGridAPI.items.data($scope.availableGridId);

					const itemsToExpand = [];
					const itemsToSelect = [];

					function selectInList(items) {
						let result = false;
						items.forEach(function (item) {
							const itemId = dlgData.getItemId(item);
							if (idMap[itemId]) {
								itemsToSelect.push(item);
								result = true;
							}
							if (dlgData.availableItemsTree) {
								const children = item[dlgData.cfg.childrenProperty];
								if (_.isArray(children)) {
									if (selectInList(children)) {
										itemsToExpand.push(item);
										result = true;
									}
								}
							}
						});
						return result;
					}

					selectInList(currentAvailableItems);

					itemsToExpand.forEach(function (item) {
						platformGridAPI.rows.expandNode($scope.availableGridId, item);
					});
					platformGridAPI.rows.selection({
						gridId: $scope.availableGridId,
						rows: itemsToSelect
					});
				}

				function getSelectedItemIndexes(ids) {
					return _.map(ids, function (id) {
						return _.findIndex(dlgData.cfg.value, function (selItem) {
							return dlgData.getSelectedItemId(selItem) === id;
						});
					});
				}

				function setSelectedSelectedItemIndexes(indexes) {
					platformGridAPI.rows.selection({
						gridId: $scope.selectedGridId,
						rows: indexes
					});
				}

				function generateSelectedItemMovementInfo() {
					return {
						totalCount: dlgData.cfg.value.length,
						indexesToMove: _.map(platformGridAPI.rows.selection({
							gridId: $scope.selectedGridId,
							wantsArray: true
						}), function (selItem) {
							if (_.isUndefined(selItem)) {
								return undefined;
							}

							const selItemId = dlgData.getSelectedItemId(selItem);
							return _.findIndex(dlgData.cfg.value, function (item) {
								return selItemId === dlgData.getSelectedItemId(item);
							});
						}),
						moveItemFunc: function (fromIndex, toIndex) {
							dlgData.cfg.value.move(fromIndex, toIndex);
						}
					};
				}

				function isSelectedGridFiltered() {
					const selectedGrid = platformGridAPI.grids.element('id', $scope.selectedGridId);
					return selectedGrid.dataView.getFilteredItems().totalRows !== dlgData.cfg.value.length;
				}

				function initToolBar() {
					return {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 'moveUp',
								sort: 10,
								caption: 'cloud.common.toolbarMoveUp',
								type: 'item',
								iconClass: 'tlb-icons ico-grid-row-up',
								fn: function () {
									const selItemIds = retrieveSelectedSelectedItemIds();
									platformCollectionUtilitiesService.moveItems(_.assign(generateSelectedItemMovementInfo(), {
										delta: -1
									}));
									updateSelectedGridData();
									setSelectedSelectedItemIndexes(getSelectedItemIndexes(selItemIds));
								},
								disabled: function () {
									return !platformCollectionUtilitiesService.canMoveItems(_.assign(generateSelectedItemMovementInfo(), {
										delta: -1
									})) || isSelectedGridFiltered();
								}
							},
							{
								id: 'moveDown',
								sort: 10,
								caption: 'cloud.common.toolbarMoveDown',
								type: 'item',
								iconClass: 'tlb-icons ico-grid-row-down',
								fn: function () {
									const selItemIds = retrieveSelectedSelectedItemIds();
									platformCollectionUtilitiesService.moveItems(_.assign(generateSelectedItemMovementInfo(), {
										delta: 1
									}));
									updateSelectedGridData();
									setSelectedSelectedItemIndexes(getSelectedItemIndexes(selItemIds));
								},
								disabled: function () {
									return !platformCollectionUtilitiesService.canMoveItems(_.assign(generateSelectedItemMovementInfo(), {
										delta: 1
									})) || isSelectedGridFiltered();
								}
							},
							{
								id: 'moveTop',
								sort: 0,
								caption: 'cloud.common.toolbarMoveTop',
								type: 'item',
								iconClass: 'tlb-icons ico-grid-row-start',
								fn: function () {
									const selItemIds = retrieveSelectedSelectedItemIds();
									platformCollectionUtilitiesService.moveItemsToBeginning(generateSelectedItemMovementInfo());
									updateSelectedGridData();
									setSelectedSelectedItemIndexes(getSelectedItemIndexes(selItemIds));
								},
								disabled: function () {
									return !platformCollectionUtilitiesService.canMoveItemsToBeginning(generateSelectedItemMovementInfo()) || isSelectedGridFiltered();
								}
							},
							{
								id: 'moveBottom',
								sort: 10,
								caption: 'cloud.common.toolbarMoveBottom',
								type: 'item',
								iconClass: 'tlb-icons ico-grid-row-end',
								fn: function () {
									const selItemIds = retrieveSelectedSelectedItemIds();
									platformCollectionUtilitiesService.moveItemsToEnd(generateSelectedItemMovementInfo());
									updateSelectedGridData();
									setSelectedSelectedItemIndexes(getSelectedItemIndexes(selItemIds));
								},
								disabled: function () {
									return !platformCollectionUtilitiesService.canMoveItemsToEnd(generateSelectedItemMovementInfo()) || isSelectedGridFiltered();
								}
							}
						],
						update: function () {
						}
					};
				}

				if (!_.isFunction(dlgData.cfg.sortItems)) {
					$scope.selectedItemsTools = initToolBar();
				}

				function updateAvailableGridData() {
					const avItems = dlgData.getAvailableItems();
					platformGridAPI.items.data($scope.availableGridId, avItems);
				}

				function updateSelectedGridData() {
					const selItems = dlgData.getSelectedItems();

					const existingSelItems = {};
					const existingSelItemList = platformGridAPI.items.data($scope.selectedGridId);
					if (_.isArray(existingSelItemList)) {
						existingSelItemList.forEach(function (existingSelItem) {
							existingSelItems[existingSelItem[dlgData.cfg.temporarySelectedIdProperty]] = existingSelItem;
						});
						selItems.forEach(function (selItem) {
							const existingSelItem = existingSelItems[selItem[dlgData.cfg.temporarySelectedIdProperty]];
							if (existingSelItem) {
								dlgData.copyItemProperties(existingSelItem, selItem);
							}
						});
					}

					platformGridAPI.items.data($scope.selectedGridId, selItems);
				}

				function updateGridData() {
					updateAvailableGridData();
					updateSelectedGridData();
				}

				$timeout(updateGridData);

				$scope.addItems = function (all) {
					const selItems = dlgData.cfg.value;

					const availableGrid = platformGridAPI.grids.element('id', $scope.availableGridId);
					const visibleAvailableItems = availableGrid.dataView.getFilteredItems().rows;
					const visibleAvailableItemIds = basicsCommonUtilities.arrayAsSetObject(visibleAvailableItems, dlgData.getItemId);
					let insertionIndex = (function () {
						const selected = platformGridAPI.rows.selection({
							gridId: $scope.selectedGridId,
							wantsArray: true
						});
						if (selected && selected.length === 1) {
							return _.findIndex(selItems, function (item) {
								return item[dlgData.cfg.temporarySelectedIdProperty] === selected[0][dlgData.cfg.temporarySelectedIdProperty];
							}) + 1;
						} else {
							return selItems.length;
						}
					})();

					const movedItemIds = [];
					if (all) {
						(function addAll() {
							const selItemIds = basicsCommonUtilities.arrayAsSetObject(selItems, dlgData.getItemId);

							dlgData.getAllSelectableItems().forEach(function (avItem) {
								const itemId = dlgData.getItemId(avItem);
								if (visibleAvailableItemIds[itemId] && !selItemIds[itemId]) {
									const newSelItem = dlgData.createSelectedItem(itemId);
									selItems.splice(insertionIndex++, 0, newSelItem);
									movedItemIds.push(dlgData.getSelectedItemId(newSelItem));
								}
							});
						})();
					} else {
						(function addSelected() {
							const selectedAvailable = platformGridAPI.rows.selection({
								gridId: $scope.availableGridId,
								wantsArray: true
							});

							selectedAvailable.forEach(function (avItem) {
								const itemId = dlgData.getItemId(avItem);
								if (visibleAvailableItemIds[itemId]) {
									const origItem = dlgData.findAvailableItemById(itemId);
									if (dlgData.cfg.isSelectable(origItem)) {
										const newSelItem = dlgData.createSelectedItem(itemId);
										selItems.splice(insertionIndex++, 0, newSelItem);
										movedItemIds.push(dlgData.getSelectedItemId(newSelItem));
									}
								}
							});
						})();
					}

					dlgData.sortSelectedItems();
					updateGridData();
					setSelectedSelectedItemIndexes(getSelectedItemIndexes(movedItemIds));
				};

				$scope.removeItems = function (all) {
					const selectedGrid = platformGridAPI.grids.element('id', $scope.selectedGridId);
					const visibleSelectedItems = selectedGrid.dataView.getFilteredItems().rows;
					const visibleSelectedItemIds = basicsCommonUtilities.arrayAsSetObject(visibleSelectedItems, dlgData.getSelectedItemId);

					const movedItemIds = [];
					const selItems = dlgData.cfg.value;
					if (all) {
						for (let i = selItems.length - 1; i >= 0; i--) {
							const itemId = dlgData.getSelectedItemId(selItems[i]);
							if (visibleSelectedItemIds[itemId]) {
								movedItemIds.push(dlgData.getItemId(selItems[i]));
								selItems.splice(i, 1);
							}
						}
					} else {
						(function () {
							const selectedSelected = platformGridAPI.rows.selection({
								gridId: $scope.selectedGridId,
								wantsArray: true
							});

							selectedSelected.forEach(function (selItem) {
								const itemId = dlgData.getSelectedItemId(selItem);
								if (visibleSelectedItemIds[itemId]) {
									const index = _.findIndex(selItems, function (item) {
										return dlgData.getSelectedItemId(item) === itemId;
									});
									if (index >= 0) {
										movedItemIds.push(dlgData.getItemId(selItem));
										selItems.splice(index, 1);
									}
								}
							});
						})();
					}

					updateGridData();
					setSelectedAvailableIds(movedItemIds);
				};

				$scope.$on('$destroy', function () {
					finalizers.forEach(function (f) {
						f();
					});
				});
			}
		};
	}
})(angular);
