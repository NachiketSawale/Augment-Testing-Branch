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
	angular.module('basics.lookupdata').factory('projectSortCode01LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var projectSortCode01LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/structures/sortcode01/', endPointRead: 'list' },
				filterParam: 'projectId'
				// dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups'])]
				// tree: { parentProp: 'CostGroupParentFk', childProp: 'SubGroups' }
			};

			return platformLookupDataServiceFactory.createInstance(projectSortCode01LookupDataServiceConfig).service;
		}]);
})(angular);
