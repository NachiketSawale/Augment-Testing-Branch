/**
 * Created by lcn on 02/10/2025.
 */

(function (angular, globals) {
	'use strict';

	const moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonCreateAccrualTransactionService', [
		'$http',
		'PlatformMessenger',
		function ($http, PlatformMessenger) {
			return function (endpointPrefix) {
				const onCreateSuccessed = new PlatformMessenger();
				const buildUrl = (endpoint) => globals.webApiBaseUrl  + endpointPrefix  + endpoint;

				return {
					onCreateSuccessed: onCreateSuccessed,
					create: function (data) {
						const url = buildUrl('/create')
						return $http.post(url, data);
					},
					init: function () {
						const url = buildUrl('/init');
						return $http.get(url);
					}
				};
			};
		}
	]);

})(angular, globals);
