/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode10LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code10 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode10LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode10');
		}]);
})(angular);
