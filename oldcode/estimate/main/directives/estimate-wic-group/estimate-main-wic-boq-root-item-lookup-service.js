
(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';


	angular.module(moduleName).factory('estimateMainWicBoqRootItemLookupService', ['$q', 'cloudCommonGridService', 'boqWicItemService','basicsLookupdataLookupDescriptorService',
		function ($q, cloudCommonGridService, boqWicItemService,basicsLookupdataLookupDescriptorService) {

			// Object presenting the service
			let service = {};

			// get wic boq root item for the given item
			let getBoqRootItem = function getBoqRootItem(item, boqItems){
				let rootItem = {};
				if(item && item.Id) {
					let boqWicItems = boqWicItemService.getList();

					let list = boqItems && _.size(boqItems) > 0 ? boqItems : (boqWicItems.length > 0 ? boqWicItems : basicsLookupdataLookupDescriptorService.getData('boqWicBoqItemFk'));
					if (list && _.size(list) > 0) {
						// let output = [];
						// cloudCommonGridService.flatten(list, output, 'BoqItems');
						rootItem = cloudCommonGridService.getRootParentItem(item, list, 'BoqItemFk');
					}
				}
				return rootItem && rootItem.Id ? rootItem : null;
			};

			// get wic boq root item for the given item
			let getBoqRootItemAsync = function getBoqRootItemAsync(item){
				return boqWicItemService.getWicItemListAsync().then(function(result){
					return $q.when(getBoqRootItem(item, result));
				});
			};

			// get list of the wic boq item by Id
			service.getItemById = function getItemById(value) {
				let item =  boqWicItemService.getItemById(value);
				return getBoqRootItem(item, []);
			};

			service.getItemByKey = function getItemByKey(value) {
				return service.getItemByIdAsync(value);
			};

			// get list of the wic boq item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				return boqWicItemService.getItemByIdAsync(value).then(function(item){
					return getBoqRootItemAsync(item).then(function(result){
						return result;
					});
				});
			};

			return service;
		}]);
})();
