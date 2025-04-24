/**
 * Created by joshi on 27.10.2015.
 */

(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';
	var boqMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name boqMainSurchargeService
	 * @function
	 *
	 * @description
	 * boqMainSurchargeService is the data service for all boq position and surharge items related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	boqMainModule.factory('boqMainSurchargeServiceFactory', ['$q', '$http', '$injector', 'platformDataServiceFactory', 'cloudCommonGridService', 'ServiceDataProcessArraysExtension',
		'boqMainImageProcessor', 'lookupZeroToNullProcessor', 'boqMainSurchargeReadonlyProcessor', 'boqMainCommonService',
		function ($q, $http, $injector, platformDataServiceFactory, cloudCommonGridService, ServiceDataProcessArraysExtension,
			boqMainImageProcessor, lookupZeroToNullProcessor, boqMainSurchargeReadonlyProcessor, boqMainCommonService) {

			var serviceCache = [];

			var surchargeList = [];
			var serviceContainer = {};

			function getServiceName(serviceKey) {
				return 'boqMainSurchargeService_' + serviceKey;
			}

			function createNewComplete(boqMainService, serviceKey) {

				var boqSurchargeOnServiceOptions = {
					hierarchicalRootItem: {// flatNodeItem
						module: angular.module(serviceKey),
						serviceName: getServiceName(serviceKey),
						httpRead: {
							route: globals.webApiBaseUrl + 'boq/main/surcharged/',
							endRead: 'list',
							usePostForRead: true,
							initReadData: function (readData) {
								var selectItem = boqMainService.getSelected();
								if (selectItem && (isSurchargeItem3(selectItem) || isSurchargeItem4(selectItem))) {
									readData.BoqHeaderFk = selectItem.BoqHeaderFk;
									readData.BoqItemFk = selectItem.Id;
								}
							}
						},
						actions: {delete: false, create: false},
						entityRole: {
							node: {
								itemName: 'BoqSurcharged',
								moduleName: 'BoQ',
								codeField: 'Reference',
								descField: 'BriefInfo.Translated',
								parentService: boqMainService
							}
						},
						entitySelection: {},
						dataProcessor: [new ServiceDataProcessArraysExtension(['SurchargeOnChildren']), boqMainImageProcessor, boqMainSurchargeReadonlyProcessor, lookupZeroToNullProcessor],
						presenter: {
							tree: {// list
								parentProp: 'BoqItemFk',
								childProp: 'SurchargeOnChildren',
								isInitialSorted: true,
								sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
								incorporateDataRead: function (readData, data) {
									var selectItem = boqMainService.getSelected(),
										filterData = [],
										boqItems = null;
									if (selectItem && isSurchargeItem3(selectItem)) {
										boqItems = boqMainService.getList();
										var surchargeData = _.isArray(readData) ? readData : [];
										let index = 0;
										filterData = _.filter(boqItems, function (d) {
											return d.BoqLineTypeFk === 0;
										}).map(function (i) {
											return _.pick(i, ['Id', 'BoqHeaderFk', 'Reference', 'BriefInfo', 'Quantity', 'BasUomFk', 'Finalprice', 'BoqItemFk', 'BoqItems', 'image', 'BoqLineTypeFk']);
										});

										// Remove all template surcharge items to make sure always having the list of referenced boq items up to date.
										_.remove(surchargeData, function(item) {
											return !_.isNumber(item.BoqSurcharedItemFk);
										});

										angular.forEach(filterData, function (filterItem) {
											// Add a transient property to keep the link to the corresponding referenced boqItem, because with the Id property we cannot be sure
											// to have the necessary link established in all cases (-> see comment below for overlapping number ranges of Id's)
											filterItem.ReferencedBoqItemId = filterItem.Id;
											let copyItem = angular.copy(filterItem);
											filterItem.BoqItemFk = selectItem && selectItem.Id ? selectItem.Id : null;
											filterItem.boqItem = copyItem;

											// Check if this filterItem is already included in the surchargeData array
											let surchargeItem = _.find(surchargeData, {
												BoqSurcharedItemFk: filterItem.ReferencedBoqItemId,
												BoqHeaderFk: filterItem.BoqHeaderFk
											});

											if (surchargeItem) {
												surchargeItem.SelectMarkup = true;
												makeIdsUnique(filterData, surchargeItem.Id); // Before merrging the surchargeItem into the filtered item make sure the Id of the persistant surchargeItem doesn't break the rule of unique Ids with in the list of items.
												let surchargeItemId = surchargeItem.Id; // Save surchargeItem Id
												angular.extend(surchargeItem, filterItem);
												surchargeItem.Id = surchargeItemId; // After extend the id gets overwritten so restore it here.
											}
											else {
												surchargeData.splice(index, 0, filterItem);
											}

											index++;
										});

										filterData = surchargeData;
									}

									if (selectItem && isSurchargeItem4(selectItem)) {
										boqItems = boqMainService.getList();
										filterData = boqMainService.getTree();

										angular.forEach(boqItems, function (boqItem) {
											boqItem.BaseBoqItemFk = boqItem.BoqItemFk;
											boqItem.ReferencedBoqItemId = boqItem.Id;
										});

										if(_.isArray(readData) && readData.length === 1 && _.isArray(readData[0].SurchargeOnChildren)) {

											// Todo: Detect changes in underlying boq tree and adjust related surchargeOn tree !!
											return serviceContainer.data.handleReadSucceeded(readData, data);
										}

										surchargeList = readData;

										if (assertDivisionTypeAssignmentHasValue(selectItem)) {

											var divisionTypeIds = getIdsFromDivisionTypeAssignments(selectItem);
											filterData = generateSurchargeOnByDivisionType(selectItem, filterData, divisionTypeIds);
										} else {
											filterData = generateSurchargeOnByBoqItems(selectItem, boqItems, filterData, readData);
										}
									}

									return serviceContainer.data.handleReadSucceeded(filterData, data);
								}
							}
						}
					}
				};
				serviceContainer = platformDataServiceFactory.createNewComplete(boqSurchargeOnServiceOptions);
				var service = serviceContainer.service;
				var data = serviceContainer.data;

				service.getSurchargeItemsTotal = function getSurchargeItemsTotal(item) {
					var sItems = service.getList(),
						total = 0;
					var selectedBoqItem = boqMainService.getSelected();
					if (sItems.length) {
						angular.forEach(sItems, function (si) {
							if (si.SelectMarkup && si.QuantitySplit > 0 && (isSurchargeItem(si) || isPositionItem(si))) {
								total += boqMainService.getSurchargeTotal(si);
							}
						});
					}

					if (!item.SelectMarkup) {
						if (item.QuantitySplit > 0) {
							// total += boqMainService.getSurchargeTotal(item); // What is the sense of this code???
							// item.SelectMarkup = true;  --> removed by peter: causes confusing user experience
							service.setBoqSurchargedItem(item, boqMainService); // Update BoqSurcharedItemFk and BoqItemFk
						}
					}
					else if ((item.QuantitySplit > 0) && isSurchargeItem4(selectedBoqItem)) {
						calculateTotalOfSurchargeTree(service.getRootItem());
						service.gridRefresh();
					}

					return total;
				};

				service.updBoqCalcNRefresh = function updBoqCalcNRefresh(selectedBoq) {
					boqMainService.calcItemsPriceHoursNew(selectedBoq, true);
					boqMainService.gridRefresh();
				};

				function markSurchargeOnAsModifiedByDivisionType(surcharges, boqItemList, selectedBoqItem, divisionTypeIds, parentSelectMarkupValue) {

					if (!_.isArray(surcharges)) {
						return;
					}

					_.forEach(surcharges, function (surcharge) {

						// set selectMarkup
						var selectMarkup = parentSelectMarkupValue ? true : false;
						if (!selectMarkup && surcharge.BoqDivisionTypeFk && divisionTypeIds.indexOf(surcharge.BoqDivisionTypeFk) > -1) {
							selectMarkup = true;
						}

						// mark surcharge as modified when its divisionType is in selected divisionTypeIds
						if (selectMarkup) {
							surcharge.BoqSurcharedItemFk = surcharge.boqItem && surcharge.boqItem.Id ? surcharge.boqItem.Id : surcharge.ReferencedBoqItemId;
							surcharge.BoqItemFk = selectedBoqItem && selectedBoqItem.Id ? selectedBoqItem.Id : null;
							service.markEntitiesAsModified([surcharge]);
						} else {
							var existsInDataBase = _.find(surchargeList, {'BoqHeaderFk': surcharge.BoqHeaderFk, 'BoqSurcharedItemFk': surcharge.Id});
							if (existsInDataBase) {
								if (!surcharge.boqItem) {
									var copyItem = angular.copy(surcharge);
									makeIdsUnique(boqItemList, existsInDataBase.Id); // Before merrging the surchargeItem into the filtered item make sure the Id of the persistant surchargeItem doesn't break the rule of unique Ids with in the list of items.
									angular.extend(surcharge, existsInDataBase);
									surcharge.boqItem = copyItem;
									surcharge.boqItem.BoqItems = [];
								}

								surcharge.Id = existsInDataBase.Id;
								surcharge.BoqSurcharedItemFk = null;
								surcharge.BoqItemFk = selectedBoqItem && selectedBoqItem.Id ? selectedBoqItem.Id : null;
								service.markEntitiesAsModified([surcharge]);
							}
						}

						// revert to children
						if (assertArrayPropertyHasValue(surcharge, 'SurchargeOnChildren')) {
							markSurchargeOnAsModifiedByDivisionType(surcharge.SurchargeOnChildren, boqItemList, selectedBoqItem, divisionTypeIds, selectMarkup);
						}
					});
				}

				function changeBoqItemParentSurchargeSelectMarkup(currentSurcharge, boqItemList, selectedBoqItem, surchargeList, selectMarkup) {

					if (!currentSurcharge.BaseBoqItemFk) {
						return;
					}

					var parent = _.find(surchargeList, {ReferencedBoqItemId: currentSurcharge.BaseBoqItemFk});

					if (!parent) {
						return;
					}

					if (parent.SelectMarkup !== selectMarkup) {

						var surchargeItem = _.find(surchargeList, {
							BoqSurcharedItemFk: parent.ReferencedBoqItemId,
							BoqHeaderFk: parent.BoqHeaderFk
						});

						if (surchargeItem) {

							parent.SelectMarkup = selectMarkup;
							parent.BoqItemFk = selectedBoqItem && selectedBoqItem.Id ? selectedBoqItem.Id : null;
							parent.BoqSurcharedItemFk = !selectMarkup ? null : parent.boqItem && parent.boqItem.Id ? parent.boqItem.Id : parent.ReferencedBoqItemId;
							//
							service.markEntitiesAsModified([parent]);

							service.maintainNavigationProperty(selectedBoqItem, surchargeItem);
						}
					}

					if (parent.BaseBoqItemFk) {
						changeBoqItemParentSurchargeSelectMarkup(parent, boqItemList, selectedBoqItem, surchargeList, selectMarkup);
					}
				}

				function setQuantitySplit(item/* , isSelected */) {
					if (item && (isPositionItem(item) || isSurchargeItem(item))) {
						if (item.SelectMarkup) {
							item.QuantitySplit = item.Quantity;
							item.QuantitySplitTotal = item.Finalprice;
						} else {
							item.QuantitySplit = 0; // null;
							item.QuantitySplitTotal = 0;
						}
					} else {
						item.QuantitySplit = 0; // null;
						item.QuantitySplitTotal = 0;
					}
				}

				function changeBoqItemChildrenSurchargeSelectMarkup(surcharges, boqItemList, selectedBoqItem, surchargeList, selectMarkup) {
					var surchargeModified = [];

					if (!surcharges || !angular.isArray(surcharges)) {
						return surchargeModified;
					}

					_.forEach(surcharges, function (surcharge) {

						surcharge.SelectMarkup = selectMarkup;
						surcharge.BoqItemFk = selectedBoqItem && selectedBoqItem.Id ? selectedBoqItem.Id : null;
						surcharge.BoqSurcharedItemFk = !selectMarkup ? null : surcharge.boqItem && surcharge.boqItem.Id ? surcharge.boqItem.Id : surcharge.ReferencedBoqItemId;

						setQuantitySplit(surcharge);

						surchargeModified.push(surcharge);

						service.maintainNavigationProperty(selectedBoqItem, surcharge);

						if (assertSurchargeHasChildren(surcharge)) {
							var boqChildrenSurchargeList = changeBoqItemChildrenSurchargeSelectMarkup(surcharge.SurchargeOnChildren, boqItemList, selectedBoqItem, surchargeList, selectMarkup);
							surchargeModified = surchargeModified.concat(boqChildrenSurchargeList);
						}

					});

					return surchargeModified;
				}

				service.setBoqSurchargedItem = function setBoqSurchargedItem(surchargeItem, boqMainService) {
					var selectedBoqItem = boqMainService.getSelected();

					// selected boqItem is SurchargeItem4 and has divisionType assignment
					if (isSurchargeItem4(selectedBoqItem) && assertDivisionTypeAssignmentHasValue(selectedBoqItem)) {

						var boqDivisionTypeAssignmentUpdateService = $injector.get('boqDivisionTypeAssignmentUpdateService');

						_.forEach(selectedBoqItem.DivisionTypeAssignment, function (assignmentItem) {

							boqDivisionTypeAssignmentUpdateService.addBoq2DivisionTypeToUpdateByAssignment(selectedBoqItem, assignmentItem, false);
						});

						// mark the surcharge (which divisionType is in DivisionTypeAssignment) modified
						markSurchargeOnAsModifiedByDivisionType(service.getRootItem(), boqMainService.getList(), selectedBoqItem, getIdsFromDivisionTypeAssignments(selectedBoqItem));

						// refresh the selected boq item
						selectedBoqItem.DivisionTypeAssignment = [];
						boqMainService.fireItemModified(selectedBoqItem);
					}

					surchargeItem.BoqSurcharedItemFk = !surchargeItem.SelectMarkup ? null : surchargeItem.boqItem && surchargeItem.boqItem.Id ? surchargeItem.boqItem.Id : surchargeItem.ReferencedBoqItemId;
					surchargeItem.BoqItemFk = selectedBoqItem && selectedBoqItem.Id ? selectedBoqItem.Id : null;
					service.markItemAsModified(surchargeItem);
					service.fireItemModified(surchargeItem);

					if (isSurchargeItem4(selectedBoqItem)) {

						var surchargeList = service.getList();

						changeBoqItemParentSurchargeSelectMarkup(surchargeItem, boqMainService.getList(), selectedBoqItem, surchargeList, surchargeItem.SelectMarkup);

						if (angular.isArray(surchargeItem.SurchargeOnChildren)) {
							var surchargeModified = changeBoqItemChildrenSurchargeSelectMarkup(surchargeItem.SurchargeOnChildren, boqMainService.getList(), selectedBoqItem, surchargeList, surchargeItem.SelectMarkup);
							service.markEntitiesAsModified(surchargeModified);
						}

						calculateTotalOfSurchargeTree(service.getRootItem());

						service.gridRefresh();
					}
				};

				// Overwrite mergeInUpdateData because of special character of this service, because it also delivers items that are not BoqIteSurchargeEntities but templates for them
				// based on linked BoqItemEntities
				service.mergeInUpdateData = function mergeInUpdateDataForSurchargeItemEntities(updateData) {
					if (updateData[data.itemName + 'ToSave']) {

						_.forEach(updateData[data.itemName + 'ToSave'], function (updateItemComplete) {

							var oldItem = null;
							var updateItem = updateItemComplete.BoqSurcharged;

							if (updateItem) {
								if (updateItem.Version === -1 && updateItem.BoqSurcharedItemFk !== null) {
									// Item was deleted
									oldItem = _.find(data.itemList, {Id: updateItem.Id});
									updateItem.Version = 0;
									updateItem.SelectMarkup = false;
									updateItem.Id = updateItem.BoqSurcharedItemFk; // Reset Id to initial state when item list is being loaded
									updateItem.BoqSurcharedItemFk = null;
									updateItem.QuantitySplit = 0; // undefined;
									updateItem.ReferencedBoqItemId = updateItem.BoqSurcharedItemFk;
								} else {
									// Because we cannot rely on a proper id setting for the item we use the BoqSurcharedItemFk as search key
									oldItem = _.find(data.itemList, {BoqSurcharedItemFk: updateItem.BoqSurcharedItemFk});
								}
							}

							if (oldItem) {
								data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem, true, data);
							}
						});
					}
				};

				service.markSurchargeOnSelectedByDivisionTypeImp = function markSelectByDivisionTypeImp(surcharges, divisionTypeIds, parentMarkupValue) {

					_.forEach(surcharges, function (surcharge) {

						if (!surcharge.ReferencedBoqItemId) {
							surcharge.ReferencedBoqItemId = surcharge.Id;
						}

						var selectMarkup = parentMarkupValue ? true : false;

						if (!selectMarkup) {
							if (surcharge.BoqDivisionTypeFk && divisionTypeIds.indexOf(surcharge.BoqDivisionTypeFk) > -1) {
								selectMarkup = true;
							}
						}

						if (surcharge.SelectMarkup !== selectMarkup) {
							surcharge.SelectMarkup = selectMarkup;
							service.markEntitiesAsModified(surcharge);
						}

						if (assertArrayPropertyHasValue(surcharge, 'SurchargeOnChildren')) {
							markSelectByDivisionTypeImp(surcharge.SurchargeOnChildren, divisionTypeIds, selectMarkup);
						}
					});
				};

				service.markSurchargeOnSelectedByDivisionType = function markSurchargeOnSelectedByDivisionType(boqMainService, item) {
					if (boqMainService && item) {
						var selectedBoqItem = boqMainService.getSelected();
						// has divisionType assignment
						if (assertDivisionTypeAssignmentHasValue(selectedBoqItem)) {
							var rootOfSurcharges = service.getRootItem();
							service.markSurchargeOnSelectedByDivisionTypeImp(rootOfSurcharges, getIdsFromDivisionTypeAssignments(selectedBoqItem), false);
							calculateTotalOfSurchargeTree(rootOfSurcharges);
						}
					}
				};

				service.getRootItem = function getRootItem() {
					return _.filter(service.getList(), function (item) {
						return !item.BaseBoqItemFk;
					});
				};

				service.maintainNavigationProperty = function maintainNavigationProperty(selectedBoqItem, surchargeItem) {
					if(angular.isDefined(selectedBoqItem.BoqSurchardedItemEntities) && _.isArray(selectedBoqItem.BoqSurchardedItemEntities) && boqMainCommonService.isItem(surchargeItem))
					{
						if(surchargeItem.SelectMarkup) {
							if(!_.isObject(_.find(selectedBoqItem.BoqSurchardedItemEntities, {Id: surchargeItem.Id}))) {
								selectedBoqItem.BoqSurchardedItemEntities.push(surchargeItem); // Insert new item to the BoqSurchardedItemEntities array
							}
						}
						else {
							_.remove(selectedBoqItem.BoqSurchardedItemEntities, {Id: surchargeItem.Id});
						}
					}
				};

				return service;
			}

			function makeIdsUnique(itemList, newId) {
				// When a new Id is given to an item of itemList and we want this newId not to break the uniqueness of Id's
				// we look if there is already an item with the new Id and replace this one by a new unique one in the context of
				// the currently given items in the list.
				var itemWithSameId = _.find(itemList, {Id: newId});

				// We only replace the Ids of items that are transient in the context of this service.
				// Being transient is indicated by having a BoqSurcharedItemFk of null or even undefined.
				if (angular.isDefined(itemWithSameId) && itemWithSameId !== null) {
					if (!_.isNumber(itemWithSameId.BoqSurcharedItemFk)) {
						itemWithSameId.Id = !_.isEmpty(itemList) ? (_.maxBy(itemList, 'Id').Id + 1) : 1;
					} else {
						console.error('There is already a persistent BoqSurchargeItemEntity with this Id given -> could not generate a unique Id');
					}
				}
			}

			function pick(boqItem) {
				return _.pick(boqItem, ['Id', 'BoqHeaderFk', 'Reference', 'BriefInfo', 'Quantity', 'BasUomFk', 'Finalprice', 'BoqItemFk', 'image', 'BoqDivisionTypeFk', 'BaseBoqItemFk', 'BoqLineTypeFk']);
			}

			function findSurchargeOfBoqItem(boqItem, surchargeOns) {
				return _.find(surchargeOns, {
					BoqSurcharedItemFk: boqItem.Id,
					BoqHeaderFk: boqItem.BoqHeaderFk
				});
			}

			function isPositionItem(boqItem) {
				return boqMainCommonService.isItem(boqItem);
			}

			function isSurchargeItem3(boqItem) {
				return boqMainCommonService.isSurchargeItem3(boqItem);
			}

			function isSurchargeItem4(boqItem) {
				return boqMainCommonService.isSurchargeItem4(boqItem);
			}

			function isSurchargeItem(boqItem) {
				return boqMainCommonService.isSurchargeItem(boqItem);
			}

			function getIdsFromDivisionTypeAssignments(boqItem) {
				if (!boqItem || !boqItem.DivisionTypeAssignment) {
					return [];
				}
				return _.map(boqItem.DivisionTypeAssignment, 'BoqDivisionTypeFk');
			}

			function assertArrayPropertyHasValue(item, propertyName) {
				if (!item) {
					return false;
				}
				if (item[propertyName] && _.isArray(item[propertyName]) && item[propertyName].length > 0) {
					return true;
				} else {
					return false;
				}
			}

			function assertDivisionTypeAssignmentHasValue(boqItem) {
				return assertArrayPropertyHasValue(boqItem, 'DivisionTypeAssignment');
			}

			function assertBoqItemHasChildren(boqItem) {
				return assertArrayPropertyHasValue(boqItem, 'BoqItems');
			}

			function assertSurchargeHasChildren(boqItem) {
				return assertArrayPropertyHasValue(boqItem, 'SurchargeOnChildren');
			}

			function calculateQuantitySplitTotal(entity) {
				if (!entity) {
					return;
				}
				if (boqMainCommonService.isDivisionOrRoot(entity)) {
					entity.Quantity = null;
					entity.QuantitySplit = 0; // null;
					entity.QuantitySplitTotal = angular.isArray(entity.SurchargeOnChildren) ? _.sumBy(entity.SurchargeOnChildren, function (e) {
						return e.QuantitySplitTotal ? e.QuantitySplitTotal : 0;
					}) : 0;
				} else {
					if (!entity.Quantity || !entity.QuantitySplit) {
						entity.QuantitySplitTotal = 0;
					} else {
						entity.QuantitySplitTotal = entity.Finalprice * entity.QuantitySplit / entity.Quantity;
					}
				}
			}

			function calculateTotalOfSurchargeTree(surcharges) {
				if (surcharges && angular.isArray(surcharges)) {
					_.forEach(surcharges, function (item) {
						if (item && boqMainCommonService.isDivisionOrRoot(item) && angular.isArray(item.SurchargeOnChildren)) {
							calculateTotalOfSurchargeTree(item.SurchargeOnChildren);
						}
						calculateQuantitySplitTotal(item);
					});
				}
			}

			function generateSurchargeOnByDivisionType(selectedBoqItem, boqItems, divisionTypeIds, parentMarkupValue) {

				var result = [];

				_.forEach(boqItems, function (boqItem) {

					var surchargeOnItem, surchargeOnChildren;

					// set select markup
					var selectMarkup = parentMarkupValue ? true : false;
					if (!selectMarkup && boqItem.BoqDivisionTypeFk && divisionTypeIds.indexOf(boqItem.BoqDivisionTypeFk) > -1) {
						selectMarkup = true;
					}

					// copy boqItem as surchargeOn
					if (isPositionItem(boqItem) || (isSurchargeItem4(boqItem) && boqItem.Id !== selectedBoqItem.Id)) {
						surchargeOnItem = pick(boqItem);
					} else {
						if (assertBoqItemHasChildren(boqItem)) {
							surchargeOnChildren = generateSurchargeOnByDivisionType(selectedBoqItem, boqItem.BoqItems, divisionTypeIds, selectMarkup);
							if (_.isArray(surchargeOnChildren) && surchargeOnChildren.length > 0) {
								surchargeOnItem = pick(boqItem);
							}
						}
					}

					// collect surchargeOn
					if (surchargeOnItem) {
						surchargeOnItem.ReferencedBoqItemId = boqItem.Id;
						surchargeOnItem.SelectMarkup = selectMarkup;
						surchargeOnItem.SurchargeOnChildren = surchargeOnChildren ? surchargeOnChildren : [];
						surchargeOnItem.boqItem = angular.copy(boqItem);
						surchargeOnItem.boqItem.BoqItems = [];

						calculateQuantitySplitTotal(surchargeOnItem);

						result.push(surchargeOnItem);
					}
				});

				return result;
			}

			function generateSurchargeOnByBoqItems(selectedBoqItem, boqItemList, boqItems, surchargeOns) {

				var result = [];

				_.forEach(boqItems, function (boqItem) {

					var surchargeOnItem, surchargeOnChildren;

					// set select markup
					var surcharge = findSurchargeOfBoqItem(boqItem, surchargeOns);

					var selectMarkup = surcharge ? true : false;

					// copy boqItem as surchargeOn
					if (isPositionItem(boqItem) || (isSurchargeItem4(boqItem) && boqItem.Id !== selectedBoqItem.Id)) {
						surchargeOnItem = pick(boqItem);
					} else {
						if (assertBoqItemHasChildren(boqItem)) {
							surchargeOnChildren = generateSurchargeOnByBoqItems(selectedBoqItem, boqItemList, boqItem.BoqItems, surchargeOns);
							if (_.isArray(surchargeOnChildren) && surchargeOnChildren.length > 0) {
								surchargeOnItem = pick(boqItem);
							}
						}
					}

					// collect surchargeOn
					if (surchargeOnItem) {

						surchargeOnItem.SelectMarkup = selectMarkup;
						surchargeOnItem.ReferencedBoqItemId = boqItem.Id;
						surchargeOnItem.SurchargeOnChildren = surchargeOnChildren ? surchargeOnChildren : [];
						surchargeOnItem.boqItem = angular.copy(boqItem);
						surchargeOnItem.boqItem.BoqItems = [];

						if (surcharge) {
							makeIdsUnique(boqItemList, surcharge.Id); // Before merging the surchargeItem into the filtered item make sure the Id of the persistant surchargeItem doesn't break the rule of unique Ids with in the list of items.
							angular.extend(surchargeOnItem, surcharge);
						}

						calculateQuantitySplitTotal(surchargeOnItem);

						result.push(surchargeOnItem);
					}
				});

				return result;
			}

			return {

				getService: function (parentService, serviceKey) {

					var serviceName = getServiceName(serviceKey);
					if (!serviceCache[serviceName]) {
						serviceCache[serviceName] = createNewComplete(parentService, serviceKey);
					}
					return serviceCache[serviceName];
				}
			};
		}]);
})();
