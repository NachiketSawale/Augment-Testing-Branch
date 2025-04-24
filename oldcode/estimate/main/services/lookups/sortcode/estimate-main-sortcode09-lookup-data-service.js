/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode09LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code09 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode09LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode09');
		}]);
})(angular);
