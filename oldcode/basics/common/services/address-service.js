/**
 * Created by rei on 14.11.18.
 */

(function () {
	'use strict';
	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonAddressService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsCommonAddressService', ['$http', 'globals', function ($http, globals) {
		/**
		 * Create an address object based on addressCreationDto
		 * @param addressCreationDto
		 * @returns {Promise}
		 *
		 * addressCreationDto{}
		 * int? countryId
		 * string street
		 * string zipCode
		 * string city
		 * }
		 */
		function createAddress(addressCreationDto) {
			return $http.post(globals.webApiBaseUrl + 'basics/common/address/createwithinit', addressCreationDto).then(
				function ok(response) {
					return response.data;
				},
				function error(reason) {           /* jshint ignore:line */
					// error case will be handled by interceptor
				});
		}

		function getAddressGeoLocation(address) {
			return $http.post(globals.webApiBaseUrl + 'basics/common/address/getaddressgeolocation?save=true', address).then(
				function ok(response) {
					return response.data;
				});
		}

		return {
			'createAddress': createAddress,
			'getAddressGeoLocation': getAddressGeoLocation
		};
	}
	]);
})(angular);
