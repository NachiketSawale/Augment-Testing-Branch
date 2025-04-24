/**
 * Created by Benny on 13.06.2017.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqCatalogAssignLookupDataService
	 * @function
	 *
	 * @description
	 * boqCatalogAssignLookupDataService is the data service for all catalog assign lookup related functionality.
	 */
	var moduleName = 'basics.currency';
	angular.module(moduleName).factory('boqCatalogAssignLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var locationLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/catalog/', endPointRead: 'list'}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
