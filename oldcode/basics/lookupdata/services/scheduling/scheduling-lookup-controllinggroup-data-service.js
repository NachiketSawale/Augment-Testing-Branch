/**
 * Created by leo on 22.06.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name scheduling-lookup-controllinggroup-data-service.js
	 * @function
	 *
	 * @description
	 * scheduling-lookup-controllinggroup-data-service.js is the data service for all project cost-group1 look ups
	 */
	angular.module('basics.lookupdata').factory('controllingGroupLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var controllingGroupLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'controlling/structure/lookup/', endPointRead: 'controllinggroup' }
			};

			return platformLookupDataServiceFactory.createInstance(controllingGroupLookupDataServiceConfig).service;
		}]);
})(angular);