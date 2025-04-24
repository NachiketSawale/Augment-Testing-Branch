/**
 * Created by bh on 16.11.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomSalesBidStatusLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomSalesBidStatusLookupDataService is the data service for all sales bid status lookups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomSalesBidStatusLookupDataService', ['basicsCustomStatusLookupDataFactoryService',
		function (basicsCustomStatusLookupDataFactoryService) {
			return basicsCustomStatusLookupDataFactoryService.createService('basicsCustomQuotationStatusLookupDataService', 'bidstatus');
		}]);
})(angular);