/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.billing';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingEstimateLineItemDataService
	 * @function
	 *
	 * @description
	 * salesBillingLineItemDataService is the data service for all estimate line item related functionality in the module Sales Billing.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	angular.module(moduleName).factory('salesBillingEstimateLineItemDataService',
		['_', 'globals', '$http', '$rootScope', 'PlatformMessenger', 'platformDataServiceFactory', 'platformRuntimeDataService', 'salesBillingService', 'salesBillingReadonlyProcessor', '$injector', 'basicsLookupdataLookupDescriptorService', 'modelViewerModelSelectionService', 'salesBillingEstimateHeaderDataService', 'modelViewerStandardFilterService', 'salesBillingBoqStructureService',
			function (_, globals, $http, $rootScope, PlatformMessenger, platformDataServiceFactory, platformRuntimeDataService, salesBillingService, readonlyProcessor, $injector, lookupDescriptorService, modelViewerModelSelectionService, salesBillingEstimateHeaderDataService, modelViewerStandardFilterService, salesBillingBoqStructureService) {

				var editableFields = ['LiBilledQuantity', 'LiPercentageQuantity', 'LiTotalQuantity', 'LiCumulativePercentage'];

				var billingLineItemServiceOptions = {
					flatLeafItem: {
						module: module,
						serviceName: 'salesBillingEstimateLineItemDataService',
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
										$rootScope.$broadcast('resetToggleLineItem');
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
											$rootScope.$broadcast('resetToggleLineItem');
											return serviceContainer.data.handleReadSucceeded(readData, data);
										}
									}
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'EstLineItem',
								parentService: salesBillingBoqStructureService
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

					var salesBillingLineItemDynamicService = $injector.get('salesBillingEstLineItemDynamicConfigurationService');
					// //at module Billing, idDynamicColunmActive will be true.
					// serviceContainer.data.isDynamicColumnActive = data.IsDynamicColumnActive;
					var dynCols = [];

					// create cost group column.
					var costGroupColumns = $injector.get('basicsCostGroupAssignmentService').createCostGroupColumns(readData.CostGroupCats, false);
					// added to UIStandard.
					salesBillingLineItemDynamicService.attachData({costGroup: costGroupColumns});
					dynCols = dynCols.concat(costGroupColumns);

					// Update grid layout if there are dynamic columns
					// if dynCols.length is 0, it also should render UI again.
					// if (dynCols.length > 0){
					// Gather all the columns
					serviceContainer.data.dynamicColumns = dynCols;
					// refresh layout.
					salesBillingLineItemDynamicService.fireRefreshConfigLayout();
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
							isReadonly: true // at module billing, it is readonly.
						});
					}]);
				}

				function initReadData(readData) {
					var selectedBill = salesBillingService.getSelected();
					var billBoqItem = salesBillingBoqStructureService.getSelected();
					var boqInformationList = [];
					if (selectedBill && billBoqItem) {
						readData.projectFk = selectedBill.ProjectFk;
						readData.salesHeaderFk = selectedBill.Id;
						readData.prjBoqHeaderFk = billBoqItem.BoqItemPrjBoqFk || 0;
						readData.prjBoqId = billBoqItem.BoqItemPrjItemFk || 0;
						readData.boqHeaderFk = billBoqItem.BoqHeaderFk || 0;
						readData.boqItemFk = billBoqItem.Id || 0;
						readData.date = billBoqItem.PerformedTo;
						readData.salesModule = 'billing';
						readData.isGeneral = false;
						readData.billTypeFk = selectedBill.TypeFk;
						readData.previousBillFk = selectedBill.PreviousBillFk || 0;
						if (billBoqItem) {
							var linkedBoqItems = [];
							if (billBoqItem.HasChildren) {
								var billBoqItems = billBoqItem.BoqItems;
								var childrenHaveChildren = true;
								while (childrenHaveChildren) {
									var childrenChildren = [];
									_.each(billBoqItems, function (item) {
										if (item.HasChildren) {
											item.BoqItems.forEach(function (item) {
												childrenChildren.push(item);
											});
										} else {
											linkedBoqItems.push(item);
										}
									});
									if (childrenChildren.length === 0) {
										childrenHaveChildren = false;
									} else {
										billBoqItems = childrenChildren;
									}
								}
							}
							if (linkedBoqItems) {
								linkedBoqItems.forEach(function (item) {
									if (item.BoqItemPrjItemFk) {
										var boqInformationObject = {
											boqItemPrjBoqFk: item.BoqItemPrjBoqFk,
											boqItemPrjItemFk: item.BoqItemPrjItemFk,
											boqHeaderFk: item.BoqHeaderFk,
											boqItemFk: item.Id
										};
										boqInformationList.push(boqInformationObject);
									}
								});
								readData.boqInformationList = boqInformationList;
							} else {
								readData.boqInformationList = null;
							}
						}
						if (readData.date === null || readData.date === undefined) {
							var today = new Date();
							readData.date = today;
						}
						return readData;
					} else {
						return null;
					}
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(billingLineItemServiceOptions);

				var service = serviceContainer.service;

				serviceContainer.data.clearContentBase = serviceContainer.data.clearContent;
				serviceContainer.data.clearContent = function () {
					// TODO: avoid usage of broadcast on rootscope;
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
					var selectedBoqItem = salesBillingBoqStructureService.getSelected();
					var isReadOnly = _.isObject(selectedBoqItem) ? selectedBoqItem.RecordingLevel === 0 : true;

					if (_.includes(editableFields, field)) {
						return !isReadOnly;
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

				service.getDataByHeaderId = function () {
					var selectedBoqItem = salesBillingBoqStructureService.getSelected();
					if (selectedBoqItem) {
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

				/**
				 * @ngdoc function
				 * @name calcLiTotalQuantity
				 * @function
				 * @methodOf sales.billing.salesBillingEstimateLineItemDataService
				 * @description Calculate the total quantity
				 * @param {Object} lineItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				var calcLiTotalQuantity = function calcLiTotalQuantity(lineItem, isChanged) {
					if (_.isObject(lineItem) && _.has(lineItem, 'LiTotalQuantity')) {
						if (isChanged) {
							service.calcDependantValues(lineItem, 'LiTotalQuantity');
						} else {
							lineItem.LiTotalQuantity = lineItem.LiBilledQuantity + (lineItem.LiPreviousQuantity ? lineItem.LiPreviousQuantity : 0);
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcPercentageQuantity
				 * @function
				 * @methodOf sales.billing.salesBillingEstimateLineItemDataService
				 * @description Calculate the current percentage
				 * @param {Object} lineItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				var calcLiPercentageQuantity = function calcLiPercentageQuantity(lineItem, isChanged) {
					if (_.isObject(lineItem) && _.has(lineItem, 'LiTotalQuantity')) {
						if (isChanged) {
							lineItem.LiBilledQuantity = lineItem.QuantityTotal * lineItem.LiPercentageQuantity / 100;
							service.calcDependantValues(lineItem, 'LiPercentageQuantity');
						} else {
							lineItem.LiPercentageQuantity = lineItem.QuantityTotal === 0 ? 0 : lineItem.LiBilledQuantity / lineItem.QuantityTotal * 100;
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcLiCumulativePercentage
				 * @function
				 * @methodOf sales.billing.salesBillingEstimateLineItemDataService
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
				 * @methodOf sales.billing.salesBillingEstimateLineItemDataService
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
				 * @methodOf sales.billing.salesBillingEstimateLineItemDataService
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

				function processResponseData(readData, fromPrj) {
					if (readData && readData.EstimateLineItems) {
						var estLineItems = readData.EstimateLineItems;
						var prevQuantities = readData.PreviousQuantities;
						var quantities = readData.Quantities || [];
						var readonlyQuantities = readData.ReadonlyQuantities || [];
						var billHeaderItem = salesBillingService.getSelected();
						var billBoqItem = salesBillingBoqStructureService.getSelected();
						var today = new Date();
						var lineItem = null;
						var lineItemQuantity = null;

						for (var i = 0; i < estLineItems.length; i++) {
							lineItem = estLineItems[i];

							if (_.isObject(lineItem)) {

								// Find fitting line item quantity entry related to line item via EstLineItemFk
								lineItem.LiPreviousQuantity = prevQuantities[lineItem.Id] || 0;
								lineItem.LiQuantity = readonlyQuantities[lineItem.Id] || 0;
								lineItem.LiBilledQuantity = quantities[lineItem.Id] || 0;
								lineItem.LiTotalQuantity = 0;
								lineItem.LiPercentageQuantity = 0;
								lineItem.LiCumulativePercentage = 0;
								lineItem.Date = _.isObject(lineItemQuantity) ? lineItemQuantity.Date : today;
								lineItem.EstLineItemFk = lineItem.EstLineItemFk === null ? 0 : lineItem.EstLineItemFk;
								lineItem.loadedFromPrj = true;
								if (!fromPrj) {
									lineItem.loadedFromPrj = false;
									lineItem.LiOrdQuantity = billBoqItem.OrdQuantity || 0;
									lineItem.BilHeaderFk = billHeaderItem.Id;
								}

								calcDependantValues(lineItem);
							}
						}
						readData.EstimateLineItems = estLineItems;
					}
					return readData;
				}

				service.syncLineItems = function (items) {
					serviceContainer.data.updatedLineItems = items;
				};

				service.setButton = new PlatformMessenger();
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
			}]);
})(angular);