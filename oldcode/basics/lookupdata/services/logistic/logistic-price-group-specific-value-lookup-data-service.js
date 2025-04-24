(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticPriceGroupSpecificValueLookupDataService
	 * @function
	 *
	 * @description
	 * logisticPriceGroupSpecificValueLookupDataService is the data service for lookups
	 */
	angular.module('basics.lookupdata').factory('logisticPriceGroupSpecificValueLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticPriceGroupSpecificValueLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Description',
				showIcon:true,
				columns: [
					{
						id: 'descriptionInfo',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'f4131bd887f44cc0b312c110852d619f'
			});

			var logisticPriceGroupSpecificValueLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/specificvalue/',
					endPointRead: 'lookuplist',
					usePostForRead: true
				}
			};

			return platformLookupDataServiceFactory.createInstance(logisticPriceGroupSpecificValueLookupDataServiceConfig).service;
		}]);
})(angular);
