/**
 * Created by baf on 2016/06/13.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomCodeFormatLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomCodeFormatLookupDataService is the data service for all Address Format
	 */
	angular.module('basics.lookupdata').factory('basicsCustomCodeFormatLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomCodeFormatLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon:true,
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab'
			});

			var basicsCustomCodeFormatLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/codeformat/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomCodeFormatLookupDataServiceConfig).service;
		}]);
})(angular);
