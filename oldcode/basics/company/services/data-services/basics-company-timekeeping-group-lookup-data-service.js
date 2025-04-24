/**
 * Created by henkel on 20.09.2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsTimekeepingGroupLookupDataService
	 * @function
	 *
	 * @description
	 * basicsTimekeepingGroupLookupDataService is the data service providing data for TimekeepingGroup look ups
	 */
	angular.module('basics.company').factory('basicsTimekeepingGroupLookupDataService', ['$injector', 'globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector, globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsTimekeepingGroupLookupDataService', {

				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'f1597c3ae0a940a4ba2bc521bf980a9b'
			});

			// Pkey1 = CompanyFk
			var readData =  { PKey1: null };

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/company/timekeepinggroup/', endPointRead: 'listbyparent' },
				filterParam: readData,
				prepareFilter: function prepareFilter(companyFk) {
					readData.PKey1 = companyFk;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
