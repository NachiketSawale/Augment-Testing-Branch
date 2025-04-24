/**
 * Created by leo on 13.09.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingHeaderLookupDataServiceNew
	 * @function
	 *
	 * @description
	 * logisticDispatchingHeaderLookupDataServiceNew is the data service for header look ups
	 */
	angular.module('logistic.dispatching').factory('logisticDispatchingHeaderLookupDataServiceNew', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var activityLookupDataServiceConfig = {}; 
			return filterLookupDataService.createInstance(activityLookupDataServiceConfig);
		}]);
})(angular);
