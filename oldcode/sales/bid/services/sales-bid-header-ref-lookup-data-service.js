/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';

	/**
	 * @ngdoc service
	 * @name salesBidHeaderRefLookupDataService
	 * @function
	 *
	 * @description
	 * salesBidHeaderRefLookupDataService is the data service to select a main bid (by lookup)
	 */
	angular.module('sales.bid').factory('salesBidHeaderRefLookupDataService', ['globals', '_', 'platformLookupDataServiceFactory',

		function (globals, _, platformLookupDataServiceFactory) {

			var salesBidHeaderRefLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'sales/bid/', endPointRead: 'refheaderlookup'},
				filterParam: 'bidId',
				prepareFilter: function prepareFilter(filter) {
					if (_.isObject(filter)) {
						// filter ==> bid item!
						return '?bidId=' + filter.Id + '&projectId=' + filter.ProjectFk;
					}
					return '?bidId=' + filter;
				}
			};

			return platformLookupDataServiceFactory.createInstance(salesBidHeaderRefLookupDataServiceConfig).service;
		}]);
})();
