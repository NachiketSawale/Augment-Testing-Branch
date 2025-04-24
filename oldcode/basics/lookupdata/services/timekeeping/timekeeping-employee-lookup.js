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
	angular.module('basics.lookupdata').factory('timekeepingEmployeeLookupDataService', [
		'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingEmployeeLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				desMember: 'DescriptionInfo.Translated',
				moduleQualifier: 'timekeepingEmployeeLookupDataService',
				dataServiceName: 'timekeepingEmployeeLookupDataService',
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
					},
					{
						id: 'CompanyCode',
						field: 'CompanyFk',
						name: 'Company Code',
						width: 100,
						name$tr$: 'cloud.common.entityCompanyCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Company',
							displayMember: 'Code'
						},
						sortable: true
					}
				],
				uuid: 'd040410fc40f40569af16694ffc882af',
			});

			let employeeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/',
					endPointRead: 'lookup',
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
