
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomizePantTypeLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizePantTypeLookupDataService is the data service providing data for unit look ups
	 */
	angular.module('basics.unit').factory('basicsCustomizePantTypeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomizePantTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '968e4037d4644cd9b7015c8acda1bfdf'
			});

			var locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/customize/planttype/',
					endPointRead: 'list',
					usePostForRead: true
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
