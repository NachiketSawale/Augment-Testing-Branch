/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode08LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code08 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode08LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode08');
		}]);
})(angular);
