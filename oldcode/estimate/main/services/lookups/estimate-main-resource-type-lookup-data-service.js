/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */
(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainResourceTypeLookupDataService
	 * @function
	 *
	 * @description
	 * estimateMainResourceTypeLookupDataService is the data service for all resource type functionality.
	 */
	angular.module(moduleName).factory('estimateMainResourceTypeLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			let estResourceTypeLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'estimate/main/resource/type/', endPointRead: 'list'}
			};
			return platformLookupDataServiceFactory.createInstance(estResourceTypeLookupDataServiceConfig).service;
		}]);
})(angular);
