/**
 * Created by lst on 22.04.2019.
 */

(function () {
	'use strict';
	/* global _ */
	var moduleName = 'constructionsystem.main';


	angular.module(moduleName).factory('constructionsystemMainWicBoqRootItemLookupService',
		['$q', 'cloudCommonGridService', 'constructionsystemMainBoqWicItemLookupService',
			function ($q, cloudCommonGridService, boqWicItemService) {

				// Object presenting the service
				var service = {};

				// get wic boq root item for the given item
				var getBoqRootItem = function getBoqRootItem(item, boqItems) {
					var rootItem = {};
					if (item && item.Id) {
						var list = boqItems && _.size(boqItems) > 0 ? boqItems : boqWicItemService.getList(item.BoqWicCatFk);
						if (list && _.size(list) > 0) {
							rootItem = cloudCommonGridService.getRootParentItem(item, list, 'BoqItemFk');
						}
					}
					return rootItem && rootItem.Id ? rootItem : null;
				};

				// get wic boq root item for the given item
				var getBoqRootItemAsync = function getBoqRootItemAsync(item) {
					return boqWicItemService.getWicItemListAsync().then(function (result) {
						return $q.when(getBoqRootItem(item, result));
					});
				};

				// get list of the wic boq item by Id
				service.getItemById = function getItemById(value) {
					var item = boqWicItemService.getItemById(value);
					return getBoqRootItem(item, []);
				};

				service.getItemByKey = function getItemByKey(value) {
					return service.getItemByIdAsync(value);
				};

				// get list of the wic boq item by Id Async
				service.getItemByIdAsync = function getItemByIdAsync(value) {
					return boqWicItemService.getItemByIdAsync(value).then(function (item) {
						return getBoqRootItemAsync(item).then(function (result) {
							return result;
						});
					});
				};

				return service;
			}]);
})();
