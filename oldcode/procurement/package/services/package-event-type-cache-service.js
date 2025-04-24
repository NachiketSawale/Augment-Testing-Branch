/**
 * Created by wwa on 2/25/2016.
 */

(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackageEventTypeDataCacheService',
		['basicsLookupdataLookupDescriptorService',function (lookupDescriptorService) {
			var service = {},dataCache = [];

			service.load = function(){
				lookupDescriptorService.loadData('PrcEventType').then(function(items){
					dataCache = items;
				});
			};

			service.getData = function(){
				return dataCache;
			};

			return service;
		}]);
})(angular);