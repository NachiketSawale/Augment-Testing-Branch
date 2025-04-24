/**
 * Created by leo on 17.10.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceReservationLookupDataService
	 * @function
	 *
	 * @description
	 * resourceReservationLookupDataService is the data service for reservation look ups
	 */
	angular.module('resource.reservation').factory('resourceReservationLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var options = {
				httpRoute: 'resource/reservation/',
				endPointRead: 'lookuplistbyfilter',
				filterParam: {ResourceId: null, RequisitionId: null}
			};

			return filterLookupDataService.createInstance(options);
		}]);
})(angular);