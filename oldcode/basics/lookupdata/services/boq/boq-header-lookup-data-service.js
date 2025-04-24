/**
 * Created by bh on 26.05.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqHeaderLookupDataService
	 * @function
	 *
	 * @description
	 * boqHeaderLookupDataService is the data service for a special boq header lookup giving a top level view on boq root items
	 */
	angular.module('basics.lookupdata').factory('boqHeaderLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var boqHeaderLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'getboqheaderlookup' },
				filterParam: 'wicItemsOnly',
				dataProcessor: [{processItem:processItem}]
			};

			function processItem (item) {
				// Add a prefix to the WIC items
				if(item.IsWicItem){
					item.Description = 'WIC: ' + item.Description; // Todo BH: Add translation for WIC
				}
			}

			return platformLookupDataServiceFactory.createInstance(boqHeaderLookupDataServiceConfig).service;
		}]);
})(angular);
