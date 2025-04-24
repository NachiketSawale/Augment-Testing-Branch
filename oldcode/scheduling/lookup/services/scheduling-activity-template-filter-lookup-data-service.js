/**
 * Created by Frank on 25.03.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingActivityTemplateFilterLookupDataService
	 * @function
	 *
	 * @description
	 * schedulingActivityTemplateFilterLookupDataService is the data service for all activity templates change look ups
	 */
	angular.module('scheduling.lookup').factory('schedulingActivityTemplateFilterLookupDataService', ['lookupFilterDialogDataService',

		function (lookupFilterDialogDataService) {

			return lookupFilterDialogDataService.createInstance({});
		}]);
})(angular);
