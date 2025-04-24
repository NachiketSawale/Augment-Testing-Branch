/**
 * Created by Frank on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostGroupCatalogLookupDataService
	 * @function
	 *
	 * @description
	 * projectCostGroupCatalogLookupDataService is the data service for all project cost-group1 look ups
	 */
	angular.module('basics.lookupdata').factory('projectCostGroupCatalogLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {
			var readData =  { PKey1: null };

			var projectCostGroupCatalogLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'project/main/costGroupCatalog/',
					endPointRead: 'listByParent'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(projectCostGroupCatalogLookupDataServiceConfig).service;
		}]);
})(angular);
