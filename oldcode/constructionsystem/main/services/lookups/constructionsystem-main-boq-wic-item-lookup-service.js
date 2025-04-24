/**
 * Created by lst on 22.04.2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainBoqWicItemLookupService', [
		'$http', '$q', '$injector', '_', 'cloudCommonGridService', 'basicsLookupdataLookupDescriptorService',
		function ($http, $q, $injector, _, cloudCommonGridService, basicsLookupdataLookupDescriptorService) {

			var wicBoqItemsPromise = null;
			var wicBoqListAsyncPromise = null;

			function getList(boqWicCatFk) {
				var result = basicsLookupdataLookupDescriptorService.getData('boqWicBoqItemTree');
				if (result && _.size(result) > 0 && boqWicCatFk !== undefined) {
					result = _.filter(result, function (item) {
						return item.BoqWicCatFk === boqWicCatFk;
					});
				}
				return result;
			}

			// only return boq Item
			function getItemByIdAsync(id) {
				var boqWicBoqItemFk = 'boqWicBoqItemFk';
				if (basicsLookupdataLookupDescriptorService.hasLookupItem(boqWicBoqItemFk, id)) {
					return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(boqWicBoqItemFk, id));
				} else {
					if (!wicBoqItemsPromise) {
						wicBoqItemsPromise = getWicItemListAsync();
					}
					return wicBoqItemsPromise.then(function (data) {
						basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemFk', data);
						wicBoqItemsPromise = null;
						return getItemById(id);
					});
				}
			}

			function getItemById(value) {
				var itemCache = basicsLookupdataLookupDescriptorService.getLookupItem('boqWicBoqItemFk', value);
				return itemCache;
			}

			// return boq items
			function getWicItemListAsync() {
				// lineItemContainer
				var lineItems = $injector.get('constructionsystemMainLineItemService').getList();

				var wicBoqItemFks = [];
				if (lineItems && lineItems.length > 0) {
					angular.forEach(lineItems, function (item) {
						if (item.WicBoqItemFk !== null) {
							wicBoqItemFks.push(item.WicBoqItemFk);
						}
					});
				}

				if (wicBoqItemFks.length === 0) {
					return $q.when([]);
				} else {
					var lookupCache = basicsLookupdataLookupDescriptorService.getData('boqWicBoqItemFk');
					if (lookupCache && lookupCache.length > 0) {
						return $q.when(lookupCache);
					}
					wicBoqItemFks = _.uniqBy(wicBoqItemFks);
					var postData = {
						wicBoqItemFks: wicBoqItemFks
					};
					if (!wicBoqListAsyncPromise) {
						wicBoqListAsyncPromise = $http.post(globals.webApiBaseUrl + 'boq/wic/boq/getBoqItemTreeById', postData).then(function (response) {
							return updateLookups(response.data);
						});
					}

					return wicBoqListAsyncPromise.then(function (data) {
						wicBoqListAsyncPromise = null;
						return updateLookups(data);
					});
				}
			}

			function updateLookups(boqItemTrees) {
				var flattenResult = [];
				cloudCommonGridService.flatten(boqItemTrees, flattenResult, 'BoqItems');
				basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemFk', flattenResult);
				basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemTree', boqItemTrees);
				return flattenResult;
			}

			return {
				getItemByIdAsync: getItemByIdAsync,
				getItemById: getItemById,
				getWicItemListAsync: getWicItemListAsync,
				getList: getList
			};
		}
	]);
})(angular);