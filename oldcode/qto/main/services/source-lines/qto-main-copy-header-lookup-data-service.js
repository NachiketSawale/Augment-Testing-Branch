(function (angular) {
	/* global globals */
	'use strict';

	angular.module('qto.main').factory('qtoMainCopyHeaderLookupDataService', ['platformLookupDataServiceFactory',
		function (platformLookupDataServiceFactory) {
			let qtoHeaderLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'qto/main/header/', endPointRead: 'getqtoheaderlookup'},
				filterParam: 'qtoHeadersOnly',
				prepareFilter: function prepareFilter(filter) {
					return filter;
				}
			};

			return platformLookupDataServiceFactory.createInstance(qtoHeaderLookupDataServiceConfig).service;
		}]);
})(angular);
