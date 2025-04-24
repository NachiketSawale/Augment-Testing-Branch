/**
 * Created by Joshi on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCostGroups3LookupDataService
	 * @function
	 *
	 * @description
	 * basicsCostGroups3LookupDataService is the data service for Line item context coastgroups3 related functionality.
	 */
	var moduleName = 'basics.costgroups';
	angular.module(moduleName).factory('basicsCostGroups3LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var costGroups3LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/costgroups3/', endPointRead: 'lookuptree' },
				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
				tree: { parentProp: 'LicCostGroupFk', childProp: 'ChildItems' }
			};

			return platformLookupDataServiceFactory.createInstance(costGroups3LookupDataServiceConfig).service;
		}]);
})(angular);
