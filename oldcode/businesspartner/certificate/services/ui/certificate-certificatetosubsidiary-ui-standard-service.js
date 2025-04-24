/**
 * Created by lius on 2021/12/30.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).factory('businesspartnerCertificateToSubsidiaryUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerCustomerCertificateToSubsidiaryLayout', 'businesspartnerCertificateTranslationService', 'platformSchemaService',
			'platformUIStandardExtentService',
			function (platformUIStandardConfigService, businesspartnerCustomerCertificateToSubsidiaryLayout, businesspartnerCertificateTranslationService, platformSchemaService,
				platformUIStandardExtentService) {

				var attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Certificate2subsidiaryDto',
					moduleSubModule: 'BusinessPartner.Certificate'
				}).properties;

				let service = new platformUIStandardConfigService(businesspartnerCustomerCertificateToSubsidiaryLayout, attributeDomains, businesspartnerCertificateTranslationService);
				platformUIStandardExtentService.extend(service, businesspartnerCustomerCertificateToSubsidiaryLayout.addition, attributeDomains);
				return service;
			}
		]);

	angular.module(moduleName).factory('businesspartnerCustomerCertificateToSubsidiaryLayout',
		[
			function () {
				return {
					'fid': 'businessPartner.certificate.certificate2subsidiary.detail',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['subsidiaryfk']
						}
					],
					'translationInfos': {
						'extraModules': [moduleName],
						'extraWords': {
							SubsidiaryFk: {
								location: moduleName,
								identifier: 'entitySubsidiaryFk',
								initial: 'Subsidiary'
							}
						}
					},
					'overloads': {
						'subsidiaryfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-subsidiary-lookup',
									lookupOptions: {
										filterKey: 'businesspartner-main-certificate-to-subsidiary-common-filter',
										showClearButton: true,
										displayMember: 'SubsidiaryDescription'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Subsidiary',
									displayMember: 'SubsidiaryDescription'
								}
							}
						}
					},
					'addition': {
						grid: [
							{
								'afterId': 'subsidiaryfk',
								'id': 'subsidiaryDescription',
								'field': 'SubsidiaryFk',
								'name': 'Address',
								'name$tr$': 'businesspartner.certificate.entitySubsidiaryAddress',
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'Subsidiary',
									displayMember: 'AddressInfo'
								},
								'width': 140
							}
						]
					}
				};
			}
		]);
})(angular);