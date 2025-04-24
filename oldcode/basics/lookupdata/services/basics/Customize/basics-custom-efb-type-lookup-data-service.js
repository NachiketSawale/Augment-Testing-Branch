
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomEFBTypeLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomEFBTypeLookupDataService is the data service for all EFB Type lookups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomEFBTypeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomEFBTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
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
				uuid: '3a51bf834b8649069172d23ec1ba35e2'
			});

			var basicsCustomEFBTypeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/efbtype/', endPointRead: 'list', usePostForRead: true},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomEFBTypeLookupDataServiceConfig).service;
		}]);
})(angular);
