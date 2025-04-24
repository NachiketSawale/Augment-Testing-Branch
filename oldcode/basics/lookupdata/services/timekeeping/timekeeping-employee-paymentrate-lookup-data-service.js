/**
 * Created by mohit on 11.01.2024.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeePaymentRateLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingEmployeePaymentRateLookupDataService is the data service for all payment group
	 */
	angular.module('basics.lookupdata').factory('timekeepingEmployeePaymentRateLookupDataService', ['$injector','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingPaymentGroupConstantValues','platformContextService',

		function ($injector,platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, platformDataServiceProcessDatesBySchemeExtension, timekeepingPaymentGroupConstantValues,platformContextService) {
			let readData = {PKey1: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingEmployeePaymentRateLookupDataService', {
				valMember: 'Id',
				dispMember: 'Rate',
				columns: [
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
					},
					{
						id: 'Rate',
						field: 'Rate',
						name: 'Rate',
						formatter: 'rate',
						name$tr$: 'cloud.common.entityRate'
					},
					{
						id: 'ValidFrom',
						field: 'ValidFrom',
						name: 'ValidFrom',
						formatter: 'datetime',
						name$tr$: 'cloud.common.entityValidFrom'
					},
					{
						id: 'CommentText',
						field: 'CommentText',
						name: 'CommentText',
						formatter: 'comment',
						name$tr$: 'cloud.common.CommentText'
					},
					{
						id: 'Surcharge',
						field: 'SurchargeTypeFk',
						name: 'SurchargeType',
						name$tr$: 'timekeeping.paymentgroup.entitySurchargeTypeFk',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingsurchargetype').grid.formatterOptions
					}
				],
				uuid: '4f934589ab69498cb55da56755edee9a'
			});
			let paymentRateLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'timekeeping/paymentgroup/rate/', endPointRead: 'paymentgroupratelist'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				},
				showFilteredData: true,
				filterOnLoadFn: function (item) {
					let clientId = platformContextService.signedInClientId;
					if(clientId === item.CompanyFk)
					{
						return item;
					}

				},
				selectableCallback: function (dataItem) {
					return platformContextService.signedInClientId === dataItem.CompanyFk;
				},
				disableDataCaching: true,
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingPaymentGroupConstantValues.schemes.rate)],
			};
			return platformLookupDataServiceFactory.createInstance(paymentRateLookupDataServiceConfig).service;

		}]);
})(angular);
