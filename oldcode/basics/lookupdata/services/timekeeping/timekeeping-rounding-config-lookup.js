/**
 * Created by leo on 17.12.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingRoundingConfigLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingRoundingConfigLookupDataService is the data service for all crew leaders types
	 */
	angular.module('basics.lookupdata').factory('timekeepingRoundingConfigLookupDataService', [
		'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			let readData = {PKey1: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingRoundingConfigLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				//				desMember: 'DescriptionInfo.Translated',
				moduleQualifier: 'timekeepingRoundingConfigLookupDataService',
				dataServiceName: 'timekeepingRoundingConfigLookupDataService',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription',
					}
				],
				uuid: 'a53a4ebe553f4e6c8b3da188dc46219c',
			});

			let roundingLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/recording/roundingconfig/',
					endPointRead: 'getroundingconfiglookup',
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				},
				disableDataCaching: true
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(roundingLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id) {
				return serviceContainer.service.getItemById(id, serviceContainer.options);
			};

			return serviceContainer.service;
		},
	]);
})(angular);
