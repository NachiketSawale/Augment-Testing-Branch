/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceSelectionExtension
	 * @function
	 * @description
	 * platformDataServiceSelectionExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceSelectionExtension', PlatformDataServiceSelectionExtension);

	PlatformDataServiceSelectionExtension.$inject = ['$q', '_', 'platformContextService'];

	function PlatformDataServiceSelectionExtension($q, _, platformContextService) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceSelectionExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.addEntitySelection = function addEntitySelection(container, options) {
			if (options.entitySelection) {
				container.data.numberOfSelectionChangeRequests = 0;
				container.data.fireSelectionChangedEventAlways = true;//Set to false, when a late firing does not harm.
				container.data.selectedItem = null;
				container.data.selectedEntities = [];
				container.data.registerAndCreateEventMessenger('selectionChanged');
				container.data.registerAndCreateEventMessenger('selectedEntitiesChanged');

				container.service.getSelected = function getSelectedEntity() {
					return self.getSelected(container.data);
				};

				container.service.getSelectedEntities = function getSelectedEntities() {
					return self.getSelectedEntities(container.data);
				};

				container.service.setSelected = function (item, entities) {
					var entityList = entities ? entities : [];
					var ts = item || null;
					if (!_.isNil(ts) && entityList.length === 0) {
						entityList.push(ts);
					}
					container.data.numberOfSelectionChangeRequests += 1;

					return self.doMultiSelect(ts, entityList, container.data, container.data.numberOfSelectionChangeRequests);
				};

				container.service.setSelectedEntities = function setSelectedEntities(entities) {
					return self.doSelectEntities(entities, container.data);
				};

				container.service.deselect = function deselect() {

					return self.deselect(container.data);
				};

				container.service.isSelection = function isSelection(item) {
					return self.isSelection(item);
				};

				container.service.hasSelection = function hasSelection() {
					return self.isSelection(self.getSelected(container.data));
				};

				container.service.getIfSelectedIdElse = function getIfSelectedIdElse(elseValue) {
					var sel = self.getSelected(container.data);
					return self.isSelection(sel) ? sel.Id : elseValue;
				};

				if (options.entitySelection.supportsMultiSelection) {
					container.service.deleteSelection = function deleteSelection() {
						return container.service.deleteEntities(self.getSelectedEntities(container.data));
					};

				} else {
					container.service.deleteSelection = function deleteSelection() {
						return container.service.deleteItem(self.getSelected(container.data));
					};
				}
				container.data.supportsMultiSelection = function supportsMultiSelection() {
					return options.entitySelection.supportsMultiSelection;
				};
				container.service.supportsMultiSelection = function supportsMultiSelection() {
					return options.entitySelection.supportsMultiSelection;
				};
			}
		};

		this.doSelectCloseTo = function doSelectCloseTo(index, data) {
			var item = null;
			if (index >= 0 && index < data.itemList.length) {// Another item available, so we chose the next
				item = data.itemList[index];
			} else {
				if (index > 0) {// Last item was removed, chose the one before
					item = data.itemList[index - 1];
				}
			}

			return self.doSelect(item, data);
		};

		function isNewSelection(oldSel, newSel) {
			return (oldSel && !newSel) || (!oldSel && newSel) || (oldSel && newSel && oldSel.Id !== newSel.Id);
		}

		function finishSelectionChange(entity, data, fireChange) {
			if (data.trackSelections) {
				data.trackSelections(entity, data);
			}

			if (isNewSelection(data.selectedItem, entity)) {
				data.selectedItem = null;
				if (data.unloadSubEntities) {
					data.unloadSubEntities(data);
				}

				data.selectedItem = entity;

				if (data.clearDependentCaches) {
					data.clearDependentCaches(data);
				}

				if (data.showHeaderAfterSelectionChanged) {
					data.showHeaderAfterSelectionChanged(entity, data);
				}

				if(fireChange) {
					data.selectionChanged.fire(null, entity);
				}

				if (data.startSubEntityLoad) {
					data.startSubEntityLoad(entity);
				}

				if (entity && data.translateEntity) {
					data.translateEntity(data);
				}

				if (data.showRemarks) {
					data.showRemarks(data);
				}

				// Reactivate watch on currently selected item
				data.enableWatchSelected(data.selectedItem, data);
			}

			// set or reset current PermissionObjectInfo
			if (data.isRoot && data.selectedItem !== null && data.isRealRootForOpenedModule()) {
				platformContextService.setPermissionObjectInfo(_.get(data.selectedItem, 'PermissionObjectInfo') || _.get(data.selectedItem, 'permissionObjectInfo'));
			}

			return data.selectedItem;
		}

		this.supportSelection = function supportSelection(data) {
			return data.selectionChanged;
		};

		this.doSelect = function doSelect(entity, data) {
			var entities = [];
			if (!_.isNull(entity)) {
				entities.push(entity);
			}

			data.numberOfSelectionChangeRequests += 1;

			return self.doMultiSelect(entity, entities, data, data.numberOfSelectionChangeRequests);
		};

		this.doMultiSelect = function doMultiSelect(entity, entities, data, changeRequestsWhenTriggered) {
			self.doSelectEntities(entities, data);

			if (data.selectedItem && entity && entity.Id === data.selectedItem.Id) {
				return $q.when(entity);
			}

			if (data.checkTranslationForChanges) {
				data.checkTranslationForChanges(data);
			}

			// Avoid unnecessary triggered watch when doing the following actions
			data.disableWatchSelected(data);

			if (data.selectedItem && data.updateOnSelectionChanging) {
				return data.updateOnSelectionChanging(data, entity).then(function () {
					return finishSelectionChange(entity, data, data.fireSelectionChangedEventAlways || changeRequestsWhenTriggered === data.numberOfSelectionChangeRequests);
				},
				function () {
					return data.selectedItem;
				});
			} else {
				return $q.when(finishSelectionChange(entity, data, data.fireSelectionChangedEventAlways || changeRequestsWhenTriggered === data.numberOfSelectionChangeRequests));
			}
		};

		this.getSelected = function getSelected(data) {
			return data.selectedItem;
		};

		this.getSelectedEntities = function getSelectedEntitiesOfService(data) {
			if (data.selectedEntities && data.selectedEntities.length === 1 && data.selectedEntities[0] === undefined) {
				return [];
			}
			return data.selectedEntities;
		};

		this.doSelectEntities = function doSelectEntities(entities, data) {
			data.selectedEntities.length = 0;
			_.forEach(entities, function (entity) {
				data.selectedEntities.push(entity);
				// platformDataServiceOriginalStateExtension.saveOriginalState(entity);
			});

			if (data && data.triggerLoadOnSelectedEntitiesChanged && data.doLoadOnSelectedEntitiesChanged) {
				data.doLoadOnSelectedEntitiesChanged(entities, data);
			}

			data.selectedEntitiesChanged.fire(null, entities);
		};

		this.registerSelectionChanged = function registerSelectionChanged(callBackFn, data) {
			data.selectionChanged.register(callBackFn);
		};

		this.unregisterSelectionChanged = function unregisterSelectionChanged(callBackFn, data) {
			data.selectionChanged.unregister(callBackFn);
		};

		this.registerSelectedEntitiesChanged = function registerSelectedEntitiesChanged(callBackFn, data) {
			data.selectedEntitiesChanged.register(callBackFn);
		};

		this.unregisterSelectedEntitiesChanged = function unregisterSelectedEntitiesChanged(callBackFn, data) {
			data.selectedEntitiesChanged.unregister(callBackFn);
		};

		this.deselect = function deselect(data) {
			return self.doSelect(null, data);
		};

		this.isSelection = function isSelection(item) {
			return !_.isNull(item) && !_.isUndefined(item);
		};
	}
})();
