/**
 * Created by lcn on 9/6/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';
	/**
     * @ngdoc service
     * @name materialprojectStockLookupDataService
     * @function
     *
     * @description
     * projectLookupDataService is the data service for all location look ups
     */

	angular.module(moduleName).factory('materialprojectStockLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {
			var readData =  { PKey1: null };
			var stockLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'project/stock/material2projectstock/',
					endPointRead: 'getstockbyprojectid'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(stockLookupDataServiceConfig).service;
		}]);
})(angular);
