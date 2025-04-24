/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSortCode04LookupDataService
	 * @function
	 * @description
	 * This is the data service for all project sort-code04 lookups
	 */
	angular.module('estimate.main').factory('estimateMainSortCode04LookupDataService', ['estimateMainSortCodesLookupDataService',
		function (estimateMainSortCodesLookupDataService) {
			return estimateMainSortCodesLookupDataService.createDataService('sortcode04');
		}]);
})(angular);
