/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceActionExtension
	 * @function
	 * @requires platform:platformDataServiceSelectionExtension
	 * @description
	 * platformDataServiceActionExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceActionExtension', PlatformDataServiceActionExtension);

	PlatformDataServiceActionExtension.$inject = ['$q', 'platformDataServiceSelectionExtension', 'platformDataServiceConfiguredCreateExtension',
		'platformDataServiceHttpResourceExtension'];

	function PlatformDataServiceActionExtension($q, platformDataServiceSelectionExtension, platformDataServiceConfiguredCreateExtension,
		platformDataServiceHttpResourceExtension) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceActionExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.addEntityActions = function addEntityActions(container, options) {
			if (options.actions) {
				self.addEntityDelete(container, options);

				if (options.actions.create === 'hierarchical') {
					self.addTreeEntityCreate(container, options);
				} else if (options.actions.create === 'flat') {
					self.addListEntityCreate(container, options);
				}
			} else {
				self.addEntityDelete(container, null);
				self.addListEntityCreate(container, null);
			}
		};

		this.fireEntityCreated = function (data, entity) {
			data.entityCreated.fire(null, entity);
		};

		this.fireEntityDeleted = function (data, entity) {
			data.entityDeleted.fire(null, entity);
		};

		this.addEntityDelete = function addEntityDelete(container, options) {
			if (options && options.actions && options.actions.delete) {

				container.data.registerAndCreateEventMessenger('entityDeleted');

				if (!container.data.deleteItem) {
					container.data.deleteItem = function () {
					};
				}

				if (!container.data.deleteEntities) {
					container.data.deleteEntities = function () {
					};
				}

				container.service.deleteItem = function deleteItem(entity) {
					return container.data.deleteItem(entity, container.data);
				};

				container.service.deleteEntities = function deleteEntities(entities) {
					return container.data.deleteEntities(entities, container.data);
				};

				container.service.canDelete = function canDelete() {
					var res = (container.data.itemList.length > 0);
					if (res) {
						var item = platformDataServiceSelectionExtension.getSelected(container.data);

						res = platformDataServiceSelectionExtension.isSelection(item);
					}

					if (res && options.actions.canDeleteCallBackFunc) {
						res = options.actions.canDeleteCallBackFunc(platformDataServiceSelectionExtension.getSelected(container.data), container.data);
					}

					return res;
				};
			} else {
				container.service.canDelete = function canNotDelete() {
					return false;
				};
			}
		};

		this.addTreeEntityCreate = function addTreeEntityCreate(container, options) {
			self.addListEntityCreate(container, options);

			if (!container.data.doPrepareCreateChild) {
				container.data.doPrepareCreateChild = function () {
				};
			}

			container.service.createChildItem = function createChildItem() {
				var creationData = container.data.doPrepareCreateChild(container.data);

				if (container.data.doUpdate) {
					return container.data.doUpdate(container.data).then(function (canCreate) {
						if (canCreate) {
							return container.data.doCallHTTPCreate(creationData, container.data, container.data.onCreateSucceeded);
						}
						return $q.reject('Cancelled by User');
					});
				} else {
					return container.data.doCallHTTPCreate(creationData, container.data, container.data.onCreateSucceeded);
				}
			};

			if (!options.entityRole) {
				container.service.canCreateChild = function checkIfCanCreateChildOfEntity() {
					return self.canCreateChildOfRootEntity(container.data, options);
				};
			} else if (options.entityRole.leaf || options.entityRole.node) {
				container.service.canCreateChild = function checkIfCanCreateChildOfSubordinatedEntity() {
					return self.canCreateChildOfSubordinatedEntity(container.data, options);
				};
			} else {
				container.service.canCreateChild = function checkIfCanCreateChildOfRootEntity() {
					return self.canCreateChildOfRootEntity(container.data, options);
				};
			}
		};

		this.addListEntityCreate = function addListEntityCreate(container, options) {
			if (options && options.actions && options.actions.create) {
				container.data.registerAndCreateEventMessenger('entityCreated');// The data for the plain list has been loaded successfully (again) -> control shall update

				if (!container.data.doPrepareCreate) {
					container.data.doPrepareCreate = function () {
					};
				}

				if (!container.data.doCallHTTPCreate) {
					container.data.doCallHTTPCreate = function () {
					};
				}

				if (!container.data.onCreateSucceeded) {
					container.data.onCreateSucceeded = function () {
					};
				}

				container.service.createItem = function createItem(creationOptions) {
					return self.createItem(creationOptions, container.data, container.service);
				};

				container.service.createItemInBackground = function createItemInBackground(creationOptions) {
					return self.createItemDirectly(creationOptions, container.data, container.service, true);
				};

				if (!options.entityRole) {
					container.service.canCreate = function checkIfCanCreateEntity() {
						return self.canCreateRootEntity(container.data, options);
					};
				} else if (options.entityRole.leaf || options.entityRole.node) {
					container.service.canCreate = function checkIfCanCreateSubordinatedEntity() {
						return self.canCreateSubordinatedEntity(container.data, options);
					};
				} else {
					container.service.canCreate = function checkIfCanCreateRootEntity() {
						return self.canCreateRootEntity(container.data, options);
					};
				}

				if (options.actions.suppressAutoCreate) {
					container.service.canAutoCreateRow = function autoCreateRowSuppressed() {
						return false;
					};
				} else {
					container.service.canAutoCreateRow = function autoCreateRowEnabled() {
						return true;
					};
				}
			} else {
				container.service.canCreate = function canNotCreate() {
					return false;
				};

				container.service.canAutoCreateRow = function rowCreationDisabled() {
					return false;
				};
			}
		};

		this.canCreateRootEntity = function canCreateRootEntity(data, options) {
			var res = true;

			if (res && options.actions.canCreateCallBackFunc) {
				res = options.actions.canCreateCallBackFunc(platformDataServiceSelectionExtension.getSelected(data), data);
			}

			return res;
		};

		this.canCreateSubordinatedEntity = function canCreateSubordinatedEntity(data, options) {
			var res = (data.parentService && platformDataServiceSelectionExtension.isSelection(data.parentService.getSelected()));

			if (res && options.actions.canCreateCallBackFunc) {
				res = options.actions.canCreateCallBackFunc(platformDataServiceSelectionExtension.getSelected(data), data);
			}

			return res;
		};

		this.canCreateChildOfRootEntity = function canCreateChildOfRootEntity(data, options) {
			var res = true;

			if (res && options.actions.canCreateChildCallBackFunc) {
				res = options.actions.canCreateChildCallBackFunc(platformDataServiceSelectionExtension.getSelected(data), data);
			} else {
				var selEntity = platformDataServiceSelectionExtension.getSelected(data);
				res = selEntity && selEntity.Id > 0;
			}

			return res;
		};

		this.canCreateChildOfSubordinatedEntity = function canCreateChildOfSubordinatedEntity(data, options) {
			var res = (data.parentService && platformDataServiceSelectionExtension.isSelection(data.parentService.getSelected()));

			if (res && options.actions.canCreateChildCallBackFunc) {
				res = options.actions.canCreateChildCallBackFunc(platformDataServiceSelectionExtension.getSelected(data), data);
			}

			return res;
		};

		this.createItem = function createItem(creationOptions, data, service) {
			if (platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(data)) {
				return platformDataServiceConfiguredCreateExtension.createByConfiguredDialog(self, data, creationOptions, service);
			} else {
				return self.createItemDirectly(creationOptions, data, false);
			}
		};

		this.createItemDirectly = function createItemDirectly(creationOptions, data, isBackground) {
			var creationData = data.doPrepareCreate(data, creationOptions);
			if(isBackground){
				return data.doCallHTTPCreate(creationData, data, data.handleCreateSucceededWithoutSelect);
			} else if (data.doUpdate) {
				return data.doUpdate(data).then(function (canCreate) {
					if (canCreate) {
						return data.doCallHTTPCreate(creationData, data, data.onCreateSucceeded);
					} else {
						return $q.reject('Cancelled by User');
					}
				});
			} else {
				return data.doCallHTTPCreate(creationData, data, data.onCreateSucceeded);
			}
		};

		this.createConfiguredItem = function createConfiguredItem(configuredItem, data/* , creationOptions */) {
			if (data.doUpdate) {
				return data.doUpdate(data).then(function (canCreate) {
					if (canCreate) {
						return platformDataServiceHttpResourceExtension.createConfiguredEntityUsingHttpPost(configuredItem, data, data.onCreateSucceeded);
					} else {
						return $q.reject('Cancelled by User');
					}
				});
			} else {
				return platformDataServiceHttpResourceExtension.createConfiguredEntityUsingHttpPost(configuredItem, data, data.onCreateSucceeded);
			}
		};
	}
})();
