/**
 * Created by leo on 07.11.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticJobLookupDataService
	 * @function
	 * @description
	 *
	 * data service for logistic job lookup.
	 */
	angular.module('basics.lookupdata').factory('logisticJobLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticJobLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: '100',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '3accb74855da4eba97cc5c608bcbb6d0'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'logistic/job/', endPointRead: 'lookuplist'}
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
