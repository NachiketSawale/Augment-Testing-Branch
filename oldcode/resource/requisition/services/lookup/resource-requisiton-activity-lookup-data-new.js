/**
 * Created by leo on 13.09.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceRequisitionActivityLookupDataService
	 * @function
	 *
	 * @description
	 * resourceRequisitionLookupDataService is the data service for requisition look ups
	 */
	angular.module('resource.requisition').factory('resourceRequisitionActivityLookupDataServiceNew', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var activityLookupDataServiceConfig = {};

			var service = filterLookupDataService.createInstance(activityLookupDataServiceConfig);

			service.isUsedFilterSet = function isFilterSet(){
				var result = false;
				if(service.getSelectedFilter('scheduleFk')) {
					result = true;
				}
				return result;
			};
			return service;
		}]);
})(angular);
