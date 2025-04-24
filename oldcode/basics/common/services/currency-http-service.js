/**
 * Created by chi on 2015/8/12. Implemented by wuj.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCommonCurrencyHttpService
	 * @function
	 * @description Load the milestones data
	 */
	angular.module('basics.common').factory('basicsCommonCurrencyHttpService', ['$http', 'globals', function ($http, globals) {
		const service = {};

		service.getCurrencies = function getCurrencies() {
			return $http.get(globals.webApiBaseUrl + 'basics/common/currency/getcurrencies?filterValue');
		};

		service.getCurrencyById = function getCurrencyById(id) {
			return $http.get(globals.webApiBaseUrl + 'basics/common/currency/getcurrencybyid?id=' + id);
		};

		return service;
	}
	]);
})(angular);