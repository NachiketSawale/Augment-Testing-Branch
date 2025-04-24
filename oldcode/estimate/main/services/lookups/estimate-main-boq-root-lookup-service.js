/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainBoqRootLookupService
	 * @function
	 *
	 * @description
	 * estimateMainBoqRootLookupService provides all lookup data for estimate module boq lookup
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainBoqRootLookupService', ['$q', 'cloudCommonGridService', 'estimateMainBoqLookupService',
		function ($q, cloudCommonGridService, estimateMainBoqLookupService) {

			// Object presenting the service
			let service = {};

			// get boq root item for the given item
			let getBoqRootItem = function getBoqRootItem(item, boqItems){
				let rootItem = {};
				if(item && item.Id){
					let list = boqItems.length ? boqItems : estimateMainBoqLookupService.getList();
					if(list && list.length>0){
						let output = [];
						cloudCommonGridService.flatten(list, output, 'BoqItems');
						rootItem = cloudCommonGridService.getRootParentItem(item, output, 'BoqItemFk');
					}
				}
				return rootItem && rootItem.Id ? rootItem : null;
			};

			// get boq root item for the given item
			let getBoqRootItemAsync = function getBoqRootItemAsync(item){
				return estimateMainBoqLookupService.getListAsync().then(function(result){
					return $q.when(getBoqRootItem(item, result));
				});
			};

			// get list of the estimate boq item by Id
			service.getItemById = function getItemById(value) {
				let item =  estimateMainBoqLookupService.getItemById(value);
				return getBoqRootItem(item, []);
			};

			service.getItemByKey = function getItemByKey(value) {
				return service.getItemById(value);
			};

			// get list of the estimate boq item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value,options) {
				return estimateMainBoqLookupService.getItemByIdAsync(value,options).then(function(item){
					return getBoqRootItemAsync(item).then(function(result){
						return result;
					});
				});
			};

			// estimate look up data service call
			service.loadLookupData = function(){
				estimateMainBoqLookupService.loadLookupData();
			};

			// General stuff
			service.reload = function(){
				service.loadLookupData();
			};

			return service;
		}]);
})();
