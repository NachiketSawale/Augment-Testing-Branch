/**
 * Created by henkel on 20.09.2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name objectMainUnitLookupDataService
	 * @function
	 *
	 * @description
	 * objectMainUnitLookupDataService is the data service providing data for RubricCategory look ups
	 */
	angular.module('basics.company').factory('objectMainUnitLookupDataService', ['$injector', 'globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector, globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: -1 };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('objectMainUnitLookupDataService', {

				valMember: 'Id',
				dispMember: 'Description',
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
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'e57f5fca7c8744eb876a97f7f7458565'
			});

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'object/main/unit/', endPointRead:'list' ,usePostForRead: true },
				filterParam: 'mainItemId',
				prepareFilter: function prepareFilter(Id) {
					readData.PKey1 = Id;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
