/**
 * Created by leo on 17.12.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeByRightsLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingEmployeeByRightsLookupDataService is the data service for all crew leaders types
	 */
	angular.module('basics.lookupdata').factory('timekeepingEmployeeByRightsLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingEmployeeByRightsLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				desMember: 'DescriptionInfo.Translated',
				moduleQualifier: 'timekeepingEmployeeByRightsLookupDataService',
				dataServiceName: 'timekeepingEmployeeByRightsLookupDataService',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 300,
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
				uuid: 'ef7153f249314fb7bab9bb201cda86c0'
			});

			let employeeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/',
					endPointRead: 'lookupbyrights'
				}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(employeeLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
