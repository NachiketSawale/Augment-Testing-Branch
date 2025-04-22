/**
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesCommonWipLookupDataService
	 * @function
	 * @description
	 *
	 * data service for sales wip lookup.
	 */
	// TODO: move later to basics.lookupdata module
	angular.module('sales.common').factory('salesCommonWipLookupDataService', [
		'globals', 'platformLookupDataServiceFactory',
		function (globals, platformLookupDataServiceFactory) {

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'sales/wip/', endPointRead: 'list'},
				filterParam: 'projectId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})();
