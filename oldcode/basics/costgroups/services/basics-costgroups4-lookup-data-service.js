/**
 * Created by Joshi on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCostGroups4LookupDataService
	 * @function
	 *
	 * @description
	 * basicsCostGroups4LookupDataService is the data service for Line item context coastgroups4 related functionality.
	 */
	var moduleName = 'basics.costgroups';
	angular.module(moduleName).factory('basicsCostGroups4LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var costGroups4LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/costgroups4/', endPointRead: 'lookuptree' },
				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
				tree: { parentProp: 'LicCostGroupFk', childProp: 'ChildItems' }
			};

			return platformLookupDataServiceFactory.createInstance(costGroups4LookupDataServiceConfig).service;
		}]);
})(angular);
