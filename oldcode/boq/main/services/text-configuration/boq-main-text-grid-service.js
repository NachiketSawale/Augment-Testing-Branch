/**
 * Created by zen on 5/12/2017.
 */
(function (angular) {
	/* global globals, _ */
	'use strict';

	var moduleName = 'boq.main';
	angular.module(moduleName).factory('boqMainTextGridService',
		['platformDataServiceFactory', 'PlatformMessenger', 'boqMainService', 'platformGridAPI', 'cloudCommonGridService', 'platformDataValidationService', 'boqMainCommonService',
			function (platformDataServiceFactory, PlatformMessenger, boqMainService, platformGridAPI, cloudCommonGridService, platformDataValidationService, boqMainCommonService) {

				var selectedTypeFk = 1, selectedSplitId = 1, selectedCombinationId = 1, selectedNumberingId = 1;
				var gridId, currentItem = {}, processItems = [], sortItems = [];
				var service = {};

				var boqMainTextGridServiceOptions = {
					hierarchicalLeafItem: {
						module: angular.module(moduleName),
						httpCRUD: {
							route: globals.webApiBaseUrl + 'boq/main/textconfiguration/',
							usePostForRead: true
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'boq/main/textconfiguration',
							endRead: 'tree',
							usePostForRead: true,
							initReadData: function (readData) {
								var selectItem = boqMainService.getSelected();
								if (selectItem) {
									readData.BoqHeaderFk = selectItem.BoqHeaderFk;
									readData.BoqItemFk = selectItem.Id;
									readData.ConfigType = selectedTypeFk;
								}
							}
						},
						dataProcessor: [], // TODO: add the needed processors by zen
						presenter: {
							tree: {
								parentProp: 'BoqTextConfigurationFk', childProp: 'BoqTextConfigGroups',
								initCreationData: function initCreationData(creationData) {
									var selectBoqItem = boqMainService.getSelected();
									if (selectBoqItem && selectBoqItem.Id > 0) {
										creationData.BoqHeaderFk = selectBoqItem.BoqHeaderFk;
										creationData.BoqItemFk = selectBoqItem.Id;
										creationData.ConfigType = selectedTypeFk;
									}
								},
								incorporateDataRead: function (readData, data) {
									sortItems = readData;
									service.sortBySorting(sortItems);
									return data.handleReadSucceeded(sortItems, data);
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'boqTextConfigGroup'/* properties in parent entity */,
								parentService: boqMainService
							}
						},
						actions: {create: 'hierarchical', canCreateCallBackFunc: canCreate, canCreateChildCallBackFunc: canCreate, delete: {}, canDeleteCallBackFunc: canCreate}
					}
				};
				var serviceContainer = platformDataServiceFactory.createNewComplete(boqMainTextGridServiceOptions);

				service = serviceContainer.service;

				angular.extend(service, {
					canCreate: canCreate
				});

				service.setSelectedTypeFk = function (selTypeFk) {
					selectedTypeFk = selTypeFk;
				};

				service.getSelectedTypeFk = function () {
					return selectedTypeFk;
				};

				service.setSelectedSplitId = function (selSplitId) {
					selectedSplitId = selSplitId;
				};

				service.getSelectedSplitId = function () {
					return selectedSplitId;
				};

				service.setSelectedCombinationId = function (selCombinationId) {
					selectedCombinationId = selCombinationId;
				};

				service.getSelectedCombinationId = function () {
					return selectedCombinationId;
				};

				service.setSelectedNumberingId = function (selNumberingId) {
					selectedNumberingId = selNumberingId;
				};

				service.getSelectedNumberingId = function () {
					return selectedNumberingId;
				};

				service.setGridId = function (Id) {
					gridId = Id;
				};

				service.setSortItems = function ChangeCheckState(items) {
					sortItems = items;
				};

				service.moveUp = function () {
					currentItem = service.getSelected();
					if (currentItem) {
						var configItems = service.getTree();
						if (currentItem.BoqTextConfigurationFk) {
							var list = [];
							cloudCommonGridService.flatten(configItems, list, 'BoqTextConfigGroups'); // Flatten the rules into list so that, also trees (if any) are shifted to list item.
							processItems = _.filter(list, {'Id': currentItem.BoqTextConfigurationFk})[0].BoqTextConfigGroups;
						} else {
							processItems = configItems;
						}

						// configItems = _.filter(configItems, {'BoqTextConfigurationFk': null});
						var sortingIsZeros = _.filter(processItems, {'Sorting': 0});
						if (sortingIsZeros && sortingIsZeros.length > 1) {
							var count = 0;
							angular.forEach(processItems, function (item) {
								item.Sorting = count;
								count++;
							});
						}

						var index = service.indexInItems(currentItem);
						if (index > 0) {
							var previousItem = processItems[index - 1];
							var currentSorting = currentItem.Sorting;
							var previousSorting = previousItem.Sorting;
							currentItem.Sorting = previousSorting;
							previousItem.Sorting = currentSorting;
							processItems.move(index, --index);

							platformGridAPI.items.data(gridId, configItems);
							if (platformGridAPI.rows.selection({gridId: gridId}) !== currentItem) {
								platformGridAPI.rows.selection({
									gridId: gridId,
									rows: [currentItem]
								});
							}
							serviceContainer.data.itemTree = configItems;
							service.markEntitiesAsModified(processItems);
						}
					}
				};

				service.moveDown = function () {
					currentItem = service.getSelected();
					if (currentItem) {
						var configItems = service.getTree();
						if (currentItem.BoqTextConfigurationFk) {
							var list = [];
							cloudCommonGridService.flatten(configItems, list, 'BoqTextConfigGroups'); // Flatten the rules into list so that, also trees (if any) are shifted to list item.
							processItems = _.filter(list, {'Id': currentItem.BoqTextConfigurationFk})[0].BoqTextConfigGroups;
						} else {
							processItems = configItems;
						}

						// configItems = _.filter(configItems, {'BoqTextConfigurationFk': null});
						var sortingIsZeros = _.filter(processItems, {'Sorting': 0});
						if (sortingIsZeros && sortingIsZeros.length > 1) {
							var count = 0;
							angular.forEach(processItems, function (item) {
								item.Sorting = count;
								count++;
							});
						}

						var index = service.indexInItems(currentItem);
						if (index >= 0 && index < processItems.length - 1) {
							var previousItem = processItems[index + 1];
							var currentSorting = currentItem.Sorting;
							var previousSorting = previousItem.Sorting;
							currentItem.Sorting = previousSorting;
							previousItem.Sorting = currentSorting;
							processItems.move(index, ++index);

							platformGridAPI.items.data(gridId, configItems);
							if (platformGridAPI.rows.selection({gridId: gridId}) !== currentItem) {
								platformGridAPI.rows.selection({
									gridId: gridId,
									rows: [currentItem]
								});
							}
							serviceContainer.data.itemTree = configItems;
							service.markEntitiesAsModified(processItems);
						}
					}
				};

				service.indexInItems = function (item) {
					return _.findIndex(processItems, {Id: item.Id});
				};

				service.sortBySorting = function (items) {
					if (items && items.length > 0) {
						items = _.sortBy(items, 'Sorting');
						if (items[0].BoqTextConfigurationFk !== null) {
							var list = [];
							cloudCommonGridService.flatten(sortItems, list, 'BoqTextConfigGroups'); // Flatten the rules into list so that, also trees (if any) are shifted to list item.
							var parentItem = _.filter(list, {'Id': items[0].BoqTextConfigurationFk})[0];
							parentItem.BoqTextConfigGroups = items;
						}
						angular.forEach(items, function (item) {
							if (item.BoqTextConfigGroups !== null) {
								service.sortBySorting(item.BoqTextConfigGroups);
							}
						});
					}
				};

				service.getConfigBody = function (item) {
					if (item !== null && !platformDataValidationService.isEmptyProp(item['ConfigBody'])) {
						return item.ConfigBody;
					} else {
						return '';
					}
				};

				service.getConfigCaption = function (item) {
					if (item !== null && !platformDataValidationService.isEmptyProp(item['ConfigCaption'])) {
						return item.ConfigCaption;
					} else {
						return '';
					}
				};

				service.getConfigTail = function (item) {
					if (item !== null && !platformDataValidationService.isEmptyProp(item['ConfigTail'])) {
						return item.ConfigTail;
					} else {
						return '';
					}
				};

				service.getIsOutput = function (item) {
					if (item !== null && !platformDataValidationService.isEmptyProp(item['Isoutput'])) {
						return item.Isoutput;
					} else {
						return '';
					}
				};

				service.getTheTree = function () {
					if (serviceContainer.data.itemTree) {
						return serviceContainer.data.itemTree;
					} else {
						return null;
					}
				};

				service.changeCheckState = function ChangeCheckState(selectedItem) {
					var list = [], affectItems = [];
					affectItems.push(selectedItem);
					cloudCommonGridService.flatten(service.getTheTree(), list, 'BoqTextConfigGroups'); // Flatten the rules into list so that, also trees (if any) are shifted to list item.
					checkParent2Children(selectedItem, affectItems);
					checkChildren2Parent(selectedItem, list, affectItems);
					service.markEntitiesAsModified(affectItems);
					service.gridRefresh();
				};

				function checkParent2Children(selectedItem, affectItems) {
					if (!platformDataValidationService.isEmptyProp(selectedItem['BoqTextConfigGroups'] && selectedItem['BoqTextConfigGroups'] !== null)) {
						angular.forEach(selectedItem['BoqTextConfigGroups'], function (item) {
							item['Isoutput'] = selectedItem['Isoutput'];
							affectItems.push(item);
							checkParent2Children(item, affectItems);
						});

					}
				}

				function checkChildren2Parent(selectedItem, flatTree, affectItems) {
					if (!platformDataValidationService.isEmptyProp(selectedItem['BoqTextConfigurationFk'] && selectedItem['BoqTextConfigurationFk'] !== null)) {
						var parent = _.filter(flatTree, {'Id': selectedItem.BoqTextConfigurationFk});
						if (selectedItem['Isoutput'] === true && parent[0]['Isoutput'] === false) {
							parent[0]['Isoutput'] = true;
							affectItems.push(parent[0]);
							checkChildren2Parent(parent[0], flatTree, affectItems);
						}
					}
				}

				function canCreate() {
					var selectItem = boqMainService.getSelected();
					return lineTypeValidate(selectItem);
				}

				function lineTypeValidate(boqItem) {
					if (boqItem !== null && !platformDataValidationService.isEmptyProp(boqItem['BoqLineTypeFk'])) {
						return (boqMainCommonService.isDivisionType(boqItem.BoqLineTypeFk) || boqMainCommonService.isPositionType(boqItem.BoqLineTypeFk)
							|| boqMainCommonService.isSurchargeItemType(boqItem.BoqLineTypeFk));
					}
				}
				service.lineTypeValidate = lineTypeValidate;
				return service;
			}]);
})(angular);
