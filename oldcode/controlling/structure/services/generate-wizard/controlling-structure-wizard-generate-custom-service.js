/**
 * Created by janas on 10.02.2016.
 */


(function () {
	'use strict';
	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureWizardGenerateCustomService
	 * @function
	 *
	 * @description
	 * controllingStructureWizardGenerateCustomService is the data service for managing custom key-value-pairs.
	 */
	controllingStructureModule.factory('controllingStructureWizardGenerateCustomService',
		['_', 'PlatformMessenger', function (_, PlatformMessenger) {

			var autoIncrementId = 0;
			var list = [];

			var service = {
				onItemCreated: new PlatformMessenger(),
				onItemDeleted: new PlatformMessenger(),
				getList: function getList() {
					return list;
				},
				createItem: function createItem() {
					var newItem = {Id: ++autoIncrementId, code: '', description: ''};
					list.push(newItem);
					service.onItemCreated.fire(newItem);
					return newItem;
				},
				deleteItem: function deleteItem(item) {
					_.remove(list, function (i) {
						return item.Id === i.Id;
					});
					service.onItemDeleted.fire();
				},
				checkIsCustom: function (entityName) {
					var item = _.find(list, {code: entityName});
					return _.isObject(item);
				},
				getCustDataByKey: function (key) {
					var item = _.find(list, {code: key});
					return [item];
				}
			};

			return service;
		}]);
})();
