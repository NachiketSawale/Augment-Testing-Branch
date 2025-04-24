/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode02LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code02 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode02LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode02');
		}]);
})(angular);
