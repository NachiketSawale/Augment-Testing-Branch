/**
 * Created by Frank on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostGroup3LookupDataService
	 * @function
	 *
	 * @description
	 * projectCostGroup3LookupDataService is the data service for all project cost-group3 look ups
	 */
	angular.module('basics.lookupdata').factory('projectCostGroup3LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {
			var readData =  { PKey1: null };

			var projectCostGroup3LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/costgroup3/', endPointRead: 'tree' },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups'])],
				tree: { parentProp: 'CostGroupParentFk', childProp: 'SubGroups' }
			};

			return platformLookupDataServiceFactory.createInstance(projectCostGroup3LookupDataServiceConfig).service;
		}]);
})(angular);
