/**
 * Created by waz on 2/22/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCommonBaseDataServiceRoleAssignExtension
	 * @deprecated
	 * This extension is deprecated, please try to use basicsCommonBaseDataServiceReferenceExtension instead.
	 * @description
	 * Extension for data service's assign methods
	 */
	const moduleName = 'basics.common';
	const module = angular.module(moduleName);
	module.service('basicsCommonBaseDataServiceRoleAssignExtension', BasicsCommonBaseDataServiceRoleAssignExtension);

	BasicsCommonBaseDataServiceRoleAssignExtension.$inject = ['$injector', 'PlatformMessenger', '_'];

	function BasicsCommonBaseDataServiceRoleAssignExtension($injector, PlatformMessenger, _) {

		const self = this;

		/**
		 * Add role assign methods to data service. Be carefully, it may replace your origin delete method!
		 * @param container
		 * Data service container
		 * @param assignOptions
		 * Assign options
		 */
		this.addRoleAssign = function (container, assignOptions) {
			const service = container.service;
			container.data.entityAssigned = new PlatformMessenger();
			container.data.entityRemoveAssigned = new PlatformMessenger();
			_.extend(container.service, {
				assignItems: assignItems,
				removeAssignItems: removeAssignItems,
				canAssign: canAssign,
				registerEntityAssigned: registerEntityAssigned,
				registerEntityRemoveAssigned: registerEntityRemoveAssigned,
				fireEntityAssigned: fireEntityAssigned,
				fireEntityRemoveAssigned: fireEntityRemoveAssigned
			});

			if (assignOptions) {
				container.service.deleteItem = service.deleteItem ? deleteItem : service.deleteItem;
				container.service.deleteEntities = service.deleteEntities ? deleteEntities : service.deleteEntities;
			}

			function assignItems(items, assignKey, value, targetService) {
				self.assignItems(container.service, items, assignKey, value, targetService);
			}

			function removeAssignItems(items, assignKey, value, targetService) {
				self.removeAssignItems(container.service, items, assignKey, value, targetService);
			}

			function canAssign() {
				return self.canAssign(container.service);
			}

			function registerEntityAssigned(callback) {
				container.data.entityAssigned.register(callback);
			}

			function registerEntityRemoveAssigned(callback) {
				container.data.entityRemoveAssigned.register(callback);
			}

			function fireEntityAssigned(items) {
				container.data.entityAssigned.fire(null, items);
			}

			function fireEntityRemoveAssigned(items) {
				container.data.entityRemoveAssigned.fire(null, items);
			}

			/**
			 * Delete assign item by foregin key, save delete item into ToSave
			 * @param item
			 */
			function deleteItem(item) {
				removeAssignItems([item], assignOptions.key, assignOptions.sourceService);
			}

			function deleteEntities(entities) {
				removeAssignItems(entities, assignOptions.key, assignOptions.sourceService);
			}

		};

		/**
		 * Assign items to target data service
		 * @param service
		 * data service
		 * @param items
		 * Need assign items
		 * @param assignKey
		 * Assign foreign key
		 * @param value
		 * Assign foreign key value
		 * @param targetService
		 * Target data service
		 */
		this.assignItems = function (service, items, assignKey, value, targetService) {
			service.moveLoadedItems(items, targetService, function (items) {
				_.forEach(items, function (item) {
					item[assignKey] = value;
				});
				return items;
			});
			targetService.markEntitiesAsModified(items);

			if (service.fireEntityAssigned) {
				service.fireEntityAssigned(items);
			}
			if (targetService.fireEntityAssigned) {
				targetService.fireEntityAssigned(items);
			}
		};

		/**
		 * Remove Assign Items, save delete item into ToSave. if there is sourceService, the remove items will be add to sourceService
		 * @param service
		 * data service
		 * @param items
		 * Need Remove items
		 * @param assignKey
		 * Assign foreign key
		 * @param sourceService
		 * @optional
		 * Assign Items's source data service
		 */
		this.removeAssignItems = function (service, items, assignKey, sourceService) {
			_.forEach(items, function (item) {
				item[assignKey] = null;
			});
			service.removeLoadedItems(items);
			service.markEntitiesAsModified(items);

			if (sourceService) {
				getService(sourceService).appendLoadedItems(items);
			}

			if (service.fireEntityRemoveAssigned) {
				service.fireEntityRemoveAssigned(items);
			}
		};

		/**
		 * Can assign item to this data service
		 * @returns {boolean}
		 */
		this.canAssign = function (service) {
			return true;
		};

		function getService(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}
	}
})(angular);