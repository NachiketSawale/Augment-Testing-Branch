/**
 * Created by Frank on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostGroup1LookupDataService
	 * @function
	 *
	 * @description
	 * projectCostGroup1LookupDataService is the data service for all project cost-group1 look ups
	 */
	angular.module('basics.lookupdata').factory('projectCostGroup1LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {
			var readData =  { PKey1: null };

			var projectCostGroup1LookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'project/main/costgroup1/',
					endPointRead: 'tree'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups'])],
				tree: {
					parentProp: 'CostGroupParentFk',
					childProp: 'SubGroups'
				}
			};

			return platformLookupDataServiceFactory.createInstance(projectCostGroup1LookupDataServiceConfig).service;
		}]);
})(angular);
