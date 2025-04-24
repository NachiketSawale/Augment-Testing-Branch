/**
 * Created by Frank on 04.03.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name businessPartnerCustomerLookupDataService
	 * @function
	 *
	 * @description
	 * businessPartnerCustomerLookupDataService is the data service for all project change look ups
	 */
	angular.module('basics.lookupdata').factory('businessPartnerCustomerLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('businessPartnerCustomerLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						width: 100
					},
					{
						id: 'SupplierNo',
						field: 'SupplierNo',
						name: 'Supplier No.',
						formatter: 'description',
						name$tr$: 'businesspartner.main.supplierNo',
						width: 150
					}
				],
				uuid: '1a0311f7aa9648cc984789543551a949'
			});

			var businessPartnerCustomerLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'businesspartner/main/customer/', endPointRead: 'listPlain' },
				filterParam: 'filter=BusinessPartnerFk'
				//dataEnvelope: 'Main'
			};

			return platformLookupDataServiceFactory.createInstance(businessPartnerCustomerLookupDataServiceConfig).service;
		}]);
})(angular);
