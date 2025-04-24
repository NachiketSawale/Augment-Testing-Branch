/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceModificationTrackingExtension
	 * @function
	 * @description
	 * platformDataServiceModificationTrackingExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceModificationTrackingExtension', PlatformDataServiceModificationTrackingExtension);

	PlatformDataServiceModificationTrackingExtension.$inject = ['_', 'platformModuleStateService', 'platformRuntimeDataService',
		'platformDataServiceDataProcessorExtension'];

	function PlatformDataServiceModificationTrackingExtension(_, platformModuleStateService, platformRuntimeDataService,
		platformDataServiceDataProcessorExtension) {
		var self = this;
		var modificationId = 1;

		var modificationHistory = {};

		function getNextModificationId() {
			return modificationId++;
		}

		/**
		 * @ngdoc function
		 * @param modification
		 * @description adds a modification to the modification history
		 * @return {*}
		 */
		this.addModificationToHistory = function addModificationToHistory(modification) {
			if(modification && modification.EntitiesCount >= 1){
				modification.ModificationId = getNextModificationId();
				modificationHistory[modification.ModificationId] = modification;
			}
		};

		/**
		 * @ngdoc function
		 * @param modificationId
		 * @description removes a modification from the modification history
		 */
		this.removeModificationFromHistory = function removeModificationFromHistory(modificationId) {
			if(modificationHistory[modificationId]){
				delete modificationHistory[modificationId];
			}
		};

		/**
		 * @ngdoc function
		 * @param modificationId
		 * @description gets a modification from the modification history
		 * @return {*}
		 */
		this.getModificationFromHistory = function getModificationFromHistory(modificationId) {
			return modificationHistory[modificationId];
		};

		/**
		 * @ngdoc function
		 * @description clears the modification history
		 */
		this.clearModificationHistory = function clearModificationHistory() {
			modificationHistory = {};
		};

		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceSelectionExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @param options {object} describes how to create the service and all its data
		 * @returns state
		 */
		this.addModificationTracking = function addModificationTracking(container, options) {
			if (options.modification) {
				container.data.registerAndCreateEventMessenger('itemModified');

				container.data.markItemAsModified = function doMarkItemAsModified(entity, data) {
					self.markAsModified(container.service, entity, data);
				};

				container.service.cleanUpLocalData = function cleanUpLocalData() {
					self.cleanUpLocalServiceData(container.data, container.service);
				};

				container.service.fireItemModified = function fireItemModified(entity) {
					// More changes are done by background process and the event need to be fired for update of clients
					if (entity && entity.Id) {
						container.data.itemModified.fire(null, entity);
					}
				};

				container.service.markItemAsModified = function doMarkItemAsModified(item) {
					self.markAsModified(container.service, item, container.data);
				};

				container.service.markEntitiesAsModified = function doMarkEntitiesAsModified(entities) {
					return self.markEntitiesAsModified(container.service, entities, container.data);
				};

				container.service.markCurrentItemAsModified = function doMarkCurrentItemAsModified() {
					self.markAsModified(container.service, container.data.selectedItem, container.data);
				};

				container.service.findItemToMerge = function findItemToMerge(item2Merge) {
					return self.findItemToMerge(item2Merge, container.data, container.service);
				};

				container.service.assertPath = function doAssertPath(root, addSel, entity) {
					return self.assertPath(root, container.service, addSel, entity);
				};

				if (options.entityRole) {
					if (options.entityRole.root) {
						if (options.entitySelection && options.entitySelection.supportsMultiSelection) {
							container.service.addEntityToModified = function doAddSingleRootEntityToModified(elemState, entity, modState) {
								self.addRootEntitiesToModified(elemState, [entity], container.data, modState);
							};
							container.service.addEntitiesToModified = function doAddRootEntitiesToModified(elemState, entity, modState) {
								self.addRootEntitiesToModified(elemState, entity, container.data, modState);
							};
						} else {
							container.service.addEntityToModified = function doAddRootEntityToModified(modStorage, entity) {
								self.addRootEntityToModified(modStorage, entity, container.data);
							};
						}

						container.service.addOrExtendEntityToModified = function (elemState, entity, extendObj) {
							self.addOrExtendRootEntityToModified(elemState, entity, container.data, options, extendObj);
						};

						container.service.assertTypeEntries = function () {
						};// The empty root is already available

						container.service.assertSelectedEntityEntry = function doAssertSelectedRootEntityEntry(modStorage, entity) {
							return self.assertSelectedRootEntityEntry(modStorage, entity);
						};

						container.service.tryGetSelectedEntityEntry = function doTryGetSelectedRootEntityEntry(modStorage) {
							return self.tryGetSelectedRootEntityEntry(modStorage, container.data);
						};

						container.service.provideUpdateData = function doProvideRootItemUpdateData(updateData) {
							return self.provideParentItemUpdateData(container.service, container.data, updateData);
						};

						container.service.revertProcessItems = function doRevertProcessRootItem(modStorage) {
							if (options.entitySelection && options.entitySelection.supportsMultiSelection) {
								self.revertProcessParentItems(modStorage, container.service, container.data);
							}
							self.revertProcessParentItem(modStorage, container.service, container.data);
						};

						container.service.mergeInUpdateData = function doMergeInRootUpdateData(updateData) {
							return self.mergeInParentUpdateData(container.service, container.data, updateData, true);
						};

						container.data.doClearModifications = function doClearModificationsInRoot(entity, data) {
							self.clearModificationsInRoot(container.service, data, entity);
						};
					} else {
						if (options.entityRole.node) {
							container.service.addOrExtendEntityToModified = function addOrExtendEntityToModified(elemState, entity, extendObj) {
								self.addOrExtendNodeEntityToModified(elemState, entity, container.data, extendObj);
							};

							container.service.addEntityToModified = function doAddNodeEntityToModified(elemState, entity, modState) {
								self.addNodeEntityToModified(elemState, entity, container.data, modState);
							};

							container.service.addEntitiesToModified = function doAddNodeEntitiesToModified(elemState, entities, modState) {
								self.addNodeEntitiesToModified(elemState, entities, container.data, modState);
							};

							container.service.addEntityToDeleted = function doAddNodeEntityToDeleted(elemState, entity, data, modState) {
								self.addNodeEntityToDeleted(elemState, entity, data, modState);
							};

							container.service.addEntitiesToDeleted = function doAddNodeEntitiesToDeleted(elemState, entities, data, modState) {
								self.addLeafEntitiesToDeleted(elemState, entities, data, modState);
							};

							container.service.assertSelectedEntityEntry = function doAssertSelectedNodeEntityEntry(modStorage) {
								return self.assertSelectedNodeEntityEntry(modStorage, container.service, container.data);
							};

							container.service.tryGetSelectedEntityEntry = function doTryGetSelectedNodeEntityEntry(modStorage) {
								return self.tryGetSelectedNodeEntityEntry(modStorage, container.data);
							};

							container.service.provideUpdateData = function doProvideNodeItemsUpdateData(updateData) {
								return self.provideNodeItemsUpdateData(container.service, container.data, updateData);
							};

							container.service.revertProcessItems = function doRevertProcessNodeItems(modStorage) {
								return self.revertProcessNodeItems(modStorage, container.service, container.data);
							};

							container.service.mergeInUpdateData = function doMergeInNodeUpdateData(updateData) {
								return self.mergeInNodeUpdateData(container.service, container.data, updateData);
							};

							container.data.doClearModifications = function doClearModificationsInNode(entity, data) {
								self.clearModificationsInNode(container.service, data, entity);
							};

							container.service.tryGetSelectedEntry = function doTryGetSelectedNodeEntry(elemStates) {
								var sel = container.service.getSelected();
								var res = null;
								if (sel && sel.Id) {
									res = _.find(elemStates, {MainItemId: sel.Id});
								}
								return res;
							};
						} else {
							container.service.addOrExtendEntityToModified = function addOrExtendEntityToModified(elemState, entity, extendObj) {
								self.addOrExtendLeafEntityToModified(elemState, entity, container.data, extendObj);
							};

							container.service.addEntityToModified = function doAddLeafEntityToModified(elemState, entity, modState) {
								self.addLeafEntityToModified(elemState, entity, container.data, modState);
							};

							container.service.addEntitiesToModified = function doAddLeafEntitiesToModified(elemState, entities, modState) {
								self.addLeafEntitiesToModified(elemState, entities, container.data, modState);
							};

							container.service.addEntityToDeleted = function doAddLeafEntityToDeleted(elemState, entity, data, modState) {
								self.addLeafEntityToDeleted(elemState, entity, data, modState);
							};

							container.service.addEntitiesToDeleted = function doAddLeafEntitiesToDeleted(elemState, entities, data, modState) {
								self.addLeafEntitiesToDeleted(elemState, entities, data, modState);
							};

							container.service.provideUpdateData = function doProvideLeafItemsUpdateData(updateData) {
								return self.provideLeafItemsUpdateData(container.service, container.data, updateData);
							};

							container.service.revertProcessItems = function doRevertProcessLeafItems(modStorage) {
								return self.revertProcessLeafItems(modStorage, container.service, container.data);
							};

							container.service.mergeInUpdateData = function doMergeInLeafUpdateData(updateData) {
								return self.mergeInLeafUpdateData(container.service, container.data, updateData);
							};

							container.data.doClearModifications = function doClearModificationsInLeaf(entity, data) {
								self.clearModificationsInLeaf(container.service, data, entity);
							};

							container.service.tryGetSelectedEntry = function doTryGetSelectedLeafEntry(elemStates) {
								var sel = container.service.getSelected();
								var res = null;
								if (sel && sel.Id) {
									res = _.find(elemStates, {Id: sel.Id});
								}
								return res;
							};
						}

						container.service.assertTypeEntries = function doAssertTypeEntries(modStorage) {
							modStorage = modStorage || {};
							if (!modStorage[container.data.itemName + 'ToSave']) {
								modStorage[container.data.itemName + 'ToSave'] = [];
							}
						};

						container.service.tryGetTypeEntries = function doTryGetTypeEntries(modStorage) {
							return modStorage[container.data.itemName + 'ToSave'];
						};
					}
				} else {
					container.data.doClearModifications = function doNothingToClearModifications() {
					};
				}
			}

			container.service.isReadonly = function isReadonly() {
				return (options.modification && (options.modification !== 'none')) ? false : true;
			};
		};

		this.addOrExtendRootEntityToModified = function addOrExtendRootEntityToModified(modStorage, entity, data, options, extendObj){
			if (options.entitySelection && options.entitySelection.supportsMultiSelection){
				if (modStorage[data.itemName]){
					const entityInModified = _.find(modStorage[data.itemName], function(modified){
						return modified.Id === entity.Id;
					});
					if(entityInModified){
						angular.extend(entityInModified, extendObj);
						return;
					}
				}
				angular.extend(entity, extendObj);
				this.addRootEntitiesToModified(modStorage, [entity], data);
			}else{
				if(modStorage[data.itemName]){
					angular.extend(modStorage[data.itemName], extendObj);
					return;
				}
				angular.extend(entity, extendObj);
				this.addRootEntityToModified(modStorage, [entity], data);
			}
		};

		this.addRootEntityToModified = function addRootEntityToModified(modStorage, entity, data) {
			if (!modStorage[data.itemName]) {
				modStorage[data.itemName] = entity;
				modStorage.EntitiesCount += 1;
			}
		};

		this.addRootEntitiesToModified = function addRootEntitiesToModified(modStorage, entities, data) {
			if (!modStorage[data.itemName]) {
				modStorage[data.itemName] = [];
			}

			var newEntities = _.filter(entities, function (entity) {
				return !_.find(modStorage[data.itemName], function (modified) {
					return modified.Id === entity.Id;
				});
			});

			if (newEntities && newEntities.length > 0) {
				_.forEach(newEntities, function (entity) {
					modStorage[data.itemName].push(entity);
				});
				modStorage.EntitiesCount += newEntities.length;
			}

			return newEntities;
		};

		this.addOrExtendNodeEntityToModified = function addOrExtendNodeEntityToModified(modStorage, entity, data, extendObj){
			const propName = data.itemName + 'ToSave';
			modStorage = modStorage || {};
			if (modStorage[propName]) {
				const toSearch = self.createNodeSearchExpression(entity);
				const to = _.find(modStorage[propName], toSearch);
				if(to && to[data.itemName]){
					angular.extend(to[data.itemName], extendObj);
					return;
				}
			}
			angular.extend(entity, extendObj);
			this.addNodeEntityToModified(modStorage, entity, data, modStorage);
		};

		this.addNodeEntityToModified = function addNodeEntityToModified(elemState, entity, data, modState) {
			self.buildEntryAndAddAsModified(elemState, entity, data, modState, self.createNodeEntry,
				self.createNodeSearchExpression, self.hasToAddNodeEntry);
		};

		this.addNodeEntitiesToModified = function addNodeEntitiesToModified(elemState, entities, data, modState) {
			self.buildEntriesAndAddAsModified(elemState, entities, data, modState, self.createNodeEntry,
				self.createNodeSearchExpression, self.hasToAddNodeEntry);
		};

		this.addOrExtendLeafEntityToModified = function addOrExtendLeafEntityToModified(modStorage, entity, data, extendObj){
			const propName = data.itemName + 'ToSave';
			if (modStorage && modStorage[propName]) {
				const toSearch = self.createLeafSearchExpression(entity);
				const entityInModified = _.find(modStorage[propName], toSearch);
				if(entityInModified){
					angular.extend(entityInModified, extendObj);
					return;
				}
			}
			angular.extend(entity, extendObj);
			this.addLeafEntityToModified(modStorage, entity, data, modStorage);
		};

		this.addLeafEntityToModified = function addLeafEntityToModified(elemState, entity, data, modState) {
			self.buildEntryAndAddAsModified(elemState, entity, data, modState, self.createLeafEntry,
				self.createLeafSearchExpression, self.hasToAddLeafEntry);
		};

		this.addLeafEntitiesToModified = function addLeafEntitiesToModified(elemState, entities, data, modState) {
			self.buildEntriesAndAddAsModified(elemState, entities, data, modState, self.createLeafEntry,
				self.createLeafSearchExpression, self.hasToAddLeafEntry);
		};

		this.createNodeEntry = function createNodeEntry(entity, data) {
			var entry = {MainItemId: entity.Id};
			entry[data.itemName] = entity;
			return entry;
		};

		this.createLeafEntry = function createLeafEntry(entity) {
			return entity;
		};

		this.createNodeSearchExpression = function createNodeSearchExpression(entity) {
			return {MainItemId: entity.Id};
		};

		this.createLeafSearchExpression = function createLeafSearchExpression(entity) {
			return {Id: entity.Id};
		};

		this.hasToAddNodeEntry = function hasToAddNodeEntry(entry, data) {
			return !entry || !entry[data.itemName];
		};

		this.hasToAddLeafEntry = function hasToAddLeafEntry(entry) {
			return !entry;
		};

		/* jshint -W072 */ // many parameters because they are used
		this.buildEntryAndAddAsModified = function buildEntryAndAddAsModified(elemState, entity, data, modState, buildFunc, searchFunc, evalAddFunc) {
			var propName = data.itemName + 'ToSave';
			elemState = elemState || {};
			var action = {};
			if (!elemState[propName]) {
				elemState[propName] = [];
				action = {add: true, entry: null};
			} else {
				action = self.hasToAddEntityToModified(elemState, propName, entity, data, searchFunc, evalAddFunc);
			}

			self.addEntityEntryToModified(elemState, modState, propName, action, entity, data, buildFunc);
		};

		/* jshint -W072 */ // many parameters because they are used
		this.buildEntriesAndAddAsModified = function buildEntriesAndAddAsModified(elemState, entities, data, modState, buildFunc, searchFunc, evalAddFunc) {
			var propName = data.itemName + 'ToSave';
			var useSearch = true;
			if (!elemState[propName]) {
				elemState[propName] = [];
				useSearch = false;
			}

			_.forEach(entities, function (entity) {
				var action = useSearch ? self.hasToAddEntityToModified(elemState, propName, entity, data, searchFunc, evalAddFunc) : {add: true, entry: null};
				self.addEntityEntryToModified(elemState, modState, propName, action, entity, data, buildFunc);
			});
		};

		/* jshint -W072 */ // many parameters because they are used
		this.hasToAddEntityToModified = function hasToAddEntityToModified(elemState, propName, entity, data, searchFunc, evalAddFunc) {
			var toSearch = searchFunc(entity);
			var to = _.find(elemState[propName], toSearch);// If it is not in already we got null. Not null is true
			return {add: evalAddFunc(to, data), entry: to};
		};

		/* jshint -W072 */ // many parameters because they are used
		this.addEntityEntryToModified = function addEntityEntryToModified(elemState, modState, propName, action, entity, data, buildFunc) {
			if (action.add) {
				var newEntry = buildFunc(entity, data);
				if (!action.entry) {
					elemState[propName].push(newEntry);
				} else {
					angular.extend(action.entry, newEntry);
				}
				modState.EntitiesCount += 1;
			}
		};

		this.assertSelectedRootEntityEntry = function assertSelectedRootEntityEntry(modStorage, entity) {
			if (entity && entity.Id) {
				modStorage.MainItemId = entity.Id;
			}

			return modStorage;
		};

		this.assertSelectedNodeEntityEntryById = function assertSelectedNodeEntityEntryById(modStorage, itemId, service, data) {
			var toInsert = null;
			if (itemId) {
				service.assertTypeEntries(modStorage);
				toInsert = {MainItemId: itemId};
				var entry = _.find(modStorage[data.itemName + 'ToSave'], toInsert);
				if (!entry) {
					modStorage[data.itemName + 'ToSave'].push(toInsert);
				} else {
					toInsert = entry;
				}
			}

			return toInsert;
		};

		this.assertSelectedNodeEntityEntry = function assertSelectedNodeEntityEntry(modStorage, service, data) {
			var toInsert = null;
			if (data.selectedItem && data.selectedItem.Id) {
				toInsert = self.assertSelectedNodeEntityEntryById(modStorage, data.selectedItem.Id, service, data);
			} else if (data.forceNodeItemCreation) {
				toInsert = self.assertSelectedNodeEntityEntryById(modStorage, -1, service, data);
			}

			return toInsert;
		};

		this.assertPath = function assertPath(root, service, addSel, entity) {
			var parentSrv = service.parentService();
			var elem = root;

			if (parentSrv) {
				elem = self.assertPath(root, parentSrv, true);
				service.assertTypeEntries(elem);

				if (addSel) {
					elem = service.assertSelectedEntityEntry(elem, entity);
				}
			} else {
				elem = service.assertSelectedEntityEntry(elem, entity);
			}

			return elem;
		};

		this.tryGetSelectedRootEntityEntry = function tryGetSelectedRootEntityEntry(modStorage) {
			return modStorage;
		};

		this.tryGetServiceEntriesFromUpdateData = function tryGetServiceEntriesFromUpdateData(updateData, data) {
			var propName = data.itemName;
			if (data.isChildItem()) {
				propName += 'ToSave';
			}

			let res = null;
			if (data.isRoot && _.isFunction(data.getChangedRootEntitiesAsArray)) {
				res = data.getChangedRootEntitiesAsArray(updateData, data, data.getService(), true);
			} else {
				res = updateData[propName];

				if (!data.supportsMultiSelection()) {
					res = [res];
				}
			}

			return res;
		};

		this.tryGetSelectedNodeEntityEntry = function tryGetSelectedNodeEntityEntry(modStorage, data) {
			var entry = null;

			if (data.selectedItem && data.selectedItem.Id) {
				entry = _.find(modStorage[data.itemName], {MainItemId: data.selectedItem.Id});
			}

			return entry;
		};

		this.tryGetPath = function tryGetPath(root, service) {
			var parentSrv = service.parentService();
			var elem = null;

			if (parentSrv) {
				elem = self.tryGetPath(root, parentSrv);

				if (elem) {
					elem = service.tryGetTypeEntries(elem);
				}
				if (elem) {
					elem = service.tryGetSelectedEntry(elem);
				}
			} else {
				elem = root;
			}

			return elem;
		};

		this.markAsModified = function markAsModified(service, entity, data) {
			if (entity && !self.isEntityDeleted(service, entity, data)) {
				var modState = platformModuleStateService.state(service.getModule());
				var elemState = service.assertPath(modState.modifications, false, entity);

				service.addEntityToModified(elemState, entity, modState.modifications);
				data.itemModified.fire(null, entity);
			}
		};

		this.markEntitiesAsModified = function markEntitiesAsModified(service, entities, data) {
			if (entities && entities.length > 0) {
				var modState = platformModuleStateService.state(service.getModule());
				var elemState = service.assertPath(modState.modifications, false, entities[0]);

				service.addEntitiesToModified(elemState, entities, modState.modifications);

				_.forEach(entities, function (entity) {
					data.itemModified.fire(null, entity);
				});
			}
		};

		this.findItemToMerge = function findItemToMerge(item2Merge, data) {
			return (!item2Merge || !item2Merge.Id) ? undefined : _.find(data.itemList, {Id: item2Merge.Id});
		};

		this.getModifications = function getModifications(service) {
			var modState = platformModuleStateService.state(service.getModule());
			var updateData = angular.copy(modState.modifications);

			if (service.hasSelection()) {
				updateData.MainItemId = service.getSelected().Id;
			}

			if (service.provideUpdateData) {
				service.provideUpdateData(updateData);
			}
			if (service.cleanUpLocalData) {
				service.cleanUpLocalData();
			}

			if (updateData.EntitiesCount >= 1) {
				self.revertProcessItems(service, updateData);
			}

			return updateData;
		};

		function getChangedEntities(updateData, data, service, isBeforeUpdate) {
			var copies = [];
			var changed = null;
			if (_.isFunction(data.getChangedRootEntitiesAsArray)) {
				copies = data.getChangedRootEntitiesAsArray(updateData, data, service, isBeforeUpdate);
			} else if (service.supportsMultiSelection()) {
				changed = updateData[data.itemName];
				if (changed) {
					copies = changed;
				}
			} else {
				changed = updateData[data.itemName];
				if (changed) {
					copies = [changed];
				}
			}

			var res = [];
			if (data.doProvideChangedEntitiesAsUpdateData) {
				res = copies;
			} else {
				_.forEach(copies, function (entity) {
					res.push(service.getItemById(entity.Id));
				});
			}

			return res;
		}

		this.clearTranslationChangesInRoot = function clearTranslationChangesInRoot(updateData, data, service) {
			if (_.isFunction(data.clearTranslationChanges)) {
				var entities = getChangedEntities(updateData, data, service, true);

				_.forEach(entities, function (entity) {
					data.clearTranslationChanges(entity, data);
				});
			}
		};

		this.clearModificationsInRoot = function clearModificationsInRoot(service) {
			var modState = platformModuleStateService.state(service.getModule());
			modState.modifications = {EntitiesCount: 0};
		};

		this.makeEntitiesReadOnlyWhileUpdating = function makeEntitiesReadOnlyWhileUpdating(updateData, data, service) {
			platformRuntimeDataService.lock(getChangedEntities(updateData, data, service, true), true);
		};

		this.makeEntitiesEditableAfterUpdating = function makeEntitiesEditableAfterUpdating(updateData, data, service) {
			platformRuntimeDataService.lock(getChangedEntities(updateData, data, service, false), false);
		};

		function modificationsAsArray(input) {
			var entities;
			if (_.isArray(input)) {
				entities = input;
			} else {
				entities = [input];
			}

			return entities;
		}

		this.clearModificationsInNode = function clearModificationsInNode(service, data, entity) {
			var entities = modificationsAsArray(entity);
			entity = null;

			var modState = platformModuleStateService.state(service.getModule());
			var parentState = self.tryGetPath(modState.modifications, service.parentService());

			_.forEach(entities, function (entity) {
				if (parentState && entity && parentState[data.itemName + 'ToSave']) {
					if (_.find(parentState[data.itemName + 'ToSave'], {MainItemId: entity.Id})) {
						parentState[data.itemName + 'ToSave'] = _.filter(parentState[data.itemName + 'ToSave'], function (item) {
							return item.MainItemId !== entity.Id;
						});
						modState.modifications.EntitiesCount -= 1;
					}
				}
			});
		};

		this.clearModificationsInLeaf = function clearModificationsInLeaf(service, data, entity) {
			var entities = modificationsAsArray(entity);
			entity = null;

			var modState = platformModuleStateService.state(service.getModule());
			var parentState = self.tryGetPath(modState.modifications, service.parentService());
			var propName = data.itemName + 'ToSave';

			_.forEach(entities, function (entity) {
				if (parentState && entity && parentState[propName]) {
					if (_.find(parentState[propName], {Id: entity.Id})) {
						parentState[propName] = _.filter(parentState[propName], function (item) {
							return item.Id !== entity.Id;
						});
						modState.modifications.EntitiesCount -= 1;
					}
				}

				if (entity && entity.Version === 0 && modState.modifications[propName]) {
					if (_.find(modState.modifications[propName], {Id: entity.Id})) {
						modState.modifications[propName] = _.filter(modState.modifications[propName], function (item) {
							return item.Id !== entity.Id;
						});
						modState.modifications.EntitiesCount -= 1;
					}
				}
			});
		};

		this.hasModifications = function hasModifications(service) {
			var state = platformModuleStateService.state(service.getModule());

			return state.modifications.EntitiesCount >= 1;
		};

		this.markAsDeleted = function markAsDeleted(service, entity, data) {
			if (entity && entity.Version >= 1) {
				var modState = platformModuleStateService.state(service.getModule());
				var elemState = service.assertPath(modState.modifications, false, entity);

				service.addEntityToDeleted(elemState, entity, data, modState.modifications);
			}
		};

		this.markEntitiesAsDeleted = function markEntitiesAsDeleted(service, entities, data) {
			var storedEntities = _.filter(entities, function (entity) {
				return entity.Version > 0;
			});

			if (storedEntities && storedEntities.length >= 1) {
				var modState = platformModuleStateService.state(service.getModule());
				var elemState = service.assertPath(modState.modifications, false, storedEntities[0]);

				service.addEntitiesToDeleted(elemState, entities, data, modState.modifications);
			}
		};

		this.addNodeEntityToDeleted = function addNodeEntityToDeleted(elemState, entity, data, modState) {
			if (!elemState[data.itemName + 'ToDelete']) {
				elemState[data.itemName + 'ToDelete'] = [];
			}
			elemState[data.itemName + 'ToDelete'].push(entity);
			modState.EntitiesCount += 1;
		};

		this.addLeafEntityToDeleted = function addLeafEntityToDeleted(elemState, entity, data, modState) {
			if (!elemState[data.itemName + 'ToDelete']) {
				elemState[data.itemName + 'ToDelete'] = [];
			}
			elemState[data.itemName + 'ToDelete'].push(entity);
			modState.EntitiesCount += 1;
		};

		this.addLeafEntitiesToDeleted = function addLeafEntitiesToDeleted(elemState, entities, data, modState) {
			if (!elemState[data.itemName + 'ToDelete']) {
				elemState[data.itemName + 'ToDelete'] = [];
			}
			_.forEach(entities, function (entity) {
				elemState[data.itemName + 'ToDelete'].push(entity);
			});
			modState.EntitiesCount += entities.length;
		};

		this.isEntityDeleted = function isEntityDeleted(service, entity) {
			return !service.getItemById(entity.Id);
		};

		this.cleanUpLocalServiceData = function cleanUpLocalServiceData(data, service) {
			if (data.cleanUpLocalData) {
				data.cleanUpLocalData(data);
			}

			var children = service.getChildServices();
			if (children && children.length > 0) {
				_.forEach(children, function (childService) {
					childService.cleanUpLocalData();
				});
			}
		};

		this.provideParentItemUpdateData = function provideParentItemUpdateData(service, data, updateData) {
			if (data.provideUpdateData) {
				data.provideUpdateData(updateData, data);
			}

			var children = service.getChildServices();
			_.forEach(children, function (childService) {
				childService.provideUpdateData(updateData);
			});
		};

		this.provideNodeItemsUpdateData = function provideNodeItemsUpdateData(service, data, updateData) {
			self.provideParentItemUpdateData(service, data, updateData);
		};

		this.provideLeafItemsUpdateData = function provideLeafItemsUpdateData(/* service, data, updateData */) {
			// Not needed yet -> not implemented
		};

		this.revertProcessItems = function revertProcessItems(service, modState) {
			service.revertProcessItems(modState);
		};

		this.revertProcessParentItems = function revertProcessParentItems(modState, service, data) {
			var items = modState[data.itemName];

			if (items) {
				_.forEach(items, function (item, index) {
					self.revertProcessParentEntity(item, modState, service, data, index === 0);
				});
			}
		};

		this.revertProcessParentItem = function revertProcessParentItem(modState, service, data) {
			self.revertProcessParentEntity(modState[data.itemName], modState, service, data, true);
		};

		this.revertProcessParentEntity = function revertProcessParentEntity(entity, modState, service, data, includeChildren) {
			if (entity) {
				platformDataServiceDataProcessorExtension.revertProcessItem(entity, data);
			}

			if (includeChildren) {
				var children = service.getChildServices();
				_.forEach(children, function (childService) {
					childService.revertProcessItems(modState);
				});
			}
		};

		this.revertProcessNodeItems = function revertProcessNodeItems(modState, service, data) {
			if (modState[data.itemName + 'ToSave']) {
				_.forEach(modState[data.itemName + 'ToSave'], function (childState) {
					self.revertProcessParentItem(childState, service, data);
				});
				platformDataServiceDataProcessorExtension.revertProcessDeletedItems(modState[data.itemName + 'ToDelete'], data);
			}
		};

		this.revertProcessLeafItems = function revertProcessLeafItems(modState, service, data) {
			if (modState[data.itemName + 'ToSave']) {
				platformDataServiceDataProcessorExtension.revertProcessItems(modState[data.itemName + 'ToSave'], data);
				platformDataServiceDataProcessorExtension.revertProcessDeletedItems(modState[data.itemName + 'ToDelete'], data);
			}
		};

		this.mergeInUpdateData = function mergeInUpdateData(service, data, updateData) {
			service.mergeInUpdateData(updateData);
		};

		this.mergeInParentUpdateData = function mergeInParentUpdateData(service, data, updateData, handleMe) {
			if (handleMe && updateData[data.itemName]) {
				var updateItem = updateData[data.itemName];
				var oldItem = service.findItemToMerge(updateItem);
				if (oldItem) {
					data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem, true, data);
				}
			}

			var children = service.getChildServices();
			_.forEach(children, function (childService) {
				childService.mergeInUpdateData(updateData);
			});
		};

		this.mergeInNodeUpdateData = function mergeInNodeUpdateData(service, data, updateData) {
			if (updateData[data.itemName + 'ToSave']) {
				_.forEach(updateData[data.itemName + 'ToSave'], function (childData) {
					self.mergeInParentUpdateData(service, data, childData, true);
				});
			}
		};

		this.mergeInLeafUpdateData = function mergeInLeafUpdateData(service, data, updateData) {
			if (updateData[data.itemName + 'ToSave']) {
				if (service.mergeUpdatedDataInCache) {// If the service provides a special message to handle the merge of updated data, we do
					// not do anything. It is up to the service than
					service.mergeUpdatedDataInCache(updateData, data);
				} else {
					_.forEach(updateData[data.itemName + 'ToSave'], function (updateItem) {
						var oldItem = service.findItemToMerge(updateItem);
						if (oldItem) {
							data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem, true, data);
						}
					});
				}
			}
		};
	}
})();
