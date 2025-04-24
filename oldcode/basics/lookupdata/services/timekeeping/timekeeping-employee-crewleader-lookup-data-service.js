/**
 * Created by leo on 07.05.2018.
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
	 * timekeepingEmployeeCrewLeaderLookupDataService is the data service for all crew leaders types
	 */
	angular.module('basics.lookupdata').factory('timekeepingEmployeeCrewLeaderLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingEmployeeCrewLeaderLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
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
				uuid: '56dfe96f64f648a595f5747d42e1a7da'
			});

			let crewLeaderLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/',
					endPointRead: 'lookupcrewleader'
				}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(crewLeaderLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
