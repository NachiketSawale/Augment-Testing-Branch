/**
 * Created by jhe on 1/11/2019.
 */
(function () {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementContractCrewUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of procurement call off agreement entities
	 */
	angular.module(moduleName).factory('procurementContractCrewUIStandardService',
		['platformUIStandardConfigService', '$injector', 'procurementContractTranslationService', 'platformSchemaService',
			'platformUIStandardExtentService',

			function (platformUIStandardConfigService, $injector, procurementContractTranslationService, platformSchemaService,
				platformUIStandardExtentService) {

				function createMainDetailLayout() {
					return {

						'fid': 'procurement.contract.crewdetailform',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['descriptioninfo', 'bpdcontactfk', 'sorting', 'isdefault', 'islive',
									'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'descriptioninfo': {
								required: true
							},
							'bpdcontactfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'business-partner-main-contact-dialog-without-teams',
										'lookupOptions': {'filterKey': 'prc-crew-contact-filter', 'showClearButton': true}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'Contact', 'displayMember': 'FamilyName'},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										'filterKey': 'prc-crew-contact-filter', 'showClearButton': true, 'displayMember': 'FamilyName'
									}
								}
							}
						},
						'addition': {
							'grid': [
								{
									lookupDisplayColumn: true,
									id: 'ContactFirstName',
									field: 'BpdContactFk',
									name: 'Contact First Name',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactFirstName',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'FirstName',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'FirstName'
									},
									width: 120
								},
								{
									lookupDisplayColumn: true,
									id: 'ContactTitle',
									field: 'BpdContactFk',
									name: 'Contact Title',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactTitle',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog-without-teams',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'Title',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'Title'
									},
									width: 120
								},
								{
									lookupDisplayColumn: true,
									id: 'ContactTel1',
									field: 'BpdContactFk',
									name: 'Contact Telephone 1',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactTel1',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog-without-teams',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'Telephone1',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'Telephone1'
									},
									width: 130
								},
								{
									lookupDisplayColumn: true,
									id: 'ContactTel2',
									field: 'BpdContactFk',
									name: 'Contact Telephone 2',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactTel2',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog-without-teams',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'Telephone2',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'Telephone2'
									},
									width: 130
								},
								{
									lookupDisplayColumn: true,
									id: 'ContactFax',
									field: 'BpdContactFk',
									name: 'Contact Fax Number',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactFax',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog-without-teams',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'Telefax',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'Telefax'
									},
									width: 130
								},
								{
									lookupDisplayColumn: true,
									id: 'ContactMobile',
									field: 'BpdContactFk',
									name: 'Contact Mobile',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactMobile',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog-without-teams',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'Mobile',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'Mobile'
									},
									width: 130
								},
								{
									lookupDisplayColumn: true,
									id: 'ContactInternet',
									field: 'BpdContactFk',
									name: 'Contact Internet',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactInternet',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog-without-teams',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'Internet',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'Internet'
									},
									width: 130
								},
								{
									lookupDisplayColumn: true,
									id: 'ContactEmail',
									field: 'BpdContactFk',
									name: 'Contact Email',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactEmail',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog-without-teams',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'Email',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'Email'
									},
									width: 130
								},
								{
									lookupDisplayColumn: true,
									id: 'ContactSubsidiaryDescription',
									field: 'BpdContactFk',
									name: 'Contact Subsidiary Description',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactSubsidiaryDescription',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog-without-teams',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'Description',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'Description'
									},
									width: 180
								},
								{
									lookupDisplayColumn: true,
									id: 'ContactSubsidiaryAddress',
									field: 'BpdContactFk',
									name: 'Contact Address',
									name$tr$: 'procurement.contract.contractBusinessPartnerContactSubsidiaryAddress',
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog-without-teams',
										lookupOptions: {
											filterKey: 'prc-crew-contact-filter',
											displayMember: 'AddressLine',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'AddressLine'
									},
									width: 150
								}
							],
							'detail': [
								{
									lookupDisplayColumn: true,
									'rid': 'contactFirstName',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact First Name',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactFirstName',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog',
									'options': {
										displayMember: 'FirstName',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								},
								{
									lookupDisplayColumn: true,
									'rid': 'contactTitle',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact Title',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactTitle',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										displayMember: 'Title',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								},
								{
									lookupDisplayColumn: true,
									'rid': 'contactTel1',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact Telephone 1',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactTel1',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										displayMember: 'Telephone1',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								},
								{
									lookupDisplayColumn: true,
									'rid': 'contactTel2',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact Telephone 2',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactTel2',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										displayMember: 'Telephone2',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								},
								{
									lookupDisplayColumn: true,
									'rid': 'contactFax',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact Fax Number',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactFax',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										displayMember: 'Telefax',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								},
								{
									lookupDisplayColumn: true,
									'rid': 'contactMobile',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact Mobile',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactMobile',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										displayMember: 'Mobile',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								},
								{
									lookupDisplayColumn: true,
									'rid': 'contactInternet',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact Internet',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactInternet',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										displayMember: 'Internet',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								},
								{
									lookupDisplayColumn: true,
									'rid': 'contactEmail',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact Email',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactEmail',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										displayMember: 'Email',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								},
								{
									lookupDisplayColumn: true,
									'rid': 'contactSubsidiaryDescription',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact Subsidiary Description',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactSubsidiaryDescription',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										displayMember: 'Description',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								},
								{
									lookupDisplayColumn: true,
									'rid': 'contactSubsidiaryAddress',
									'gid': 'baseGroup',
									'model': 'BpdContactFk',
									'label': 'Contact Address',
									'label$tr$': 'procurement.contract.contractBusinessPartnerContactSubsidiaryAddress',
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog-without-teams',
									'options': {
										displayMember: 'AddressLine',
										filterKey: 'prc-crew-contact-filter',
										showClearButton: true
									}
								}
							]
						}
					};
				}

				var crewDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var crewAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ConCrewDto',
					moduleSubModule: 'Procurement.Contract'
				});
				crewAttributeDomains = crewAttributeDomains.properties;

				function CrewUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				CrewUIStandardService.prototype = Object.create(BaseService.prototype);
				CrewUIStandardService.prototype.constructor = CrewUIStandardService;

				var service = new BaseService(crewDetailLayout, crewAttributeDomains, procurementContractTranslationService);
				platformUIStandardExtentService.extend(service, crewDetailLayout.addition, crewAttributeDomains);

				return service;
			}
		]);
})();
