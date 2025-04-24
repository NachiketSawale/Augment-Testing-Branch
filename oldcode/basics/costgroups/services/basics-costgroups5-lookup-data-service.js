/**
 * Created by Joshi on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCostGroups5LookupDataService
	 * @function
	 *
	 * @description
	 * basicsCostGroups5LookupDataService is the data service for Line item context coastgroups5 related functionality.
	 */
	var moduleName = 'basics.costgroups';
	angular.module(moduleName).factory('basicsCostGroups5LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var costGroups5LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/costgroups5/', endPointRead: 'lookuptree' },
				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
				tree: { parentProp: 'LicCostGroupFk', childProp: 'ChildItems' }
			};

			return platformLookupDataServiceFactory.createInstance(costGroups5LookupDataServiceConfig).service;
		}]);
})(angular);
