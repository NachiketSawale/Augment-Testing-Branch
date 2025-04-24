/**
 * Created by hzh on 03.29.2021.
 */
(function (angular) {
	'use strict';

	var serviceName = 'multiSelectAction';

	function MultiSelectAction(_) {  // jshint ignore:line
		var self = this;
		var items = [];
		var selectedItems = [];

		self.setItems = function (options) {
			var id = options.id;
			var ddItems = [];
			var arr = options.items;
			if (angular.isString(arr)) {
				arr = JSON.parse(arr);
			}
			var valueMember = options.valueMember;
			var displayMember = options.displayMember;
			_.forEach(arr, function (item) {
				ddItems.push({
					Id: _.get(item, valueMember),
					name: _.get(item, displayMember),
					value: _.get(item, valueMember)
				});
			});

			items.push({id: id, items: ddItems});
			return ddItems;
		};

		self.getItems = function (id) {
			var ddItems = _.find(items, {id: id});
			return ddItems ? ddItems.items : [];
		};

		self.setSelectedItems = function (parentId, ddItems) {
			var findItems = [];
			_.forEach(ddItems, function (item) {
				findItems.push(item.value);
			});

			var arr = _.find(selectedItems, {id: parentId});
			if (arr) {
				arr.items = findItems;
			} else {
				arr = [];
				selectedItems.push({id: parentId, items: findItems});
			}
		};

		self.getSelectedItems = function (id) {
			return _.find(selectedItems, {id: id});
		};

		self.clearItems = function () {
			items.length = 0;
			selectedItems.length = 0;
		};

		self.clearSelectedItemsByScopeId = function(id){
			let selectedItemIndex = selectedItems.map(item=>item.id).indexOf(id);
			if(selectedItemIndex!==-1){
				selectedItems.remove(selectedItemIndex);
			}
		};
		self.clearItemByScopeId = function(id){
			let itemIndex = items.map(item=>item.id).indexOf(id);
			if(itemIndex!==-1){
				items.remove(itemIndex);
			}
		};

		self.contractRejectScopeId = 0;
	}

	angular.module('basics.workflow').service(serviceName, ['_', MultiSelectAction]);
})(angular);
