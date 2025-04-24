/**
 * Created by Joshi on 14.04.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';
	/**
	 * @ngdoc service
	 * @name basicsCustomizeEstQuantityRelLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeEstQuantityRelLookupDataService is the data service for all Estimate Quantity Rel related functionality.
	 */
	angular.module(moduleName).factory('basicsCustomizeEstQuantityRelLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {
			var readData =  { PKey1: null };

			var quantityRelLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/customize/estquantityrel/', endPointRead: 'list'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};
			return platformLookupDataServiceFactory.createInstance(quantityRelLookupDataServiceConfig).service;
		}]);
})(angular);
