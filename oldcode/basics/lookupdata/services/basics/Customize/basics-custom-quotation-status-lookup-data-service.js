/**
 * Created by Frank and Benjamin on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomQuotationStatusLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomQuotationStatusLookupDataService is the data service for all PES Status look ups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomQuotationStatusLookupDataService', ['basicsCustomStatusLookupDataFactoryService',
		function (basicsCustomStatusLookupDataFactoryService) {
			return basicsCustomStatusLookupDataFactoryService.createService('basicsCustomQuotationStatusLookupDataService', 'quotationstatus');
		}]);
})(angular);