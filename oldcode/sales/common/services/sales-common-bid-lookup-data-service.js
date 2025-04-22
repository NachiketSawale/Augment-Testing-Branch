/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	/**
	 * @ngdoc service
	 * @name salesCommonBidLookupDataService
	 * @function
	 * @description
	 *
	 * data service for sales bid lookup.
	 */
	// TODO: move later to basics.lookupdata module
	angular.module('sales.common').factory('salesCommonBidLookupDataService', ['globals', 'platformLookupDataServiceFactory',
		function (globals, platformLookupDataServiceFactory) {

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'sales/bid/', endPointRead: 'list'},
				filterParam: 'projectId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})();
