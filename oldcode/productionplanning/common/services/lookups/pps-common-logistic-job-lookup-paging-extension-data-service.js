
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticJobDialogLookupPagingExtensionDataService
	 * @function
	 *
	 * @description
	 * logisticJobLookupExtensionDataService is the data service for requisition look ups
	 */
	angular.module('productionplanning.common').factory('logisticJobDialogLookupPagingExtensionDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var activityLookupDataServiceConfig = {
				// httpRoute: 'productionplanning/common/',
				// endPointRead: 'logisticjobex',
				// //filterParam: {groupFk: null}
				// usePostForRead: true
			};

			return filterLookupDataService.createInstance(activityLookupDataServiceConfig);
		}]);
})(angular);
