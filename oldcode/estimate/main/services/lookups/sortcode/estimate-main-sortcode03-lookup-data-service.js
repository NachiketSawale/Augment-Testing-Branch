/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode03LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code03 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode03LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode03');
		}]);
})(angular);
