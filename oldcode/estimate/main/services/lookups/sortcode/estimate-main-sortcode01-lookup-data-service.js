/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode01LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code01 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode01LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode01');
		}]);
})(angular);
