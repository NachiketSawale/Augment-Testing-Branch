/**
 * Created by henkel.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name plantSupplierLookupDataService
	 * @function
	 *
	 * @description
	 * plantSupplierLookupDataService is the data service providing data for plantSupplier look ups
	 */
	angular.module('logistic.plantsupplier').factory('plantSupplierLookupDataService', ['$injector', 'globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector, globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			let readData =  { PKey1: null };
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('plantSupplierLookupDataService', {

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
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					},
					{	id: 'JobFk',
						field: 'JobFk',
						name: 'Job',
						width: 80,
						name$tr$: 'logistic.job.entityJob',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'logisticJob',
							displayMember: 'Code',
							version: 3
						}
					}
				],
				uuid: 'd467a9ad3f9348b1a36c5c9f1084476d'
			});

			let locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'logistic/plantsupplier/', endPointRead: 'listall', usePostForRead: true, }
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);


