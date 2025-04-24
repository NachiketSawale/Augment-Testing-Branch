/**
 * Created by leo on 13.09.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityLookupFilterService
	 * @function
	 *
	 * @description
	 * schedulingMainActivityLookupFilterService is the data service for scheduling activity look ups
	 */
	angular.module('scheduling.main').factory('schedulingMainActivityLookupFilterService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var activityLookupDataServiceConfig = {};

			var service = filterLookupDataService.createInstance(activityLookupDataServiceConfig);

			service.isUsedFilterSet = function isFilterSet(){
				var result = false;
				if(service.getSelectedFilter('scheduleFk') || service.getSelectedFilter('controllingUnitFk')) {
					result = true;
				}
				return result;
			};
			return service;
		}]);
})(angular);
