/**
 * Created by Joshi on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCostGroups2LookupDataService
	 * @function
	 *
	 * @description
	 * basicsCostGroups2LookupDataService is the data service for Line item context coastgroups2 related functionality.
	 */
	var moduleName = 'basics.costgroups';
	angular.module(moduleName).factory('basicsCostGroups2LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var costGroups2LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/costgroups2/', endPointRead: 'lookuptree' },
				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
				tree: { parentProp: 'LicCostGroupFk', childProp: 'ChildItems' }
			};

			return platformLookupDataServiceFactory.createInstance(costGroups2LookupDataServiceConfig).service;
		}]);
})(angular);
