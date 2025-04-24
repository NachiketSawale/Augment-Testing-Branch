/**
 * Created by Frank on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostGroup4LookupDataService
	 * @function
	 *
	 * @description
	 * projectCostGroup4LookupDataService is the data service for all project cost-group4 look ups
	 */
	angular.module('basics.lookupdata').factory('projectCostGroup4LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {
			var readData =  { PKey1: null };

			var projectCostGroup4LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/costgroup4/', endPointRead: 'tree' },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups'])],
				tree: { parentProp: 'CostGroupParentFk', childProp: 'SubGroups' }
			};

			return platformLookupDataServiceFactory.createInstance(projectCostGroup4LookupDataServiceConfig).service;
		}]);
})(angular);
