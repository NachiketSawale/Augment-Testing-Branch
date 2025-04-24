/**
 * Created by leo on 17.12.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeCrewLeaderLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingEmployeeLeaderLookupDataService is the data service for all crew leaders types
	 */
	angular.module('basics.lookupdata').factory('timekeepingEmployeeAllocationLookupDataService', [
		'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingEmployeeAllocationLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				desMember: 'DescriptionInfo.Translated',
				moduleQualifier: 'timekeepingEmployeeAllocationLookupDataService',
				dataServiceName: 'timekeepingEmployeeAllocationLookupDataService',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 300,
						name$tr$: 'cloud.common.entityCode',
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription',
					}
				],
				uuid: '4f585d0a8e4c47b084ec272d2eff4791',
			});

			let employeeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/',
					endPointRead: 'allemployeelookup',
				},
				showFilteredData: true,
				filterOnLoadFn: function (item) {
					return item.IsLive;
				}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(employeeLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id) {
				return serviceContainer.service.getItemById(id, serviceContainer.options);
			};

			return serviceContainer.service;
		},
	]);
})(angular);
