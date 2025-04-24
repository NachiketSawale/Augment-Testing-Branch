(function () {
	'use strict';

	angular.module('platform').factory('toolbarCommonService', toolbarCommonService);

	toolbarCommonService.$inject = ['platformCreateUuid'];

	function toolbarCommonService(platformCreateUuid) {
		var service = {};
		var toolbarItems = [];

		return {
			create: create,
			register: register,
			unregister: unregister,
			setActionItemListFunctions: setActionItemListFunctions,
			getById: getById,
			deleteItem: deleteItem,
			addItems: addItems,
			updateItems: updateItems,
			updateToolbar: updateToolbar,
			updateItemsById: updateItemsById,
			addItemsByIndex: addItemsByIndex
		};

		function create(id) {
			var item = {
				'id': id,
				items: []
			};

			toolbarItems.push(item);

			return id;
		}

		function register(toolItem) {
			toolbarItems.push(toolItem);

			return toolItem.id ? toolItem.id : platformCreateUuid();
		}

		function unregister(id) {
			// remove item from array
			_.remove(toolbarItems, function (item) {
				return item.id === id;
			});
		}

		function updateItem(id, item) {
			if (!_.isArray(item)) {
				item = [item];
			}
			if (getToolbarObjectById(id)) {
				getToolbarObjectById(id).link.updateFields(item);
			}
		}

		function updateItemById(id, item, subId) {
			if (!_.isArray(item)) {
				item = [item];
			}
			getToolbarObjectById(id).link.updateFieldsById(item, subId);
		}

		function addItems(id, item) {
			updateItem(id, item);
		}

		function updateItems(id, item) {
			updateItem(id, item);
		}

		function updateToolbar(id) {
			getToolbarObjectById(id).link.update();
		}

		function updateItemsById(id, item, subId) {
			updateItemById(id, item, subId);
		}

		function deleteItem(id, item) {
			updateItem(id, item);
		}

		function addItemsByIndex(id, index, items, subListId) {
			if (!_.isArray(items)) {
				items = [items];
			}
			getToolbarObjectById(id).link.addFieldsByIndex(items, 1);
		}

		function getById(key, value) {
			return _.find(toolbarItems, [key, value]);
		}

		function setActionItemListFunctions(id, actionItemsFuntions) {
			var object = _.find(toolbarItems, ['id', id]);
			object.link = actionItemsFuntions;
		}

		function getToolbarObjectById(id) {
			return getById('id', id);
		}
	}
})();