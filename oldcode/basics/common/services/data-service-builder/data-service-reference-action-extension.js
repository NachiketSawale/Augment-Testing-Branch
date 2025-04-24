/**
 * Created by waz on 4/9/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCommonBaseDataServiceReferenceActionExtension
	 * @description
	 * Extension for data service's reference actions, reference means some objects that has existed in the database,
	 * in some bussiness, we must dynamic make the existent items show or remove in the data service wihtout service-layer request,
	 * this extension provide some kind of methods to do this.
	 *
	 * When we create references, we won't create a new entry in the database, we will find some objects that is exists,
	 * and modify its value(most of the time is one of the foreign key), show them in the ui.
	 *
	 * Also the delete references won't delete a entry in the database, we will modify the reference item(most of the time is one of the foreign key),
	 * and remove it in the ui. Because we just modify the value instead of deleting the entry, so the modification should be merged into ToSave
	 */
	const moduleName = 'basics.common';
	angular.module(moduleName).service('basicsCommonBaseDataServiceReferenceActionExtension', ReferenceActionExtension);

	ReferenceActionExtension.$inject = [
		'$injector',
		'$http',
		'PlatformMessenger',
		'platformListSelectionDialogService',
		'platformDataServiceSelectionExtension',
		'basicsCommonDataServiceChangeManager',
		'_'];

	function ReferenceActionExtension(
		$injector,
		$http,
		PlatformMessenger,
		platformListSelectionDialogService,
		platformDataServiceSelectionExtension,
		serviceChangeManager,
		_) {

		const self = this;
		const defaultIdProerty = 'Id';
		const defaultDisplayProerty = 'Code';
		const assignedItemStorage = {};

		/**
		 * Add reference methods to data serivce
		 * @param container
		 * service container
		 * @param actions
		 * Assign options,eg:
		 * {
		 * createReference: {
		 * availableColumns: [{
		 * id: 'fieldId',
		 * field: 'fieldName',
		 * name: '*Field name',
		 * name$tr$: 'module.submodule.field',
		 * editor: null,
		 * formatter: 'description'
		 * }]
		 * referenceRequest: {
		 * method: 'GET',
		 * url: globals.webApiBaseUrl + 'module/submodule/route'
		 * },
		 * afterOkClicked: function(selectdItems) { // do some thing }
		 * },
		 * deleteReference: true,
		 * referenceForeignKeyProperty: 'foreignKey'
		 * }
		 */
		this.addReferenceActions = function (container, actions) {
			const service = container.service;

			service.showItems = showItems;
			service.notShowItems = notShowItems;
			service.refershItem = refershItem;
			service.clearAndShowItems = clearAndShowItems;
			container.data.removeEntityFromCache = removeEntityFromCache;
			container.data.updateEntityFromCache = updateEntityFromCache;
			if (actions) {
				if (actions.createReference) {
					container.data.referenceCreated = new PlatformMessenger();
					service.canCreateReference = actions.canCreateReference ? actions.canCreateReference : canCreateReference;
					service.createReferences = createReferences;
					service.showReferencesSelectionDialog = showReferencesSelectionDialog;
					service.registerReferenceCreated = registerReferenceCreated;
					service.fireReferenceCreated = fireReferenceCreated;
				}
				if (actions.deleteReference) {
					container.data.referenceDeleted = new PlatformMessenger();
					service.canDeleteReference = actions.canDeleteReference ? actions.canDeleteReference : canDeleteReference;
					service.deleteReferences = deleteReferences;
					service.deleteSelectedReferences = deleteSelectedReferences;
					service.registerReferenceDeleted = registerReferenceDeleted;
					service.fireReferenceDeleted = fireReferenceDeleted;

					// make items return to source data service after the delete reference button clicked
					if (!_.isNil(actions.referenceSourceDataService)) {
						serviceChangeManager.registerEvent(service, actions.referenceSourceDataService, 'registerReferenceDeleted',
							function (deleteItems) {
								if (!_.isNil(showItems) && this.canCreateReference()) {
									showItems(deleteItems, actions.referenceForeignKeyProperty);
								}
							});
					}
				}
				if (actions.createReference || actions.deleteReference) {
					service.assignReferences = assignReferences;
				}
			}

			function showItems(items) {
				self.showItems(container, items);
			}

			function notShowItems(items) {
				self.notShowItems(container, items);
			}

			function refershItem(item) {
				self.refershItem(container, item);
			}

			function clearAndShowItems(items) {
				self.clearAndShowItems(container, items);
			}

			function assignReferences(assignItems, targetDataService, foreignKeyProperty, foreignKeyValue) {
				self.assignReferences(container, assignItems, targetDataService, foreignKeyProperty, foreignKeyValue);
			}

			function canCreateReference() {
				return true;
			}

			function createReferences(createItems, referenceForeignKeyProperty, referenceForeignKeyValue) {
				const parentService = container.service.parentService();
				const foreignKeyProperty = _.isNil(referenceForeignKeyProperty) ? actions.referenceForeignKeyProperty : referenceForeignKeyProperty;
				if (_.isNil(parentService) || _.isNil(foreignKeyProperty)) {
					return;
				}

				const parentForeignKeyProperty = _.isNil(actions.parentForeignKeyProperty) ? defaultIdProerty : actions.parentForeignKeyProperty;
				const foreignKeyValue = _.isNil(referenceForeignKeyValue) ? parentService.getSelected()[parentForeignKeyProperty] : referenceForeignKeyValue;
				self.createReferences(container, createItems, foreignKeyProperty, foreignKeyValue);
			}

			function showReferencesSelectionDialog() {
				self.showReferencesSelectionDialog(container, actions);
			}

			function canDeleteReference() {
				return true;
			}

			function deleteSelectedReferences(referenceForeignKeyProperty) {
				const foreignKeyProperty = _.isNil(referenceForeignKeyProperty) ? actions.referenceForeignKeyProperty : referenceForeignKeyProperty;
				return self.deleteSelectedReferences(container, foreignKeyProperty);
			}

			function deleteReferences(deleteItems, referenceForeignKeyProperty) {
				const foreignKeyProperty = referenceForeignKeyProperty ? referenceForeignKeyProperty : actions.referenceForeignKeyProperty;
				self.deleteReferences(container, deleteItems, foreignKeyProperty);
			}

			function registerReferenceCreated(callback) {
				container.data.referenceCreated.register(callback);
			}

			function registerReferenceDeleted(callback) {
				container.data.referenceDeleted.register(callback);
			}

			function fireReferenceCreated(e, createItems) {
				container.data.referenceCreated.fire(e, createItems);
			}

			function fireReferenceDeleted(e, deleteItems) {
				container.data.referenceDeleted.fire(e, deleteItems);
			}
		};

		/**
		 * Show items in container, not saveable, only for display
		 * @param container
		 * service container
		 * @param items
		 * items need to be shown
		 */
		this.showItems = function (container, items) {
			if (container.data.addEntityToCache) {
				_.forEach(items, function (item) {
					container.data.addEntityToCache(item, container.data);
				});
			}

			const showIds = _.map(items, defaultIdProerty);
			container.data.itemList = _.concat(_.filter(container.service.getList(), function (item) {
				return !_.includes(showIds, item[defaultIdProerty]);
			}), items);
			container.data.listLoaded.fire();
		};

		/**
		 * Remove the existing items in container, not saveable, only for display
		 * @param container
		 * service container
		 * @param items
		 * items need to be removed in the ui
		 */
		this.notShowItems = function (container, items) {
			if (items.length === 0) {
				return;
			}

			if (container.data.usesCache) {
				_.forEach(items, function (item) {
					removeEntityFromCache(container, item, container.data);
				});
			}

			const ids = _.map(items, defaultIdProerty);
			const selectedIndex = _.indexOf(container.data.itemList, items[0]);
			container.data.itemList = _.filter(container.service.getList(), function (item) {
				return !_.includes(ids, item[defaultIdProerty]);
			});
			container.data.listLoaded.fire();
			platformDataServiceSelectionExtension.doSelectCloseTo(selectedIndex, container.data);
		};

		/**
		 * Refersh the existing item in container, not saveable, only for display
		 * @param container
		 * service container
		 * @param item
		 * item need to refersh
		 */
		this.refershItem = function (container, item) {
			if (container.data.usesCache) {
				updateEntityFromCache(container, item, container.data);
			}

			const i = _.indexOf(container.data.itemList, {Id: item[defaultIdProerty]});
			container.data.itemList[i] = item;
			container.data.listLoaded.fire();
		};

		this.clearAndShowItems = function (container, items) {
			const data = container.data;
			if (data.usesCache) {
				const currentParentItem = angular.isDefined(data.currentParentItem) && (data.currentParentItem !== null) ? data.currentParentItem : container.data.parentService.getSelected();
				const cache = data.provideCacheFor(currentParentItem.Id, data);
				if (cache) {
					cache.loadedItems.length = 0;
				}
			}

			data.itemList.length = 0;
			this.showItems(container, items);
		};

		/**
		 * Create references in container, saveable
		 * @param container
		 * service container
		 * @param createItems
		 * the reference items need to be created
		 * @param referenceForeignKeyProperty
		 * the reference foreign key property, when we create reference items, we need to set the value of reference foreign key as referenceForeignKeyValue
		 * @param referenceForeignKeyValue
		 * the reference foreign key value
		 */
		this.createReferences = function (container, createItems, referenceForeignKeyProperty, referenceForeignKeyValue) {
			onCreateReferences(container, createItems, referenceForeignKeyProperty, referenceForeignKeyValue);
			this.showItems(container, createItems);
			container.service.markEntitiesAsModified(createItems);
			if (container.data.referenceCreated) {
				container.data.referenceCreated.fire(null, createItems);
			}
		};

		/**
		 * Show references selection dialog, it will show platformListSelectionDialog
		 * @param container
		 * service container
		 * @param actions
		 * action options,eg:
		 * {
		 * availableColumns: [{
		 * id: 'fieldId',
		 * field: 'fieldName',
		 * name: '*Field name',
		 * name$tr$: 'module.submodule.field',
		 * editor: null,
		 * formatter: 'description'
		 * }]
		 * referenceRequest: {
		 * method: 'GET',
		 * url: globals.webApiBaseUrl + 'module/submodule/route'
		 * },
		 * afterOkClicked: function(selectdItems) { // do some thing }
		 */
		this.showReferencesSelectionDialog = function (container, actions) {
			const createReferenceOptions = actions.createReference;
			createReferenceOptions.referenceRequest().then(function (items) {
				const idProperty = _.isNil(createReferenceOptions.idProperty) ? defaultIdProerty : createReferenceOptions.idProperty;
				const displayNameProperty = _.isNil(createReferenceOptions.displayNameProperty) ? defaultDisplayProerty : createReferenceOptions.displayNameProperty;
				const value = _.isNil(createReferenceOptions.value) ? _.map(container.service.getList(), createReferenceOptions.idProperty) : createReferenceOptions.value;
				const options = _.assign({
					allItems: items,
					idProperty: idProperty,
					displayNameProperty: displayNameProperty,
					value: value
				}, createReferenceOptions);
				const afterOkClickedFn = createReferenceOptions.afterOkClicked;
				platformListSelectionDialogService.showDialog(options).then(function (result) {
					const listIds = _.map(value, idProperty);
					const selectedItems = _.filter(result.value, function (item) {
						return !_.includes(listIds, item[idProperty]);
					});

					const foreignKeyProperty = actions.referenceForeignKeyProperty;
					const parentForeignKeyProperty = _.isNil(actions.parentForeignKeyProperty) ? defaultIdProerty : actions.parentForeignKeyProperty;
					const parentService = container.service.parentService();
					if (_.isNil(parentService) || _.isNil(foreignKeyProperty)) {
						return;
					}
					const referenceForeignKeyValue = parentService.getSelected()[parentForeignKeyProperty];
					self.createReferences(container, selectedItems, foreignKeyProperty, referenceForeignKeyValue);
					if (!_.isNil(afterOkClickedFn)) {
						afterOkClickedFn.call(this, selectedItems);
					}
				});
			});
		};

		/**
		 * Delete references, saveable, the modify result will be merged into ToSave
		 * @param container
		 * service container
		 * @param deleteItems
		 * the reference items need to be deleted
		 * @param referenceForeignKeyProperty
		 * the reference foreign key property, when we delete reference items, we need to set the value of reference foreign key as null
		 */
		this.deleteReferences = function (container, deleteItems, referenceForeignKeyProperty) {
			onDeleteReferences(container, deleteItems, referenceForeignKeyProperty);
			container.service.markEntitiesAsModified(deleteItems);
			if (container.data.referenceDeleted) {
				container.data.referenceDeleted.fire(null, deleteItems);
			}
			this.notShowItems(container, deleteItems);
		};

		/**
		 * Delete seleted references, saveable, the modify result will be merged into ToSave
		 * @param container
		 * service container
		 * @param referenceForeignKeyProperty
		 * the reference foreign key property, when we delete reference items, we need to set the value of reference foreign key as null
		 */
		this.deleteSelectedReferences = function (container, referenceForeignKeyProperty) {
			let selectedItems = container.service.getSelectedEntities ? container.service.getSelectedEntities() : container.service.getSelected();
			selectedItems = _.isArray(selectedItems) ? selectedItems : [selectedItems];
			this.deleteReferences(container, selectedItems, referenceForeignKeyProperty);
		};

		/**
		 * Assign references from this data service to target data service, the reference items will be remove from this data service and move to the
		 * target data service, at last the reference items will be saved in the target data service
		 * @param container
		 * service container
		 * @param assignItems
		 * the reference items need to be assigned
		 * @param targetDataService
		 * target data service
		 * @param foreignKeyProperty
		 * the reference foreign key property, when we assign reference items, we need to set the value of reference foreign key as foreignKeyValue
		 * @param foreignKeyValue
		 * the reference foreign key value
		 */
		this.assignReferences = function (container, assignItems, targetDataService, foreignKeyProperty, foreignKeyValue) {
			this.notShowItems(container, assignItems);
			_.forEach(assignItems, function (item) {
				item[foreignKeyProperty] = foreignKeyValue;
			});
			targetDataService.createReferences(assignItems, foreignKeyProperty, foreignKeyValue);
		};

		/**
		 * Get the assigned items record
		 * @param key
		 * record key
		 */
		this.getAssignedItemsRecord = function (key) {
			return assignedItemStorage[key];
		};

		/**
		 * Record the items which has been assigned
		 * @param key record key
		 * @param assignedItems the items has been assigned
		 */
		this.recordAssignedItems = function (key, assignedItems) {
			assignedItemStorage[key] = assignedItemStorage[key] ? assignedItemStorage[key] : [];
			_.forEach(assignedItems, function (item) {
				if (!_.find(assignedItemStorage[key], {Id: item.Id})) {
					assignedItemStorage[key].push(item);
				}
			});
			return assignedItemStorage[key];
		};

		/**
		 * Remove the record of assigned items
		 * @param key
		 * record key
		 * @param assignedItemIds
		 * the item ids has been assigned
		 */
		this.removeAssignedItemsRecord = function (key, assignedItemIds) {
			if (!assignedItemStorage[key]) {
				return;
			}

			assignedItemStorage[key] = _.filter(assignedItemStorage[key], function (item) {
				return !_.includes(assignedItemIds, item.Id);
			});
			return assignedItemStorage[key];
		};

		/**
		 * Clear the assigned items record
		 * @param key
		 * record key
		 */
		this.clearAssignedItemsRecord = function (key) {
			assignedItemStorage[key] = [];
			return assignedItemStorage[key];
		};

		function onCreateReferences(container, createItems, foreignKeyProperty, referenceForeignKeyValue) {
			_.forEach(createItems, function (item) {
				item.IsCreated = true;
				item[foreignKeyProperty] = referenceForeignKeyValue;
			});
		}

		function onDeleteReferences(container, deleteItems, foreignKeyProperty) {
			if (_.isNil(foreignKeyProperty)) {
				return;
			}

			_.forEach(deleteItems, function (item) {
				item.IsDeleted = true;
				item[foreignKeyProperty] = null;
			});
		}

		function removeEntityFromCache(container, entity, data) {
			const currentParentItem = angular.isDefined(data.currentParentItem) && (data.currentParentItem !== null) ? data.currentParentItem : container.data.parentService.getSelected();
			const cache = angular.isDefined(currentParentItem) && (currentParentItem !== null) ? data.provideCacheFor(currentParentItem.Id, data) : null;
			if (cache) {
				cache.loadedItems = _.filter(cache.loadedItems, function (item) {
					return item.Id !== entity.Id;
				});
			}
		}

		function updateEntityFromCache(container, entity, data) {
			const currentParentItem = angular.isDefined(data.currentParentItem) && (data.currentParentItem !== null) ? data.currentParentItem : container.data.parentService.getSelected();
			const cache = angular.isDefined(currentParentItem) && (currentParentItem !== null) ? data.provideCacheFor(currentParentItem.Id, data) : null;
			if (cache) {
				const i = _.indexOf(cache.loadedItems, {Id: entity[defaultIdProerty]});
				cache.loadedItems[i] = entity;
			}
		}
	}
})(angular);
