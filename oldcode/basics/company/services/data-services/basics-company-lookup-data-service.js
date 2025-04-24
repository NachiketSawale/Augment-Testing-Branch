(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCountryLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCountryLookupDataService is the data service providing data for Country look ups
	 */
	angular.module('basics.company').factory('basicsCompanyLookupDataService', ['globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'ServiceDataProcessArraysExtension', 'basicsCompanyImageProcessor',

		function (globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, ServiceDataProcessArraysExtension, basicsCompanyImageProcessor) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCompanyLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Company',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCompany'
					},
					{
						id: 'CompanyName',
						field: 'CompanyName',
						name: 'Company',
						formatter: 'description',
						name$tr$: 'cloud.common.entityName'
					}
				],
				uuid: '648b676fc93d4e3ab71efdb399172225'
			});

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/company/', endPointRead:'list'},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor],
				tree: { parentProp: 'CompanyFk', childProp: 'Companies' },

				selectableCallback: function selectableCallback(dataItem) {
					let result = false;
					if (dataItem.IsLive) {
						result = true;
					}
					return result;
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
