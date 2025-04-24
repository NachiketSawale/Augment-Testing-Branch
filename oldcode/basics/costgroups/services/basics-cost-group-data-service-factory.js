/**
 * Created by wed on 08/05/2019.
 */

(function (window, angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupDataServiceFactory', [
		'globals',
		'_',
		'$q',
		'platformGridAPI',
		'platformRuntimeDataService',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		function (globals,
			_,
			$q,
			platformGridAPI,
			platformRuntimeDataService,
			platformDataServiceFactory,
			basicsLookupdataLookupDescriptorService) {

			var serviceCache = new window.Map();

			/*
			moduleName : this service are used in which module.(reserve)
			parentService : the parent service of costGroupService.
			* */
			function createService(moduleName, parentService, createOptions) {
				let currentParentEntity = null;
				var options = angular.extend({
					itemName: 'CostGroup',
					dataLookupType: 'CostGroups',
					ignorePrjCostGroup: false,
					supportAssignmentContainer: false,
					identityGetter: function (entity) {
						return {
							MainItemId: entity.Id // Returns foreign key object to identity main item. such as "{RootItemId:entity.EstHeaderFk,MainItemId:entity.EstLineItemFk}".
						};
					}
				}, createOptions);
				var serviceContainer = null;

				var cacheKey = parentService.getServiceName() + options.itemName;
				var service = serviceCache.has(cacheKey) ? serviceCache.get(cacheKey) : null;

				function cellChangeHandler(entity, col, isBulkEditor) {
					var deferred = $q.defer();
					var costGroupCatId = options.costGroupCatGetter ? options.costGroupCatGetter(entity) : col.costGroupCatId;

					/* delete */
					var groupFilter = angular.extend(options.identityGetter(entity), {
						CostGroupCatFk: costGroupCatId
					});
					var group = _.find(service.getList(), groupFilter);

					// if group is null and entity[col.field] is not null, find costgroup in lookup data
					if (!group) {
						let lookupData = basicsLookupdataLookupDescriptorService.getData(options.dataLookupType),
							lookupItems = lookupData ? _.map(lookupData) : [];
						group = _.find(lookupItems, groupFilter);
						if (group) {
							let updatedList = _.unionBy(service.getList(), [group], 'Id');
							service.setList(updatedList);
						}
					}

					if (group) {
						if (entity[col.field]) {
							/* update */
							group.CostGroupFk = entity[col.field];
							service.markItemAsModified(group);
							deferred.resolve(true);
						} else {
							/* delete */
							platformRuntimeDataService.removeMarkAsBeingDeleted(group);
							service.deleteItem(group);
							deferred.resolve(true);
						}
					} else {
						/* add */
						if (entity[col.field]) {
							let param = {};
							if(isBulkEditor){
								param = {
									MainItemId:  entity.Id,
									CostGroupFk:entity[col.field],
									CostGroupCatFk: costGroupCatId
								};
							}

							service.createItem(param).then(function (newItem) {
								newItem.CostGroupFk = entity[col.field];
								newItem.CostGroupCatFk = costGroupCatId;
								if (!options.costGroupCatGetter) {
									angular.extend(newItem, options.identityGetter(entity));
								}
								deferred.resolve(true);
							});
						}else{
							deferred.resolve(true);
						}
					}

					/* refresh the cost group assignment */
					var costGroupAssignmentService = service.costGroupAssignmentService;
					if (costGroupAssignmentService) {
						var costGroupAssignmentEntity = costGroupAssignmentService.getItemById(costGroupCatId);
						if (costGroupAssignmentEntity) {
							costGroupAssignmentEntity['costgroup_'] = entity[col.field];
							costGroupAssignmentService.fireItemModified(costGroupAssignmentEntity);
						}
					}

					return deferred.promise;
				}

				function onCostGroupContainerCellChange(costGroupEntity, col) {
					var deferred = $q.defer();
					var costGroupCatId = costGroupEntity.Id;

					var costGroupColumnOfParent = 'costgroup_' + costGroupCatId;

					/* delete */
					var parentEntity = parentService.getSelected();

					var groupFilter = angular.extend(options.identityGetter(parentEntity), {
						CostGroupCatFk: costGroupCatId
					});
					var group = _.find(service.getList(), groupFilter);

					if (group) {
						if (costGroupEntity[col.field]) {
							/* update */
							group.CostGroupFk = costGroupEntity[col.field];
							service.markItemAsModified(group);
							deferred.resolve(true);
						} else {
							/* delete */
							platformRuntimeDataService.removeMarkAsBeingDeleted(group);
							service.deleteItem(group);
							deferred.resolve(true);
						}
					} else {
						/* add */
						if (costGroupEntity[col.field]) {
							service.createItem().then(function (newItem) {
								newItem.CostGroupFk = costGroupEntity[col.field];
								newItem.CostGroupCatFk = costGroupCatId;
								angular.extend(newItem, options.identityGetter(parentEntity));
								deferred.resolve(true);
							});
						}
					}

					/* refresh the parent item */
					parentEntity[costGroupColumnOfParent] = costGroupEntity[col.field];
					parentService.fireItemModified(parentEntity);

					return deferred.promise;
				}

				function onCellChange(e, args) {
					var col = args.grid.getColumns()[args.cell];
					if (col.field.indexOf('costgroup_') > -1) {
						if (options.supportAssignmentContainer) {
							if (args.item.hasOwnProperty('costgroup_')) {
								onCostGroupContainerCellChange(args.item, col);
							} else if (options.dataLookupType !== 'LineItem2CostGroups') { // the LineItem2CostGroups was handled at validation side.
								cellChangeHandler(args.item, col);
							}
						} else if (options.dataLookupType === 'QtoDetail2CostGroups') {
							service.createCostGroupForQtoLines(args.item, col);
						} else {
							cellChangeHandler(args.item, col);
						}
					}
				}

				if (!service) {
					let serviceFactoryOptions = {
						flatLeafItem: {
							module: parentService.getModule(),
							serviceName: parentService.getServiceName() + '_CostGroupDataService',
							httpCreate: {
								useLocalResource: true,
								resourceFunction: function (serviceData, callData) {
									return angular.extend({Id: service.getEntityNextId(), Version: 0}, callData);
								}
							},
							httpRead: {
								useLocalResource: true,
								resourceFunction: function () {
									var selectedItems = parentService.hasSelection() ? parentService.getSelectedEntities() : null,
										lookupData = basicsLookupdataLookupDescriptorService.getData(options.dataLookupType),
										lookupItems = lookupData ? _.map(lookupData) : [];

									if (currentParentEntity !== null) {
										selectedItems = [currentParentEntity];
									}

									return _.uniq(selectedItems !== null ? _.reduce(selectedItems, function (result, selectedItem) {
										return result.concat(_.filter(lookupItems, options.identityGetter(selectedItem)));
									}, []) : [], 'Id');
								}
							},
							entityRole: {
								leaf: {
									itemName: options.itemName,
									parentService: parentService,
									doesRequireLoadAlways: true
								}
							},
							presenter: {
								list: {
									initCreationData: function (creationData,data, creationOptions) {
										var entity = parentService.getSelected();
										if (entity) {
											angular.extend(creationData, options.identityGetter(entity));
										}

										if(creationOptions){
											if(!_.isNil(creationOptions.MainItemId)){ // for some cases(like costgroups in PPS modules), MainItemId is setted by options.identityGetter and is not setted by creationOptions
												creationData.MainItemId = creationOptions.MainItemId;
											}
											creationData.CostGroupCatFk= creationOptions.CostGroupCatFk;
											creationData.CostGroupFk= creationOptions.CostGroupFk;
										}
									},
									incorporateDataRead: function (itemList, data) {
										return serviceContainer.data.handleReadSucceeded(itemList, data);
									}
								}
							}
						}
					};

					serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

					service = serviceContainer.service;

					serviceContainer.data.usesCache = false;

					serviceContainer.data.supportUpdateOnSelectionChanging = false;

					service.setListWithResources = function (qtoLines, costGroupCatId) {
						let lookupData = basicsLookupdataLookupDescriptorService.getData(options.dataLookupType),
							lookupItems = lookupData ? _.map(lookupData) : [];

						let itemList = _.uniq(qtoLines !== null ? _.reduce(qtoLines, function (result, qtoLine) {
							return result.concat(_.filter(lookupItems, angular.extend(options.identityGetter(qtoLine), {
								CostGroupCatFk: costGroupCatId
							})));
						}, []) : [], 'Id');

						service.setList(itemList);
					};

					service.getEntityNextId = function () {
						var entityId = this.__entityId || 0;
						this.__entityId = --entityId;
						return this.__entityId;
					};

					service.createCostGroup2Save = function createCostGroup2Save(entity, costGroupCol) {
						currentParentEntity = entity;
						return service.load().then(function () {
							return cellChangeHandler(entity, costGroupCol);
						}).finally(function () {
							currentParentEntity = null;
						});
					};

					service.createCostGroupForQtoLines = function createCostGroupForQtoLines(entity, col, isBulkEditor) {
						// set selected costgroup the multi qtolines
						let qtoLinesGroup = parentService.getTheSameGroupQto(entity);

						let selectedEntities = parentService.getSelectedEntities();
						selectedEntities = selectedEntities.concat(qtoLinesGroup);
						selectedEntities  = _.unionBy(selectedEntities,'Id');

						parentService.setSelectedEntities(selectedEntities);
						isBulkEditor |= selectedEntities.length > 0;
						// load costgroup list for selected qtolines
						let lookupData = basicsLookupdataLookupDescriptorService.getData(options.dataLookupType);
						service.load().then(function () {
							_.each(qtoLinesGroup, function (qtoLine) {
								if (qtoLine.Id !== entity.Id&&qtoLine[col.field] !== entity[col.field]) {
									qtoLine[col.field] = entity[col.field];
									parentService.markItemAsModified(qtoLine);
								}
								let group;
								if (!entity[col.field]){
									let groupFilter = angular.extend(options.identityGetter(qtoLine), {
										CostGroupCatFk: col.costGroupCatId
									});

									group = _.find(service.getList(), groupFilter);
								}

								cellChangeHandler(qtoLine, col, isBulkEditor);

								if (group){
									delete  lookupData[group.Id];
								}
							});

							parentService.updateQtoDetailGroupInfo();
						});
					};

					service.registerCellChangedEvent = function (gridId) {
						platformGridAPI.events.register(gridId, 'onCellChange', onCellChange);
					};

					service.unregisterCellChangedEvent = function (gridId) {
						platformGridAPI.events.unregister(gridId, 'onCellChange', onCellChange);
					};

					service.registerItemModified(function (e, item) {
						if (item.Version === 1) {
							var lookupData = basicsLookupdataLookupDescriptorService.getData(options.dataLookupType);
							for (var name in lookupData) {
								if (lookupData.hasOwnProperty(name) && _.startsWith(name, '-')) {
									var cacheItem = lookupData[name], isMatch = true;
									if (item.MainItemId && cacheItem.MainItemId) {
										isMatch = item.MainItemId === cacheItem.MainItemId;
									}
									if (isMatch && item.MainItemId64 && cacheItem.MainItemId64) {
										isMatch = item.MainItemId64 === cacheItem.MainItemId64;
									}
									if (isMatch && item.RootItemId && cacheItem.RootItemId) {
										isMatch = item.RootItemId === cacheItem.RootItemId;
									}
									if (isMatch && item.NodeItemId && cacheItem.NodeItemId) {
										isMatch = item.NodeItemId === cacheItem.NodeItemId;
									}
									if (isMatch && item.CostGroupCatFk && cacheItem.CostGroupCatFk) {
										isMatch = item.CostGroupCatFk === cacheItem.CostGroupCatFk;
									}
									if (isMatch) {
										delete  lookupData[name];
									}
								}
							}
							basicsLookupdataLookupDescriptorService.updateData(options.dataLookupType, [item]);
						}
					});

					service.registerEntityCreated(function (e, entity) {
						basicsLookupdataLookupDescriptorService.updateData(options.dataLookupType, [entity]);
						service.markItemAsModified(entity);
					});

					parentService.registerSelectedEntitiesChanged(function (e, entities) {
						if (entities && entities.length > 1) {
							service.load();
						}
					});

					service.findItemToMerge = function (updateItem) {
						var lookupData = basicsLookupdataLookupDescriptorService.getData(options.dataLookupType),
							lookupItems = lookupData ? _.map(lookupData) : [],
							identityKeys = _.keys(options.identityGetter({})),
							identity = _.pick(updateItem, identityKeys);

						return _.find(lookupItems, angular.extend(identity, {
							CostGroupCatFk: updateItem.CostGroupCatFk
						}));
					};

					service.mergeUpdatedDataInCache = function (updateData, data) {

						// Update to lookup
						if (updateData[data.itemName + 'ToSave']) {
							_.forEach(updateData[data.itemName + 'ToSave'], function (updateItem) {
								var oldItem = service.findItemToMerge(updateItem);
								if (oldItem) {
									data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem, true, data);
								}
							});
						}

						// Delete from lookup
						if (updateData[data.itemName + 'ToDelete']) {
							var lookupData = basicsLookupdataLookupDescriptorService.getData(options.dataLookupType);
							_.forEach(updateData[data.itemName + 'ToDelete'], function (deleteItem) {
								if (lookupData[deleteItem.Id]) {
									delete  lookupData[deleteItem.Id];
								}
							});
						}

						service.load();

					};

					service.clearModifications = function clearModifications(lineItem, col) {
						let costGroupCatId = options.costGroupCatGetter ? options.costGroupCatGetter(lineItem) : col.costGroupCatId;
						let groupFilter = angular.extend(options.identityGetter(lineItem), {
							CostGroupCatFk: costGroupCatId
						});
						let group = _.find(service.getList(), groupFilter);
						if (group) {
							serviceContainer.data.doClearModifications(group, serviceContainer.data);
						}
					};

					serviceCache.set(cacheKey, service);

					return service;
				}

				return service;
			}

			return {
				createService: createService
			};

		}

	]);
})(window, angular);