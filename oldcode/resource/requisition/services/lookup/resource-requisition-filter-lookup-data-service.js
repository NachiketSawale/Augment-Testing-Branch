/**
 * Created by leo on 17.10.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceRequisitionFilterLookupDataService
	 * @function
	 *
	 * @description
	 * resourceRequisitionFilterLookupDataService is the data service for reservation look ups
	 */
	angular.module('resource.requisition').factory('resourceRequisitionFilterLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var options = {};

			return filterLookupDataService.createInstance(options);
		}]);
})(angular);