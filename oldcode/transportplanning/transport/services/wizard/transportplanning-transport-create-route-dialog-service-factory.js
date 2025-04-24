/**
 * Created by lav on 11/7/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).service('transportplanningTransportCreateTransportRouteDialogServiceFactory', Service);

	Service.$inject = [
		'platformDataServiceFactory',
		'packageTypes'];

	function Service(platformDataServiceFactory,
					 packageTypes) {

		// The instance of the main service - to be filled with functionality below
		var defaultOption = {
			module: moduleName,
			//serviceName: 'transportplanningTransportCreateTransportRouteDialogMaterialService',
			dataProcessor: [],
			entitySelection: {supportsMultiSelection: true},
			presenter: {list: {}},
			idProperty: 'Id'
		};

		var self = this;
		/**
		 * @ngdoc function
		 * @name
		 * @function
		 * @methodOf Service
		 * @description
		 * @param {}
		 * @param {}
		 * @returns {}
		 */
		self.createInstance = function (option) {
			var selfOption = {};
			_.extend(selfOption, defaultOption);
			_.extend(selfOption, option);
			var serviceContainer = platformDataServiceFactory.createNewComplete(selfOption);

			var data = serviceContainer.data;
			var service = serviceContainer.service;

			service.initialize = function () {
				data.itemList = [];
				data.selectedEntities = [];
			};

			service.canCreate = function () {
				return true;
			};

			service.canDelete = function () {
				return hasSelection();
			};

			service.canCopy = function () {
				return hasSelection();
			};

			service.createItem = function () {

			};

			service.deleteAll = function () {
				data.listLoaded.fire(null, {'deleteItems': data.itemList});
				data.itemList.length = 0;
			};

			service.deleteItem = function () {
				var nextSelectedItem;
				_.forEach(data.selectedEntities, function (entity) {
					_.remove(data.itemList, function (item) {
						if (entity[selfOption.idProperty] === item[selfOption.idProperty]) {
							nextSelectedItem = doSelectCloseTo(data.itemList.indexOf(item));
							return true;
						} else {
							return false;
						}
					});
				});
				data.listLoaded.fire(null, {'selectedItem': nextSelectedItem, 'deleteItems': data.selectedEntities});
			};

			service.copyItem = function () {
				var addItems = [];
				_.forEach(data.selectedEntities, function (entity) {
					var copyEntity = _.clone(entity);
					data.itemList.push(copyEntity);
					addItems.push(copyEntity);
				});
				data.listLoaded.fire(null, {'selectedItem': addItems[0], 'addItems': addItems});
			};

			service.getResult = function () {
				var options = packageTypes.properties[option.pkgType];
				var result = [];
				_.forEach(service.getList(), function (item) {
					result.push({
						Id: item.Id,
						PkgType: option.pkgType,
						Quantity: item.PQuantity,
						UomFk: item.PUomFk,
						Weight: _.get(item, options.weightPropertyName),
						UoMWeightFk: _.get(item, options.weightUomPropertyName),
						Description: item.freeDescription,
						UserDefined1: item.PrefillUserdefined1,
						UserDefined2: item.PrefillUserdefined2,
						UserDefined3: item.PrefillUserdefined3,
						UserDefined4: item.PrefillUserdefined4,
						UserDefined5: item.PrefillUserdefined5,
						JobDefFk: item.JobDefFk || item.LgmJobFk
					});
				});
				var tmp = {};
				tmp[option.resultName] = result;
				return tmp;
			};

			service.createReferences = function (selectedItems) {
				if (selectedItems) {
					var canAddItems = [];
					var showIds = _.map(data.itemList, selfOption.idProperty);
					_.forEach(selectedItems, function (item) {
						if (!_.includes(showIds, item[selfOption.idProperty])) {
							if (service.onAddNewItem) {
								service.onAddNewItem(item);
							}
							data.itemList.push(item);
							canAddItems.push(item);
						}
					});
					data.listLoaded.fire(null, {'selectedItem': selectedItems[0], 'addItems': canAddItems});
				}
			};

			function hasSelection() {
				return !!(data.selectedEntities && data.selectedEntities.length > 0);
			}

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
		};
	}
})(angular);