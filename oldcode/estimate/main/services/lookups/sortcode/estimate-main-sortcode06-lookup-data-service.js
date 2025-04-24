/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode06LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code06 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode06LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode06');
		}]);
})(angular);
