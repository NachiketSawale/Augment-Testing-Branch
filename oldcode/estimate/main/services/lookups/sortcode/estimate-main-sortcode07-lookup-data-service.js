/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode07LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code07 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode07LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode07');
		}]);
})(angular);
