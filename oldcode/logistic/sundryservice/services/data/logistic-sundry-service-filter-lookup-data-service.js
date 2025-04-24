/**
 * Created by leo on 17.10.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceFilterLookupDataService
	 * @function
	 *
	 * @description
	 * logisticSundryServiceFilterLookupDataService is the data service for resource look ups
	 */
	angular.module('logistic.sundryservice').factory('logisticSundryServiceFilterLookupDataService', ['lookupFilterDialogDataService',
		function (filterLookupDataService) {
			return filterLookupDataService.createInstance({
				httpRoute: 'logistic/sundryservice/',
				endPointRead: 'lookuplistbyfilter',
				filterParam: {groupFk: null},
				usePostForRead: true
			});
		}]);
})(angular);