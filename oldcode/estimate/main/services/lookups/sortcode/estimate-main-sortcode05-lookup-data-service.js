/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode05LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code05 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode05LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode05');
		}]);
})(angular);
