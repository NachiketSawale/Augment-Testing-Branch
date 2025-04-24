/**
 * Created by leo on 02.03.2021.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeePaymentGroupLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingEmployeePaymentGroupLookupDataService is the data service for all payment group
	 */
	angular.module('basics.lookupdata').factory('timekeepingEmployeePaymentGroupLookupDataService', ['$injector','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector,platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingEmployeePaymentGroupLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'efae4d9755834726b31ad7cbdf09d41f'
			});

			let paymentGroupLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'timekeeping/paymentgroup/', endPointRead: 'all'},

			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(paymentGroupLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
