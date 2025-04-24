/**
 * Created by bh on 05.10.2016
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name businesspartnerAgreementLookupDataService
	 * @function
	 *
	 * @description
	 * businesspartnerAgreementLookupDataService is the data service for business partner agreements
	 */
	angular.module('basics.lookupdata').factory('businesspartnerAgreementLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {


			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('businesspartnerAgreementLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'BusinessPartnerFk',
						field: 'BusinessPartnerFk',
						name: 'BusinessPartnerFk',
						formatter: 'lookup',
						name$tr$: 'businesspartner.main.name1',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.lookup.businesspartner',
							displayMember: 'BP_NAME1',
							valueMember: 'Id'
						},
						width: 150
					},
					{
						id: 'ValidFrom',
						field: 'ValidFrom',
						name: 'ValidFrom',
						formatter: 'datetime',
						width: 150,
						name$tr$: 'cloud.common.entityValidFrom'
					},
					{
						id: 'ValidTo',
						field: 'ValidTo',
						name: 'ValidTo',
						formatter: 'datetime',
						width: 150,
						name$tr$: 'cloud.common.entityValidTo'
					}
				],
				uuid: 'd0c75ac9aa4d4689a1a6e9857c0d5bfa'
			});

			var businesspartnerAgreementLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'businesspartner/main/agreement/', endPointRead: 'listAll' }
			};

			return platformLookupDataServiceFactory.createInstance(businesspartnerAgreementLookupDataServiceConfig).service;
		}]);
})(angular);
