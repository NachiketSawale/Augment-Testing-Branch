/**
 * Created by wui on 2/25/2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionsystemMasterBoqRootService', [
		'$q', 'basicsLookupdataLookupDescriptorService',
		function ($q, lookupDescriptorService) {
			var lookupType = 'estboqitems';

			return {
				getItemByIdAsync: getItemByIdAsync,
				getItemById: getItemById
			};

			function getItemByIdAsync(id) {
				var boqRootItem;
				var boqItem = lookupDescriptorService.getLookupItem(lookupType, id);

				if (boqItem !== null && boqItem !== undefined) {
					/** @namespace boqItem.BoqRootItemFk */
					boqRootItem = lookupDescriptorService.getLookupItem(lookupType, boqItem.BoqRootItemFk);
				}
				return $q.when(boqRootItem);
			}

			function getItemById(id) {
				var boqRootItem;
				var boqItem = lookupDescriptorService.getLookupItem(lookupType, id);

				if (boqItem !== null && boqItem !== undefined) {
					boqRootItem = lookupDescriptorService.getLookupItem(lookupType, boqItem.BoqRootItemFk);
				}
				return boqRootItem;
			}
		}
	]);
})(angular);