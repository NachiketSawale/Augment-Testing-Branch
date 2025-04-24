/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainGroupSettingService
	 * @function
	 *
	 * @description
	 * This service provides estimate main group setting for dialog
	 */
	angular.module(moduleName).factory('estimateMainGroupSettingService', [
		'$q', '$http', '$timeout', 'PlatformMessenger', 'platformDataServiceFactory','platformRuntimeDataService',
		function ($q, $http, $timeout, PlatformMessenger, platformDataServiceFactory,platformRuntimeDataService) {

			let service = {},
				data = [],
				itemsToSave = [],
				itemsToDelete = [];

			angular.extend(service, {
				getList: getList,
				clear: clear,
				addItem:addItem,
				createItem: createItem,
				deleteItem: deleteItem,
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				listLoaded: new PlatformMessenger(),
				onUpdateList: new PlatformMessenger(),
				onItemChange: new PlatformMessenger(),
				refreshGrid: refreshGrid
			});

			// Move implementation of setSelected and remove this serviceOption configuration
			let serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainGroupSettingService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			container.data.itemList = [];
			angular.extend(service, container.service);
			service.markItemAsModified = null;
			return service;

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function getList() {
				return data;
			}

			function addItem(item) {
				data = data ? data : [];
				data.push(item);
				setItemToSave(item);
				service.refreshGrid();
			}

			function setItemToSave(item) {
				let modified = _.find(itemsToSave, {Id: item.Id});
				if (!modified) {
					itemsToSave.push(item);
				}
			}

			function createItem() {
				let deferred = $q.defer();
				let item = {};
				item.Id = item.Sorting = data.length + 1;
				addItem(item);
				// container.data.itemList = data;
				platformRuntimeDataService.readonly(item, [{field: 'StructureName', readonly: 'readonly'}]);

				service.setSelected(item);
				deferred.resolve(item);
				return deferred.promise;
			}

			function deleteItem(selectedItem) {
				if (selectedItem && selectedItem.Version > 0) {
					itemsToDelete.push(selectedItem);
				}

				data = _.filter(data, function (d) {
					return d.Id !== selectedItem.Id;
				});

				orderSorting(data);

				// container.data.itemList = data;
				refreshGrid();
			}

			function orderSorting(list) {
				let nCount = 1;
				_.each(list, function (item) {
					item.Id = item.Sorting = nCount;
					nCount++;
				});
			}

			function refreshGrid() {
				service.listLoaded.fire();
			}

			function clear() {
				data = [];
			}

		}]);
})(angular);

