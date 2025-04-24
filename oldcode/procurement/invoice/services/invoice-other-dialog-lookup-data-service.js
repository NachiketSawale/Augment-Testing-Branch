/**
 * Created by leo on 09.05.2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/**
	 * @ngdoc service
	 * @name invoideOtherDialogLookupDataService
	 * @function
	 *
	 * @description
	 * invoideOtherDialogLookupDataService is the data service for prc items look ups
	 */
	angular.module('procurement.invoice').factory('invoideOtherDialogLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var config = {};

			return filterLookupDataService.createInstance(config);
		}]);
})(angular);
