/**
 * Created by bh on 16.11.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomSalesBillingStatusLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomSalesBillingStatusLookupDataService is the data service for all sales billing status lookups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomSalesBillingStatusLookupDataService', ['basicsCustomStatusLookupDataFactoryService',
		function (basicsCustomStatusLookupDataFactoryService) {
			return basicsCustomStatusLookupDataFactoryService.createService('basicsCustomQuotationStatusLookupDataService', 'billstatus');
		}]);
})(angular);