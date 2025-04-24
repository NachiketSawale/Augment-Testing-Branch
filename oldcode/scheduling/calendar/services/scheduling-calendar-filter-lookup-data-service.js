/**
 * Created by leo on 13.03.2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarFilterLookupDataService
	 * @function
	 *
	 * @description
	 * schedulingCalendarFilterLookupDataService is the data service for requisition look ups
	 */
	angular.module('scheduling.calendar').factory('schedulingCalendarFilterLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var activityLookupDataServiceConfig = {
			};

			return filterLookupDataService.createInstance(activityLookupDataServiceConfig);
		}]);
})(angular);
