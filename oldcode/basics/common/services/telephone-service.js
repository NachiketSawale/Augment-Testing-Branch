/**
 * Created by reimer on 28.07.2015.
 */

(function () {

	'use strict';

	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonTelephoneService
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCommonTelephoneService', ['$http', 'globals',
		function ($http, globals) {

			const service = {};

			service.create = function (pattern) {

				// return $http.get(globals.webApiBaseUrl + 'basics/common/telephonenumber/create', pattern)
				return $http({
					url: globals.webApiBaseUrl + 'basics/common/telephonenumber/create',
					method: 'get',
					params: {pattern: pattern}
				}).then(function (response) {
					return response.data;
				}, function (reason) {           /* jshint ignore:line */
					// error case will be handled by interceptor
				}).finally(function () {
				}
				);
			};

			return service;

		}
	]);
})(angular);
