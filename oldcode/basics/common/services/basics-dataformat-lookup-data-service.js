/**
 * Created by lcn on 3/25/2019.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsDataformatLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'globals',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, globals) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsDataformatLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.descriptionInfo'
					}
				],
				uuid: '64252829deef4f009b5d0c6a90613b07'
			});

			const locationLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/common/dataformat/', endPointRead: 'list'}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
