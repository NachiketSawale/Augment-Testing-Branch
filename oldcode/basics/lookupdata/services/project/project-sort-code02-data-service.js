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
	angular.module('basics.lookupdata').factory('projectSortCode02LookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var projectSortCode02LookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/structures/sortcode02/', endPointRead: 'list' },
				filterParam: 'projectId'
				// dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups'])]
				// tree: { parentProp: 'CostGroupParentFk', childProp: 'SubGroups' }
			};

			return platformLookupDataServiceFactory.createInstance(projectSortCode02LookupDataServiceConfig).service;
		}]);
})(angular);
