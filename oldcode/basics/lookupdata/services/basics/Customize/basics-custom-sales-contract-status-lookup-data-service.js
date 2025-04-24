/**
 * Created by bh on 16.11.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomSalesContractStatusLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomSalesContractStatusLookupDataService is the data service for all sales contract status lookups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomSalesContractStatusLookupDataService', ['basicsCustomStatusLookupDataFactoryService',
		function (basicsCustomStatusLookupDataFactoryService) {
			return basicsCustomStatusLookupDataFactoryService.createService('basicsCustomQuotationStatusLookupDataService', 'orderstatus');
		}]);
})(angular);