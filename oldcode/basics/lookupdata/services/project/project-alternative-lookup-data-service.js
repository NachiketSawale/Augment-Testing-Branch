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
	angular.module('basics.lookupdata').factory('projectAlternativeLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var projectChangeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/alternative/', endPointRead: 'list' },
				filterParam: 'projectId'
			};

			return platformLookupDataServiceFactory.createInstance(projectChangeLookupDataServiceConfig).service;
		}]);
})(angular);
