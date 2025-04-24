/**
 * Created by wed on 12/13/2018.
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationItemDataServiceFactory', [
		'_',
		'platformDataServiceFactory',
		'platformDataServiceDataProcessorExtension',
		'platformSchemaService',
		'platformRuntimeDataService',
		'ServiceDataProcessDatesExtension',
		'basicsLookupdataLookupDescriptorService',
		'$translate',
		'PlatformMessenger',
		'$timeout',
		'commonBusinessPartnerEvaluationServiceCache',
		function (_,
			platformDataServiceFactory,
			platformDataServiceDataProcessorExtension,
			platformSchemaService,
			platformRuntimeDataService,
			ServiceDataProcessDatesExtension,
			basicsLookupdataLookupDescriptorService,
			$translate,
			PlatformMessenger,
			$timeout,
			serviceCache) {

			function createService(serviceDescriptor, detailEvaluationService, groupDataService, options) {

				if (serviceCache.hasService(serviceCache.serviceTypes.ITEM_DATA, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.ITEM_DATA, serviceDescriptor);
				}
				var hasWrite = true;
				var hasRead = true;
				var createOptions = angular.merge({
						moduleName: moduleName
					}, options),
					serviceOption = {
						flatLeafItem: {
							module: angular.module(createOptions.moduleName),
							serviceName: serviceCache.getServiceName(serviceCache.serviceTypes.ITEM_DATA, serviceDescriptor),
							httpCRUD: {
								route: globals.webApiBaseUrl + 'businesspartner/main/evaluationitemdata/',
								endRead: 'listitemdata',
								usePostForRead: true,
								initReadData: initReadData
							},
							presenter: {
								list: {
									initCreationData: initCreationData,
									incorporateDataRead: incorporateDataRead
								}
							},
							entityRole: {
								leaf: {
									itemName: 'EvaluationItemData',
									parentService: groupDataService
								}
							},
							actions: {
								'delete': false,
								'create': false
							}
						}
					};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;
				var data = serviceContainer.data;

				data.markItemAsModified = markItemAsModified;

				angular.extend(service, {
					isMultiSelect: true,
					pointsChangedMessage: new PlatformMessenger(),
					clearAllData: clearAllData,
					markItemAsModified: function doMarkItemAsModified(item) {
						markItemAsModified(item, data);
					},
					markCurrentItemAsModified: markCurrentItemAsModified
				});

				Object.defineProperties(service, {
					'hasWrite': {
						get: function () {
							return hasWrite;
						},
						set: function (value) {
							hasWrite = value;
						},
						enumerable: true
					},
					'hasRead': {
						get: function () {
							return hasRead;
						},
						set: function (value) {
							hasRead = value;
						},
						enumerable: true
					}
				});

				service.pointsChangedMessage.register(groupDataService.changePointHandler);
				groupDataService.registerListLoaded(function () {
					clearAllData();
					service.gridRefresh();
				});

				var baseLoadSubItemList = serviceContainer.service.loadSubItemList;
				serviceContainer.service.loadSubItemList = function loadSubItemList() {
					if (hasRead) {
						baseLoadSubItemList();
					}
				};

				function clearAllData() {
					data.currentParentItem = null;
					data.itemList.length = 0;
					data.selectedItem = null;
					data.cache = {};
				}

				function initReadData(readData, data) {
					var currentParentItem = data.currentParentItem;
					if (currentParentItem.IsEvaluationSubGroupData) {
						readData.EvaluationSubGroupDataId = currentParentItem.Id;
						/** @namespace currentParentItem.EvaluationGroupFk */
						readData.EvaluationSubGroupId = currentParentItem.EvaluationGroupFk;
					}
					return readData;
				}

				function initCreationData(creationData, data) {
					var currentParentItem = data.currentParentItem;
					if (currentParentItem) {
						creationData.EvaluationSubGroupDataId = currentParentItem.Id;
						/** @namespace currentParentItem.EvaluationSubGroupFk */
						creationData.EvaluationSubGroupId = currentParentItem.EvaluationSubGroupFk;
					}
				}

				function incorporateDataRead(readItems, data) {
					data.itemList = [];
					var dataRead;

					if (readItems !== null && readItems.EvaluationItem !== null) {
						_.forEach(readItems.EvaluationItem, function (item) { // format the string
							item.Description = _.escape(item.Description);
						});
					}

					readItems = readItems || {};
					var localEvaluationData;
					if (detailEvaluationService.view && detailEvaluationService.view.getDataFromLocal) {
						// localEvaluationData = detailEvaluationService.collectLocalEvaluationData.fire();
						localEvaluationData = detailEvaluationService.collectLocalEvaluationDataScreen.fire();
						if (localEvaluationData && localEvaluationData.EvaluationGroupDataToSave) {
							var parentItem = groupDataService.getSelected();
							if (parentItem) {
								var temp = _.find(localEvaluationData.EvaluationGroupDataToSave, {MainItemId: parentItem.Id});
								/** @namespace temp.EvaluationItemDataToSave */
								if (temp && _.isArray(temp.EvaluationItemDataToSave) && temp.EvaluationItemDataToSave.length > 0) {
									_.forEach(readItems.dtos, function (item) {
										var existed = _.find(temp.EvaluationItemDataToSave, {Id: item.Id});
										if (existed) {
											Object.assign(item, existed);
										}
									});
								}
							}
						}
					}

					if (readItems && Object.prototype.hasOwnProperty.call(readItems, 'dtos')) {

						_.forEach(readItems.dtos, function (item) {
							processItemReadonly(item, data);
						});
						$timeout(function () {
							basicsLookupdataLookupDescriptorService.attachData(readItems);
							dataRead = data.handleReadSucceeded(readItems.dtos || [], data);
							// /** @namespace readItems.isCreate */
							// if (readItems.isCreate && Array.isArray(readItems.dtos)) {
							// readItems.dtos.forEach(function (item) { data.markItemAsModified(item, data); });
							// }
						}, 50);
					} else {
						_.forEach(readItems, function (item) {
							processItemReadonly(item, data);
						});
						dataRead = data.handleReadSucceeded(readItems || [], data);
					}
					return dataRead;
				}

				function processItemReadonly(newItem, data) {
					platformRuntimeDataService.readonly(newItem, !hasWrite);
					if (!newItem.__rt$data || !newItem.__rt$data.readonly) {
						newItem.__rt$data = newItem.__rt$data || {};
						newItem.__rt$data.readonly = [];
					} else {
						newItem.__rt$data.readonly = [];
					}
					if (!hasWrite) {
						return;
					}

					var fields = [];
					// var hasWriteFromHierarchy = data.parentService ? data.parentService.getHasWriteFromHierarchy() : true;
					var parentService = data.parentService ? data.parentService.parentService() : null;
					var parentSelected = parentService ? parentService.getSelected() : null;
					if (parentSelected) {
						var evaluationStatus = detailEvaluationService.getEvaluationStatus();
						var status = _.find(evaluationStatus, {'Id': parentSelected.EvalStatusFk});
						fields = [{
							'field': 'IsTicked',
							'readonly': true
						}, {
							'field': 'Remark',
							'readonly': true
						}];
						if (status && status.Readonly) {
							platformRuntimeDataService.readonly(newItem, fields);
							return;
						}

						// set readonly by Evaluation IsReadonly
						if (parentSelected.IsReadonly) {
							platformRuntimeDataService.readonly(newItem, fields);
							return;
						}
					}
				}

				function markItemAsModified(item, data) {
					var modifiedDataCache = detailEvaluationService.getModifiedDataCache();
					var parentItem = groupDataService.getSelected();
					if (parentItem) {
						var propName = groupDataService.itemName + 'ToSave';
						if (modifiedDataCache[propName]) {
							var parentExisted = _.find(modifiedDataCache[propName], {MainItemId: parentItem.Id});
							if (parentExisted) {
								if (parentExisted[data.itemName + 'ToSave']) {
									var itemExisted = _.find(parentExisted[data.itemName + 'ToSave'], {Id: item.Id});
									if (!itemExisted) {
										parentExisted[data.itemName + 'ToSave'].push(item);
										modifiedDataCache.EntitiesCount += 1;
									}
								} else {
									parentExisted[data.itemName + 'ToSave'] = [item];
									modifiedDataCache.EntitiesCount += 1;
								}
							} else {
								var p = {};
								p.MainItemId = parentItem.Id;
								p[data.itemName + 'ToSave'] = [item];
								modifiedDataCache[propName].push(p);
								modifiedDataCache.EntitiesCount += 1;
							}
						} else {
							var toAdd = {};
							toAdd.MainItemId = parentItem.Id;
							toAdd[data.itemName + 'ToSave'] = [item];
							modifiedDataCache[propName] = [toAdd];
							modifiedDataCache.EntitiesCount += 1;
						}

						// check the subGroupData and GroupData
						var parentExistedEntity = _.find(modifiedDataCache[propName], {MainItemId: parentItem.Id});
						if (parentExistedEntity && (item.EvaluationSubGroupDataFk < 0 || groupDataService.isCreate)) {
							var evaluationGroupData = parentExistedEntity[groupDataService.itemName];
							if (!evaluationGroupData || evaluationGroupData.length <= 0) {
								parentExistedEntity[groupDataService.itemName] = parentItem;
								modifiedDataCache.EntitiesCount += 1;
							}
							if (parentItem.PId < 0 || groupDataService.isCreate) {
								var parentParentExisted = _.find(modifiedDataCache[propName], {MainItemId: parentItem.PId});
								if (!parentParentExisted || parentParentExisted.length <= 0) {
									var parentParentTree = groupDataService.getTree();
									var parentParent = _.find(parentParentTree, {Id: parentItem.PId});
									modifiedDataCache[propName].push(
										{
											MainItemId: parentItem.PId,
											EvaluationGroupData: parentParent
										}
									);
									modifiedDataCache.EntitiesCount += 1;
								}
							}
						}
					}
					data.itemModified.fire(null, item);
				}

				function markCurrentItemAsModified() {
					var item = service.getSelected();
					if (item) {
						markItemAsModified(item, data);
					}
				}

				serviceCache.setService(serviceCache.serviceTypes.ITEM_DATA, serviceDescriptor, service);

				return service;
			}

			return {
				createService: createService
			};
		}
	]);
})(angular);
