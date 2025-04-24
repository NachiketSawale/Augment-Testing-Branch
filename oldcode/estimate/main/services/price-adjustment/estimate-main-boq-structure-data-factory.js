(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/* global Platform */

	/**
	 * @ngdoc service
	 * @name estimate.main.estimateMainBoqStructureDataFactory
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('estimateMainBoqStructureDataFactory', ['_','globals','$injector', 'PlatformMessenger', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'boqMainImageProcessor', 'lookupZeroToNullProcessor',
		'estimateMainCreationService', 'estimateMainFilterService', 'estimateMainService', 'estimateMainFilterCommon', 'estMainRuleParamIconProcess', 'boqMainCommonService',
		'boqMainItemTypes', 'boqMainItemTypes2',
		function (_,globals, $injector, PlatformMessenger, platformDataServiceFactory, ServiceDataProcessArraysExtension, boqMainImageProcessor, lookupZeroToNullProcessor,
			estimateMainCreationService, estimateMainFilterService, estimateMainService, estimateMainFilterCommon, estMainRuleParamIconProcess, boqMainCommonService,
			boqMainItemTypes, boqMainItemTypes2) {

			function createEstMainBoqSimpleDataService(serviceName,serviceOption) {
				let projectId = estimateMainService.getSelectedProjectId();
				let isReadData = false; // already send xhr to service
				let service = {};
				let lineItemFk;
				let boqServiceOption = {
					hierarchicalRootItem: {
						module: moduleName,
						serviceName: serviceName,
						httpRead: {
							route: globals.webApiBaseUrl + 'boq/project/',
							endRead: 'getboqcompositelist',
							initReadData: function (readData) {
								let projectId = estimateMainService.getSelectedProjectId();
								if (projectId) {
									readData.filter = '?projectId=' + projectId;
								}
								isReadData = true; // mark sended xhr to service
								return readData;
							}
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitem/'
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor, lookupZeroToNullProcessor, estMainRuleParamIconProcess],
						useItemFilter: true,
						presenter: {
							tree: {
								parentProp: 'BoqItemFk',
								childProp: 'BoqItems',
								incorporateDataRead: function (returnValue, data) {

									if (!returnValue) {
										return data.handleReadSucceeded([], data);
									}

									service.setBoqHeaderEntities([]);
									let readData = returnValue.dtos;
									if (returnValue.BoqHeaderEntities) {
										service.setBoqHeaderEntities(returnValue.BoqHeaderEntities);
									}

									if (readData === null) {
										return data.handleReadSucceeded([], data);
									} else {
										let boqList = [];
										$injector.get('cloudCommonGridService').flatten(readData, boqList, 'BoqItems');
										_.forEach(boqList, function (boqItem) {
											boqItem.DeltaUnit = boqItem.Delta / boqItem.Quantity;
										});

										// add virtual root item containing all boqs
										let vRoot = {
											Id: -1,
											BoqItems: readData,
											BoqItemFk: null,
											BoqHeaderFk: null,
											HasChildren: readData.length > 0,
											image: 'ico-folder-estimate'
										};
										let estHeader = estimateMainService.getSelectedEstHeaderItem();
										if (estHeader) {
											vRoot.Reference = estHeader.Code;
											vRoot.BriefInfo = {
												Description: estHeader.DescriptionInfo.Description,
												Translated: estHeader.DescriptionInfo.Translated
											};
											vRoot.EstHeaderFk = estHeader.Id;
											vRoot.IsRoot = true;
										}

										$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
											basicsCostGroupAssignmentService.process(returnValue, service, {
												mainDataName: 'dtos',
												attachDataName: 'ProjectBoQ2CostGroups',
												dataLookupType: 'ProjectBoQ2CostGroups',
												isTreeStructure: true,
												isReadonly: true,
												childrenName: 'BoqItems',
												identityGetter: function identityGetter(entity) {
													return {
														BoqHeaderFk: entity.RootItemId,
														Id: entity.MainItemId
													};
												}
											});
										}]);
										estimateMainCreationService.removeCreationProcessor('estimateMainPriceAdjustmentController');
										isReadData = false; // mark done xhr

										let _dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
										if (_dynamicUserDefinedColumnsService && _.isFunction(_dynamicUserDefinedColumnsService.attachDataToColumn)) {
											let boqList = [];
											$injector.get('cloudCommonGridService').flatten(readData, boqList, 'BoqItems');
											_dynamicUserDefinedColumnsService.attachDataToColumn(boqList);
										}
										data.handleReadSucceeded([vRoot], data);
										if (estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission()) {
											if (data.itemList.length > 0) {
												_.forEach(data.itemList, function (item) {
													$injector.get('platformRuntimeDataService').readonly(item, [{field: 'Rule', readonly: false}, {field: 'Param', readonly: false}]);
												});
											}
										}
										return data.itemList;

									}
								}
							}
						},
						entityRole: {
							root: {
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								codeField: 'Reference',
								descField: 'BriefInfo.Translated',
								itemName: 'EstBoq',
								moduleName: 'Estimate Main',
								handleUpdateDone: function (updateData, response) {
									updateData.MainItemId = updateData.MainItemId < 0 ? null : updateData.MainItemId;
									estimateMainService.updateList(updateData, response);
								}
							}
						},
						actions: {} // no create/delete actions
					}
				};
				if(serviceOption) {
					_.extend(boqServiceOption.hierarchicalRootItem, serviceOption);
				}
				let serviceContainer = platformDataServiceFactory.createNewComplete(boqServiceOption);
				service = serviceContainer.service;

				serviceContainer.data.showHeaderAfterSelectionChanged = null;

				let allFilterIds = [];
				let boqHeaderEntities = [];
				let dynamicUserDefinedColumnsService = null;

				// serviceContainer.data.doUpdate = null;

				service.onCostGroupCatalogsLoaded = new PlatformMessenger();

				service.setFilter('projectId=' + projectId + '&filterValue=');

				// filter leading structure by line items
				estimateMainFilterService.addLeadingStructureFilterSupport(service, 'BoqItemFk');

				service.creatorItemChanged = function creatorItemChanged(e, item) {

					if (!_.isEmpty(item)) {
						estimateMainCreationService.addCreationProcessor('estimateMainPriceAdjustmentController', function (creationItem) {
							// BoqLineTypeFk, only assign:
							// Position = 0, Sub-Description = 110, Surcharge Item = 200
							if (item.BoqLineTypeFk === 0 || item.BoqLineTypeFk === 110 || item.BoqLineTypeFk === 200) {
								creationItem.BoqItemFk = item.Id;
								creationItem.BoqHeaderFk = item.BoqHeaderFk;
								creationItem.DescriptionInfo = item.BriefInfo;
								creationItem.IsIncluded = item.Included;
								// from structure
								if (!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 1) {

									if (creationItem.QtyRelFk === 1) {
										creationItem.Quantity = item.QuantityAdj;  // AQ
										creationItem.QuantityDetail = item.QuantityAdjDetail;

										creationItem.WqQuantityTarget = item.Quantity;
										creationItem.WqQuantityTargetDetail = item.QuantityDetail;
									}

									if (creationItem.QtyRelFk === 6) {
										creationItem.WqQuantityTarget = item.Quantity; // WQ
										creationItem.WqQuantityTargetDetail = item.QuantityDetail;

										creationItem.QuantityTarget = item.QuantityAdj;
										creationItem.QuantityTargetDetail = item.QuantityAdjDetail;
									}

									creationItem.BasUomTargetFk = creationItem.BasUomFk = item.BasUomFk;
									creationItem.validStructure = true;
									creationItem.QtyTakeOverStructFk = 1;

									creationItem.IsFixedPrice = item.IsFixedPrice;
								}

								creationItem.IsOptional = service.IsLineItemOptional(item);
								creationItem.IsOptionalIT = service.IsLineItemOptionalIt(item);

							} else if (!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 1) {
								creationItem.WqQuantityTarget = 1; // WQ
								creationItem.WqQuantityTargetDetail = 1;

								creationItem.Quantity = 1;  // AQ
								creationItem.QuantityDetail = 1;

							}

						});

						// focus on assembly structure, to load assembly
						let estimateMainWicRelateAssemblyService = $injector.get('estimateMainWicRelateAssemblyService');
						if (estimateMainWicRelateAssemblyService.getCurrentFilterType() === 'filterByBoQ') {
							if (item && item.Id) {
								estimateMainWicRelateAssemblyService.load();
								// $injector.get('estimateMainWicRelateAssemblyService').activateStrLayout();
							} else {
								estimateMainWicRelateAssemblyService.updateList([]);
							}
						}

					} else {
						estimateMainCreationService.removeCreationProcessor('estimateMainPriceAdjustmentController');
					}
				};

				service.getDynamicUserDefinedColumnsService = function () {
					return dynamicUserDefinedColumnsService;
				};

				service.setDynamicUserDefinedColumnsService = function (value) {
					dynamicUserDefinedColumnsService = value;
				};

				service.setBoqHeaderEntities = function setBoqHeaderEntities(value) {
					boqHeaderEntities = value;
				};

				service.getBoqHeaderEntities = function getBoqHeaderEntities() {
					return boqHeaderEntities;
				};

				service.filterBoqItem = new Platform.Messenger();
				service.registerFilterBoqItem = function (callBackFn) {
					service.filterBoqItem.register(callBackFn);
				};
				service.unregisterFilterBoqItem = function (callBackFn) {
					service.filterBoqItem.unregister(callBackFn);
				};

				service.markersChanged = function markersChanged(itemList) {

					let filterKey = 'PRICE_ADJUSTMENT';

					if (_.isArray(itemList) && _.size(itemList) > 0) {
						allFilterIds = [];

						// get all child boqs (for each item)
						_.each(itemList, function (item) {
							lineItemFk = item.BoqLineTypeFk;

							let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'BoqItems'), 'Id');
							allFilterIds = allFilterIds.concat(Ids);
						});
						estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
						estimateMainFilterService.addFilter('estimateMainPriceAdjustmentController', service, function (lineItem) {
							return allFilterIds.indexOf(lineItem.BoqItemFk) >= 0;
						}, {id: filterKey, iconClass: 'tlb-icons ico-filter-boq', captionId: 'filterBoq'}, 'BoqItemFk');

					} else {
						estimateMainFilterService.setFilterIds(filterKey, []);
						estimateMainFilterService.removeFilter('estimateMainPriceAdjustmentController');
					}

					if(service.updateFilterTotalData) {
						service.updateFilterTotalData(itemList);
					}

					service.filterBoqItem.fire();
				};

				service.getLineItem = function () {
					return lineItemFk;
				};

				serviceContainer.data.provideUpdateData = function (updateData) {
					if (updateData && !updateData.MainItemId) {
						updateData.MainItemId = service.getIfSelectedIdElse(-1);
					}
					return estimateMainService.getUpdateData(updateData);
				};

				service.loadBoq = function (isFromNavigator) {
					// if project id change, then reload leading structure
					let boqList = service.getList();
					// go to estimate or side bar favorites
					let isDoRefresh = estimateMainService.getDoRefreshLS();
					if (projectId !== estimateMainService.getSelectedProjectId() || boqList.length <= 0 || isDoRefresh) {
						projectId = estimateMainService.getSelectedProjectId();
						service.setFilter('projectId=' + projectId + '&filterValue=');
						if (projectId && !isReadData) {
							service.load();
							estimateMainService.setDoRefreshLS(false);
						}
					} else {
						let rootItem = _.find(boqList, {IsRoot: true});
						if (rootItem) {
							let estHeader = estimateMainService.getSelectedEstHeaderItem();
							if (estHeader) {
								rootItem.Reference = estHeader.Code;
								rootItem.BriefInfo = {
									Description: estHeader.DescriptionInfo.Description,
									Translated: estHeader.DescriptionInfo.Translated
								};
								rootItem.EstHeaderFk = estHeader.Id;
							}
							service.fireItemModified(rootItem);
						}

						if (isFromNavigator === 'isForNagvitor') {
							service.load();
						}

					}
				};

				service.clearSelectedItem = function () {
					serviceContainer.data.selectedItem = null;
				};

				/**
				 * @ngdoc function
				 * @name addList
				 * @function
				 * @methodOf estimateMainBoqService
				 * @description
				 * @param {Array} data items to be added
				 *
				 */
				service.addList = function addList(data) {
					let list = serviceContainer.data.itemList;
					serviceContainer.data.itemList = !list || !list.length ? [] : list;

					if (data && data.length) {
						angular.forEach(data, function (d) {
							let item = _.find(list, {Id: d.Id});
							if (item) {
								angular.extend(list[list.indexOf(item)], d);
							} else {
								serviceContainer.data.itemList.push(d);
							}
						});
					}
				};

				service.isItemFilterEnabled = function () {
					$injector.get('estimateMainWicRelateAssemblyService').setList([]);
					return serviceContainer.data.itemFilterEnabled;
				};

				// when do this action, will reload data when 'onContextUpdated' event trigger
				service.resetProjectId = function () {
					projectId = null;
				};

				service.getCallingContextType = function () {
					return 'Estimate';
				};

				service.registerLookupFilters = function () {

				};

				service.getCallingContext = function () {
					return null;
				};

				service.isCrbBoq = function () {
					let boqStructureServiceState = {};
					let boqStructureService = $injector.get('boqMainBoqStructureServiceFactory').createBoqStructureService(boqStructureServiceState);
					return $injector.get('boqMainCommonService').isCrbBoqType(boqStructureService.getStructure());
				};

				service.getSelectedProjectId = function () {
					return projectId;
				};

				service.IsLineItemOptional = function (boqItem) {
					return angular.isDefined(boqItem) && boqItem !== null &&
						(boqMainCommonService.isItem(boqItem) || boqMainCommonService.isSurchargeItem(boqItem)) &&
						(boqItem.BasItemTypeFk === boqMainItemTypes.optionalWithIT ||
							boqItem.BasItemTypeFk === boqMainItemTypes.optionalWithoutIT ||
							(boqItem.BasItemTypeFk === boqMainItemTypes.standard &&
								boqItem.BasItemType2Fk !== boqMainItemTypes2.normal &&
								boqItem.BasItemType2Fk !== boqMainItemTypes2.base &&
								boqItem.BasItemType2Fk !== boqMainItemTypes2.alternativeAwarded));
				};

				service.IsLineItemOptionalIt = function (boqItem) {
					return angular.isDefined(boqItem) && boqItem !== null &&
						(boqMainCommonService.isItem(boqItem) || boqMainCommonService.isSurchargeItem(boqItem)) &&
						(boqItem.BasItemTypeFk === boqMainItemTypes.optionalWithIT) &&
						(boqItem.BasItemType2Fk === boqMainItemTypes2.normal ||
							boqItem.BasItemType2Fk === boqMainItemTypes2.base ||
							boqItem.BasItemType2Fk === boqMainItemTypes2.alternativeAwarded);
				};

				return service;
			}

			return {
				getService: createEstMainBoqSimpleDataService
			};

		}]);
})();