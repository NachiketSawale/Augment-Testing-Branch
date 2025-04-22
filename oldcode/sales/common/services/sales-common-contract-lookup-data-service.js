/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	/**
	 * @ngdoc service
	 * @name salesCommonContractLookupDataService
	 * @function
	 * @description
	 *
	 * data service for sales contract lookup.
	 */
	// TODO: move later to basics.lookupdata module
	angular.module('sales.common').factory('salesCommonContractLookupDataService', [
		'globals', 'platformLookupDataServiceFactory',
		function (globals, platformLookupDataServiceFactory) {

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'sales/contract/', endPointRead: 'list'},
				filterParam: 'projectId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})();
