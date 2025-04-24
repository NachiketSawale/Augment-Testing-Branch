/**
 * Created by sudarshan on 30.03.2023.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeCertificateLookupDataService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module('basics.lookupdata').factory('timekeepingEmployeeCertificateLookupDataService', [
		'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingEmployeeCertificateLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Id',
						field: 'Id',
						name: 'Id',
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
				uuid: '9bda1d26ecdf4d89be13cf97ddfbf0d9'
			});

			let employeeCertificateLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/certificate/',
					endPointRead: 'lookup',
				},
				showFilteredData: true,
				filterOnLoadFn: function (item) {
					return item;
				}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(employeeCertificateLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id) {
				return serviceContainer.service.getItemById(id, serviceContainer.options);
			};

			return serviceContainer.service;
		},
	]);
})(angular);
