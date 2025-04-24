(function (angular) {
	/* global globals */
	'use strict';

	angular.module('qto.main').factory('qtoMainHeaderProjectLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			let qtoMainHeaderProjectLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/project/', endPointRead: 'list'},
				filterParam: 'projectId'
			};
			return platformLookupDataServiceFactory.createInstance(qtoMainHeaderProjectLookupDataServiceConfig).service;
		}]);
})(angular);
