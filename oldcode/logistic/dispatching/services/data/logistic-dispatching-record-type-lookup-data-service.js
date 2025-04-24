(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'logistic.dispatching';
	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordTypeLookupDataService
	 * @function
	 *
	 * @description
	 * logisticDispatchingRecordTypeLookupDataService is the data service for all record type functionality.
	 */
	angular.module(moduleName).factory('logisticDispatchingRecordTypeLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var recordTypeLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/customize/logisticrecordtype/', endPointRead: 'list', usePostForRead: true },
				showFilteredData: true,
				filterOnLoadFn: function (recType) {
					return recType.IsLive;
				}
			};
			var service =  platformLookupDataServiceFactory.createInstance(recordTypeLookupDataServiceConfig).service;
			service.getItemByKey = function (value, options) {
				return service.getItemById(value, options);
			};
			return service;
		}]);
})(angular);
