(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticSettlementLookupByCompany
	 * @function
	 * @description
	 *
	 * data service for settlement lookup filter by company.
	 */
	angular.module('basics.lookupdata').factory('logisticSettlementLookupByCompanyService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticSettlementLookupByCompanyService', {
				valMember: 'Id',
				dispMember: 'SettlementNo',
				columns: [
					{
						id: 'SettlementNo',
						field: 'SettlementNo',
						name: 'SettlementNo',
						formatter: 'settlementNo',
						width: 100,
						name$tr$: 'cloud.common.SettlementNo'
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
				uuid: 'cfc7ceb3879d45b1a82891d765226cc4'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'logistic/settlement/', endPointRead: 'lookuplistbycompany'},
				filterParam: 'companyId',
				disableDataCaching: true
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
