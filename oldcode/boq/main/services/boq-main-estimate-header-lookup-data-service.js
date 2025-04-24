//TODO-Estimate-DEV22870-Remove this service and use the one provided by estimate team once available

(function (angular) {
	/* global globals */
	'use strict';
	angular.module('boq.main').factory('boqMainEstimateHeaderLookupDataService', ['platformLookupDataServiceFactory',
		function (platformLookupDataServiceFactory) {
			var boqHeaderLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'estimate/main/header/', endPointRead: 'list'},
				filterParam: 'EstHeader',
				prepareFilter: function prepareFilter(filter) {
					return filter;//Will have projectId and BoqHeaderId
				},
			};
			return platformLookupDataServiceFactory.createInstance(boqHeaderLookupDataServiceConfig).service;
		}]);
})(angular);
