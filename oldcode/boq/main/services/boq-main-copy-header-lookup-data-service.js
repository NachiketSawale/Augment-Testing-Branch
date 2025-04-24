(function (angular) {
	/* global globals */
	'use strict';

	angular.module('boq.main').factory('boqMainCopyHeaderLookupDataService', ['platformLookupDataServiceFactory',
		function (platformLookupDataServiceFactory) {
			var boqHeaderLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'getboqheaderlookup'},
				filterParam: 'wicItemsOnly',
				prepareFilter: function prepareFilter(filter) {
					filter.filterDisabled = filter.boqType===1; // 1 === WicBoq
					return filter;
				},
				dataProcessor: [{processItem: processItem}]
			};

			function processItem(item) {
				// Add a prefix to the WIC items
				if (item.IsWicItem) {
					item.Description = 'WIC: ' + item.Description; // Todo BH: Add translation for WIC
				}
			}

			return platformLookupDataServiceFactory.createInstance(boqHeaderLookupDataServiceConfig).service;
		}]);
})(angular);
