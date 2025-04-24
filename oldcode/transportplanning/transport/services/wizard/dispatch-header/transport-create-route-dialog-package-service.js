/**
 * Created by anl on 8/12/2021.
 */

(function (angular) {
	'use strict';
	/*globals angular, _*/
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateRoutePackageService', PackageService);

	PackageService.$inject = ['$injector', 'platformDataServiceFactory'];

	function PackageService($injector, platformDataServiceFactory) {
		var service = {};
		var data = {};
		var defaultOption = {
			module: moduleName,
			serviceName: 'transportplanningTransportCreateRoutePackageService',
			dataProcessor: [],
			entitySelection: {supportsMultiSelection: true},
			presenter: {list: {}},
			idProperty: 'Id'
		};

		service.initialize = function initialize() {
			var serviceContainer = platformDataServiceFactory.createNewComplete(defaultOption);

			_.extend(service, serviceContainer.service);
			data = serviceContainer.data;

			data.itemList = [];
			data.selectedEntities = [];
		};

		service.updateList = function updateList(items){
			data.itemList = items;
			data.listLoaded.fire(null, data.itemList);
		};

		service.clear = function clear(){
		};

		service.deleteAll = function () {
			data.listLoaded.fire(null, {'deleteItems': data.itemList});
			data.itemList.length = 0;
		};

		service.deleteItem = function () {
			var nextSelectedItem;
			_.forEach(data.selectedEntities, function (entity) {
				_.remove(data.itemList, function (item) {
					if (entity[defaultOption.idProperty] === item[defaultOption.idProperty]) {
						nextSelectedItem = doSelectCloseTo(data.itemList.indexOf(item));
						return true;
					} else {
						return false;
					}
				});
			});
			data.listLoaded.fire(null, {'selectedItem': nextSelectedItem, 'deleteItems': data.selectedEntities});
		};

		service.isTabValid = function(){
			return true;
		};

		function doSelectCloseTo(index) {
			var item = null;
			if (index === 0) {
				item = data.itemList[1];
			} else {
				item = data.itemList[index - 1];
			}
			return item;
		}

		return service;
	}
})(angular);