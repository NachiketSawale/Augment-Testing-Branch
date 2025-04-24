/**
 * Created by ltn on 5/25/2017.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name modelLookupDataService
     * @function
     *
     * @description
     * modelLookupDataService is the data service for activity look ups
     */
	angular.module('basics.lookupdata').factory('instanceHeaderLanguageDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
	        var readData =  { PKey1: null };


			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('instanceHeaderLanguageDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Language',
						formatter: 'description',
						width: 150
					},
					{
						id: 'culture',
						field: 'Culture',
						name: 'Culture',
						formatter: 'description',
						width: 100
					}

				],
				uuid: '11507B5EE12E4E288FC8FAFF9E0612A7'
			});

			var instanceHeaderLanguageDataServiceConfig = {
            	httpRead: { route: globals.webApiBaseUrl + 'basics/customize/language/', endPointRead: 'list', usePostForRead: true },
	            filterParam: readData,
	            prepareFilter: function prepareFilter(item) {
		            readData.PKey1 = item;
		            return readData;
	            }
			};

			return platformLookupDataServiceFactory.createInstance(instanceHeaderLanguageDataServiceConfig).service;
		}]);
})(angular);