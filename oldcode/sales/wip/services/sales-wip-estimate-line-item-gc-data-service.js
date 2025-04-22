/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.wip';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipEstimateLineItemGcDataService
	 * @function
	 *
	 * @description
	 * salesWipLineItemGcDataService is the data service for all estimate related functionality in the module Sales Wip.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	angular.module(moduleName).factory('salesWipEstimateLineItemGcDataService',
		['_', 'globals', '$http', '$rootScope', 'PlatformMessenger', 'platformDataServiceFactory', 'salesWipService', 'salesWipReadonlyProcessor', '$injector', 'basicsLookupdataLookupDescriptorService', 'modelViewerModelSelectionService', 'salesWipEstimateHeaderDataService', 'modelViewerStandardFilterService',
			function (_, globals, $http, $rootScope, PlatformMessenger, platformDataServiceFactory, salesWipService, readonlyProcessor, $injector, lookupDescriptorService, modelViewerModelSelectionService, wipEstimateHeaderDataService, modelViewerStandardFilterService) {

				var editableFields = ['LiQuantity', 'LiPercentageQuantity', 'LiTotalQuantity', 'LiCumulativePercentage'];

				var wipLineItemServiceOptions = {
					flatLeafItem: {
						module: module,
						serviceName: 'salesWipEstimateLineItemGcDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitem/',
							endRead: 'filterlineitems4sales',
							initReadData: initReadData,
							usePostForRead: true
						},
						presenter: {
							isDynamicModified: true,
							list: {
								incorporateDataRead: function (readData, data) {
									if (readData && readData.EstimateLineItems) {
										readData = processResponseData(readData);
										handleDataBeforeReadCompleted(readData);
										lookupDescriptorService.attachData(readData);
										return serviceContainer.data.handleReadSucceeded(readData.EstimateLineItems, data);
									} else {
										var updatedLineItems = serviceContainer.data.updatedLineItems;
										if (readData && readData.length > 0 && updatedLineItems && updatedLineItems.length > 0) {
											for (var j = 0; j < readData.length; j++) {
												var mapItem = _.find(updatedLineItems, {Id: readData[j].Id});
												if (mapItem) {
													readData[j] = mapItem;
												}
											}
										}
										if (readData) {
											return serviceContainer.data.handleReadSucceeded(readData, data);
										}
									}
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'EstLineItem',
								parentService: salesWipService
							}
						},
						entitySelection: {},
						useItemFilter: true
					}
				};

				function handleDataBeforeReadCompleted(readData) {

					createDynamicColumns(readData);
					assignCostGroupsToLineItems(readData);
				}

				function createDynamicColumns(readData) {

					var salesWipLineItemDynamicService = $injector.get('salesWipEstLineItemDynamicConfigurationService');
					// //at module WIP, idDynamicColunmActive will be true.
					// serviceContainer.data.isDynamicColumnActive = data.IsDynamicColumnActive;
					var dynCols = [];

					// create cost group column.
					var costGroupColumns = $injector.get('basicsCostGroupAssignmentService').createCostGroupColumns(readData.CostGroupCats, false);
					// added to UIStandard.
					salesWipLineItemDynamicService.attachData({costGroup: costGroupColumns});
					dynCols = dynCols.concat(costGroupColumns);

					// Update grid layout if there are dynamic columns
					// if dynCols.length is 0, it also should render UI again.
					// if (dynCols.length > 0){
					// Gather all the columns
					serviceContainer.data.dynamicColumns = dynCols;
					// refresh layout.
					salesWipLineItemDynamicService.fireRefreshConfigLayout();
					// }
				}

				function assignCostGroupsToLineItems(readData) {

					$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
						basicsCostGroupAssignmentService.process(readData, service, {
							mainDataName: 'Main',
							attachDataName: 'LineItem2CostGroups',
							dataLookupType: 'LineItem2CostGroups',
							identityGetter: function identityGetter(entity) {
								return {
									EstHeaderFk: entity.RootItemId,
									Id: entity.MainItemId
								};
							},
							isReadonly: true // at module wip, it is readonly.
						});
					}]);
				}

				function initReadData(readData) {
					var selectedWip = salesWipService.getSelected();
					if (selectedWip) {
						readData.projectFk = selectedWip.ProjectFk;
						readData.salesHeaderFk = selectedWip.Id;
						readData.date = selectedWip.PerformedTo;
						readData.salesModule = 'wip';
						readData.isGeneral = true;

						if (readData.date === null || readData.date === undefined) {
							readData.date = new Date();
						}
						return readData;
					} else {
						return null;
					}
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(wipLineItemServiceOptions);
				var service = serviceContainer.service;

				serviceContainer.data.clearContentBase = serviceContainer.data.clearContent;
				serviceContainer.data.clearContent = function () { // TODO: avoid usage of broadcast on rootscope;
					$rootScope.$broadcast('clearContentLI');
				};

				service.clearContentLI = function (force) { // TODO: avoid usage of broadcast on rootscope;
					if (force) {
						serviceContainer.data.clearContentBase(serviceContainer.data);
						$rootScope.$broadcast('resetToggleLineItem');
					}
				};

				service.canCreate = service.canDelete = function () {
					return false;
				};

				service.getCellEditable = function getCellEditable(item, field) {
					if (_.includes(editableFields, field)) {
						return true;
					}
					return false;
				};

				function show3DViewByLineItem(selectedLineItem) {
					var route = globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/getall';
					$http.post(route, selectedLineItem).then(function (response) {
						var modelIds = [];
						if (response.data && response.data.length > 0) {
							// var currentSelectedModelId = modelViewerModelSelectionService.getSelectedModelId();
							// modelIds = _.filter(response.data, function (item) {
							//    return currentSelectedModelId === item.MdlModelFk;
							// });
							/* setCurrentPinningContext(modelFk).then(function(){
							 angular.extend(estLineItem2MdlObject,{MdlModelFk:modelFk});
							 showModelViewer(estLineItem2MdlObject);
							 }); */

							modelIds = response.data;
						}
						showModelViewer(modelIds);
					});
				}

				function showModelViewer() {
					modelViewerStandardFilterService.updateMainEntityFilter();
				}

				service.getLineItemSelected = function (arg, gridItems) {
					var arr = [];
					if (arg) {
						angular.forEach(arg.rows, function (item) {
							var elem = gridItems[item];
							if (elem) {
								arr.push(elem);
							}
						});
						if (arr.length > 0) {
							var multipleItems = _.map(arr, function (item) {
								return {
									EstHeaderFk: item.EstHeaderFk,
									EstLineItemFk: item.Id
								};
							});
							show3DViewByLineItem(multipleItems);
						}

					}
				};

				/**
				 * @ngdoc function
				 * @name calcLiTotalQuantity
				 * @function
				 * @methodOf sales.wip.salesWipEstimateLineItemDataService
				 * @description Calculate the total quantity
				 * @param {Object} lineItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				var calcLiTotalQuantity = function calcLiTotalQuantity(lineItem, isChanged) {
					if (_.isObject(lineItem) && _.has(lineItem, 'LiTotalQuantity')) {
						if (isChanged) {
							service.calcDependantValues(lineItem, 'LiTotalQuantity');
						} else {
							lineItem.LiTotalQuantity = lineItem.LiQuantity + (lineItem.LiPreviousQuantity ? lineItem.LiPreviousQuantity : 0);
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcPercentageQuantity
				 * @function
				 * @methodOf sales.wip.salesWipEstimateLineItemDataService
				 * @description Calculate the current percentage
				 * @param {Object} lineItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				var calcLiPercentageQuantity = function calcLiPercentageQuantity(lineItem, isChanged) {
					if (_.isObject(lineItem) && _.has(lineItem, 'LiTotalQuantity')) {
						if (isChanged) {
							lineItem.LiQuantity = lineItem.QuantityTotal * lineItem.LiPercentageQuantity / 100;
							service.calcDependantValues(lineItem, 'LiPercentageQuantity');
						} else {
							lineItem.LiPercentageQuantity = lineItem.QuantityTotal === 0 ? 0 : lineItem.LiQuantity / lineItem.QuantityTotal * 100;
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcLiCumulativePercentage
				 * @function
				 * @methodOf sales.wip.salesWipEstimateLineItemDataService
				 * @description Calculate the cumulative percentage
				 * @param {Object} lineItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				var calcLiCumulativePercentage = function calcLiCumulativePercentage(lineItem, isChanged) {
					if (_.isObject(lineItem) && _.has(lineItem, 'LiTotalQuantity')) {
						if (isChanged) {
							lineItem.LiTotalQuantity = lineItem.QuantityTotal * lineItem.LiCumulativePercentage / 100;
							service.calcDependantValues(lineItem, 'LiCumulativePercentage');
						} else {
							lineItem.LiCumulativePercentage = lineItem.QuantityTotal === 0 ? 0 : lineItem.LiTotalQuantity / lineItem.QuantityTotal * 100;
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name initInstalledValues
				 * @function
				 * @methodOf sales.wip.salesWipEstimateLineItemDataService
				 * @description Initialize the given lineItem with the corresponding installed values
				 * @param {Object} lineItem : item whose corresponding installed values are to be initialized
				 */
				var initInstalledValues = function initInstalledValues(lineItem) {
					service.calcDependantValues(lineItem);
				};

				/**
				 * @ngdoc function
				 * @name calcDependantValues
				 * @function
				 * @methodOf sales.wip.salesWipEstimateLineItemDataService
				 * @description Calculate the dependant values due to a change of one dependant value in the dependancy chain.
				 * @param {Object} lineItem : item whose corresponding properties are calculated
				 * @param {String} valueToBeSkipped : indicating the property that has already been set manually and needs no calculation, so it can be skipped
				 */
				var calcDependantValues = function calcDependantValues(lineItem, valueToBeSkipped) {

					// Check for initial calculation of values.
					// If so, add the TotalQuantity property to activate this feature.
					if (!_.isString(valueToBeSkipped) && !_.has(lineItem, 'LiTotalQuantity')) {
						lineItem.LiTotalQuantity = 0;
					}

					if (valueToBeSkipped !== 'LiTotalQuantity') {
						calcLiTotalQuantity(lineItem);
					}

					if (valueToBeSkipped !== 'LiPercentageQuantity') {
						calcLiPercentageQuantity(lineItem);
					}

					if (valueToBeSkipped !== 'LiCumulativePercentage') {
						calcLiCumulativePercentage(lineItem);
					}

					service.fireItemModified(lineItem);
				};

				service.synLineItems = function (items) {
					serviceContainer.data.updatedLineItems = items;
				};

				service.getDataByHeaderId = function () {
					var selectedWipHeader = salesWipService.getSelected();
					if (selectedWipHeader) {
						var readData = {};
						readData = initReadData(readData);
						service.clearContentLI(true);
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/filterlineitems4sales', readData)
							.then(function (response) {
								var responseData = processResponseData(response.data);
								handleDataBeforeReadCompleted(responseData);
								lookupDescriptorService.attachData(responseData);
								$rootScope.$broadcast('resetToggleLineItem');
								return serviceContainer.data.handleReadSucceeded(responseData.EstimateLineItems, serviceContainer.data);
							});
					}
				};

				service.toggleContainer = new PlatformMessenger();
				service.gcButtonClicked = new PlatformMessenger();

				service.calcLiTotalQuantity = calcLiTotalQuantity;
				service.calcLiPercentageQuantity = calcLiPercentageQuantity;
				service.calcLiCumulativePercentage = calcLiCumulativePercentage;
				service.initInstalledValues = initInstalledValues;
				service.calcDependantValues = calcDependantValues;

				serviceContainer.service.loadSubItemsList = loadSubItemsList;
				return service;

				// //////////////////////
				function loadSubItemsList() {
					serviceContainer.data.doesRequireLoadAlways = true;
					serviceContainer.data.loadSubItemList();
					serviceContainer.data.doesRequireLoadAlways = false;
				}

				function processResponseData(readData) {
					if (readData && readData.EstimateLineItems) {
						var estLineItems = readData.EstimateLineItems;
						var prevQuantities = readData.PreviousQuantities;
						var quantities = readData.Quantities || [];
						var wipHeaderItem = salesWipService.getSelected();
						var today = new Date();
						var lineItem = null;
						var lineItemQuantity = null;

						for (var i = 0; i < estLineItems.length; i++) {
							lineItem = estLineItems[i];

							if (_.isObject(lineItem)) {

								// Find fitting line item quantity entry related to line item via EstLineItemFk
								lineItem.LiPreviousQuantity = prevQuantities[lineItem.Id] || 0;
								lineItem.LiQuantity = quantities[lineItem.Id] || 0;
								lineItem.LiTotalQuantity = 0;
								lineItem.LiPercentageQuantity = 0;
								lineItem.LiCumulativePercentage = 0;
								lineItem.Date = _.isObject(lineItemQuantity) ? lineItem.Date : today;
								lineItem.EstLineItemFk = lineItem.EstLineItemFk === null ? 0 : lineItem.EstLineItemFk;
								lineItem.WipHeaderFk = wipHeaderItem.Id;

								calcDependantValues(lineItem);
							}
						}
						readData.EstimateLineItems = estLineItems;
					}
					return readData;
				}

				// #115405 needs to be consulted
				/*
				function getBoqItemsFromTree(wipBoqItems, linkedBoqItems) {
					var childrenChildren = [];
					wipBoqItems.forEach(function(item) {
						if (item.HasChildren) {
							item.BoqItems.forEach(function(item) {
								childrenChildren.push(item);
							});
						} else {
							linkedBoqItems.push(item);
						}
					});
					if (childrenChildren.length === 0) {
						return linkedBoqItems;
					} else {
						getBoqItemsFromTree(wipBoqItems, linkedBoqItems);
					}
				}
				*/
			}]);
})(angular);