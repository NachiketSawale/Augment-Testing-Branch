/**
 * Created by Frank on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostGroup5LookupDataService
	 * @function
	 *
	 * @description
	 * projectCostGroup5LookupDataService is the data service for all project cost-group5 look ups
	 */
	angular.module('basics.lookupdata').factory('projectCostGroup5LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {
			var readData =  { PKey1: null };

			var projectCostGroup5LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/costgroup5/', endPointRead: 'tree' },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups'])],
				tree: { parentProp: 'CostGroupParentFk', childProp: 'SubGroups' }
			};

			return platformLookupDataServiceFactory.createInstance(projectCostGroup5LookupDataServiceConfig).service;
		}]);
})(angular);
