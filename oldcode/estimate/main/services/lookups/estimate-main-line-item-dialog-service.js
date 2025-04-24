/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLineItemDialogService
	 * @function
	 *
	 * @description
	 * estimateMainLineItemDialogService provides all lookup data for estimate reference line item lookup
	 */
	angular.module(moduleName).factory('estimateMainLineItemDialogService', ['$http', '$q', 'estimateMainService',
		function ( $http, $q, estimateMainService) {

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = {
				estLineItems:[]
			};

			// get data list of the estimate Line items
			let getFilterData = function getFilterData() {
				return {
					'estHeaderFk':estimateMainService.getSelectedEstHeaderId(),
					'id':estimateMainService.getIfSelectedIdElse(0)
				};
			};

			let getEstLineItems = function(){
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getsearchlookuplist', getFilterData());
			};

			// get data list of the estimate Line items
			service.getListAsync = function getListAsync() {
				if(!lookupData.estLineListAsyncPromise) {
					lookupData.estLineListAsyncPromise = getEstLineItems();
				}
				return lookupData.estLineListAsyncPromise.then(function(response){
					lookupData.estLineListAsyncPromise = null;
					lookupData.estLineItems = response.data;
					// return (angular.copy(lookupData.estLineItems));
					return lookupData.estLineItems;
				});

			};

			function getItem(list, value){
				let item = null;

				if(list && list.length>0){
					for (let i = 0; i < list.length; i++) {
						if (list[i].Id === value) {
							item = list[i];
							break;
						}
					}
				}

				return item;
			}

			// get list of the estimate boq item by Id
			service.getItemById = function getItemById(value) {
				let item = getItem(lookupData.estLineItems, value);
				if(!item || !item.Id){
					item = getItem(estimateMainService.getList(), value);
				}

				return item;
			};

			// get list of the estimate boq item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				let item = service.getItemById(value);

				if(!item || !item.Id){
					lookupData.estLineItemPromise = $http.get(globals.webApiBaseUrl+'estimate/main/lineitem/getitembyid?id='+value);
					return lookupData.estLineItemPromise.then(function(response){
						return response.data;
					});
				}else{
					return $q.when(item);
				}
			};

			// get list of the estimate boq items by filter value
			service.getSearchList = function getSearchList(value) {
				let filterData = getFilterData();
				filterData.filterValue = value;

				if(!lookupData.searchLineItemsPromise){
					lookupData.searchLineItemsPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getsearchlookuplist', filterData);
				}
				return lookupData.searchLineItemsPromise.then(function(response){
					lookupData.searchLineItemsPromise = null;
					return _.uniq(response.data, 'Id');
				});
			};

			service.loadDataByRefLineItemIds = function (readData){
				let deferred = $q.defer();

				if(!readData || readData.length < 0){
					deferred.resolve();
				}else{
					$http.post(globals.webApiBaseUrl+'estimate/main/lineitem/getlineitemlistbyids', readData).then(function(response){
						lookupData.estLineItems = response && response.data && response.data.length > 0 ? response.data : [];
						deferred.resolve();
					});
				}

				return deferred.promise;
			};

			return service;
		}]);
})();
