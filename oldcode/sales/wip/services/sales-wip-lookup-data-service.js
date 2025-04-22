/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	salesWipModule.factory('salesWipLookupDataService', ['_', 'globals', '$http', '$q', '$injector', 'basicsLookupdataLookupFilterService', 'qtoBoqType',
		function (_, globals, $http, $q, $injector, basicsLookupdataLookupFilterService, qtoBoqType) {

			var service = {};

			var lookupData = {};

			var salesWipHeaderList = [];

			var projectId = 0;

			var saleWipHeaderPromise = null;

			service.setProjectId = function(value){
				saleWipHeaderPromise = null;
				projectId = value;
			};

			service.getItemById = function(item , options ){
				if (options && options.BoqType && options.BoqType !== qtoBoqType.QtoBoq){
					let itemService = $injector.get('qtoMainCommonService').getItemService(options.BoqType);
					return  itemService.getSelected();
				}
				else {
					return _.find(salesWipHeaderList, {Id: item});
				}
			};

			service.getItemByIdAsync = function(value, options){
				if(projectId > 0) {
					if (!saleWipHeaderPromise) {
						saleWipHeaderPromise = $http.get(globals.webApiBaseUrl + 'sales/wip/list?projectId=' + projectId);
					}
					return saleWipHeaderPromise.then(function (response) {
						salesWipHeaderList = _.uniqBy(salesWipHeaderList.concat(response.data), 'Id');
						saleWipHeaderPromise = null;
						return service.getItemById(value, options);
					});
				} else {

					var currentWipHeaderAsyncPromise = 'wipHeaderAsyncPromise' + value;
					if (!lookupData[currentWipHeaderAsyncPromise]) {
						lookupData[currentWipHeaderAsyncPromise] = getWipHeaderById(value);
					}

					return lookupData[currentWipHeaderAsyncPromise].then(function (data) {
						lookupData[currentWipHeaderAsyncPromise] = null;
						return data;
					});
				}
			};

			function getWipHeaderById(value){
				var deferred = $q.defer();
				var ids = [value];
				$http.post(globals.webApiBaseUrl + 'sales/wip/wipsbyids', ids).then(function (response) {
					var wipHeaderList = response.data;
					salesWipHeaderList = _.uniqBy(salesWipHeaderList.concat(wipHeaderList), 'Id');
					deferred.resolve( _.find(wipHeaderList, {Id : value}));

				});

				return deferred.promise;
			}

			service.getSalesWipList = function(){

				var filter = basicsLookupdataLookupFilterService.getFilterByKey('qto-sales-wip-code-filter');

				if(filter){

					var value = filter.fn();

					if(angular.isDefined(value) && value !== null){

						return $http.get(globals.webApiBaseUrl + 'sales/wip/getlist?' + value).then(function(response){
							saleWipHeaderPromise = null;
							salesWipHeaderList = _.uniqBy(salesWipHeaderList.concat(response.data), 'Id');
							return _.uniqBy(response.data, 'Code');
						});
					}
				}

				return $q.when([]);
			};
			service.getSalesWipByContractList = function () {
				var filter = basicsLookupdataLookupFilterService.getFilterByKey('sales-wip-code-filter');

				if (filter) {

					var value = filter.fn();

					if (angular.isDefined(value) && value !== null) {

						return $http.get(globals.webApiBaseUrl + 'sales/wip/getwipsbycontract?' + value).then(function (response) {
							saleWipHeaderPromise = null;
							salesWipHeaderList = _.uniqBy(salesWipHeaderList.concat(response.data), 'Id');
							return _.uniqBy(response.data, 'Code');
						});
					}
				}

				return $q.when([]);
			};

			service.clearDataCache = function clearDataCache() {
				salesWipHeaderList =[];
			};

			return service;

		}]);
})(angular);
