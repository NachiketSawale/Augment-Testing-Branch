/**
 * Created by Frank on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostGroup2LookupDataService
	 * @function
	 *
	 * @description
	 * projectCostGroup2LookupDataService is the data service for all project cost-group2 look ups
	 */
	angular.module('basics.lookupdata').factory('projectCostGroup2LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {
			var readData =  { PKey1: null };

			var projectCostGroup2LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/costgroup2/', endPointRead: 'tree' },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups'])],
				tree: { parentProp: 'CostGroupParentFk', childProp: 'SubGroups' }
			};

			return platformLookupDataServiceFactory.createInstance(projectCostGroup2LookupDataServiceConfig).service;
		}]);
})(angular);
