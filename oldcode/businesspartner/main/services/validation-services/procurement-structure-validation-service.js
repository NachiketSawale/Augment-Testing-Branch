/**
 * Created by zos on 8/6/2015.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businesspartner.main.businessPartnerMainProcurementStructureValidationService
	 * @function
	 * @requireds $translate,$timeout, cloudLookupLookupDescriptorService, cloudCommonUtilities
	 *
	 * @description Provide procurement structure validation service
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainPrcStructureValidationService',
		[
			function () {
				return function () {
					var service;
					service = {};
					return service;
				};
			}
		]);
})(angular);