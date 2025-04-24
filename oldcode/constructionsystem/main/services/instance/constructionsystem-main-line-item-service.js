(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/* globals globals,_,Platform */
	/**
	 * This constant describes the line item/resource compare flag.
	 */
	angular.module(moduleName).value('constructionsystemMainCompareFlags', {
		noComparison: 0,     // user setting: no comparison
		unmodified: 1,
		new: 2,
		delete: 3,
		modified: 4,
		cellCss: {
			modified: 'cm-invalidchar',
			new: 'cm-invalidchar',
			delete: 'CodeMirror-guttermarker-subtle'
		}
	});

	/**
	 * @ngdoc service
	 * @name constructionsystemMainLineItemService
	 * @function
	 * @requires $http
	 * @description
	 * #
	 * data service of constructionsystem main LineItem container.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionsystemMainLineItemService', [
		'$http', '$injector', 'platformDataServiceFactory', 'constructionSystemMainInstanceService', 'basicsLookupdataLookupDescriptorService',
		'constructionSystemMainJobDataService', 'constructionsystemMainCompareFlags',
		'estimateMainSortCode01LookupDataService',
		'estimateMainSortCode02LookupDataService',
		'estimateMainSortCode03LookupDataService',
		'estimateMainSortCode04LookupDataService',
		'estimateMainSortCode05LookupDataService',
		'estimateMainSortCode06LookupDataService',
		'estimateMainSortCode07LookupDataService',
		'estimateMainSortCode08LookupDataService',
		'estimateMainSortCode09LookupDataService',
		'estimateMainSortCode10LookupDataService',
		'estimateMainCommonService',
		'PlatformMessenger',
		'platformGridAPI',
		'platformPermissionService',
		'$q',
		'permissions',
		function ($http, $injector, platformDataServiceFactory, parentService, lookupDescriptorService,
			constructionSystemMainJobDataService, compareFlags,
			estimateMainSortCode01LookupDataService,
			estimateMainSortCode02LookupDataService,
			estimateMainSortCode03LookupDataService,
			estimateMainSortCode04LookupDataService,
			estimateMainSortCode05LookupDataService,
			estimateMainSortCode06LookupDataService,
			estimateMainSortCode07LookupDataService,
			estimateMainSortCode08LookupDataService,
			estimateMainSortCode09LookupDataService,
			estimateMainSortCode10LookupDataService,
			estimateMainCommonService,
			PlatformMessenger,
			platformGridAPI,
			platformPermissionService,
			$q,
			permissions) {

			var updateTools = new Platform.Messenger();
			var parentContainerGridId = null;

			var onBeforeEditCell = null;

			var isDoRefreshLD = false;

			var isReadOnlyService = false;

			// eslint-disable-next-line no-unused-vars
			var sortCodeInfoToSave = [];

			// eslint-disable-next-line no-unused-vars
			var selectedProjectInfo = null;

			var selectedEstHeaderItem = $injector.get('estimateMainService').getSelectedEstHeaderItem();

			var selectedLineItem = {};

			var serviceOptions = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionsystemMainLineItemService',
					httpRead: {
						route: globals.webApiBaseUrl + 'constructionsystem/main/lineitem/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							if (parentService.hasSelection()) {
								var selectedItem = parentService.getSelected();
								readData.InsHeaderId = selectedItem.InstanceHeaderFk;
								readData.InstanceId = selectedItem.Id;
							}
							// multi-selected
							const entities = parentService.getSelectedEntities();
							if (entities && entities.length > 1) {
								readData.InstanceIds = entities.map(e => e.Id);
							}
							// resetWatchers();
						}
					},

					httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},

					presenter: {
						list: {
							isDynamicModified: true,
							isInitialSorted: true,
							sortOptions: {
								initialSortColumn: {field: 'Code', id: 'code'},
								isAsc: true
							},
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						node: {
							codeField: 'Code',
							itemName: 'EstLineItems',
							moduleName: 'constructionsystem.main',
							parentService: parentService,
							handleUpdateDone: function (updateData, response, data) {
								sortCodeInfoToSave = [];

								if (response.EstLineItemsToSave && response.EstLineItemsToSave.length > 0) {
									var currentLineItem = response.EstLineItems[0];
									service.onSortCodeReset.fire(response.SortCodeInfoToSave);
									var selectedProjectInfo = getSelectedProjectInfo();
									if (selectedProjectInfo) {
										currentLineItem.ProjectId = selectedProjectInfo.ProjectId;
										currentLineItem.ProjectName = selectedProjectInfo.ProjectName;
										currentLineItem.ProjectNo = selectedProjectInfo.ProjectNo;
										if (selectedEstHeaderItem) {
											currentLineItem.EstimationCode = selectedEstHeaderItem.Code;
											currentLineItem.EstimationDescription = selectedEstHeaderItem.DescriptionInfo;
										}
									}
								}

								var cosMainResourceService = $injector.get('constructionsystemMainResourceDataService');
								if (response.EstResourceToDelete && response.EstResourceToDelete.length > 0) {
									cosMainResourceService.deleteResources(response.EstResourceToDelete);
								}
								if (response.EstResourceToSave && response.EstResourceToSave.length > 0) {
									cosMainResourceService.handleUpdateDone(response.EstResourceToSave);
								}

								if(angular.isArray(response.UserDefinedcolsOfLineItemModified)){
									$injector.get('constructionsystemMainDynamicUserDefinedColumnService').attachUpdatedValueToColumn(response.EstLineItems, response.UserDefinedcolsOfLineItemModified, true);
								}

								data.handleOnUpdateSucceeded(updateData, response, data, true);

								// clear updateData
								var modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
								modTrackServ.clearModificationsInRoot(service);

								// if ((response.PrjMaterialsToSave && response.PrjMaterialsToSave.length) || (response.PrjCostCodesToSave && response.PrjCostCodesToSave.length)) {
								//      service.onUpdateProjectData.fire();
								// }

								// handle updated lineitem and resource user defined price column value
								if(angular.isArray(response.UserDefinedcolsOfResourceModified)){
									$injector.get('constructionsystemMainResourceDynamicUserDefinedColumnService').updateValueList(response.UserDefinedcolsOfResourceModified);
								}
								if(response.UserDefinedcolsOfResourceToUpdate){
									$injector.get('constructionsystemMainResourceDynamicUserDefinedColumnService').handleUpdateDone(response.UserDefinedcolsOfResourceToUpdate);
								}
								if(response.UserDefinedcolsOfLineItemToUpdate){
									$injector.get('constructionsystemMainDynamicUserDefinedColumnService').handleUpdateDone(response.UserDefinedcolsOfLineItemToUpdate);
								}
								service.onUpdated.fire();

								if (response.EstLineItemToDelete && response.EstLineItemToDelete.length) {
									service.load();
								}

							},
							handleSelection: function () {
								service.setSelectedLineItem(selectedLineItem);
							},
							mergeAffectedItems: function (affectedItems, data) {
								if (affectedItems && affectedItems.length) {
									angular.forEach(affectedItems, function (item) {
										var index = _.findIndex(data.itemList, {Id: item.Id});
										if (index !== -1) {
											angular.extend(data.itemList[index], item);
										}
									});
									service.gridRefresh();
								}
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			var service = serviceContainer.service;

			service.onQuantityChanged = new PlatformMessenger();

			var parentReadonly = function () {
				var selectedItem = parentService.getSelected();
				return !(selectedItem && !selectedItem.IsUserModified);
			};
			var canDelete = serviceContainer.service.canDelete;
			service.canDelete = function () {
				var result = canDelete() && parentReadonly();
				updateTools.fire(result);
				return result;
			};
			service.registerUpdateTools = function (fn) {
				updateTools.register(fn);
			};

			service.unRegisterUpdateTools = function (fn) {
				updateTools.unregister(fn);
			};

			var noCssStyleProperties = ['Info', 'CompareFlag'];
			var compareProperties = [
				'EstAssemblyFk', 'QuantityTargetDetail', 'QuantityTarget', 'BasUomTargetFk', 'QuantityDetail', 'Quantity', 'BasUomFk',
				'QuantityFactorDetail1', 'QuantityFactor1', 'QuantityFactorDetail2', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4',
				'ProductivityFactorDetail', 'ProductivityFactor', 'QuantityUnitTarget', 'QuantityTotal', 'CostUnit',
				'CostFactorDetail1', 'CostFactor1', 'CostFactorDetail2', 'CostFactor2', 'CostUnitTarget', 'CostTotal',
				'HoursUnit', 'HoursUnitTarget', 'HoursTotal', 'EstCostRiskFk', 'MdcControllingUnitFk', 'BoqItemFk', 'PsdActivityFk',
				'LicCostGroup1Fk', 'LicCostGroup2Fk', 'LicCostGroup3Fk', 'LicCostGroup4Fk', 'LicCostGroup5Fk',
				'PrjCostGroup1Fk', 'PrjCostGroup2Fk', 'PrjCostGroup3Fk', 'PrjCostGroup4Fk', 'PrjCostGroup5Fk',
				'MdcWorkCategoryFk', 'MdcAssetMasterFk', 'PrjLocationFk', 'PrcStructureFk',
				'IsLumpsum', 'IsDisabled', 'CommentText'
			];

			/**
			 *  apply the new one to the old one. In this case, the old line items will be delete.
			 *  And the new items (including resources) will be copied and marked as not temporary.
			 *  After that we still have two copies there.
			 *  The idea is, if user change it in estimate document, he/she can still roll back to the version when he/she applied from construction system.
			 *  But when the construction is run again, the temporary line items will be deleted and refreshed again.
			 */
			service.applyTempLineItems = function () {
				if (parentService.hasSelection()) {
					var selectedItem = parentService.getSelected();
					var instanceIds = [];
					instanceIds.push(selectedItem.Id);
					var obj = {
						InsHeaderId: selectedItem.InstanceHeaderFk,
						InstanceIds: instanceIds
					};
					$http.post(globals.webApiBaseUrl + 'constructionsystem/main/lineitem/apply', obj).then(
						function (response) {
							if (response.data) {
								service.load();
							}
						}
					);
				}
			};

			/**
			 * compare objects(properties) which has the same type.
			 * @param newItem: objA
			 * @param oldItem: objB
			 * @param compareProperties: the properties which need to be compared.
			 * @returns {{isEqual: boolean, changedProperties: Array}}:
			 */
			service.compareObjectProperties = function compareObjectProperties(newItem, oldItem, compareProperties) {
				var result = {
					isEqual: true,
					changedProperties: []
				};
				var properties = Object.getOwnPropertyNames(newItem);

				_.each(properties, function (prop) {
					if (_.includes(compareProperties, prop) && newItem[prop] !== oldItem[prop]) {
						result.isEqual = false;
						result.changedProperties.push(prop);
					}
				});

				return result;
			};

			/**
			 * get the properties which will be applied with css style.
			 */
			service.getPropertiesWithStyle = function getPropertiesWithStyle(item, ignoreProperties) {
				var list = [];
				var properties = Object.getOwnPropertyNames(item);

				_.each(properties, function (prop) {
					if (!_.includes(ignoreProperties, prop)) {
						list.push(prop);
					}
				});

				return list;
			};

			/**
			 * reload after instance recalculation successfully.
			 */
			constructionSystemMainJobDataService.onCalculationDone.register(function (args) {
				if (parentService.hasSelection() && parentService.getSelected().Id === args.instance.Id) {
					service.load();
				}
			});

			function updateSortCode(service, options, items) {
				var list = service.getListSync();
				var newList = list.concat(items);
				service.setCache(options, newList);
			}

			// eslint-disable-next-line no-unused-vars
			var estConfigData = [];
			// setEstConfigData for structure assignment on line item create
			service.setEstConfigData = function setEstConfigData(data) {
				estConfigData = [];
				if (data && data.EstStructureDetails && data.EstStructureDetails.length) {
					estConfigData = _.sortBy(data.EstStructureDetails, 'Sorting');
				}
			};
			service.clearEstConfigData = function clearEstConfigData() {
				estConfigData = [];
			};

			/*
			* @param readData.CostGroupsDict
			*
			* */
			function addCostGroupsToReadData(readData) {
				readData.dtos = readData.LineItems;
				readData.CostGroupCats = readData.CostGroupsDict.CostGroupCats;
				readData.LineItem2CostGroups = readData.CostGroupsDict.LineItem2CostGroups;

			}

			/**
			 * @param readData.CostFactor1
			 * @param readData.LookupLineItems
			 * @param readData.LookupAssemblies
			 * @param readData.LookupBoqItems
			 * @param readData.LookupActivities
			 * @param readData.LookupControllingUnits
			 * @param readData.LookupSchedules
			 * @param readData.IsNeedComparison
			 * @param readData.LineItems */
			function incorporateDataRead(readData, data) {

				addCostGroupsToReadData(readData);
				$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
					basicsCostGroupAssignmentService.process(readData, service, {
						mainDataName: 'dtos',
						attachDataName: 'LineItem2CostGroups',
						dataLookupType: 'LineItem2CostGroups',
						identityGetter: function identityGetter(entity) {
							return {
								EstHeaderFk: entity.RootItemId,
								Id: entity.MainItemId
							};
						}
					});
				}]);
				lookupDescriptorService.updateData('estlineitemfk', readData.LookupLineItems);
				lookupDescriptorService.updateData('estassemblyfk', readData.LookupAssemblies);
				lookupDescriptorService.updateData('estboqitems', readData.LookupBoqItems);
				lookupDescriptorService.updateData('estlineitemactivity', readData.LookupActivities);
				lookupDescriptorService.updateData('prjcontrollingunit', readData.LookupControllingUnits);
				lookupDescriptorService.updateData('packageSchedulingLookupService', readData.LookupSchedules);
				updateSortCode(estimateMainSortCode01LookupDataService, {lookupType: 'sortcode01'}, readData.ProjectSortCode01s);
				updateSortCode(estimateMainSortCode02LookupDataService, {lookupType: 'sortcode02'}, readData.ProjectSortCode02s);
				updateSortCode(estimateMainSortCode03LookupDataService, {lookupType: 'sortcode03'}, readData.ProjectSortCode03s);
				updateSortCode(estimateMainSortCode04LookupDataService, {lookupType: 'sortcode04'}, readData.ProjectSortCode04s);
				updateSortCode(estimateMainSortCode05LookupDataService, {lookupType: 'sortcode05'}, readData.ProjectSortCode05s);
				updateSortCode(estimateMainSortCode06LookupDataService, {lookupType: 'sortcode06'}, readData.ProjectSortCode06s);
				updateSortCode(estimateMainSortCode07LookupDataService, {lookupType: 'sortcode07'}, readData.ProjectSortCode07s);
				updateSortCode(estimateMainSortCode08LookupDataService, {lookupType: 'sortcode08'}, readData.ProjectSortCode08s);
				updateSortCode(estimateMainSortCode09LookupDataService, {lookupType: 'sortcode09'}, readData.ProjectSortCode09s);
				updateSortCode(estimateMainSortCode10LookupDataService, {lookupType: 'sortcode10'}, readData.ProjectSortCode10s);

				$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
					basicsCostGroupAssignmentService.process(readData, serviceContainer.service, {
						mainDataName: 'LineItems',
						attachDataName: 'LineItem2CostGroups',
						dataLookupType: 'LineItem2CostGroups',
						identityGetter: function identityGetter(entity) {
							return {
								EstHeaderFk: entity.RootItemId,
								Id: entity.MainItemId
							};
						}
					});
				}]);

				serviceContainer.data.isDynamicColumnActive = readData.IsDynamicColumnActive;
				if (Object.prototype.hasOwnProperty.call(readData,'IsDynamicColumnActive') && readData.IsDynamicColumnActive === true) {
					setDynamicColumnsLayout(readData);
				}
				// if need comparison by user's setting, then compare them,
				var items = [];
				if (readData.IsNeedComparison) {
					items = compareLineItems(readData.LineItems);
				} else {
					items = readData.LineItems;
				}

				data.sortByColumn(items);

				let result = data.handleReadSucceeded(items, data);

				// load user defined column and attach data into lineitems
				let constructionsystemMainDynamicUserDefinedColumnService = $injector.get('constructionsystemMainDynamicUserDefinedColumnService');
				constructionsystemMainDynamicUserDefinedColumnService.attachDataToColumn(data.getList());

				return result;
			}

			service.onCostGroupCatalogsLoaded = new PlatformMessenger();

			service.handleOnCalculationUpdate = function handleOnCalculationUpdate(calcData) {
				serviceContainer.data.handleOnUpdateSucceeded(calcData, calcData, serviceContainer.data, true);
			};

			/* function addLocationToReadData(readData){
				var selected = parentService.getSelected();
				if(selected){
					angular.forEach(readData.LineItems,function (item) {
						if(item.PrjLocationFk == null){
							item.PrjLocationFk = selected.LocationFk;
						}
					});
				}
			} */
			function setDynamicColumnsLayout(readData) {
				var dynColumns = readData.dynamicColumns;
				var colConfigLookupData = dynColumns.DynamicColumns;
				var estLineItemConfigDetails = dynColumns.ColumnConfigDetails || [];
				var estLineItemCharacteristics = dynColumns.Characteristics || [];
				var estLineItemResources = dynColumns.lineItemsResources || [];
				var estLineItemCharacteristicsColumns = [];
				var dynamicColService = $injector.get('constructionsystemMainDynamicColumnService');

				$injector.get('constructionsystemMainConfigDetailService').setInfo({DynamicColumns: colConfigLookupData, Main: estLineItemConfigDetails});
				var estLineItemConfigDetailsColumns = _.values(dynamicColService.generateDynamicColumns(estLineItemConfigDetails));
				if (_.size(estLineItemConfigDetails) > 0) {
					dynamicColService.appendColumnData(readData.dtos, estLineItemResources, estLineItemConfigDetails);
				}

				if (_.size(estLineItemCharacteristics) > 0) {
					estimateMainCommonService.appendCharactiricColumnData(estLineItemCharacteristics, service, readData.dtos);
					estLineItemCharacteristicsColumns = estimateMainCommonService.getCharactCols(estLineItemCharacteristics);
				}

				serviceContainer.data.dynamicColumns = estLineItemConfigDetailsColumns.concat(estLineItemCharacteristicsColumns);
				dynamicColService.setDyAndCharCols(serviceContainer.data.dynamicColumns);
				service.setDynamicColumnsLayoutToGrid();
			}

			/**
			 * To compare the line item result with the old one, we will go through all the line item with the order of code.
			 * If the assign objects of the line item is the same, and also the assembly template is the same for the old and new line item, we will say it is the line items for compare.
			 * If no same line item found in old line items, it is the new one.
			 * If no same line item found in new line items it will shown as the delete one.
			 * @param lineItems The new and old line items
			 * @returns {Array} Returns compared old line items with compare flag ('new/ delete/ modified/ unmodified')
			 */
			function compareLineItems(lineItems) {
				var comparedList = [];
				var oldLineItems = _.filter(lineItems, {IsTemp: false});
				var newLineItems = _.filter(lineItems, {IsTemp: true});

				// (1) add the line items marked 'New/ Modified/ Unmodified' after comparison
				_.each(newLineItems, function (newLineItem) {
					var newItem = angular.copy(newLineItem);
					newItem.compareLineItem = null;

					var sameOldLineItems = getSameLineItems(newLineItem, newLineItems, oldLineItems);
					if (sameOldLineItems.length) {
						// (a) if has same line items, then compare them and mark them as 'Modified / Unmodified'.
						_.each(sameOldLineItems, function (sameOldItem) {
							// compare the two same line items
							if (sameOldItem.CosMatchText === newItem.CosMatchText) {
								var result = service.compareObjectProperties(newItem, sameOldItem, compareProperties);
								if (result.isEqual) {
									newItem.CompareFlag = compareFlags.unmodified;
								} else {
									newItem.CompareFlag = compareFlags.modified;
								}
								newItem.changedProperties = result.changedProperties;
								newItem.compareLineItem = sameOldItem; // for getting old resources to compare

								if (!_.some(comparedList, ['Id', newItem.Id])) {
									comparedList.push(newItem);
								}
							}

						});
					} else {
						// (b) If no same line item found in old line items, it is the new one (mark as 'New').
						newItem.CompareFlag = compareFlags.new;
						newItem.changedProperties = service.getPropertiesWithStyle(newItem, noCssStyleProperties);
						if (!_.some(comparedList, ['Id', newItem.Id])) {
							comparedList.push(newItem);
						}
					}
				});

				// (2) If no same line item found in new line items it will shown as the delete one (mark as 'Delete').
				_.each(oldLineItems, function (oldLineItem) {
					var sameNewLineItems = getSameLineItems(oldLineItem, oldLineItems, newLineItems);
					if (!sameNewLineItems.length) {
						var oldItem = angular.copy(oldLineItem);
						oldItem.CompareFlag = compareFlags.delete;
						oldItem.changedProperties = service.getPropertiesWithStyle(oldItem, noCssStyleProperties);

						if (!_.some(comparedList, ['Id', oldItem.Id])) {
							comparedList.push(oldItem);
						}
					}
				});

				return comparedList;
			}

			service.getCompareLineItems = function () {
				return compareLineItems;
			};

			/**
			 * get the line item's same line items compared with the old line items.
			 * @param {Object} newLineItem Temp line item
			 * @param {Array} newLineItems Temp line items
			 * @param {Array} oldLineItems Standard line items
			 * @returns {Array} Returns the same standard line items after compared with temp line item.
			 */
			function getSameLineItems(newLineItem, newLineItems, oldLineItems) {
				var sameLineItems = [];
				if(_.isEmpty(newLineItem.CosMatchText)){
					return sameLineItems;
				}
				_.each(oldLineItems, function (oldLineItem) {
					if (areSameLineItems2(newLineItem, oldLineItem)) {
						sameLineItems.push(oldLineItem);
					}
				});

				return sameLineItems;

				/**
				 * @param newItem.LineItem2Objects
				 * @param newItem.EstAssemblyFk */
				// function areSameLineItems(newItem, oldItem) {
				// var isSame;
				//
				//    // 1) has same AssemblyFk or not (if has Reference Line Item, compare Reference line item's AssemblyFk)
				//    var assembly1 = newItem.EstLineItemFk ? filterParentAssembly(newLineItems, newItem) : newItem.EstAssemblyFk;
				//    var assembly2 = oldItem.EstLineItemFk ? filterParentAssembly(oldLineItems, oldItem) : oldItem.EstAssemblyFk;
				//    if (assembly1 !== assembly2) {
				//        return false;
				//    }
				//    //(2) has same LineItem2ModelObjects or not
				//    isSame = hasSameLineItem2Objects(newItem.LineItem2Objects, oldItem.LineItem2Objects);
				//
				//    return isSame;
				// }

				/**
				 * #88614 - CoS instance generated line item compare/overwritten enhancement
				 * @param newItem
				 * @param oldItem
				 * @returns {boolean}
				 */
				function areSameLineItems2(newItem, oldItem) {
					return newItem.CosMatchText === oldItem.CosMatchText;
				}

				// function filterParentAssembly(items, item) {
				// return _.result(_.find(items, {Id: item.Id}), 'EstAssemblyFk', null);
				// }

				/**
				 * compare Line item's  LineItem2Object list are equal or not.
				 */
				// function hasSameLineItem2Objects(newItems, oldItems) {
				// var result = true;
				//
				// if (_.isEmpty(newItems) && _.isEmpty(oldItems)) {
				//     result = true;
				// }
				// else if (!_.isEmpty(newItems) && !_.isEmpty(oldItems)) {
				//      if (newItems.length !== oldItems.length) {
				//          return false; //count is different
				//      } else {
				//        for (var i = 0; i < newItems.length; i++) {
				//            if ((newItems[i].MdlModelFk !== oldItems[i].MdlModelFk) || (newItems[i].MdlObjectFk !== oldItems[i].MdlObjectFk)) {
				//                 return false; //object is different
				//            }
				//         }
				//      }
				//    }
				//    else {
				//       result = false;
				//    }
				//
				//   return result;
				// }
			}

			// service.onCostGroupCatalogsLoaded = new PlatformMessenger();

			service.setGridId = function (gridId) {
				parentContainerGridId = gridId;
			};
			service.setOnBeforeFunction = function (onBefore) {
				onBeforeEditCell = onBefore;
			};

			// eslint-disable-next-line no-unused-vars
			function resetWatchers() {

				if (parentContainerGridId && angular.isFunction(onBeforeEditCell)) {
					platformGridAPI.events.unregister(parentContainerGridId, 'onBeforeEditCell', onBeforeEditCell);

					platformGridAPI.events.register(parentContainerGridId, 'onBeforeEditCell', onBeforeEditCell);
				}
			}

			// eslint-disable-next-line no-unused-vars
			function getLineItemSelectedItemsToCalculate(entity, field, value, isFromBulkEditor) {
				if (service.isCalculateInProcess) {
					return serviceContainer.data.lineItemsCalculatePromise;
				} else {
					service.isCalculateInProcess = true;

					// Lock container while it calculating
					$injector.get('estimateMainDynamicConfigurationService').showLoadingOverlay();

					// Update fields and then send to server
					// var currentSelectedLineItem = service.getSelected();
					var currentSelectedLineItems = service.getSelectedEntities();

					// Single
					// currentSelectedLineItem[field] = value;

					_.forEach(currentSelectedLineItems, function (item) {
						item[field] = value;
					});

					var postData = {
						LineItemCreationData: {
							// SelectedItem: service.getSelected(),
							SelectedItems: currentSelectedLineItems,
							ProjectId: service.getSelectedProjectId(),
							EstHeaderFk: service.getSelectedEstHeaderId()
						}
					};

					serviceContainer.data.lineItemsCalculatePromise = calculateLineItemAndResource(postData, isFromBulkEditor);
					return serviceContainer.data.lineItemsCalculatePromise;
				}
			}

			function calculateLineItemAndResource(postData) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/resolvecalculationlineitem', postData).then(function (response) {

					var lineItemsCalculatedResolved = response.data.lineItemsUpdated || [];
					var lineItems = service.getList();
					// var currentSelectedLineItem = service.getSelected();
					// eslint-disable-next-line no-unused-vars
					var currentSelectedLineItems = angular.copy(service.getSelectedEntities());

					var processList = function processList(items, callBack) {
						_.forEach(items, function (item) {
							if (callBack) {
								callBack(item);
							}
						});
					};

					processList(lineItemsCalculatedResolved, function (item) {
						// platformDataServiceDataProcessorExtension.doProcessItem(item, data);

						var itemToUpdate = _.find(lineItems, {'Id': item.Id});
						if (itemToUpdate) {
							item.ProjectName = itemToUpdate.ProjectName;
							item.ProjectNo = itemToUpdate.ProjectNo;
							item.EstimationCode = itemToUpdate.EstimationCode;
							item.EstimationDescription = itemToUpdate.EstimationDescription;

							angular.extend(itemToUpdate, item);

							// $injector.get('estimateMainLineItemDetailService').valueChangeCallBack(itemToUpdate, field, value);
						}
					});

					// Update recalculated lineitem and resoruce user defined column value
					if(response && response.data && angular.isArray(response.data.UserDefinedcolsOfLineItemModified)){
						$injector.get('constructionsystemMainDynamicUserDefinedColumnService').attachUpdatedValueToColumn(lineItems, response.data.UserDefinedcolsOfLineItemModified, true);
					}

					// Refresh the line item grid and load resources
					// serviceContainer.data.listLoaded.fire();
					service.gridRefresh();

					// Highlight is gone but
					// serviceContainer.Data.selectedItem is kept, so we just highlight it instead of deselect and select  service.deselect({}).then(function(){ service.select(resource); })

					// reload resources
					var resourceContainerGridId = '51543C12BB2D4888BC039A5958FF8B96';
					if (platformGridAPI.grids.exist(resourceContainerGridId)) {
						let constructionsystemMainResourceDataService = $injector.get('constructionsystemMainResourceDataService');
						constructionsystemMainResourceDataService.load().then(function(){
							let resList = constructionsystemMainResourceDataService.getList();
							if(resList && resList.length > 0) {
								let constructionsystemMainResourceDynamicUserDefinedColumnService = $injector.get('constructionsystemMainResourceDynamicUserDefinedColumnService');
								if(response && response.data && angular.isArray(response.data.UserDefinedcolsOfResourceModified)){
									constructionsystemMainResourceDynamicUserDefinedColumnService.updateValueList(resList, response.data.UserDefinedcolsOfResourceModified);
									constructionsystemMainResourceDynamicUserDefinedColumnService.calculateResources(selectedLineItem, resList);
								}
							}
						});
					}

					// Unlock container when calculation is done
					$injector.get('estimateMainDynamicConfigurationService').hideLoadingOverlay();

					service.isCalculateInProcess = false;
				}, function () {
					service.isCalculateInProcess = false;
					return [];
				});
			}

			// eslint-disable-next-line no-unused-vars
			function resourceReadFunction(data, readData, onReadSucceeded) {
				var httpReadLineItemPromise = $http({
					url: serviceOptions.flatRootItem.httpRead.route + serviceOptions.flatRootItem.httpRead.endRead,
					method: serviceOptions.flatRootItem.httpRead.usePostForRead ? 'POST' : 'GET',
					data: readData
				});
				var promises = [];
				// 1. Set estimate default settings
				promises.push(setEstDefaultSettings(readData));
				// 2. Retrieve estimate line items
				promises.push(httpReadLineItemPromise);

				return $q.all(promises).then(function (response) {
					var responseEstHeader = response[0];
					var responseLineItem = response[1];

					var responseEstHeaderData = responseEstHeader ? responseEstHeader.data : {};
					var responseLineItemData = responseLineItem ? responseLineItem.data : {};

					handleBeforeEstHeaderResponse(responseEstHeaderData);
					handleBeforeLineItemResponse(responseLineItemData);

					onReadSucceeded(responseLineItemData, data);
				});
			}

			function setEstDefaultSettings(readData) {

				if (Object.prototype.hasOwnProperty.call(readData,'isFromSideBar')) {
					// From sidebar
					return loadPermissionByEstHeader(readData);

				}
			}

			function loadPermissionByEstHeader(readData) {
				setDoRefreshLS(true);
				var estHeaderId = service.getSelectedEstHeaderId();
				var gridIdLineItem = 'efec989037bc431187bf166fc31666a0';

				// 1. It is called from side bar favorites estimate selection
				if (readData) {
					if (Object.prototype.hasOwnProperty.call(readData,'furtherFilters')) {
						var estHeaderFilter = _.find(readData.furtherFilters, {Token: 'EST_HEADER'});
						estHeaderId = estHeaderFilter ? estHeaderFilter.Value : -1;
					}
				}

				if (estHeaderId < 0) {
					// 2. This is called from estimate page initialization and refresh triggered
					var cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					var estHeaderContext = _.find(cloudDesktopPinningContextService.getContext(), {token: moduleName});
					estHeaderId = estHeaderContext ? estHeaderContext.id : -1;
				}

				if (estHeaderId < 0) { // multiple headers
					return $q.when();
				}

				var promiseSetDefault = function promiseSetDefault(estHeaderId) {
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'estimate/project/getestimatebyid?estHeaderFk=' + estHeaderId).then(function (response) {
						var estDefaultSettings = response.data;

						// 1.
						// service.setSidebarNFavInfo(readData);
						// Permission
						var isHeaderStatusReadOnly = estDefaultSettings.IsHeaderStatusReadOnly;
						var permissionFlag = isHeaderStatusReadOnly ? permissions.read : false;
						isReadOnlyService = !!isHeaderStatusReadOnly;

						// TODO：Walt
						platformPermissionService.restrict(gridIdLineItem, permissionFlag);
						toggleSideBarWizard(isReadOnlyService);

						defer.resolve(response);
					});
					return defer.promise;
				};

				// When navigating to another estimate from sidebar favorites, we need to re-set estimate default settings,
				return promiseSetDefault(estHeaderId);
			}

			function setDoRefreshLS(value) {
				isDoRefreshLD = value;
			}

			// eslint-disable-next-line no-unused-vars
			function getDoRefreshLS() {
				return isDoRefreshLD;
			}

			function handleBeforeEstHeaderResponse() {
				// Add logic here
			}

			function handleBeforeLineItemResponse(data) {
				// Add logic here
				var estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
				// var dynamicColService = $injector.get('estimateMainDynamicColumnService');

				// serviceContainer.data.isDynamicColumnActive = data.IsDynamicColumnActive;
				var dynCols = [];
				// 1. Estimate configuration details
				var estimateMainConfigDetailService = $injector.get('estimateMainConfigDetailService');
				// Set ColumnIds lookup data to generate dynamic column in Line Items grid
				// estimateMainConfigDetailService.setInfo({ DynamicColumns: data.dynamicColumns.DynamicColumns });
				estimateMainConfigDetailService.setInfo({DynamicColumns: data.dynamicColumns.DynamicColumns});

				if (Object.prototype.hasOwnProperty.call(data,'isEstDynamicColumnActive') && data.isEstDynamicColumnActive === true) {
					// Set to cache
					estimateMainConfigDetailService.setInfo({Main: data.dynamicColumns.ColumnConfigDetails});

					var estConfigColumns = getEstDynamicColumns(data.dynamicColumns);
					estMainStandardDynamicService.attachData({estConfig: estConfigColumns});
					dynCols = dynCols.concat(estConfigColumns);

				}
				// 2. Characteristics columns to add
				var estCharacteristicsColumns = getDynamicColumnsLayout(data.dynamicColumns);
				estMainStandardDynamicService.attachData({estCharacteristics: estCharacteristicsColumns});
				dynCols = dynCols.concat(estCharacteristicsColumns);

				// 3 cost group column
				var costGroupColumns = $injector.get('basicsCostGroupAssignmentService').createCostGroupColumns(data.CostGroupCats, false);
				estMainStandardDynamicService.attachData({costGroup: costGroupColumns});
				dynCols = dynCols.concat(costGroupColumns);

				// 4 quantity dynamic columns
				service.setDynamicQuantityColumns(data.dtos);
				var quantityTypeColumns = $injector.get('estimateMainDynamicQuantityColumnService').getDynamicQuantityColumns();
				estMainStandardDynamicService.attachData({quantityType: quantityTypeColumns});
				dynCols = dynCols.concat(quantityTypeColumns);

				// Update grid layout if there are dynamic columns
				if (dynCols.length > 0) {
					// Gather all the columns
					serviceContainer.data.dynamicColumns = dynCols; // dynamicColService.getStaticColumns().concat(dynCols);
					// serviceContainer.data.dynamicColumns = serviceContainer.data.dynamicColumns.concat(costGroupColumns);

					// Finally
					// Set all columns to Line Items grid layout
					// setDynamicColumnsLayoutToGrid(serviceContainer.data.dynamicColumns);
					estMainStandardDynamicService.fireRefreshConfigLayout();

					// TODO-VICTOR: Update UI configuration ONLY IF we have dynamic columns
					// var uiStandardService = $injector.get('estimateMainStandardConfigurationDynamicService');
					// uiStandardService.setDynamicColumns(dynCols);
				}

				// TODO-VICTOR:Add CostGroup Validation
				var validationService = $injector.get('estimateMainValidationService');
				_.forEach(_.filter(costGroupColumns, {bulkSupport: true}), function (costGroup) {
					validationService['validate' + costGroup.field] = validationService['validate' + costGroup.field + 'ForBulkConfig'] = function (entity, value, field, isBulkEditor) {
						if (isBulkEditor) {
							entity[field] = value;
							service.costGroupService.createCostGroup2Save(entity, costGroup);
						}
						return true;
					};
				});
			}

			function toggleSideBarWizard(isDisable) {
				var sideBarService = $injector.get('cloudDesktopSidebarService');
				var sideBarId, sideBarItem;
				if (sideBarService.getSidebarIds() && sideBarService.getSidebarIds().newWizards) {
					sideBarId = sideBarService.getSidebarIds().newWizards;
					sideBarItem = _.find(sideBarService.commandBarDeclaration.items, {id: '#' + sideBarId});
					if (sideBarItem) {
						sideBarItem.hideItem = isDisable;
						sideBarItem.isDisabled = function () {
							return isDisable;
						};
						if (!isDisable && sideBarService.scope && !sideBarService.scope.pinned) {
							sideBarItem.fnWrapper(sideBarId);
						}
					}
				}
			}

			// Only get est config detail columns
			function getEstDynamicColumns(dynamicColumns) {
				var dynamicColService = $injector.get('constructionsystemMainDynamicColumnService');

				// Estimate configuration - column configuration details (which will be added to Line Items)
				var estLineItemConfigDetails = dynamicColumns.ColumnConfigDetails || [];

				// Get estimate column config columns
				var estLineItemConfigDetailsColumns = _.values(dynamicColService.generateDynamicColumns(estLineItemConfigDetails));

				// return serviceContainer.data.dynamicColumns;
				return angular.copy(estLineItemConfigDetailsColumns);
			}

			function getDynamicColumnsLayout(dynamicColumns) {
				// Estimate line items characteristics
				var estLineItemCharacteristics = dynamicColumns.Characteristics || [];

				// Get characteristics line items columns
				var estLineItemCharacteristicsColumns = [];
				if (_.size(estLineItemCharacteristics) > 0) {
					estLineItemCharacteristicsColumns = estimateMainCommonService.getCharactCols(estLineItemCharacteristics);
				}

				return angular.copy(estLineItemCharacteristicsColumns);
			}

			function getSelectedProjectInfo() {
				return $injector.get('constructionSystemMainInstanceService').getSelectedProjectInfo();
			}

			// eslint-disable-next-line no-unused-vars
			function setSelectedProjectInfo(projectEntity) {
				selectedProjectInfo = {
					ProjectNo: projectEntity.ProjectNo,
					ProjectName: projectEntity.ProjectName,
					ProjectId: projectEntity.Id,
					ProjectCurrency: projectEntity.CurrencyFk,
					PrjCalendarId: projectEntity.CalendarFk
				};
			}

			// eslint-disable-next-line no-unused-vars
			function setSelectedLineItem(selectedLineItem) {
				if (selectedLineItem && selectedLineItem.Id) {
					serviceContainer.data.selectionAfterSort.fire(selectedLineItem);
				}
			}

			return service;
		}
	]);
})(angular);
