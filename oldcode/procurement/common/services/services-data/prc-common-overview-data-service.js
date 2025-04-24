/**
 *  ID MAP  1.root  2.Header Text  3.Item Text  4.Boq  5.Attachements  6.Milestones  7.Sub/Sub Relations  8 General
 *  root Id:1 (role:root)
 *       --header (Id:2 role:node)
 *          --header text   (Id:PRC_HEADER_TEXT.ID, role:leaf)
 *       --item  (Id:3 role:node)
 *          --item text (Id:PRC_ITEM_TEXT.ID,role:leaf)
 *       --boq (Id:5 role:leaf)
 *       --Attachements (Id:4 role:node)
 *          --documents (Id:PRC_DOCUMENT.ID,role:leaf) *
 *       --milestone (Id:6 role:leaf)
 *       --Sub/Sub Relations (Id:7 role:leaf)
 *       --GENERAL (Id:8 role:leaf)
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name procurementCommonOverviewDataService
	 * @function
	 *
	 * @description Provides data buffer
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonOverviewDataService',
		['platformDataServiceFactory', 'ServiceDataProcessArraysExtension',
			'procurementCommonDataImageProcessor', '$translate',
			'platformDataServiceDataProcessorExtension', 'procurementContextService',
			'basicsLookupdataLookupDescriptorService', 'platformDataServiceSelectionExtension', 'PlatformMessenger',
			'$q',
			function (dataServiceFactory, ServiceDataProcessArraysExtension,
				imageProcessor, $translate, platformDataServiceDataProcessorExtension,
				moduleContext, basicsLookupdataLookupDescriptorService, platformDataServiceSelectionExtension, PlatformMessenger,
				$q) {

				// load all text type by default.
				basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');

				/* var updated = new Messenger(); */
				function constructorFn(mainService, leadingService) {
					var overViewService;
					var services = {},
						// service configuration
						serviceOption = {
							hierarchicalLeafItem: {
								module: angular.module('procurement.common'),
								httpRead: {
									route: globals.webApiBaseUrl + 'procurement/common/overview/', usePostForRead: true,
									initReadData: function (readData) {
										var headerItem = mainService.getSelected();
										readData.mainItemId = platformDataServiceSelectionExtension.isSelection(headerItem) && headerItem.Version ? headerItem.PrcHeaderFk : 0;
										readData.mainItemIds = mainService.allMainItemToDictionary && mainService.allMainItemToDictionary();
									}
								},
								dataProcessor: [new ServiceDataProcessArraysExtension(['Children']), imageProcessor('ParentFk', function (item) {
									var headerItem = mainService.getSelected();
									if (mainService.allMainItemToDictionary && platformDataServiceSelectionExtension.isSelection(headerItem)) {
										return item.PrcHeaderFk !== headerItem.PrcHeaderFk;
									}
									return false;
								})],
								presenter: {
									tree: {
										parentProp: 'ParentFk', childProp: 'Children',
										incorporateDataRead: function incorporateDataRead(readData, data) {
											var dataRead = data.handleReadSucceeded(readData, data, true);
											var items = overViewService.getList();
											var headerItem = mainService.getSelected();
											_.forEach(items, function (item) {
												// when header is new the PrcHeaderFk will set to 0 so we want to reset it.
												// when mainservice have no record,set to zero.
												item.PrcHeaderFk = item.PrcHeaderFk || (headerItem && headerItem.PrcHeaderFk) || 0;
												if (item.ParentFk === moduleContext.overview.keys.data || item.ParentFk === 0) {
													item.Description = item.Description || $translate.instant('procurement.common.overview.' + moduleContext.overview.translation[item.IdReal]);
												}
											});
											var parentService = overViewService.parentService();
											var parent = parentService.getSelected();

											if (parent && parent.Version === 0) {
												if (doRefreshView(moduleContext.overview.keys.headerText)) {
													overViewService.gridRefresh();
												}
											} else {
												overViewService.gridRefresh();
											}

											if (overViewService.addHeaderTextItems) {
												overViewService.addHeaderTextItems.fire();
											}
											return dataRead;
										}
									}
								},
								entityRole: {
									leaf: {
										itemName: 'PrcOverview',
										parentService: leadingService || mainService,
										doesRequireLoadAlways: true
									}
								}
							}
						};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
					// when the leading service and main service are not equal
					if (leadingService && mainService !== leadingService) {
						var doBaseReadData = serviceContainer.data.doReadData;
						var loadAndUpdateOverview = function () {
							doBaseReadData(serviceContainer.data);
							serviceContainer.data.listLoaded.fire();
						};
						serviceContainer.data.doReadData = function () {
							var deffered = $q.defer();
							deffered.resolve();
							return deffered.promise;
						};
						if (mainService.loadOverview) {
							mainService.loadOverview.register(loadAndUpdateOverview);
						}
					}

					// read service from serviceContainer
					overViewService = serviceContainer.service;

					serviceContainer.service.treePresOpt = serviceContainer.data.treePresOpt;
					overViewService.canDelete = overViewService.canCreateChild = overViewService.canCreate = null;

					/**
					 * register dataService to overview for update overview display
					 * @param serviceKey  data type key
					 * @param dataService   data service
					 * @param mapper    Id,Description mapper.
					 */
					var updateDataDisplay;
					overViewService.registerDataService = function registerDataService(serviceKey, dataService, mapper) {
						mapper = mapper || function (item) {
							return {Id: item.Id, Description: item.Description};
						};

						updateDataDisplay = function updateDataDisplay() {
							if (doRefreshView(serviceKey)) {
								overViewService.gridRefresh();
							}
						};

						dataService.registerEntityCreated(updateDataDisplay);
						dataService.registerItemModified(updateDataDisplay);
						// dataService.entitiyDeleted.register(updateDataDisplay);
						dataService.registerEntityDeleted(updateDataDisplay);

						services[serviceKey] = {service: dataService, mapper: mapper};
					};

					/**
					 * refresh data display
					 */
					overViewService.refreshView = function refreshView() {
						doRefreshView(moduleContext.overview.keys.data);// refresh root item
						overViewService.gridRefresh();
					};

					overViewService.addHeaderTextItems = new PlatformMessenger();
					var getMappedChildren;

					/**
					 * refresh data display
					 * @param serviceKey
					 */
					function doRefreshView(serviceKey) { // jshint ignore: line
						var prcHeaderFk;
						if (mainService.getSelected()) {
							prcHeaderFk = mainService.getSelected().PrcHeaderFk;
						}
						var nodeItem = _.find(overViewService.getList(), {
							IdReal: serviceKey,
							PrcHeaderFk: prcHeaderFk,
							ParentFk: moduleContext.overview.keys.data
						});

						var processor = services[serviceKey];
						var hasChanges = false;

						if (_.isNil(nodeItem)) {
							return hasChanges;
						}

						// refresh root item
						if (serviceKey === 1) {
							for (var i = 2; i <= 8; i++) {
								// refresh all children of root
								var result = doRefreshView(i);
								hasChanges = hasChanges || result;
							}
							if (hasChanges) {
								nodeItem.Count = _.sumBy(nodeItem.Children, 'Count');
							}
						}
						// refresh header text, item text, documents
						else if (serviceKey === moduleContext.overview.keys.headerText ||
							serviceKey === moduleContext.overview.keys.itemText ||
							serviceKey === moduleContext.overview.keys.attachment) {
							var children = getMappedChildren(nodeItem);
							_.forEach(children, function (child) {
								var oldItem = _.find(nodeItem.Children, {Id: child.Id});
								if (!oldItem || oldItem.Description !== child.Description) {
									hasChanges = true;
								}
							});
							if (nodeItem.Count !== children.length || hasChanges) {
								nodeItem.Count = children.length;
								nodeItem.Children = children;
								nodeItem.nodeInfo = nodeItem.nodeInfo || {};
								nodeItem.nodeInfo.children = children.length > 0;
								hasChanges = true;
							}
						} else if (serviceKey === moduleContext.overview.keys.item) { // jshint ignore:line

						}
						// refresh other types
						else {
							if (processor) {
								var serviceData = processor.service.getList();
								if (!nodeItem) {
									return hasChanges;
								}
								hasChanges = nodeItem.Count !== serviceData.length;
								nodeItem.Count = serviceData.length;
							}
						}
						return hasChanges;
					}

					getMappedChildren = function (node) {
						var processor = services[node.IdReal];
						if (processor) {
							{
								var itemList = processor.service.getList();
								if (node.IdReal === moduleContext.overview.keys.itemText) {
									itemList = processor.service.getListForOverView();
								}
								var children;
								children = _.map(itemList, function (item) {
									var mapped = processor.mapper(item);
									if (mapped === null || mapped === undefined) {
										return [];
									}
									mapped.Count = 1;
									mapped.ParentFk = node.Id;
									mapped.Id = node.Id * 100 + item.Id; // for get an unique id for every sub item
									platformDataServiceDataProcessorExtension.doProcessItem(mapped, serviceContainer.data);
									return mapped;
								});
								return children;
							}
						}
						return [];
					};

					var dataProcessArraysExtension = new ServiceDataProcessArraysExtension(['Children']);
					var processItemImage = imageProcessor('ParentFk', function (item) {
						var sel = mainService.getSelected();
						if (platformDataServiceSelectionExtension.isSelection(sel) && mainService.allMainItemToDictionary) {
							return item.PrcHeaderFk !== sel.PrcHeaderFk;
						}
						return false;
					});
					var itemTranslate = function (item) {
						if (item.ParentFk === moduleContext.overview.keys.data || item.ParentFk === 0) {
							item.Description = item.Description || $translate.instant('procurement.common.overview.' + moduleContext.overview.translation[item.IdReal]);
						}
					};
					var resetTreeId = function (treeArray) {
						var rootBaseId = -1;
						_.forEach(treeArray, function (item) {
							rootBaseId += 1;
							item.Id = rootBaseId;
							var childIdIncreaseUnit = treeArray.length;
							for (var i = 0; i < item.Children.length; i++) {
								if (i === 0) {
									item.Children[i].Id = rootBaseId + childIdIncreaseUnit;
								} else {
									item.Children[i].Id = childIdIncreaseUnit + item.Children[i - 1].Id;
								}
							}
						});
					};

					overViewService.load = function load() {

					};

					overViewService.addRow = function (item) {
						if (item) {
							var itemTree = overViewService.getTree();
							item.Id = itemTree.length;
							var prcHeaderId = null;
							if (mainService.getSelected()) {
								prcHeaderId = mainService.getSelected().PrcHeaderFk;
							}
							item.PrcHeaderFk = prcHeaderId;

							processItemImage.processItem(item);
							serviceContainer.data.itemList.push(item);
							itemTranslate(item);

							_.forEach(item.Children, function (child) {
								processItemImage.processItem(child);
								dataProcessArraysExtension.processItem(child);
								child.PrcHeaderFk = prcHeaderId;
								itemTranslate(child);
								serviceContainer.data.itemList.push(child);
							});
							itemTree.push(item);
							resetTreeId(itemTree);
							serviceContainer.data.listLoaded.fire();
							updateDataDisplay();
						}
					};

					overViewService.deleteRow = function (prcHeaderFk) {
						var itemTree = overViewService.getTree();
						var itemList = serviceContainer.data.itemList;
						_.remove(itemTree, function (item) {
							return item.PrcHeaderFk === prcHeaderFk;
						});
						_.remove(itemList, function (item) {
							return item.PrcHeaderFk === prcHeaderFk;
						});
						serviceContainer.data.listLoaded.fire();
					};

					var collaseRow = function collaseRow() {
						var itemList = overViewService.getList();
						_.forEach(itemList, function (item) {
							processItemImage.processItem(item);
						});
						serviceContainer.data.listLoaded.fire();
					};
					mainService.registerSelectionChanged(collaseRow);

					return overViewService;
				}

				// service repository function
				var dataServiceRepository = {};
				return {
					/**
					 * get over view service
					 * @returns {*}
					 * @param mainService
					 * @param leadingService
					 */
					getService: function getService(mainService, leadingService) {
						var serviceName = mainService.getItemName();
						if (leadingService) {
							serviceName = mainService.getItemName() + leadingService.getItemName();
						}
						var dataService = dataServiceRepository[serviceName];
						if (!dataService) {
							dataService = constructorFn.apply(this, arguments);
							dataServiceRepository[serviceName] = dataService;
						}
						return dataService;
					}
				};
			}]);
})(angular);