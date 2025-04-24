/**
 * Created by leo on 09.05.2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name prcComonItemDialogLookupDataService
	 * @function
	 *
	 * @description
	 * prcComonItemDialogLookupDataService is the data service for prc items look ups
	 */
	angular.module('procurement.common').factory('prcComonItemDialogLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var activityLookupDataServiceConfig = {};

			return filterLookupDataService.createInstance(activityLookupDataServiceConfig);
		}]);
})(angular);
