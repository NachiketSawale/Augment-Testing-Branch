/**
 * Created by Frank and Benjamin on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectChangeLookupDataService
	 * @function
	 *
	 * @description
	 * projectChangeLookupDataService is the data service for all project change look ups
	 */
	angular.module('basics.lookupdata').factory('projectChangeLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {
			//var readData =  { PKey1: null };

			var projectChangeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'change/main/', endPointRead: 'byProject' },
				filterParam: 'projectId'
				// filterParam: readData,
				// prepareFilter: function prepareFilter(item) {
				// 	readData.PKey1 = item;
				// 	return readData;
				// }
			};

			return platformLookupDataServiceFactory.createInstance(projectChangeLookupDataServiceConfig).service;
		}]);

	angular.module('basics.lookupdata').factory('projectChangeByContractLookupDataService', ['platformLookupDataServiceFactory',
		function (platformLookupDataServiceFactory) {
			var readData =  { PKey1: null };

			var projectChangeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'change/main/', endPointRead: 'byProjectInContract' },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(projectChangeLookupDataServiceConfig).service;
		}]);

	angular.module('basics.lookupdata').factory('projectChangeByOrdLookupDataService', ['platformLookupDataServiceFactory',
		function (platformLookupDataServiceFactory) {
			var readData =  { PKey1: null };

			var projectChangeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'change/main/', endPointRead: 'byProjectInOrd' },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(projectChangeLookupDataServiceConfig).service;
		}]);
})(angular);
