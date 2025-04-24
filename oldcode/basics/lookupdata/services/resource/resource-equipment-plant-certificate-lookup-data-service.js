(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantCertificateLookupDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantLookupDataService is the data service for all resource certificated plants types
	 */
	angular.module('basics.lookupdata').factory('resourceEquipmentPlantCertificateLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceEquipmentPlantCertificateLookupDataService', {

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
					},
					{
						id: 'ValidFrom',
						field: 'ValidFrom',
						name: 'ValidFrom',
						formatter: 'dateutc',
						width: 150,
						name$tr$: 'cloud.common.entityValidFrom'
					},
					{
						id: 'ValidTo',
						field: 'ValidTo',
						name: 'ValidTo',
						formatter: 'dateutc',
						width: 150,
						name$tr$: 'cloud.common.entityValidTo'
					},
					{
						id: 'Certificate',
						field: 'CertificateTypeFk',
						name: 'Certificate type',
						width: 300,
						name$tr$: 'basics.customize.plantcertificatetype',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantcertificatetype').grid.formatterOptions
					}
				],



				uuid: 'd6f7ab26ac7211e9a2a32a2ae2dbcce4'
			});

			var resourceEquipmentPlantCertificateLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'resource/certificate/', endPointRead: 'bydivision' }
			};

			return platformLookupDataServiceFactory.createInstance(resourceEquipmentPlantCertificateLookupDataServiceConfig).service;
		}]);
})(angular);



