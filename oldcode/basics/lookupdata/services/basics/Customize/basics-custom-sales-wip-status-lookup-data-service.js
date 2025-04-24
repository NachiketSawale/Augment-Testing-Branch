/**
 * Created by bh on 16.11.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomSalesWipStatusLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomSalesWipStatusLookupDataService is the data service for all sales wip status lookups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomSalesWipStatusLookupDataService', ['basicsCustomStatusLookupDataFactoryService',
		function (basicsCustomStatusLookupDataFactoryService) {
			return basicsCustomStatusLookupDataFactoryService.createService('basicsCustomQuotationStatusLookupDataService', 'workinprogressstatus');
		}]);
})(angular);