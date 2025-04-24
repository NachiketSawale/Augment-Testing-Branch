/**
 * Created by wui on 3/25/2016.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* globals globals,angular,_,console */
	var moduleName = 'constructionsystem.main';
	/**
	 * @ngdoc service
	 * @name constructionsystemMainResourceDataService
	 * @function
	 * @requires $http
	 * @description
	 * #
	 * data service for constructionsystem main resources grid(tree) contianer.
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('constructionsystemMainResourceDataService', [
		'$http', '$injector', '$q', 'platformDataServiceFactory', 'constructionsystemMainLineItemService',
		'ServiceDataProcessArraysExtension', 'estimateMainResourceImageProcessor',
		'estimateMainResourceProcessor', 'constructionsystemMainCompareFlags',
		'PlatformMessenger', 'cloudCommonGridService', 'constructionsystemMainCommonService',
		'basicsLookupdataLookupFilterService', 'constructionsystemMainResourceValidationProcessService',
		'estimateMainFilterService', 'basicsLookupdataLookupDescriptorService', 'estimateMainPrjMaterialLookupService',
		'estimateMainDynamicColumnFilterService', 'constructionsystemMainConfigDetailService', 'estimateMainCommonCalculationService',
		'estimateMainService', 'estimateMainExchangeRateService', 'estimateMainCommonService',
		function ($http, $injector, $q, platformDataServiceFactory, parentService, ServiceDataProcessArraysExtension,
			estimateMainResourceImageProcessor, estimateMainResourceProcessor, compareFlags,
			PlatformMessenger, cloudCommonGridService, constructionsystemMainCommonService,
			basicsLookupdataLookupFilterService, constructionsystemMainResourceValidationProcessService,
			estimateMainFilterService, basicsLookupdataLookupDescriptorService, estimateMainPrjMaterialLookupService,
			estimateMainDynamicColumnFilterService, constructionsystemMainConfigDetailService, estimateMainCommonCalculationService,
			estimateMainService, estimateMainExchangeRateService, estimateMainCommonService
		) {
			var isReadOnlyService = false;

			var serviceOptions = {
				hierarchicalLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionsystemMainResourceDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/resource/',
						endRead: 'gettree',
						initReadData: function initReadData(readData) {
							if (parentService.hasSelection()) {
								readData.filter += getFilter(parentService.getSelected());

							}
							return readData;
						}
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'constructionsystem/main/instance/', endUpdate: 'update'},
					setCellFocus: true,
					presenter: {
						tree: {
							parentProp: 'EstResourceFk',
							childProp: 'EstResources',
							childSort: true,
							isInitialSorted: true,
							sortOptions: {
								initialSortColumn: {field: 'Code', id: 'code'},
								isAsc: true
							},
							incorporateDataRead: incorporateDataRead
						}
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['EstResources']), estimateMainResourceImageProcessor, estimateMainResourceProcessor],
					entityRole: {
						node: {
							codeField: 'Code',
							itemName: 'EstResource',
							moduleName: 'constructionsystem.main',
							parentService: parentService,
						}
					}
				}
			};

			function incorporateDataRead(readData, data) {
				if (!parentService.hasSelection()) {
					return;
				}

				var lineItem = parentService.getSelected();

				function loadUserDefinedColumnValue(){
					if(lineItem.isResourceUDPAttached){return;}

					if(!_.isArray(readData)){return;}

					// load user defined column value
					let constructionsystemMainResourceDynamicUserDefinedColumnService = $injector.get('constructionsystemMainResourceDynamicUserDefinedColumnService');
					constructionsystemMainResourceDynamicUserDefinedColumnService.attachDataToColumn(readData, lineItem);
					constructionsystemMainResourceDynamicUserDefinedColumnService.updateColumnsReadOnlyStats(readData);
				}

				// no need to compare resources because user configed not to compare.
				if (lineItem.CompareFlag !== compareFlags.noComparison) {
					// no need to compare resources because they come from line item's Reference Item and are readonly in module 'Estimte.Main'.
					if (lineItem.EstLineItemFk) {
						if (lineItem.CompareFlag === compareFlags.modified) {
							// even line item modified, resources still unmodified because the are readonly.
							setFlagValueForTree(readData, compareFlags.unmodified, data.treePresOpt.childProp);
						} else {
							setFlagValueForTree(readData, lineItem.CompareFlag, data.treePresOpt.childProp);
						}
					} else {
						if (lineItem.CompareFlag === compareFlags.new || lineItem.CompareFlag === compareFlags.delete) {
							setFlagValueForTree(readData, lineItem.CompareFlag, data.treePresOpt.childProp);

						} else if (lineItem.CompareFlag === compareFlags.modified || lineItem.CompareFlag === compareFlags.unmodified) {
							// get old line item's resources
							var filter = getFilter(lineItem.compareLineItem);
							$http.get(globals.webApiBaseUrl + 'estimate/main/resource/gettree' + filter).then(
								function (response) {
									if (response.data) {
										var comparedList = [];
										compareResources(readData, response.data, null, data.treePresOpt.childProp, comparedList); // compare tree root items
									}
								}
							);
						}
					}
				}
				data.sortByColumn(readData);
				let result = data.handleReadSucceeded(readData, data);
				loadUserDefinedColumnValue();
				estimateMainResourceProcessor.setDisabledChildrenReadOnly(serviceContainer.service.getList());
				return result;
			}

			/**
			 * set compare flag value for Tree items.
			 */
			function setFlagValueForTree(itemTree, flag, childProp) {
				_.each(itemTree, function (item) {
					item.CompareFlag = flag;
					if (item[childProp] && item[childProp].length) {
						setFlagValueForTree(item[childProp], flag, childProp);
					}
				});
			}

			function addItem(item, parent, itemList, childProp) {
				if (!parent) {
					if (!_.some(itemList, ['Id', item.Id])) {
						itemList.push(item);
					}
				} else {
					if (!_.some(parent[childProp], ['Id', item.Id])) {
						parent[childProp].push(item);
					}
				}
			}

			var compareProperties = [
				'EstResourceTypeFk', 'QuantityDetail', 'Quantity', 'BasUomFk',
				'QuantityFactorDetail1', 'QuantityFactor1', 'QuantityFactorDetail2', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4',
				'ProductivityFactorDetail', 'ProductivityFactor', 'EfficiencyFactorDetail1', 'EfficiencyFactor1', 'EfficiencyFactorDetail2', 'EfficiencyFactor2',
				'QuantityFactorCc', 'QuantityReal', 'QuantityInternal', 'QuantityUnitTarget', 'QuantityTotal',
				'CostUnit', 'BasCurrencyFk', 'CostFactorDetail1', 'CostFactor1', 'CostFactorDetail2', 'CostFactor2', 'CostFactorCc', 'CostUnitSubItem', 'CostUnitLineItem',
				'CostUnitTarget', 'CostTotal', 'HoursUnit', 'HoursUnitSubItem', 'HoursUnitLineItem', 'HoursUnitTarget',
				'HoursTotal','IsLumpsum', 'IsDisabled', 'CommentText', 'RuleType', 'RuleCode', 'RuleDescription',
				'EvalSequenceFk', 'ElementCode', 'ElementDescription', 'IsIndirectCost', 'Sorting'
			];

			/**
			 * compare estimate resources (tree) and return the compared list.
			 * only the new/old items in tree at the same level and has the same 'EstResourceTypeFk, Code' can be used to compare.
			 * e.g.
			 *       new                    old
			 *       1 ->                   3 ->
			 *          1.1 ->                  3.1 ->
			 *              1.1.1 ->
			 *       2 ->                   2 ->
			 *          2.1 ->                  2.1 ->
			 *                                      2.1.1 ->
			 *       3 ->                   1 ->
			 *
			 *   1 -> 1; 1.1 (new); 1.1.1 (new);
			 *   2 -> 2; 2.1 -> 2.1 ; 2.1.1 (deleted)
			 *   3 -> 3; 3.1 (deleted);
			 */
			function compareResources(newItems, oldItems, parentItem, childProp, list) {
				var newResources = _.isEmpty(newItems) ? [] : angular.copy(newItems);
				var oldResources = _.isEmpty(oldItems) ? [] : angular.copy(oldItems);
				var count = newResources.length > oldResources.length ? newResources.length : oldResources.length;

				for (var i = 0; i < count; i++) {
					var newItem = _.isEmpty(newResources[i]) ? null : angular.copy(newResources[i]);
					if (newItem) {
						var tempOldItem = _.find(oldResources, {
							'EstResourceTypeFk': newItem.EstResourceTypeFk,
							'Code': newItem.Code
						});
						var oldItem = _.isEmpty(tempOldItem) ? null : angular.copy(tempOldItem);

						// (1) if they have the same 'ResourceTypeFk' and 'Code' (means: Equal), then compare and mark them as 'Modified' or 'Unmodified'.
						if (oldItem) {
							newItem[childProp] = []; // clear children, because it will used to store the compared result.
							oldItem[childProp] = [];

							var result = parentService.compareObjectProperties(newItem, oldItem, compareProperties);
							if (result.isEqual) {
								newItem.CompareFlag = compareFlags.unmodified;
							} else {
								newItem.CompareFlag = compareFlags.modified;
							}
							newItem.changedProperties = result.changedProperties;
							addItem(newItem, parentItem, list, childProp);

							// compare item's children
							compareResources(newResources[i][childProp], tempOldItem[childProp], newItem, childProp, list);

							// after compared with the new item, it will removed to guarantee it will no compared with other new items of the same level
							var oldItemIdx = _.findIndex(oldResources, 'Id', oldItem.Id);
							oldResources.splice(oldItemIdx, 1);
						}
						// (2) add the new item that haven't the same 'ResourceTypeFk' and 'Code' in old items(means: Not Equal and marked as 'New') .
						else {
							newItem.CompareFlag = compareFlags.new;
							setFlagValueForTree(newItem[childProp], compareFlags.new, childProp); // no need to compare 'New' item's children

							addItem(newItem, parentItem, list, childProp);
						}
					}
				}

				// (3) add the left old items which haven't the same 'ResourceTypeFk' and 'Code' in new items (means: Not Equal and marked as 'Deleted').
				_.each(oldResources, function (oldItem) {
					oldItem.CompareFlag = compareFlags.delete;
					setFlagValueForTree(oldItem[childProp], compareFlags.delete, childProp); // no need to compare 'Delete' item's children
					addItem(oldItem, parentItem, list, childProp);
				});
			}

			function getFilter(lineItem) {
				return '?estHeaderId=' + lineItem.EstHeaderFk + '&lineItemId=' + (lineItem.EstLineItemFk ? lineItem.EstLineItemFk : lineItem.Id);
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			var service = serviceContainer.service;

			serviceContainer.data.doesRequireLoadAlways = true;

			service.toolHasAdded = false;

			service.calcResources = new PlatformMessenger();

			service.refreshData = new PlatformMessenger();

			serviceContainer.data.newEntityValidator = constructionsystemMainResourceValidationProcessService;

			var baseOnDeleteDone = serviceContainer.data.onDeleteDone;

			var deleteFromDrag = false;

			service.DeleteResourceByDropDrag = function (deleteParams, lineItem) { // delete the resource from  assign assembly ( drag/drop assembly ,change assembly , change assembly by bulk editor)

				console.log(lineItem);// removing error
				deleteFromDrag = true;

				serviceContainer.data.deleteEntities(deleteParams.entities, serviceContainer.data).then(function () {

					deleteFromDrag = false;

				});
			};

			serviceContainer.data.onDeleteDone = function (deleteParams, data, response) {

				baseOnDeleteDone(deleteParams, data, response); // remove the deleted item form list

				var selectedLineItem = parentService.getSelected();

				var flatResList = [];

				cloudCommonGridService.flatten(service.getTree(), flatResList, 'EstResources');

				if (!deleteFromDrag) {  // here no need calculate lineitem if delete the resource from  assign assembly ( drag/drop assembly ,change assembly , change assembly by bulk editor)

					service.calLineItemDynamicColumns(selectedLineItem, flatResList);

					service.calcResources.fire(service.getTree());

				}

				// estimateMainService.fireItemModified(selectedLineItem);

				$injector.get('constructionsystemMainResourceValidationService').validateSubItemsUniqueCodeFromAssembly(service.getTree());

				// remove the user defined column value of deleted resource
				let constructionsystemMainResourceDynamicUserDefinedColumnService = $injector.get('constructionsystemMainResourceDynamicUserDefinedColumnService');
				constructionsystemMainResourceDynamicUserDefinedColumnService.handleEntitiesDeleted(deleteParams.entities, selectedLineItem, service.getTree());

				parentService.markItemAsModified(selectedLineItem);

				var constructionsystemMainResourceValidationService = $injector.get('constructionsystemMainResourceValidationService');

				constructionsystemMainResourceValidationService.validateSubItemsUniqueCodeFromAssembly(service.getTree());
			};

			service.deleteResources = function deleteResources(resourcesToDelete) {

				if (resourcesToDelete && resourcesToDelete.length > 0) {

					var deleteParams = {

						entities: resourcesToDelete,
						index: 1,
						service: service

					};

					baseOnDeleteDone(deleteParams, serviceContainer.data, null);

				}
			};

			estimateMainFilterService.onUpdated.register(function () {

				var list = parentService.getList();

				if (list && list.length === 0) {

					parentService.deselect();

				}

				service.gridRefresh();
			});

			service.setList = function setList(data, isReadOnly) {
				data = data ? data : [];
				cloudCommonGridService.sortTree(data, 'Sorting', 'EstResource');
				serviceContainer.data.itemTree = _.filter(data, function (item) {
					return item.EstResourceFk === null;
				});
				var flatResList = [];
				cloudCommonGridService.flatten(data, flatResList, 'EstResources');
				flatResList = _.uniq(flatResList, 'Id');
				estimateMainResourceImageProcessor.processItems(flatResList);
				estimateMainResourceProcessor.processItems(flatResList, false);
				serviceContainer.data.itemList = flatResList;
				estimateMainResourceProcessor.readOnly(flatResList, !!isReadOnly);
			};

			service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};

			service.updateList = function updateList(resList, isReadOnly) {
				service.setList(resList, isReadOnly);
				service.fireListLoaded();
			};

			service.transformAssembly2Subitem = function (assembly) {
				// change assembly to subitem
				// 4=Assembly, 5=Subitem
				if (assembly.EstResourceTypeFk === 4) {

					assembly.EstResourceTypeFk = assembly.EstResourceTypeFkExtend = 5;

				}

				estimateMainResourceImageProcessor.processItem(assembly);
			};

			service.resolveRessourceFromAssembly = function (lineItem, assemblyResources, parentResource) {

				var data = serviceContainer.data;

				var traverse = function (resItem) {
					// assign to selected line item
					if (lineItem) {

						resItem.EstLineItemFk = lineItem.Id;

						resItem.EstHeaderFk = lineItem.EstHeaderFk;

					}

					if (resItem.EstResourceTypeFk === 1) {

						var mdcCC = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');

						var item = _.find(mdcCC, {Id: resItem.MdcCostCodeFk});

						if (item) {

							estimateMainCommonService.addPrjCostCodes(item);

						}
					}

					data.itemList.push(resItem);

					if (!resItem[data.treePresOpt.childProp]) {

						resItem[data.treePresOpt.childProp] = [];

					}

					_.forEach(data.processor, function (proc) {

						proc.processItem(resItem);

					});

					data.markItemAsModified(resItem, data);

					_.each(resItem[data.treePresOpt.childProp], function (child) {
						traverse(child, resItem);
					});
				};

				var materialIdList = [];

				_.each(assemblyResources, function (item) {

					item.IsDisabled = parentResource ? parentResource.IsDisabled : item.IsDisabled;

					item.IsDisabledPrc = parentResource ? parentResource.IsDisabledPrc : item.IsDisabledPrc;

					if (item.EstResourceTypeFk === 2) {

						materialIdList.push(item.MdcMaterialFk);

					}
					if (parentResource) {

						parentResource.HasChildren = true;

						parentResource[data.treePresOpt.childProp].push(item);

						item[data.treePresOpt.parentProp] = parentResource.Id;

					} else {

						data.itemTree.push(item);

					}

					traverse(item);

				});

				estimateMainPrjMaterialLookupService.loadPrjMaterial();

				estimateMainPrjMaterialLookupService.getBaseMaterials(materialIdList).then(function (data) {

					var mdcCC = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');

					angular.forEach(data, function (item) {

						estimateMainPrjMaterialLookupService.addPrjMaterial(item);

						if (item.MdcCostCodeFk !== null) {

							var mdcCostCode = _.find(mdcCC, {Id: item.MdcCostCodeFk});

							if (mdcCostCode) {

								estimateMainCommonService.addPrjCostCodes(mdcCostCode);

							}
						}
					});

				});

				estimateMainResourceProcessor.processItem(parentResource);

				data.listLoaded.fire();
				// ------------------------------------------------------------------------------------------------
				// TODO:
				// - check for equal code numbers
				// - check all code numbers (generate new numbers)
				// - sorting

				// platformDataServiceSelectionExtension.doSelect(resItem, data);
				// platformDataServiceActionExtension.fireEntityCreated(data, resItem);

				// _.each(assemblyResources, function (resItem) {
				// if (!resItem[data.treePresOpt.parentProp]) {
				//      data.itemTree.push(resItem);
				// }
				// else {
				//      parent[data.treePresOpt.childProp].push(resItem);
				//      //if (data.treePresOpt.childSort) {
				//      //parent[data.treePresOpt.childProp].sort(data.treePresOpt.childSort);
				//  //}
				// }
				// });
				// ------------------------------------------------------------------------------------------------
			};

			service.clearModifications = function clearModifications() {

				var items = serviceContainer.data.itemList;

				angular.forEach(items, function (item) {

					serviceContainer.data.doClearModifications(item, serviceContainer.data);

				});
			};

			service.sortTree = function sortTree(items) {

				serviceContainer.data.sortByColumn(items);

			};

			service.hasToLoadOnSelectionChange = function hasToLoadOnSelectionChange(lineItem) {

				serviceContainer.data.doNotLoadOnSelectionChange = !!lineItem.EstLineItemFk;

			};

			service.setItemResources = function setItemResources(lineItem) {
				if (lineItem) {
					var list = serviceContainer.data.itemTree;
					var filteredList = _.filter(list, function (li) {
						return li.EstLineItemFk === lineItem.Id;
					});
					serviceContainer.data.itemTree = filteredList;
					service.fireListLoaded();
				}
			};

			function getDynamicFieldId(ColumnConfigDetialId) {

				var fieldTag = 'ConfDetail';

				return fieldTag + ColumnConfigDetialId;
			}

			function calDynamicCellData(fieldName, resources) {

				var columnInfo = constructionsystemMainConfigDetailService.getColumnInfoByFieldName(fieldName);

				if (columnInfo !== null) {

					var calculateType = columnInfo.calculatetype;

					switch (calculateType) {
						case 1: {
							return getFirstValue(resources, fieldName, getDefaultValue(columnInfo));
						}
						case 2: {
							return getSumValue(resources, fieldName);
						}
						case 3: {
							return getFactorValue(resources, fieldName);
						}
						case 4: {
							return getCodeValue(resources);
						}
						case 5: {
							return getDetailValue(resources, fieldName);
						}
					}
				}

				return null;

				function getFirstValue(resources, fieldName, defaultValue) {

					if (resources && _.isArray(resources) && resources[0]) {

						return resources[0][fieldName];
					}

					return defaultValue;

				}

				function getSumValue(resources, fieldName) {

					if (resources && _.isArray(resources)) {

						return _.sumBy(resources, fieldName);
					}

					return 0;
				}

				function getFactorValue(resources, fieldName) {

					if (resources && _.isArray(resources) && resources.length === 1) {
						return resources[0][fieldName];
					}

					return null;
				}

				function getCodeValue(resources) {

					if (resources && _.isArray(resources) && resources[0]) {

						return resources[0].MdcMaterialFk;
					}

					return null;
				}

				function getDetailValue(resources, fieldName) {

					if (resources && _.isArray(resources)) {

						if (resources.length === 1) {
							return resources[0][fieldName];
						} else {
							var relateFieldName = estimateMainDynamicColumnFilterService.getTheRelateField(fieldName);
							return getSumValue(resources, relateFieldName);
						}

					}

					return null;
				}

				function getDefaultValue(columnInfo) {

					var dataType = columnInfo.type;

					switch (dataType) {
						case 'bool' : {
							return false;
						}
						case 'string': {
							return '';
						}
						case 'numeric': {
							return 0;
						}
						case 'foreignkey' : {
							return null;
						}
						default : {
							return null;
						}
					}
				}
			}

			function dynamicCellDataCollection() {

				// to save the costcode id and material id
				var costCodeIds = [];

				var materialIds = [];

				var costCodeList = {};// to save the result after resource calculate(LineType == 1)

				var materialList = {};// to save the result after resource calculate(LineType == 2)

				var service = {};

				service.getDynamicCostCode = function getDynamicCostCode(costCodeFk) {

					if (costCodeList[costCodeFk]) {

						return costCodeList[costCodeFk];

					} else {

						costCodeList[costCodeFk] = {};

						costCodeIds.push(costCodeFk);

						return costCodeList[costCodeFk];

					}
				};

				service.getDynamicMaterial = function getDynamicMaterial(MaterialLineId) {

					if (materialList[MaterialLineId]) {

						return materialList[MaterialLineId];

					} else {

						materialList[MaterialLineId] = {};

						materialIds.push(MaterialLineId);

						return materialList[MaterialLineId];

					}
				};

				service.setDynamicCostCodeTotal = function (costCodeFk, resources) {

					var costCodeItem = service.getDynamicCostCode(costCodeFk);

					if (angular.isUndefined(costCodeItem.CostTotal)) {

						costCodeItem.CostTotal = _.sumBy(resources, 'CostTotal');

					}

				};

				service.setDynamicMaterialTotal = function (MaterialLineId, resources) {

					var materialItem = service.getDynamicMaterial(MaterialLineId);

					if (angular.isUndefined(materialItem.CostTotal)) {

						materialItem.CostTotal = _.sumBy(resources, 'CostTotal');

					}
				};

				service.setDynamicCostCodeCell = function (costCodeFk, DynamicFieldId, value) {

					var costCodeItem = service.getDynamicCostCode(costCodeFk);

					costCodeItem[DynamicFieldId] = value;

				};

				service.setDynamicMaterialCell = function (MaterialLineId, DynamicFieldId, value) {

					var materialItem = service.getDynamicMaterial(MaterialLineId);

					materialItem[DynamicFieldId] = value;

				};

				service.setDynamicCellsToLineItem = function (lineItem, FlattenResources, columnConfigDetails) {

					setDynamicData(lineItem, FlattenResources, columnConfigDetails);

				};

				return service;

				function setDynamicData(selectedLineItem, flattenResources, columnConfigDetail) {

					_.forEach(columnConfigDetail, function (columnConfigDetailItem) {

						var dynamicFieldId = getDynamicFieldId(columnConfigDetailItem.Id);

						if (columnConfigDetailItem.LineType === 1) {

							if (angular.isDefined(costCodeList[columnConfigDetailItem.MdcCostCodeFk])) {

								selectedLineItem[dynamicFieldId] = costCodeList[columnConfigDetailItem.MdcCostCodeFk][dynamicFieldId];
							}
						} else {

							if (angular.isDefined(materialList[columnConfigDetailItem.MaterialLineId])) {

								selectedLineItem[dynamicFieldId] = materialList[columnConfigDetailItem.MaterialLineId][dynamicFieldId];
							}
						}
						if (angular.isUndefined(selectedLineItem[dynamicFieldId])) {

							selectedLineItem[dynamicFieldId] = null;
						}

					});

					selectedLineItem.NotAssignedCostTotal = getNotAssignedCostTotal(flattenResources);

					if (selectedLineItem.NotAssignedCostTotal === undefined || selectedLineItem.NotAssignedCostTotal === null) {

						selectedLineItem.NotAssignedCostTotal = 0;
					}
				}

				function getNotAssignedCostTotal(flattenResources) {

					var assignedCostTotal = 0;// the cost total, while assigned

					// calculate assigned cost total
					_.forEach(costCodeIds, function (costCodeId) {

						if (angular.isDefined(costCodeList[costCodeId])) {

							assignedCostTotal = assignedCostTotal + costCodeList[costCodeId].CostTotal;

						}

					});

					_.forEach(materialIds, function (materialId) {

						if (angular.isDefined(materialList[materialId])) {

							assignedCostTotal = assignedCostTotal + materialList[materialId].CostTotal;

						}

					});

					// calculate not assigned total
					return calculateCostTotal(flattenResources) - assignedCostTotal;

					function calculateCostTotal(estResources) {

						var costTotal = 0;

						_.forEach(estResources, function (resourceItem) {

							if (resourceItem.EstResourceTypeFk !== 5) {

								costTotal = costTotal + resourceItem.CostTotal;

							}
						});

						return costTotal;
					}
				}
			}

			// calculate the value of the dynamic column in lineitem
			function calLineItemDynamicColumns(selectedLineItem, estResources, columnConfigDetail) {

				var fieldName;

				var flattenResources = _.filter(estResources, {EstRuleSourceFk: null});

				var estCostCodesList = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');

				// var filterService = resourceFilterService(flattenResources);
				var filterService = estimateMainDynamicColumnFilterService.filterResources(flattenResources, columnConfigDetail);

				var dynamicCellService = dynamicCellDataCollection();

				// calculate dynamic data of all dynamic config column
				_.forEach(columnConfigDetail, function (columnConfigDetailItem) {

					fieldName = constructionsystemMainConfigDetailService.getFieldByColumnId(columnConfigDetailItem.ColumnId);

					var dynamicFieldId = getDynamicFieldId(columnConfigDetailItem.Id);

					// costcode
					if (columnConfigDetailItem.LineType === 1) {

						// filter resources by MdcCostCodeFk
						var costCodeResources = filterService.getResourceByCostCode(columnConfigDetailItem.MdcCostCodeFk, columnConfigDetail);

						dynamicCellService.setDynamicCostCodeCell(columnConfigDetailItem.MdcCostCodeFk, dynamicFieldId, calDynamicCellData(fieldName, costCodeResources));

						dynamicCellService.setDynamicCostCodeTotal(columnConfigDetailItem.MdcCostCodeFk, costCodeResources);

						// set readonly
						if (fieldName === 'CostUnit') {

							if (columnConfigDetailItem.MdcCostCodeFk) {

								var costCodeInfo = _.find(estCostCodesList, {Id: columnConfigDetailItem.MdcCostCodeFk});

								if (costCodeInfo && costCodeInfo.IsRate) {

									estimateMainResourceProcessor.setColumnReadOnly(selectedLineItem, dynamicFieldId, true);
								}
							}
						}

						var columnInfo = constructionsystemMainConfigDetailService.getColumnInfoByFieldName(fieldName);

						// field name is factor
						if (columnInfo && columnInfo.calculatetype === 3) {

							if (costCodeResources && costCodeResources.length > 1) {

								estimateMainResourceProcessor.setColumnReadOnly(selectedLineItem, dynamicFieldId, true);
							} else {
								if (selectedLineItem.EstLineItemFk === null) {
									estimateMainResourceProcessor.setColumnReadOnly(selectedLineItem, dynamicFieldId, false);
								}
							}
						}
					} else {  // material
						// filter resources by MaterialLineId
						var materialResources = filterService.getResourceByMaterial(columnConfigDetailItem.MaterialLineId);

						dynamicCellService.setDynamicMaterialCell(columnConfigDetailItem.MaterialLineId, dynamicFieldId, calDynamicCellData(fieldName, materialResources));

						dynamicCellService.setDynamicMaterialTotal(columnConfigDetailItem.MaterialLineId, materialResources);

						// set readonly
						if (fieldName === 'CostUnit') {

							estimateMainResourceProcessor.setColumnReadOnly(selectedLineItem, dynamicFieldId, true);

						}
					}
				});

				// set the dynamic cell calculation result to selected lineItem
				dynamicCellService.setDynamicCellsToLineItem(selectedLineItem, estResources, columnConfigDetail);

				service.setLineTypeReadOnly(flattenResources);
			}

			function calRefLineItem(selectedLineItem, flattenResources) {

				var lineItemList = parentService.getList();

				var refLineItems = getRefLineItems(selectedLineItem, lineItemList);

				if (refLineItems !== null && refLineItems.length > 0) {

					_.forEach(refLineItems, function (item) {

						var resourcesClone = cloneAndFilterResources(flattenResources);

						calLineItemNResources(item, resourcesClone);
					});
				}

				function cloneAndFilterResources(flattenResources) {

					var cloneResources = angular.copy(flattenResources);

					return _.filter(cloneResources, function (item) {
						return item.EstResourceFk === null;
					});
				}

				function calLineItemNResources(lineItem, resources) {

					var flatResList = [];
					cloudCommonGridService.flatten(resources, flatResList, 'EstResources');

					// before calculate the dynamic column data ,it must recalculate the resources of lineitem
					// (its parameter must a flatten resource list)
					estimateMainCommonCalculationService.calcResNLineItem(flatResList, lineItem, true);

					calLineItemDynamicColumns(lineItem, flatResList, constructionsystemMainConfigDetailService.getColumnConfigDetails());
				}

				function getRefLineItems(lineItem, estLineItemList) {

					var allRefLineItemList = [];

					// get the lineItems which reference to this lineItem
					var refLineItems = _.filter(estLineItemList, {EstLineItemFk: lineItem.Id});

					if (angular.isDefined(refLineItems) && refLineItems !== null && refLineItems.length > 0) {

						allRefLineItemList = allRefLineItemList.concat(refLineItems);

						_.forEach(refLineItems, function (item) {

							var curRefLineItems = getRefLineItems(item, estLineItemList);

							if (angular.isDefined(curRefLineItems) && curRefLineItems !== null && curRefLineItems.length > 0) {

								allRefLineItemList = allRefLineItemList.concat(curRefLineItems);
							}
						});
					}

					return allRefLineItemList;
				}

			}

			service.calLineItemDynamicColumns = function (selectedLineItem, resourceList) {

				calLineItemDynamicColumns(selectedLineItem, resourceList, constructionsystemMainConfigDetailService.getColumnConfigDetails());

				// modify the lineitems which reference to current lineitem
				calRefLineItem(selectedLineItem, resourceList);
			};

			var defaultResource = null;

			service.resetToDefault = function resetToDefault(itemToReset) {

				var id = itemToReset.Id;

				if (defaultResource) {

					itemToReset = defaultResource;

					itemToReset.Id = id;

				} else {

					var creationData = {};

					var selectedItem = parentService.getSelected();

					var selectedResourceItem = serviceContainer.service.getSelected();

					creationData.projectId = estimateMainService.getSelectedProjectId();

					if (selectedResourceItem && selectedResourceItem.Id > 0) {

						creationData.resourceItemId = creationData.parentId;

						creationData.estHeaderFk = selectedResourceItem.EstHeaderFk;

						creationData.estLineItemFk = selectedResourceItem.EstLineItemFk;

					} else if (selectedItem && selectedItem.Id > 0) {

						creationData.estHeaderFk = selectedItem.EstHeaderFk;

						creationData.estLineItemFk = selectedItem.Id;

					}

					// TODO get a new empty entity here
					// serviceContainer.data.doCallHTTPCreate(creationData, serviceContainer.data, serviceContainer.data.onCreateSucceeded).then(function (data) {
					// defaultResource = itemToReset = data;
					// itemToReset.Id = id;

					// service.fireItemModified(itemToReset);
					// });
				}
			};

			service.setLineTypeReadOnly = function setLineTypeReadOnly(readItems) {

				angular.forEach(readItems, function (item) {

					if (!_.isEmpty(item.Code)) {

						estimateMainResourceProcessor.setLineTypeReadOnly(item, true);

					}

					if (!_.isEmpty(item.EstResources)) {

						setLineTypeReadOnly(item.EstResources);

					}
				});
			};

			// Resolve assembly function
			function getAssemblyResourcesRequest(customPostData) {

				var defer = $q.defer();

				var postData = {
					EstHeaderFk: parentService.getSelectedEstHeaderId(),
					// AssemblyIds: assemblyIds, //Set customPostData to send assemblyIds
					SectionId: 33,
					ProjectId: estimateMainService.getSelectedProjectId()
				};

				angular.extend(postData, customPostData);

				var processResolvedItems = function processResolvedItems(resources) {

					var platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');

					_.forEach(resources, function (item) {

						platformDataServiceDataProcessorExtension.doProcessItem(item, serviceContainer.data);

						if (item.HasChildren) {

							processResolvedItems(item.EstResources);

						}
					});
				};

				$http.post(globals.webApiBaseUrl + 'estimate/main/resource/getassemblyresourcestolineitem', postData).then(function (response) {

					processResolvedItems(response.data.resources);

					defer.resolve(response.data);

				}, function (err) {

					console.error(err);

				});

				return defer.promise;
			}

			service.setList = function setList(data, isReadOnly) {
				data = data ? data : [];
				cloudCommonGridService.sortTree(data, 'Sorting', 'EstResource');
				serviceContainer.data.itemTree = _.filter(data, function (item) {
					return item.EstResourceFk === null;
				});
				var flatResList = [];
				cloudCommonGridService.flatten(data, flatResList, 'EstResources');
				flatResList = _.uniq(flatResList, 'Id');
				estimateMainResourceImageProcessor.processItems(flatResList);
				estimateMainResourceProcessor.processItems(flatResList, false);
				serviceContainer.data.itemList = flatResList;
				if (isReadOnly) {
					estimateMainResourceProcessor.readOnly(flatResList, !!isReadOnly);
				} else {
					var resourcesGeneratedByRule = _.filter(flatResList, function (item) {
						return item.EstRuleSourceFk > 0;
					});
					estimateMainResourceProcessor.readOnly(resourcesGeneratedByRule, true);
				}

			};

			service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};

			service.updateList = function updateList(resList, isReadOnly) {
				service.setList(resList, isReadOnly);
				service.fireListLoaded();
			};

			// Resolve assembly function
			function setAssemblyResourcesTreeNodeInfo(resource, items, subItemToAssign) {

				var selectedResourceLevel = resource && resource.nodeInfo && resource.nodeInfo.level ? resource.nodeInfo.level : 0;

				var iterateResources = function iterateResources(items, level) {

					_.forEach(items, function (item) {

						var collapsed = level > 0;

						item.nodeInfo = {collapsed: collapsed, level: level, children: item.HasChildren};

						if (item.HasChildren) {

							iterateResources(item.EstResources, level + 1);

						}
					});
				};

				// move
				if (subItemToAssign) {

					subItemToAssign.nodeInfo.collapsed = false;

					subItemToAssign.nodeInfo.children = true;

					selectedResourceLevel = selectedResourceLevel + 1;

				}

				iterateResources(items, selectedResourceLevel);
			}

			// Resolve assembly function
			function setAssemblyResourcesTreeToContainerData(items, subItemToAssign, itemLevelToAssign) {

				var res = service.getSelected();

				_.forEach(items, function (item) {

					if (res && res.Id === item.Id) { // resolve
						// we do not add this item to data.itemList, because by default it already was added.
						serviceContainer.data.markItemAsModified(item, serviceContainer.data);

					} else {
						// add item to save
						serviceContainer.data.itemList.push(item);

						serviceContainer.data.addEntityToCache(item, serviceContainer.data);

						serviceContainer.data.markItemAsModified(item, serviceContainer.data);

						// add parent resource to itemTree
						if (!_.isNumber(item.EstResourceFk)) {

							if (subItemToAssign) { // move

								item.EstResourceFk = subItemToAssign.Id;

								subItemToAssign.HasChildren = true;

								subItemToAssign.EstResources.push(item);

								serviceContainer.data.markItemAsModified(item, serviceContainer.data);

							} else if (itemLevelToAssign) { // copy

								var parent = _.find(service.getList(), {Id: itemLevelToAssign.EstResourceFk});

								if (parent) {
									// var index = _.findIndex(parent.EstResources, { Id: itemLevelToAssign.Id });
									// parent.EstResources.splice(index, 0, item);

									parent.EstResources.push(item);

								} else {

									// we check index from the tree list
									// var indexTree = _.findIndex(service.getTree(), { Id: itemLevelToAssign.Id });
									// serviceContainer.data.itemTree.splice(indexTree, 0, item);
									serviceContainer.data.itemTree.push(item);

								}

							} else {

								serviceContainer.data.itemTree.push(item);

							}
						}
					}

					if (item.HasChildren) {

						setAssemblyResourcesTreeToContainerData(item.EstResources);

					}
				});
			}

			// Resolve assembly function
			function mergeCurrentResource(resource, items, assemblyId) {
				// items : Array of treeItems
				if (resource) {
					// Pick the first assembly and merged it to the selected resource
					var resToUpdate = _.find(items, {EstAssemblyFk: assemblyId});

					if (resToUpdate) {

						resToUpdate.Id = resource.Id;

						if (resToUpdate.HasChildren) {

							_.forEach(resToUpdate.EstResources, function (rUpdate) {

								rUpdate.EstResourceFk = resource.Id;

							});
						}

						angular.extend(resource, resToUpdate);
					}
				}
			}

			// Resolve assembly function
			function clearValidationFromCurrentResource(resource) {

				if (resource) {

					var constructionsystemMainResourceValidationService = $injector.get('constructionsystemMainResourceValidationService');

					$injector.get('platformRuntimeDataService').applyValidationResult(true, resource, 'Code');

					$injector.get('platformDataValidationService').removeFromErrorList(resource, 'Code', constructionsystemMainResourceValidationService, service);

				}
			}

			// Resolve assembly function
			function calculateResolvedAssembliesAndValidateSubItemsCode(lineItem) {
				// calculate totals
				var resourceList = service.getList();

				var resourcesTree = service.getTree();

				$injector.get('estimateMainCommonCalculationService').calcResNLineItem(resourceList, lineItem, true);

				$injector.get('constructionsystemMainDynamicColumnService').calculateLineItem(lineItem, resourceList);

				// Validate Sub Item unique code
				$injector.get('constructionsystemMainResourceValidationService').validateSubItemsUniqueCodeFromAssembly(resourcesTree, lineItem);

			}

			// Copy function is used in drag drop service // Insert item at the same level where dropped
			service.copyAssembliesToEstResource = function copyAssembliesToEstResource(lineItem, assemblyIds) {

				var selectedResource = service.getSelected();

				var postData = {
					LineItemId: lineItem.Id,
					AssemblyIds: assemblyIds
				};

				getAssemblyResourcesRequest(postData).then(function (data) {

					var resourceTrees = data.resources || []; // Array of tree resources
					// var resCharacteristics = data.resourcesCharacteristics || [];

					// Follow this order to process tree resources
					// clearValidationFromCurrentResource(selectedResource); //var the sub item errors active if exists
					setAssemblyResourcesTreeNodeInfo(selectedResource, resourceTrees);

					// mergeCurrentResource(selectedResource, resourceTrees, _.first(assemblyIds)); // we do not replace resource, so we do not merge here
					setAssemblyResourcesTreeToContainerData(resourceTrees, null, selectedResource);

					// Lastly calculate totals and validate sub items
					calculateResolvedAssembliesAndValidateSubItemsCode(lineItem);

					// Refresh views
					parentService.gridRefresh();
					estimateMainResourceProcessor.setDisabledChildrenReadOnly(serviceContainer.service.getList());
					let constructionsystemMainResourceDynamicUserDefinedColumnService = $injector.get('constructionsystemMainResourceDynamicUserDefinedColumnService');
					constructionsystemMainResourceDynamicUserDefinedColumnService.processNewResourceTrees(resourceTrees, lineItem);

					service.gridRefresh();

				});
			};

			// Move function is used in drag drop service
			service.moveAssembliesToEstResource = function moveAssembliesToEstResource(lineItem, assemblyIds, addToSubItem) {

				var selectedResource = service.getSelected();

				var subItemToAssign = addToSubItem ? selectedResource : null;

				var postData = {
					LineItemId: lineItem.Id,
					AssemblyIds: assemblyIds
				};

				getAssemblyResourcesRequest(postData).then(function (data) {

					var resourceTrees = data.resources || []; // Array of tree resources
					// var resCharacteristics = data.resourcesCharacteristics || [];

					// Follow this order to process tree resources
					// clearValidationFromCurrentResource(selectedResource); //var the sub item errors active if exists as we don't replace the selected resource
					setAssemblyResourcesTreeNodeInfo(selectedResource, resourceTrees, subItemToAssign);

					// mergeCurrentResource(selectedResource, resourceTrees, _.first(assemblyIds)); // we do not replace resource, so we do not merge here
					setAssemblyResourcesTreeToContainerData(resourceTrees, subItemToAssign);

					// Lastly calculate totals and validate sub items
					calculateResolvedAssembliesAndValidateSubItemsCode(lineItem);

					// Attach user defined price value to resoruce
					if(angular.isArray(data.UserDefinedcolsOfResource)){
						setUserDefinedColToResource(lineItem, resourceTrees, data.UserDefinedcolsOfResource);
					}

					// Refresh views
					parentService.gridRefresh();

					service.gridRefresh();

				});
			};

			// Resolve function to transform assembly, returns assembly converted(S/Compound assembly) in tree structure
			service.resolveAssembliesToEstResources = function resolveAssembliesToEstResources(lineItem, assemblyIds) {

				var selectedResource = service.getSelected();

				var postData = {
					LineItemId: lineItem.Id,
					AssemblyIds: assemblyIds
				};

				getAssemblyResourcesRequest(postData).then(function (data) {

					var resourceTrees = data.resources || []; // Array of tree resources
					// var resCharacteristics = data.resourcesCharacteristics || [];

					// Follow this order to process tree resources
					clearValidationFromCurrentResource(selectedResource);
					setAssemblyResourcesTreeNodeInfo(selectedResource, resourceTrees);

					mergeCurrentResource(selectedResource, resourceTrees, _.first(assemblyIds));
					setAssemblyResourcesTreeToContainerData(resourceTrees);

					// Lastly calculate totals and validate sub items
					calculateResolvedAssembliesAndValidateSubItemsCode(lineItem);

					// Refresh views
					parentService.gridRefresh();
					service.gridRefresh();
				});
			};

			service.getAssemblyLookupSelectedItems = function getAssemblyLookupSelectedItems(entity, assemblySelectedItems) {

				if (!_.isEmpty(assemblySelectedItems) && _.size(assemblySelectedItems) > 1) {

					var assemblyIds = _.map(assemblySelectedItems, 'Id');

					var lineItem = parentService.getSelected();

					service.resolveAssembliesToEstResources(lineItem, assemblyIds);
				}
			};

			service.createItems = function createItems(resourceType, items) {

				var selectedLineItem = parentService.getSelected();

				var resourceList = [];

				var constructionsystemMainResourceValidationService = $injector.get('constructionsystemMainResourceValidationService');

				// Create item from items
				function createItem(resourceType, items) {

					var item = _.head(items);

					if (item) {

						createLineItemResource(resourceType, item).then(function (data) {

							setLineItemResourceInfo(data.resourceType, data.estimateResource, data.item);

							removeItemAndValidateToRefreshLineItem(resourceType, items);

							if (resourceType === 1 || resourceType === 2) {

								createItem(resourceType, items);

							}
						});

					} else {

						var resourceList = service.getList();

						var resources = service.getTree();

						$injector.get('estimateMainCommonCalculationService').calcResNLineItem(resourceList, selectedLineItem, true);

						$injector.get('constructionsystemMainDynamicColumnService').calculateLineItem(selectedLineItem, resourceList);

						$injector.get('constructionsystemMainResourceValidationService').validateSubItemsUniqueCodeFromAssembly(resources);

						parentService.gridRefresh();

						service.gridRefresh();
					}
				}

				// Create estimate resource from the server
				function createLineItemResource(resourceType, item) {

					var defer = $q.defer();

					var newItem = service.createItem();

					newItem.then(function (estimateResource) {

						$injector.get('platformDataValidationService').removeFromErrorList(estimateResource, 'Code', constructionsystemMainResourceValidationService, service);

						defer.resolve({
							resourceType: resourceType,
							estimateResource: estimateResource,
							item: item
						});

					});

					return defer.promise;
				}

				// Set estimate resource information based on selected code
				function setLineItemResourceInfo(resourceType, cosResource, item) {

					angular.extend(cosResource, {

						EstResourceTypeFk: resourceType,
						EstResourceTypeFkExtend: resourceType,
						Code: item.Code,
						DescriptionInfo: item.DescriptionInfo

					});

					if (resourceType === 1 || resourceType === 2) {

						estimateMainCommonService.extractSelectedItemProp(item, cosResource);

						cosResource.ExchangeRate = cosResource.ExchangeRate ? cosResource.ExchangeRate : estimateMainExchangeRateService.getExchRate(cosResource.BasCurrencyFk);

						constructionsystemMainCommonService.CalculateResources(cosResource, selectedLineItem, service.getList());
					}

					estimateMainResourceImageProcessor.processItem(cosResource);
				}

				function removeItemAndValidateToRefreshLineItem(resourceType, items) {

					items.shift();

					if (_.isEmpty(items)) {
						// Lastly calculate line item total and dynamic columns
						if (resourceType === 1 || resourceType === 2) {

							calculateLineItemTotalAndDynamicCols();

						}
					}
				}

				function calculateLineItemTotalAndDynamicCols() {

					resourceList = service.getList();

					service.calLineItemDynamicColumns(selectedLineItem, resourceList);

					angular.forEach(resourceList, function (resItem) {

						service.markItemAsModified(resItem);

					});

					parentService.markItemAsModified(selectedLineItem);
				}

				var selectedResource = service.getSelected();

				if (service.isSelection(selectedResource)) {

					$injector.get('platformRuntimeDataService').applyValidationResult(true, selectedResource, 'Code');

					$injector.get('platformDataValidationService').removeFromErrorList(selectedResource, 'Code', constructionsystemMainResourceValidationService, service);

					setLineItemResourceInfo(resourceType, selectedResource, _.head(items));

					removeItemAndValidateToRefreshLineItem(resourceType, items);

					createItem(resourceType, items);
				}
			};

			/* function isParentCompositeResource(resItem){

				var item = service.getItemById(resItem.EstResourceFk) || {};

				if (item.EstAssemblyTypeFk){
					return true;
				}else if (item.EstResourceFk){
					return isParentCompositeResource(item);
				}
			} */

			service.setIndirectCost = function setIndirectCost(resources, isIndirectCost) {

				angular.forEach(resources, function (res) {

					res.IsIndirectCost = res && res.EstRuleSourceFk ? res.IsIndirectCost : !!isIndirectCost;

				});
			};

			var filters = [
				{
					key: 'estimate-main-resources-assembly-type-filter',
					fn: function (item, entity) { // item = assembly category
						if (entity.EstResourceTypeFk === 4 && entity.EstAssemblyTypeFk) { // only assembly and composite assemblies
							return item.EstAssemblyTypeFk === entity.EstAssemblyTypeFk;
						}
						return true;
					}
				},
				{
					key: 'estimate-main-resources-cost-type-filter',
					fn: function (item) {
						return item.MdcContextFk === estimateMainCommonService.getCompanyContextFk();
					}
				}
			];

			service.registerFilters = function registerFilters() {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			service.unregisterFilters = function unregisterFilters() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			service.takeOverCostTypeFromAssembly = function (mdcCostCodeFk, mdcMaterialFk, resourceItem) {

				if (mdcCostCodeFk && resourceItem) {

					basicsLookupdataLookupDescriptorService.loadItemByKey('costcode', mdcCostCodeFk).then(function (data) {

						if (data) {
							resourceItem.EstCostTypeFk = data.EstCostTypeFk;
						}

					});
				} else if (mdcMaterialFk && resourceItem) {

					var materialIdList = [mdcMaterialFk];

					estimateMainPrjMaterialLookupService.getBaseMaterials(materialIdList).then(function (data) {

						if (data && data.length === 1) {

							resourceItem.EstCostTypeFk = data[0].EstCostTypeFk;

						}
					});
				}
			};

			function handleResourcePackage(entity) {

				if (service.getList().length > 0) {

					service.setResourcePackage(service.getList(), entity);

				} else {
					service.load().then(function () {

						service.setResourcePackage(service.getList(), entity);

					});
				}
			}

			function handleResourcePackageReference(entity) {

				if (entity.EstLineItemFk) {

					entity.EstLineItemFk = null;

					var mainItemList = parentService.getList();

					var refLineItemService = $injector.get('estimateMainRefLineItemService');

					refLineItemService.setRefLineItem(entity, mainItemList).then(function () {

						handleResourcePackage(entity);

					});
				} else {

					handleResourcePackage(entity);

				}
			}

			service.handlerPrcPackageAndStructure = function (entity, selectedItem) {

				if (entity && !entity.PrcStructureFk) {

					entity.PrcStructureFk = selectedItem ? selectedItem.StructureFk : entity.PrcStructureFk;
				}
			};

			service.setResourcePackage = function (resourceList, item) {
				// defect 84718, Try to select a procurement package to an Line Item, click the column below. The assignment is not showing in the Line Item resources
				// the packageFk and package2HeaderFk lookup has a problem that change the package then choose another lineItem,
				// the package will be changed according to the lineItem's change, but its packageFk value changes to wrong value
				if (typeof (item.EstResourceTypeFk) === 'undefined') {

					service.setSelected();

					angular.forEach(resourceList, function (res) {

						if (!item.EstLineItemFk) {

							service.markItemAsModified(res);

							service.fireItemModified(res);
						}

						//estimateMainResourceProcessor.setProcurementPackageReadOnly(res, item);

					});

					if (item.EstLineItemFk > 0) {

						service.gridRefresh();

					}
				} else {

					if (item.EstResourceTypeFk === 5) {

						angular.forEach(resourceList, function (res) {

							if (res.EstResourceFk === item.Id) {

								if (!item.EstLineItemFk) {

									service.markItemAsModified(res);

									service.fireItemModified(res);
								}
							}
						});

						if (item.EstLineItemFk > 0) {

							service.gridRefresh();

						}
					}
				}
				if (item.PrcPackageFk === null || item.PrcPackageFk === '') {
					estimateMainCommonService.DeletePrcPackageAssignments(item, 'Resources');
				}
			};

			var onLineItemChanged = new PlatformMessenger(); // estimate resource item is changed
			service.registerLineItemValueUpdate = function registerLineItemValueUpdate(func) {
				onLineItemChanged.register(func);
			};

			service.unregisterLineItemValueUpdate = function unregisterLineItemValueUpdate(func) {
				onLineItemChanged.unregister(func);
			};

			service.fireLineItemValueUpdate = function (col, item) {
				onLineItemChanged.fire(col, item);
			};

			var _gridId = null;
			service.setGridId = function setGridId(gridId) {
				_gridId = gridId;
			};

			service.getGridId = function getGridId() {
				return _gridId;
			};

			service.setReadOnlyService = function setReadOnlyService(readOnly) {

				isReadOnlyService = readOnly;

			};

			service.isReadonly = function isReadonly() {

				return isReadOnlyService;

			};

			/* function setDynamicColumnsLayout(readData){

				var dynColumns = readData.dynamicColumns;

				var estLineItemCharacteristics = dynColumns.Characteristics || [];

				var characterisitcsDefaults = dynColumns.Defaults || [];

				var estLineItemCharacteristicsColumns = [];

				var dynamicColService = $injector.get('estimateMainResourceDynamicColumnService');

				if(_.size(estLineItemCharacteristics) > 0){

					estimateMainCommonService.appendCharactiricColumnData(estLineItemCharacteristics, service, readData.dtos);

					estLineItemCharacteristicsColumns = estimateMainCommonService.getCharactCols(estLineItemCharacteristics);

				}

				serviceContainer.data.characteristicsDefaults = characterisitcsDefaults;

				serviceContainer.data.dynamicColumns = estLineItemCharacteristicsColumns;

				dynamicColService.setDynCharCols(serviceContainer.data.dynamicColumns);

				service.setDynamicColumnsLayoutToGrid();
			} */

			function getDynamicColumns() {

				return serviceContainer.data.dynamicColumns;

			}

			/* function getCharDefaults(){

				return serviceContainer.data.characteristicsDefaults;

			} */

			function parseConfiguration(propertyConfig) {

				propertyConfig = angular.isString(propertyConfig) ? JSON.parse(propertyConfig) : angular.isArray(propertyConfig) ? propertyConfig : [];

				_.each(propertyConfig, function (config) {
					if (_.has(config, 'name')) {
						_.unset(config, 'name');
						_.unset(config, 'name$tr$');
						_.unset(config, 'name$tr$param$');
					}
				});

				return propertyConfig;
			}

			function setUserDefinedColToResource(lineItem, resourceTrees, newUserDefinedCols){
				if(angular.isArray(newUserDefinedCols)){
					$injector.get('constructionsystemMainResourceDynamicUserDefinedColumnService').resolveResourcesFromAssembly(lineItem, resourceTrees, newUserDefinedCols);
					service.gridRefresh();
				}
			}

			service.setDynamicColumnsLayoutToGrid = function setDynamicColumnsLayoutToGrid() {

				var mainViewService = $injector.get('mainViewService');

				var platformGridAPI = $injector.get('platformGridAPI');

				var gridId = '51543C12BB2D4888BC039A5958FF8B96'; // Resource container grid Id

				var grid = platformGridAPI.grids.element('id', gridId);

				if (grid && grid.instance) {

					var cols = grid.columns.current; // platformGridAPI.columns.getColumns(gridId);

					var dynamicCols = _.filter(cols, function (col) {

						return (col.id.indexOf('ConfDetail') > -1 || col.id.indexOf('charactercolumn_') > -1 || col.id.indexOf('NotAssignedCostTotal') > -1);

					});
					if (dynamicCols.length === 0) {

						var allColumns = cols.concat(getDynamicColumns());

						var config = mainViewService.getViewConfig(gridId);

						if (config) {

							var propertyConfig = config.Propertyconfig || [];

							propertyConfig = parseConfiguration(propertyConfig);

							var mappedConfigIds = {};

							propertyConfig.forEach(function (el, i) {

								mappedConfigIds[el.id] = {

									'idx': i,
									'prop': el

								};

							});

							allColumns.forEach(function (col, i) {

								console.log(i);// removing error
								if (Object.prototype.hasOwnProperty.call(mappedConfigIds,col.id)) {

									col.hidden = !mappedConfigIds[col.id].prop.hidden;

								}
							});
						}

						platformGridAPI.columns.configuration(gridId, allColumns);

						platformGridAPI.grids.resize(gridId);
					}
				}
			};

			return service;
		}
	]);
})(angular);
