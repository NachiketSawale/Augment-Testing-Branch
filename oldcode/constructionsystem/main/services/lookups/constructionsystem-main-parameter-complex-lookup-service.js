/**
 * Created by xsi on 2016-10-10.
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,globals */

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainParamComplexLookupService', ['$http', '$q',
		function ( $http, $q) {

			// Object presenting the service
			var service = {};

			// private code
			var lookupData = {
				estParamItems:[]
			};

			var getEstParamItems = function(){
				return $http.get(globals.webApiBaseUrl + 'basics/customize/estparameter/list');
			};

			// get data list of the estimate ParamCode items
			service.getList = function getList() {
				if(lookupData.estParamItems.length >0){
					return lookupData.estParamItems;
				}
				else{
					getEstParamItems().then(function(response){
						lookupData.estParamItems = response.data;
						return lookupData.estParamItems;
					});
				}
			};

			// get data list of the estimate ParamCode items
			service.getListAsync = function getListAsync() {
				if(lookupData.estParamItems && lookupData.estParamItems.length >0){
					return $q.when(lookupData.estParamItems);
				}
				else{
					return getEstParamItems().then(function(response){
						lookupData.estParamItems = response.data;
						return lookupData.estParamItems;
					});
				}
			};


			// get list of the estimate ParamCode item by Id
			service.getItemById = function getItemById(value) {
				var items = [];
				var list = lookupData.estParamItems;
				if(list && list.length>0){
					angular.forEach(value, function(val){
						var item = _.find(list, {'Code':val});
						if(item && item.Id){
							items.push(item);
						}
					});
				}
				return _.uniq(items, 'Id');
			};

			// get list of the estimate ParamCode item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				if(lookupData.estParamItems.length) {
					return $q.when(service.getItemById(value));
				} else {
					if(!lookupData.estParamItemsPromise) {
						lookupData.estParamItemsPromise = service.getListAsync();
					}
					return lookupData.estParamItemsPromise.then(function(data){
						lookupData.estParamItemsPromise = null;
						lookupData.estParamItems= data;
						return service.getItemById(value);
					});
				}
			};

			// estimate look up data service call
			service.loadLookupData = function(){
				getEstParamItems().then(function(response){
					lookupData.estParamItems = response.data;
					return lookupData.estParamItems;
				});
			};

			// General stuff
			service.reLoad = function(){
				service.loadLookupData();
			};

			return service;
		}]);
})();
