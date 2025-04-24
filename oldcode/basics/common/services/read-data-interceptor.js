(function (angular) {
	'use strict';

	const modelName = 'basics.common';
	angular.module(modelName).factory('basicsCommonReadDataInterceptor', ['$q', 'platformDataServiceDataProcessorExtension',
		function ($q, platformDataServiceDataProcessorExtension) {
			const service = {};

			service.init = function init(service, data) {
				service.lockDataRead = function lockDataRead() {
					data.doNotLoadOnSelectionChange = true;
					setTimeout(function () {
						// always remove lock after 1 seconds
						data.doNotLoadOnSelectionChange = false;
					}, 1000);
				};

				const baseSetList = service.setList;
				service.setList = function setList(items) {
					data.supportUpdateOnSelectionChanging = false;
					baseSetList.apply(this, arguments);
					data.supportUpdateOnSelectionChanging = true;
					angular.forEach(items, function (newItem) {
						platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
					});
				};

				service.setCreatedItems = function setCreatedItems(items, doStoreCache) {
					if (!items) {
						return $q.when(false);
					}
					if (doStoreCache) {
						if (data.usesCache && data.currentParentItem && data.currentParentItem.Id) {
							data.storeCacheFor(data.currentParentItem, data);
						}
						data.currentParentItem = data.parentService.getSelected();
					}
					service.lockDataRead();

					items = angular.isArray(items) ? items : [items];

					service.setList(items);

					if (items.length > 0) {
						data.supportUpdateOnSelectionChanging = false;
						const result = service.setSelected(items[0]);
						data.supportUpdateOnSelectionChanging = true;
						return result;
					} else {
						return $q.when(false);
					}
				};
			};

			return service;
		}]);
})(angular);