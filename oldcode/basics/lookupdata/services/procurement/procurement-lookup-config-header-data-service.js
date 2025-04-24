/**
 * Created by Frank on 17.08.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementLookupConfigHeaderDataService
	 * @function
	 *
	 * @description
	 * procurementLookupConfigHeaderDataService is the data service for procuremnt configuration header type look ups
	 */
	angular.module('basics.lookupdata').factory('procurementLookupConfigHeaderDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('procurementLookupConfigHeaderDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 200,
						name$tr$: 'cloud.common.descriptionInfo'
					}
				],
				uuid: 'b857c36d807140ec92b3a3d4334be075'
			});

			var procurementLookupConfigHeaderDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/strategy/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(procurementLookupConfigHeaderDataServiceConfig).service;
		}]);
})(angular);
