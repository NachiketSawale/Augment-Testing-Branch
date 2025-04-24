/**
 * Created by wed on 12/07/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	const moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationDataServiceFactory', [
		'_',
		'$http',
		'$q',
		'cloudCommonGridService',
		'platformDataServiceSelectionExtension',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService',
		'platformDataServiceDataProcessorExtension',
		'PlatformMessenger',
		'platformModuleStateService',
		'ServiceDataProcessDatesExtension',
		'platformRuntimeDataService',
		'platformDataServiceModificationTrackingExtension',
		'platformDataServiceActionExtension',
		'commonBusinessPartnerEvaluationServiceCache',
		'platformDialogService',
		'businesspartnerEvaluationSchemaIconDataService',
		function (
			_,
			$http,
			$q,
			cloudCommonGridService,
			platformDataServiceSelectionExtension,
			platformDataServiceFactory,
			basicsLookupdataLookupDescriptorService,
			basicsLookupdataLookupFilterService,
			platformDataServiceDataProcessorExtension,
			PlatformMessenger,
			platformModuleStateService,
			ServiceDataProcessDatesExtension,
			platformRuntimeDataService,
			platformDataServiceModificationTrackingExtension,
			platformDataServiceActionExtension,
			serviceCache,
			platformDialogService,
			businesspartnerEvaluationSchemaIconDataService
		) {

			function createService(serviceDescriptor, mainService, parentService, detailService, options) {

				if (serviceCache.hasService(serviceCache.serviceTypes.EVALUATION_DATA, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.EVALUATION_DATA, serviceDescriptor);
				}

				let _searchFilter = null;
				let serviceContainer = null;
				let createOptions = angular.merge({
					moduleName: moduleName,
					itemName: 'BusinessPartnerEvaluation',
					columns: [],
					initReadData: function (readData) {
						readData.filter = '?MainItemId=' + parentService.getIfSelectedIdElse(-1);
					},
					dataProcessor: [],
					incorporateDataRead: null,
					onEvaluationChanged: null
				}, options);
				let onHandleReadSucceeded = new PlatformMessenger();
				let serviceOption = {
					hierarchicalRootItem: {
						module: angular.module(createOptions.moduleName),
						serviceName: serviceCache.getServiceName(serviceCache.serviceTypes.EVALUATION_DATA, serviceDescriptor),
						httpCRUD: {
							route: globals.webApiBaseUrl + 'businesspartner/main/evaluation/',
							initReadData: createOptions.initReadData
						},
						presenter: {
							tree: {
								parentProp: 'PId',
								childProp: 'ChildrenItem',
								incorporateDataRead: incorporateDataRead
							}
						},
						dataProcessor: createOptions.dataProcessor.concat([
							{
								processItem: processItem
							},
							new ServiceDataProcessDatesExtension(['EvaluationDate'])
						]),
						entityRole: {
							root: {
								itemName: createOptions.itemName
							}
						},
						entitySelection: {
							supportsMultiSelection: true
						},
						actions: {
							create: false,
							delete: true
						}
					}
				};
				let chartDataCache = []; // { schemaId: , schema: [], group: [] }}
				let schemaId2DiffEvalPoints = null;
				let schemaId2DiffEvalCount = null;
				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				let service = serviceContainer.service;
				let data = serviceContainer.data;

				data.usesCache = true;
				data.currentParentItem = {
					Id: serviceDescriptor
				};
				data.listLoadStarted.register(function () {
					let readData = {};
					createOptions.initReadData(readData);
					_searchFilter = readData.filter;
				});
				data.__dataCache = {
					_cache: {},
					clear: function (searchFilter) {
						if (searchFilter) {
							delete this._cache[searchFilter];
						} else {
							this._cache = {};
						}
					},
					update: function (searchFilter, items) {
						this._cache[searchFilter] = [].concat(items);
					},
					get: function (searchFilter) {
						if (angular.isDefined(this._cache[searchFilter])) {
							return {
								loadedItems: this._cache[searchFilter]
							};
						}
						return null;
					}
				};

				data.provideCacheFor = function () {
					return data.__dataCache.get(_searchFilter);
				};

				parentService.registerChildService(service);
				data.storeCacheFor = function () {
				};
				service.unloadSubEntities = function () {
				};
				service.killRunningLoad = function () {
				};
				service.loadSubItemList = function () {
				};
				angular.extend(serviceContainer.service, {
					getChartData: getChartData,
					clearDataCache: clearDataCache,
					parentId: -1,
					dataChangeMessenger: new PlatformMessenger(),
					provideUpdateData: provideUpdateData,
					mergeData: mergeData,
					mergeInUpdateData: mergeInLeafUpdateData,
					findItemToMerge: findItemToMerge,
					dataDeleted: new PlatformMessenger()
				});

				data.markItemAsModified = function markItemAsModified(item, data) {
					if (item.isCheckedChanged) { // field Checked is not the database field, don't mark it as modified.
						delete item.isCheckedChanged;
						return;
					}
					let modState = platformModuleStateService.state(service.getModule());
					let elemState = modState.modifications[data.itemName + 'ToSave'];
					if (!elemState) {
						elemState = modState.modifications[data.itemName + 'ToSave'] = [];
					}
					let existed = _.find(elemState, {MainItemId: item.Id});
					if (!existed) {
						elemState.push({
							MainItemId: item.Id,
							Evaluation: item
						});
						modState.modifications.EntitiesCount += 1;
					} else {
						if (existed.Evaluation) {
							let lockProperties = {
								__rt$data: existed.Evaluation.__rt$data,
								nodeInfo: existed.Evaluation.nodeInfo
							};
							Object.assign(existed.Evaluation, item);
							Object.assign(existed.Evaluation, lockProperties);
						}
					}
					if (mainService.hasSelection()) {
						modState.modifications.MainItemId = mainService.getSelected().Id;
					}
					data.itemModified.fire(null, item);
				};

				data.deleteEntities = (function () {
					if (createOptions.deleteImmediately && createOptions.deleteImmediately === true) {
						return deleteChildEntitiesImmediately;
					} else {
						return deleteChildEntities;
					}
				})();

				function deleteChildEntitiesImmediately(entity, data) {
					platformDialogService.showYesNoDialog('businesspartner.main.evaluationDeleteMessage', 'businesspartner.main.evaluationDeleteTitle', 'no').then(function (result) {
						if (result.yes) {
							let deleteEntity = {
								BusinessPartnerEvaluationToDelete: entity
							};
							return $http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluation/deleteevaluations', deleteEntity).then(function (response) {
								if (response.data['DeleteSuccess'] === true) {
									deleteChildEntities(entity, data);
								}
							});
						}
					});
				}

				function deleteChildEntities(entity, data) {
					if (_.isEmpty(entity)) {
						return;
					}
					// when selected Multi entities. filter the entity with deny delete status and its parent
					let evaluationStatus = basicsLookupdataLookupDescriptorService.getData('EvaluationStatus');
					let removeEntities = _.remove(entity, function (item) {
						let status = _.find(evaluationStatus, {Id: item.EvalStatusFk});
						return status && status.DenyDelete;
					});
					_.forEach(removeEntities, function (item) {
						_.remove(entity, {Id: item.PId});
					});

					let modState = platformModuleStateService.state(service.getModule());
					let elemState = modState.modifications[data.itemName + 'ToSave'];
					if (elemState) {
						for (let l = 0; l < entity.length; l++) {
							let existed = _.find(elemState, {MainItemId: entity[l].Id});
							let foundCache = _.find(chartDataCache, {schemaId: entity[l].EvaluationSchemaFk});
							if (existed) {
								_.remove(elemState, {MainItemId: entity[l].Id});
								modState.modifications.EntitiesCount -= 1;
								// remove the create cache
								_.remove(modState.modifications.CreateEntities, {MainItemId: entity[l].Id});
							}
							if (foundCache) {
								let found = foundCache.group[entity[l].Id];
								if (found) {
									delete foundCache.group[entity[l].Id];
								}
							}
							entity[l].Checked = false;
							service.dataDeleted.fire(entity[l]);
						}
					}
					let resetEvaluation = [];
					_.forEach(entity, function (item) {
						let parentEntity = _.find(data.getList(), {Id: item.PId});
						if (parentEntity && !_.find(entity, {Id: parentEntity.Id}) && parentEntity.ChildrenItem.length) {
							let children = _.filter(entity, {PId: parentEntity.Id});
							if (children && children.length === parentEntity.ChildrenItem.length) {
								entity.push(parentEntity);
							} else if (!_.find(resetEvaluation, {Id: parentEntity.Id})) {
								// recalculate the parent data points
								let points = _.meanBy(_.differenceBy(parentEntity.ChildrenItem, children, 'Id'), 'Points');
								points = Math.round(points * 100) / 100;
								if (parentEntity.Points !== points) {
									parentEntity.Points = points;
									resetEvaluation.push(parentEntity);
								}
							}
						}
					});

					return deleteSubEntities(entity, service, data, resetEvaluation);
				}

				data.doUpdate = function () {
					// Overwrite update function avoid save changed automatically.
					return $q.when(false);
				};

				data.doClearModifications = function () {
					// Overwrite function avoid clear entities from remove list.
				};

				// Clear fileds difination to avoid change module information which shows under application logo.
				data.rootOptions.codeField = null;
				data.rootOptions.descField = null;

				service.evaluationStatusChanged = function evaluationStatusChanged() {
					service.clearContent();
					service.refresh();
				};

				service.markItemAsModified = function doMarkItemAsModified(item) {
					data.markItemAsModified(item, data);
				};

				service.markCurrentItemAsModified = function doMarkCurrentItemAsModified() {
					let item = service.getSelected();
					if (item) {
						service.markItemAsModified(item);
					}
				};

				service.collectLocalEvaluationData = function collectLocalEvaluationData() {
					let localData = {};
					localData.Evaluation = service.getSelected();
					let modState = platformModuleStateService.state(service.getModule());
					let evaluationComplete = _.find(modState.modifications[data.itemName + 'ToSave'], {MainItemId: localData.Evaluation.Id});
					if (evaluationComplete) {
						if (_.isArray(evaluationComplete.EvaluationGroupDataToSave) && evaluationComplete.EvaluationGroupDataToSave.length > 0) {
							localData.EvaluationGroupDataToSave = evaluationComplete.EvaluationGroupDataToSave;
						}
						if (_.isArray(evaluationComplete.EvaluationDocumentToSave) && evaluationComplete.EvaluationDocumentToSave.length > 0) {
							localData.EvaluationDocumentToSave = evaluationComplete.EvaluationDocumentToSave;
						}
						if (_.isArray(evaluationComplete.Evaluation2ClerkToSave) && evaluationComplete.Evaluation2ClerkToSave.length > 0) {
							localData.Evaluation2ClerkToSave = evaluationComplete.Evaluation2ClerkToSave;
						}
						if (_.isArray(evaluationComplete.Evaluation2ClerkToDelete) && evaluationComplete.Evaluation2ClerkToDelete.length > 0) {
							localData.Evaluation2ClerkToDelete = evaluationComplete.Evaluation2ClerkToDelete;
						}
					}
					let documentToSave = modState.modifications.EvaluationDocumentToSave;
					let evaluationDocumentComplete = [];
					_.forEach(documentToSave, function (item) {
						if (item && item.EvaluationDocument && item.EvaluationDocument.EvaluationFk === localData.Evaluation.Id) {
							evaluationDocumentComplete.push(item);
						}
					});
					if (evaluationDocumentComplete.length) {
						localData.EvaluationDocumentToSave = evaluationDocumentComplete;
					}
					let createEntities = _.find(modState.modifications.CreateEntities, {MainItemId: localData.Evaluation.Id});
					if (createEntities) {
						localData.CreateEntities = createEntities;
					}
					return localData;
				};

				data.entityCreated = new PlatformMessenger();
				service.registerEntityCreated = function registerEntityCreated(callBackFn) {
					data.entityCreated.register(callBackFn);
				};
				service.unregisterEntityCreated = function unregisterEntityCreated(callBackFn) {
					data.entityCreated.unregister(callBackFn);
				};

				service.addEntitiesToDeleted = function (elemState, entities, data, modState) {
					if (!elemState[data.itemName + 'ToDelete']) {
						elemState[data.itemName + 'ToDelete'] = [];
					}
					_.forEach(entities, function (entity) {
						elemState[data.itemName + 'ToDelete'].push(entity);
					});
					modState.EntitiesCount += entities.length;
					if (mainService.hasSelection()) {
						modState.MainItemId = mainService.getSelected().Id;
					}
				};

				function deleteSubEntities(entities, service, data, resetEvaluation) {
					let parentEntities = [];
					let childEntities = [];
					let deleteParams = {};
					let flatList = service.getList();
					deleteParams.entities = [];
					deleteParams.service = service;
					_.forEach(entities, function (entity) {
						if (entity.Id < 0) {
							_.forEach(entity.ChildrenItem, function (item) {
								if (!_.find(childEntities, {Id: item.Id})) {
									childEntities.push(item);
									deleteParams.entities.push(item);
								}
							});
							parentEntities.push(entity);
						} else {
							if (!_.find(childEntities, {Id: entity.Id})) {
								childEntities.push(entity);
								deleteParams.entities.push(entity);
							}
						}
					});
					prepareMultiDelete(deleteParams.entities);
					data.doPrepareDelete(deleteParams, data);
					platformDataServiceModificationTrackingExtension.markEntitiesAsDeleted(service, deleteParams.entities, data);

					if (data.usesCache && data.currentParentItem && data.currentParentItem.Id) {
						let cache = data.provideCacheFor(data.currentParentItem.Id, data);
						if (cache) {
							let loadedItems = _.filter(cache.loadedItems, function (item) {
								return !_.find(parentEntities, function (entity) {
									return entity.Id === item.Id;
								});
							});
							data.__dataCache.update(_searchFilter, loadedItems);
						}
					}

					let removeChildOffsetIndex = null,
						removeParentOffsetIndex = null;
					let removeParentOffsetItem = parentEntities && parentEntities.length > 0 ? parentEntities[0] : null,
						removeChildOffsetItem = childEntities && childEntities.length > 0 ? childEntities[0] : null;
					if (removeParentOffsetItem) {
						removeParentOffsetIndex = _.indexOf(flatList, removeParentOffsetItem);
					}
					if (removeChildOffsetItem) {
						removeChildOffsetIndex = _.indexOf(flatList, removeChildOffsetItem);
					}

					if (childEntities && childEntities.length > 0) {
						data.onDeleteDone({
							entities: childEntities,
							service: service,
							index: removeChildOffsetIndex
						}, data, null);
					}
					if (parentEntities && parentEntities.length > 0) {
						data.onDeleteDone({
							entities: parentEntities,
							service: service,
							index: removeParentOffsetIndex
						}, data, null);
					}

					if (angular.isFunction(createOptions.onEvaluationChanged)) {
						createOptions.onEvaluationChanged({
							eventName: 'DELETE',
							sender: service,
							data: {
								entities: _.concat(parentEntities, childEntities),
								resetEvaluation: resetEvaluation
							}
						});
					}

					service.reappraise(true);

					return $q.when(true);
				}

				function prepareMultiDelete(entities) {
					let toDelete = _.filter(entities, function (entity) {
						return !platformRuntimeDataService.isBeingDeleted(entity);
					});
					if (!toDelete || toDelete.length === 0) {
						return $q.when(true);
					}
					platformRuntimeDataService.markListAsBeingDeleted(toDelete);

					return _.groupBy(entities, function (entity) {
						if (entity.version === 0) {
							return 'N';
						}
						return 'O';
					});

				}

				function getChartData(evaluationSchemaId, evaluationIds) {

					let dataCache = chartDataCache.filter(function (item) {
						return (item.schemaId === evaluationSchemaId);
					});

					// Get the local evaluation group data
					let groupDatas = getLocalEvaluationGroupData();

					if (dataCache.length > 0) {
						mergeGroupData(groupDatas, dataCache[0].group, evaluationIds);
						return $q.when({
							Labels: dataCache[0].schema,
							DataSets: dataCache[0].group
						});
					} else {
						let httpRoute = globals.webApiBaseUrl + 'businesspartner/main/evaluation/getchartdata';
						evaluationIds.unshift(evaluationSchemaId);
						return $http.post(httpRoute, evaluationIds).then(function (response) {
							if (response.data) {
								mergeGroupData(groupDatas, response.data['DataSets'] || {}, evaluationIds);
								chartDataCache.push({
									schemaId: evaluationSchemaId,
									schema: response.data['Labels'],
									group: response.data['DataSets']
								});
								return response.data;
							}
						});
					}
				}

				function getLocalEvaluationGroupData() {
					let modState = platformModuleStateService.state(service.getModule());
					let elemState = modState.modifications[data.itemName + 'ToSave'];
					let groupDataList = [];
					if (elemState) {
						_.forEach(elemState, function (evaItem) {
							if (evaItem.EvaluationGroupDataToSave) {
								let groups = _.filter(evaItem.EvaluationGroupDataToSave, function (g) {
									return g.MainItemId > 0;
								}).map(function (gd) {
									return gd.EvaluationGroupData;
								});
								groupDataList.push({
									evaluationId: evaItem.Evaluation.Id,
									groupData: groups
								});
							}
						});
					}
					return groupDataList;
				}

				function mergeGroupData(localGroupData, groupData) {
					_.forEach(localGroupData, function (lgData) {
						if (Object.prototype.hasOwnProperty.call(groupData, lgData.evaluationId) && groupData[lgData.evaluationId][0].Id > 0) {
							_.forEach(groupData[lgData.evaluationId], function (item) {
								let gd = _.find(lgData.groupData, {Id: item.Id});
								if (gd) {
									item.Total = gd.Evaluation;
								}
							});
						} else {
							groupData[lgData.evaluationId] = _.map(groupData[lgData.evaluationId], function (item) {
								let gd = _.find(lgData.groupData, {
									EvaluationFk: item.EvaluationFk,
									EvaluationGroupFk: item.EvaluationGroupFk
								});
								let total = 0;
								if (gd) {
									total = gd.Evaluation;
								}

								return {
									EvaluationFk: item.EvaluationFk,
									EvaluationGroupFk: item.EvaluationGroupFk,
									Id: item.Id,
									Total: total
								};
							});
						}
					});
				}

				function incorporateDataRead(readItems, data) {
					basicsLookupdataLookupDescriptorService.attachData(readItems);

					let items = angular.isArray(readItems) ? readItems : (readItems['Dtos'] || readItems.Main || []);
					if (angular.isObject(readItems)) {
						basicsLookupdataLookupDescriptorService.attachData({SchemaIcons: readItems.SchemaIcons});
						basicsLookupdataLookupDescriptorService.attachData({Schemas: readItems.Schemas});
					}

					clearDataCache();

					if (angular.isFunction(createOptions.incorporateDataRead)) {
						createOptions.incorporateDataRead(readItems, data);
					}

					schemaId2DiffEvalPoints = schemaId2DiffEvalPoints || readItems['SchemaId2DiffEvalPoints'];
					schemaId2DiffEvalCount = schemaId2DiffEvalCount || readItems['SchemaId2DiffEvalCount'];
					let itemTree = data.handleReadSucceeded(items, data);

					onHandleReadSucceeded.fire();

					if (data.itemList && data.itemList.length >= 2) {
						service.setSelected(data.itemList[1]);
					}
					service.dataChangeMessenger.fire();
					data.__dataCache.update(_searchFilter, items);
					return itemTree;
				}

				function setReadOnlyFieldsByStatus(newItem) {
					let readonlyFieldsByStatus = [];
					let evaluationStatus = basicsLookupdataLookupDescriptorService.getData('EvaluationStatus');
					let evalStatus = _.find(evaluationStatus, {Id: newItem.EvalStatusFk});
					if (evalStatus) {
						_.forEach(createOptions.columns, function (column) {
							if (column.field !== 'Checked') {
								readonlyFieldsByStatus.push(column.field);
							}
						});
						if (evalStatus && evalStatus.Readonly) {
							platformRuntimeDataService.readonly(newItem, getReadonlyFields(readonlyFieldsByStatus));
						}
					}

					// set readonly by Evaluation IsReadonly
					if (newItem.IsReadonly) {
						platformRuntimeDataService.readonly(newItem, getReadonlyFields(readonlyFieldsByStatus));
					}
				}

				function getReadonlyFields(fields) {
					let allReadonlyFields = [];
					_.forEach(fields, function (field) {
						allReadonlyFields.push({field: field, readonly: true});
					});
					return allReadonlyFields;
				}

				service.disableDelete = function (flag) {
					service.canDelete = function () {
						let selected = service.getSelected();
						let evaluationStatus = basicsLookupdataLookupDescriptorService.getData('EvaluationStatus');
						if (selected && selected.PId) {
							let status = _.find(evaluationStatus, {Id: selected.EvalStatusFk});
							if (status) {
								return !!(flag && service.getSelected() && !status.DenyDelete);
							}
						} else if (selected && !selected.PId) {
							let children = _.filter(selected.ChildrenItem, function (item) {
								let status = _.find(evaluationStatus, {Id: item.EvalStatusFk});
								return status.DenyDelete;
							});
							return flag && !(children && children.length);
						}
						return !!(flag && service.getSelected());
					};
				};

				service.getContainerData = function () {
					return serviceContainer.data;
				};

				service.clearContent = function () {
					data.__dataCache.clear();
					data.clearContent(data);
				};

				service.reappraise = function (isRefreshGrid, tree) {
					let evaluationTree = _.filter(tree || service.getTree(), function (item) {
						return angular.isUndefined(item.PId) || item.PId === null;
					});
					_.each(evaluationTree, function (root) {
						_.each(root.ChildrenItem, function (child) {
							reappraiseIcon(child);
						});
						reappraiseParentPoint(root);
						reappraiseIcon(root);
					});
					platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);
					if (isRefreshGrid) {
						service.gridRefresh();
					}
				};

				service.syncCreate = function (evaluation, isRefreshGrid, isReappraise) {
					let result;
					let hasCreated = !!_.find(service.getList(), function (item) {
						return evaluation.Id === item.Id;
					});
					if (!hasCreated) {
						let evaluationTree = service.getTree(),
							createEvaluation = angular.copy(evaluation),
							schema = _.find(basicsLookupdataLookupDescriptorService.getData('Schemas'), {Id: createEvaluation.EvaluationSchemaFk});
						let parent = _.find(evaluationTree, {EvaluationSchemaFk: createEvaluation.EvaluationSchemaFk});

						let lockedRt$dataProperties = {
							readonly: []
						};
						Object.assign(createEvaluation.__rt$data, lockedRt$dataProperties);

						if (!parent) {
							parent = {
								Id: -service.getTree().length - 1,
								PId: null,
								Code: ' ',
								EvaluationDate: createEvaluation.EvaluationDate,
								EvaluationSchemaFk: createEvaluation.EvaluationSchemaFk,
								EvaluationSchemaDescription: schema.DescriptionInfo.Translated,
								Points: createEvaluation.Points,
								Icon: createEvaluation.Icon,
								ChildrenItem: [createEvaluation],
								HasChildren: true
							};
							createEvaluation.PId = parent.Id;
							evaluationTree.push(parent);
						} else {
							parent.ChildrenItem.push(createEvaluation);
						}

						syncDataItemList();

						if (isReappraise) {
							service.reappraise(false, [parent]);
						}
						if (isRefreshGrid) {
							service.gridRefresh();
						}
						result = true;
					} else {
						result = true;
					}
					return result;
				};

				service.syncUpdate = function (evaluation, isRefreshGrid, isReappraise) {
					let result = false;
					let updateEvaluation = _.find(service.getList(), function (item) {
						return item.Id === evaluation.Id;
					});
					let parent = _.find(service.getTree(), {EvaluationSchemaFk: evaluation.EvaluationSchemaFk});
					if (updateEvaluation && parent) {
						let lockedProperties = {
							Checked: updateEvaluation.Checked,
							__rt$data: updateEvaluation.__rt$data,
							nodeInfo: updateEvaluation.nodeInfo
						};
						Object.assign(updateEvaluation, evaluation);
						Object.assign(updateEvaluation, lockedProperties);
						if (isReappraise) {
							service.reappraise(false, [parent]);
						}
						if (isRefreshGrid) {
							service.gridRefresh();
						}
						result = true;
					}

					return result;
				};

				service.syncDelete = function (removeEntities, isRefreshGrid, isReappraise) {

					let result = false,
						evaluationTree = service.getTree(),
						flatList = service.getList(),
						selectedIndex = _.indexOf(flatList, service.getSelected()),
						removeItems = [];

					_.each(evaluationTree, function (root) {
						let children = root.ChildrenItem;
						_.each(removeEntities, function (item) {
							let matchItem = _.find(children, {Id: item.Id});
							if (matchItem) {
								removeItems.push(_.indexOf(flatList, matchItem));
								_.remove(children, function (child) {
									return child === matchItem;
								});
								result = true;
							}
						});
					});

					if (result) {

						_.remove(evaluationTree, function (root) {
							return root.ChildrenItem.length === 0;
						});

						syncDataItemList();

						if (selectedIndex >= 0 && removeItems.length > 0 && _.includes(removeItems, selectedIndex)) {
							platformDataServiceSelectionExtension.doSelectCloseTo(_.minBy(removeItems), data);
						}

						if (isReappraise) {
							service.reappraise(false);
						}
						if (isRefreshGrid) {
							service.gridRefresh();
						}
					}

					return result;
				};

				service.registerHandleReadSucceeded = function (fn) {
					onHandleReadSucceeded.register(fn);
				};

				service.unregisterHandleReadSucceeded = function (fn) {
					onHandleReadSucceeded.unregister(fn);
				};

				function syncDataItemList() {
					let flatList = cloudCommonGridService.flatten(service.getTree(), [], 'ChildrenItem');
					data.itemList.length = 0;
					_.each(flatList, function (item) {
						data.itemList.push(item);
					});
				}

				function processItem(newItem) {
					setReadOnlyFieldsByStatus(newItem);
					if (newItem[data.treePresOpt.childProp].length > 0) {
						newItem.nodeInfo = {
							collapsed: false,
							lastElement: false,
							level: 0
						};
					} else {
						newItem.nodeInfo = {
							collapsed: false,
							lastElement: true,
							level: 1
						};
					}
					if (_.isNumber(newItem.Icon)) {
						let value = businesspartnerEvaluationSchemaIconDataService.getListAsync();
						newItem.image = 'ico-' + value[newItem.Icon - 1].Name;
					}
					if (newItem.Icon === null) {
						newItem.IconSrc = '';
					}
					if (!newItem.PId) {
						platformRuntimeDataService.readonly(newItem, [
							{
								field: 'ProjectFk',
								readonly: true
							},
							{
								field: 'ConHeaderFk',
								readonly: true
							},
							{
								field: 'InvHeaderFk',
								readonly: true
							},
							{
								field: 'QtnHeaderFk',
								readonly: true
							},
							{
								field: 'UserDefined1',
								readonly: true
							},
							{
								field: 'UserDefined2',
								readonly: true
							},
							{
								field: 'UserDefined3',
								readonly: true
							},
							{
								field: 'UserDefined4',
								readonly: true
							},
							{
								field: 'UserDefined15',
								readonly: true
							}
						]);
					}
					let evalStatuses = basicsLookupdataLookupDescriptorService.getData('EvaluationStatus');
					let evalStatus = evalStatuses[newItem.EvalStatusFk];
					if (evalStatus) {
						if (evalStatus.IsNotToCount) {
							platformRuntimeDataService.readonly(newItem, [
								{
									field: 'Checked',
									readonly: true
								}]
							);
						}
					}
				}

				function clearDataCache() {
					chartDataCache = [];
				}

				function reappraiseIcon(item) {
					let schemaIcons = basicsLookupdataLookupDescriptorService.getData('SchemaIcons');
					let icons = _.filter(schemaIcons, function (e) {
						return e.EvaluationSchemaFk === item.EvaluationSchemaFk;
					});
					let flag = false;
					_.forEach(icons, function (icon) {
						if (item.Points && item.Points >= icon.PointsFrom && item.Points <= icon.PointsTo) {
							flag = true;
							item.Icon = icon.Icon;
						}
					});
					if (!flag) {
						item.Icon = null;
						item.image = 'ico-folder-empty';
					}
				}

				function reappraiseParentPoint(parentItem) {
					if (parentItem && parentItem.ChildrenItem && parentItem.ChildrenItem.length > 0) {
						// need to set zero first be used to first create
						parentItem.Points = 0;
						let sumItems = _.filter(parentItem.ChildrenItem, function (child) {
							return angular.isDefined(child.Points) && child.Points !== null;
						});
						let length = parentItem.ChildrenItem.length;
						let diffPoints = schemaId2DiffEvalPoints ? schemaId2DiffEvalPoints[parentItem.Id] : 0;
						let diffCount = schemaId2DiffEvalCount ? schemaId2DiffEvalCount[parentItem.Id] : 0;
						diffPoints = diffPoints || 0;
						diffCount = diffCount || 0;
						let evaluationStatus = basicsLookupdataLookupDescriptorService.getData('EvaluationStatus');
						let canCountStatusIds = [];
						let countSumItems = [];
						if (evaluationStatus) {
							_.forEach(evaluationStatus, function (item) {
								if (!item.IsNotToCount) {
									canCountStatusIds.push(item.Id);
								}
							});
						}
						if (canCountStatusIds && canCountStatusIds.length > 0) {
							for (let i = 0; i < sumItems.length; i++) {
								_.forEach(canCountStatusIds, function (canCountStatusId) {
									if (sumItems[i].EvalStatusFk === canCountStatusId) {
										countSumItems.push(sumItems[i]);
									}
								});
							}
							sumItems = countSumItems;
							length = countSumItems.length;
						}
						if (sumItems.length > 0) {
							parentItem.Points = (_.sumBy(sumItems, 'Points') + diffPoints) / (length + diffCount);
						} else if (diffCount > 0) {
							parentItem.Points = diffPoints / diffCount;
						}

					}
				}

				function mergeData(result) {
					// add the result to modState
					// for result, see ScreenEvaluationCompleteDto
					if (!result.Evaluation) {
						return;
					}
					let evaluation,
						parent = null,
						tree = service.getTree(),
						list = service.getList();

					let eventName = '',
						eventData = null;

					if (detailService.create) { // create mode
						let schema = _.find(basicsLookupdataLookupDescriptorService.getData('Schemas'), {Id: result.Evaluation.EvaluationSchemaFk});
						evaluation = result.Evaluation;
						evaluation.HasChildren = false;
						evaluation.ChildrenItem = [];
						evaluation.EvaluationSchemaDescription = evaluation.Description;

						parent = _.find(tree, {EvaluationSchemaFk: evaluation.EvaluationSchemaFk});
						if (parent) {
							evaluation.PId = parent.Id;
							if (_.isArray(parent.ChildrenItem)) {
								parent.ChildrenItem.push(evaluation);
							} else {
								parent.ChildrenItem = [evaluation];
							}
							list.push(evaluation);

							parent.EvaluationDate = evaluation.EvaluationDate;

						} else {
							parent = {
								Id: -service.getTree().length - 1,
								PId: null,
								Code: ' ',
								EvaluationDate: evaluation.EvaluationDate,
								EvaluationSchemaFk: schema.Id,
								EvaluationSchemaDescription: schema.DescriptionInfo.Translated,
								Points: evaluation.Points,
								Icon: evaluation.Icon,
								ChildrenItem: [evaluation],
								HasChildren: true
							};

							evaluation.PId = parent.Id;

							tree.push(parent);
							list.push(parent);
							list.push(evaluation);
						}
						eventName = 'CREATE';
						eventData = {
							parent: parent,
							evaluation: evaluation
						};

					} else { // vew mode
						evaluation = service.getSelected();
						if (result.Evaluation) {
							result.Evaluation.PId = evaluation.PId;
							evaluation.EvaluationSchemaDescription = evaluation.Description;
							Object.assign(evaluation, result.Evaluation);

							parent = _.find(tree, {EvaluationSchemaFk: evaluation.EvaluationSchemaFk});
							eventName = 'UPDATE';
							eventData = {
								parent: parent,
								evaluation: evaluation
							};
						}
					}

					service.reappraise(false, [parent]);

					platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);
					platformDataServiceActionExtension.fireEntityCreated(data, result.Evaluation);
					service.markItemAsModified(evaluation);
					addGroupDataToModified(result, evaluation);

					data.__dataCache.update(_searchFilter, service.getTree());

					service.gridRefresh();

					service.dataChangeMessenger.fire();

					if (eventName && eventData && angular.isFunction(createOptions.onEvaluationChanged)) {
						createOptions.onEvaluationChanged({
							eventName: eventName,
							sender: service,
							data: eventData
						});
					}

					function addGroupDataToModified(result, evaluation) {
						let modState = platformModuleStateService.state(service.getModule());
						let elemState = modState.modifications[data.itemName + 'ToSave'];
						let existed = _.find(elemState, {MainItemId: evaluation.Id});

						if (result.EvaluationDocumentToSave && result.EvaluationDocumentToSave.length >= 0) {
							let saveState = modState.modifications.EvaluationDocumentToSave;
							if (!saveState) {
								saveState = modState.modifications.EvaluationDocumentToSave = [];
							}
							if (saveState && saveState.length <= 0) {
								modState.modifications.EvaluationDocumentToSave = result.EvaluationDocumentToSave;
							} else {
								_.forEach(result.EvaluationDocumentToSave, function (documentItem) {
									let documentData = _.find(modState.modifications.EvaluationDocumentToSave, {MainItemId: documentItem.MainItemId});
									if (!documentData) {
										modState.modifications.EvaluationDocumentToSave.push(documentItem);
									}
								});
							}
						}

						if (result.CreateEntities && result.CreateEntities.length >= 0) {
							// if have created entity before, put the new one in modifications
							let modifiedCreateEntities = modState.modifications.CreateEntities;
							if (!modifiedCreateEntities) {
								modifiedCreateEntities = [];
							}
							modState.modifications.CreateEntities = modifiedCreateEntities.concat(angular.copy(result.CreateEntities));
						}

						if (existed) {
							if (!existed.EvaluationGroupDataToSave) {
								existed.EvaluationGroupDataToSave = result.EvaluationGroupDataToSave;
							} else {
								_.forEach(result.EvaluationGroupDataToSave, function (group) {
									let groupData = _.find(existed.EvaluationGroupDataToSave, {MainItemId: group.MainItemId});
									if (groupData) {
										if (group.EvaluationGroupData && group.EvaluationGroupData.IsMultiSelect) {
											if (_.isArray(group.EvaluationItemDataToSave) && group.EvaluationItemDataToSave.length > 0) {
												let evaItems = [];
												_.forEach(group.EvaluationItemDataToSave, function (evaItem) {
													let temp = _.find(groupData.EvaluationItemDataToSave, {Id: evaItem.Id});
													if (temp) {
														Object.assign(temp, evaItem);
														evaItems.push(temp);
													} else {
														evaItems.push(evaItem);
													}
												});
												groupData.EvaluationItemDataToSave = evaItems;
											}
										} else {
											if (_.isArray(group.EvaluationItemDataToSave) && group.EvaluationItemDataToSave.length > 0) {
												groupData.EvaluationItemDataToSave = group.EvaluationItemDataToSave;
											}

											mergeClerkData(group, groupData, 'EvalGroupData2ClerkToSave', 'EvalGroupData2ClerkToDelete');
										}
									} else {
										groupData = group;
										existed.EvaluationGroupDataToSave.push(group);
									}

									if (groupData.EvaluationGroupData.IsEvaluationSubGroupData && isGroupDataModifiedDataEmpty(groupData)) {
										let mainItemId = groupData.EvaluationGroupData.EvaluationFk;
										groupData.EvaluationGroupData = null;
										let parentGroupData = _.find(existed.EvaluationGroupDataToSave, {MainItemId: mainItemId});
										if (isGroupDataModifiedDataEmpty(parentGroupData)) {
											parentGroupData.EvaluationGroupData = null;
										}
									}
								});
							}

							mergeClerkData(result, existed, 'Evaluation2ClerkToSave', 'Evaluation2ClerkToDelete');

							// modState.modifications.EntitiesCount = result.EntitiesCount - 1;
						}

						if (result.EvaluationDocumentToDelete && result.EvaluationDocumentToDelete.length >= 0) {

							let deleteState = modState.modifications.EvaluationDocumentToDelete;
							if (!deleteState) {
								deleteState = modState.modifications.EvaluationDocumentToDelete = [];
							}
							if (deleteState && deleteState.length <= 0) {
								modState.modifications.EvaluationDocumentToDelete = result.EvaluationDocumentToDelete;
							} else {
								_.forEach(result.EvaluationDocumentToDelete, function (documentItem) {
									let documentData = _.find(modState.modifications.EvaluationDocumentToDelete, {Id: documentItem.Id});
									if (!documentData) {
										modState.modifications.EvaluationDocumentToDelete.push(documentItem);
									}
								});
							}
						}
					}
				}

				function isGroupDataModifiedDataEmpty(groupData) {
					return groupData && groupData.EvaluationGroupData && !groupData.EvaluationGroupData.isCreateByModified &&
						(!groupData['EvalGroupData2ClerkToSave'] || groupData['EvalGroupData2ClerkToSave'].length === 0) &&
						(!groupData['EvalGroupData2ClerkToDelete'] || groupData['EvalGroupData2ClerkToDelete'].length === 0) &&
						(!groupData.EvaluationItemDataToSave || groupData.EvaluationItemDataToSave.length === 0);
				}

				function mergeClerkData(source, target, toSaveProp, toDeleteProp) {

					if (!target[toSaveProp]) {
						target[toSaveProp] = source[toSaveProp];
					} else {
						if (angular.isArray(source[toSaveProp]) && source[toSaveProp].length > 0) {
							let clerkState = target[toSaveProp];
							if (!clerkState) {
								clerkState = target[toSaveProp] = [];
							}
							if (clerkState && clerkState.length <= 0) {
								target[toSaveProp] = source[toSaveProp];
							} else {

								_.forEach(source[toSaveProp], function (clerkItem) {
									let clerkData = _.find(target[toSaveProp], {Id: clerkItem.MainItemId});
									if (!clerkData) {
										target[toSaveProp].push(clerkItem);
									}
								});
								let itemsRemoved = source[toDeleteProp] || [];
								if (itemsRemoved.length > 0) {
									target[toSaveProp] = _.filter(target[toSaveProp], function (toSave) {
										return !_.some(itemsRemoved, {Id: toSave.Id});
									});
								}
							}
						} else {
							let itemsRemoved2 = source[toDeleteProp] || [];
							if (itemsRemoved2.length > 0) {
								target[toSaveProp] = _.filter(target[toSaveProp], function (toSave) {
									return !_.some(itemsRemoved2, {Id: toSave.Id});
								});
							}
						}
					}

					if (!target[toDeleteProp]) {
						target[toDeleteProp] = source[toDeleteProp];
					} else {
						if (angular.isArray(source[toDeleteProp]) && source[toDeleteProp].length >= 0) {
							let clerkDelState = target[toDeleteProp];
							if (!clerkDelState) {
								clerkDelState = target[toDeleteProp] = [];
							}
							if (clerkDelState && clerkDelState.length <= 0) {
								target[toDeleteProp] = source[toDeleteProp];
							} else {
								_.forEach(source[toDeleteProp], function (clerkItem) {
									if (clerkItem.Version > 0) {
										let clerkDelData = _.find(target[toDeleteProp], {Id: clerkItem.Id});
										if (!clerkDelData) {
											target[toDeleteProp].push(clerkItem);
										}
									}
								});
							}
						}
					}
				}

				function provideUpdateData(updateData) {
					// the parent node is for tree view presenting, no need to save it
					let businessPartnerEvaluationToSave = updateData[createOptions.itemName + 'ToSave'];
					if (_.isArray(businessPartnerEvaluationToSave) && businessPartnerEvaluationToSave.length > 0) {
						_.remove(businessPartnerEvaluationToSave, function (e) {
							return !e.Evaluation.PId;
						});
					}
				}

				function mergeInLeafUpdateData(updateData) {
					_.forEach(updateData[data.itemName + 'ToSave'], function (updateItem) {
						let oldItem = service.findItemToMerge(updateItem);
						if (oldItem) {
							data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem.Evaluation, true, data);
						}
					});
				}

				function findItemToMerge(item2Merge) {
					return (!item2Merge || !item2Merge.MainItemId) ? undefined : _.find(data.itemList, {Id: item2Merge.MainItemId});
				}

				serviceCache.setService(serviceCache.serviceTypes.EVALUATION_DATA, serviceDescriptor, service);

				return service;
			}

			return {
				createService: createService
			};
		}
	]);
})(angular);