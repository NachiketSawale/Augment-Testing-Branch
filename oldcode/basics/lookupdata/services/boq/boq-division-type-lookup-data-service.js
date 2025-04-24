/**
 * Created by bh on 31.05.2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqDivisionTypeLookupDataService
	 * @function
	 *
	 * @description
	 * boqDivisionTypeLookupDataService is the data service for boq division type look ups
	 */
	angular.module('basics.lookupdata').factory('boqDivisionTypeLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqDivisionTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '30efbc528d3e41f988d5dc9869cb71c5'
			});

			var boqDivisionTypeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/divisiontype/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(boqDivisionTypeLookupDataServiceConfig).service;
		}]);
})(angular);
