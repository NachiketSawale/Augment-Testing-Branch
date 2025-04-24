/**
 * Created by joshi on 21.11.2014.
 */

(function (angular) {

	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCurrencyDataProcessor
	 * @function
	 *
	 * @description
	 * The basicsCurrencyDataProcessor adds currency conversion and rate.
	 */

	angular.module('basics.currency').factory('basicsCurrencyDataProcessor', [ function () {

		var service = {};

		service.processItem = function processItem(){
			// if(item) {
			// return;
			// return basicsCurrencyCommonService.setReadOnlyRow(item);
			// }
		};

		return service;

	}]);
})(angular);