/**
 * Created by Joshi on 19.11.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCurrencyConversionFilteredLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCurrencyConversionFilteredLookupDataService is the data service for all currency conversion filtered foreign currency
	 */
	angular.module('basics.currency').factory('basicsCurrencyConversionFilteredLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var basicsCurrencyFilteredLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/currency/', endPointRead: 'filteredlist'},
				filterParam: 'currencyHomeFk'
			};
			return platformLookupDataServiceFactory.createInstance(basicsCurrencyFilteredLookupDataServiceConfig).service;
		}]);
})(angular);
