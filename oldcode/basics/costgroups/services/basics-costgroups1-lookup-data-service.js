/**
 * Created by Joshi on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCostGroups1LookupDataService
	 * @function
	 *
	 * @description
	 * basicsCostGroups1LookupDataService is the data service for Line item context coastgroups1 related functionality.
	 */
	var moduleName = 'basics.costgroups';
	angular.module(moduleName).factory('basicsCostGroups1LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var costGroups1LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/costgroups1/', endPointRead: 'lookuptree' },
				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
				tree: { parentProp: 'LicCostGroupFk', childProp: 'ChildItems' }
			};

			return platformLookupDataServiceFactory.createInstance(costGroups1LookupDataServiceConfig).service;
		}]);
})(angular);
