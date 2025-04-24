/**
 * Created by clv on 7/31/2017.
 */
(function (){

	'use strict';

	var moduleName = 'procurement.common';
	var cloudCommonModule = 'cloud.common';
	var procurementRfqModule = 'procurement.rfq';

	angular.module(moduleName).factory('procurementCommonSuggestedBiddersLayout',procurementCommonSuggestedBiddersLayout);

	procurementCommonSuggestedBiddersLayout.$inject=['basicsLookupdataConfigGenerator', '$injector', 'basicsCommonCommunicationFormatter'];

	function procurementCommonSuggestedBiddersLayout(basicsLookupdataConfigGenerator, $injector, communicationFormatter ){
		function getDataService(){
			return $injector.get('procurementCommonSuggestedBiddersDataService').getService();
		}

		return{
			'fid': 'procurement.common.suggestedbidder.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['businesspartnerfk','subsidiaryfk','bpname1','bpname2','street',
						'city','zipcode','email','countryfk','telephone','userdefined1','userdefined2','userdefined3','userdefined4',
						'userdefined5','commenttext','remark','contactfk','supplierfk']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'overloads': {
				'zipcode': {regex: '^[\\s\\S]{0,20}$'},
				'businesspartnerfk': {
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-main-business-partner-status-lookup-without-teams',
						'options': {
							displayMember: 'StatusDescriptionTranslateInfo.Translated',
							imageSelector: 'platformStatusIconService',
							showClearButton: true
						},
						'label': 'Status',
						'label$tr$': 'procurement.common.entityBusinessPartnerStatus'
					},
					'grid': {
						editor: 'directive',
						editorOptions: {
							directive: 'business-partner-main-business-partner-status-lookup-without-teams',
							lookupOptions: {
								showClearButton: true,
								displayMember: 'StatusDescriptionTranslateInfo.Translated'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							imageSelector: 'platformStatusIconService',
							displayMember: 'StatusDescriptionTranslateInfo.Translated'
						},
						name: 'Status',
						name$tr$: 'procurement.common.entityBusinessPartnerStatus'
					}
				},
				'bpname1': {
					'navigator': {
						moduleName: 'businesspartner.main',
						registerService: 'businesspartnerMainHeaderDataService',
						targetIdProperty: 'BusinessPartnerFk',
						hide: function (entity) {
							return !entity || !entity.BusinessPartnerFk;
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'filter-business-partner-dialog-bidders-lookup',
						'options': {
							displayMember: 'BusinessPartnerName1',
							isTextEditable: true,
							showClearButton: true,
							'IsShowBranch': true,
							'mainService':'procurementCommonSuggestedBiddersDataService',
							'BusinessPartnerField':'BusinesspartnerFk',
							'SubsidiaryField':'SubsidiaryFk',
							'ContactField': 'ContactFk'
						},
						'label': 'Business Partner',
						'label$tr$': 'procurement.common.entityBusinessPartnerName1'
					},
					'grid': {
						editor: 'directive',
						editorOptions: {
							'directive': 'filter-business-partner-dialog-bidders-lookup',
							showClearButton: true,
							'IsShowBranch': true,
							displayMember: 'BusinessPartnerName1',
							isTextEditable: true,
							'mainService':'procurementCommonSuggestedBiddersDataService',
							'BusinessPartnerField':'BusinesspartnerFk',
							'SubsidiaryField':'SubsidiaryFk',
							'ContactField': 'ContactFk'
						},
						name: 'Business Partner',
						name$tr$: 'procurement.common.entityBusinessPartnerName1'
					}
				},
				'subsidiaryfk': {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							filterKey: 'procurement-common-suggestedbidder-businesspartner-subsidiary-filter',
							showClearButton: true,
							displayMember: 'AddressLine'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-subsidiary-lookup',
							lookupOptions: {
								filterKey: 'procurement-common-suggestedbidder-businesspartner-subsidiary-filter',
								showClearButton: true,
								displayMember: 'AddressLine'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Subsidiary',
							displayMember: 'AddressLine'
						}
					}
				},
				'countryfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.country'),
				'contactfk': {
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-main-contact-dialog',
						'options': {
							displayMember: 'FirstName',
							filterKey: 'procurement-common-suggestedbidder-businesspartner-contact-filter',
							showClearButton: true
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-contact-dialog',
							lookupOptions: {
								filterKey: 'procurement-common-suggestedbidder-businesspartner-contact-filter',
								showClearButton: true,
								displayMember: 'FirstName'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'contact',
							displayMember: 'FirstName'
						}
					}
				},
				'email': {
					'grid': {
						editor: 'directive',
						editorOptions: {
							directive: 'basics-common-email-input',
							getDataService: getDataService
						},
						formatter: communicationFormatter,
						formatterOptions: {
							domainType: 'email'
						},
						width: 150
					},
					'detail': {
						type: 'directive',
						directive: 'basics-common-email-input',
						getDataService: getDataService
					}
				},
				'telephone': {
					'grid': {
						formatter: communicationFormatter,
						formatterOptions: {
							lookupDisplayColumn: true,
							domainType: 'phone',
							getItemText: function (model) {
								return model;
							}
						}
					},
					'detail': {
						readonly: false,
						'lookupDisplayColumn': true,
						'type': 'directive',
						'directive': 'basics-common-telephone-dialog',
						'options': {
							hideEditButton: true,
							getItemText: function (model) {
								return model;
							}
						}
					}
				},
				'supplierfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'business-partner-main-supplier-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'procurement-common-suggestedbidder-businesspartner-supplier-filter',
								showClearButton: true
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-supplier-dialog',
							lookupOptions: {
								filterKey: 'procurement-common-suggestedbidder-businesspartner-supplier-filter',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Supplier',
							displayMember: 'Code'
						},
						width: 100
					}
				}
			},
			'addition': {
				'grid': [
					{
						lookupDisplayColumn: true,
						field: 'ContactFk',
						displayMember: 'FamilyName',
						name: 'Contact Family Name',
						name$tr$: 'procurement.common.contactFamilyName'
					},
					{
						lookupDisplayColumn: true,
						field: 'ContactFk',
						displayMember: 'Title',
						name: 'Contact Title',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactTitle'
					},
					{
						id: 'contacttelephone1',
						field: 'ContactFk',
						displayMember: 'Telephone1',
						name: 'Contact Telephone 1',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactTel1',
						formatter: communicationFormatter,
						formatterOptions: {
							lookupDisplayColumn: true,
							domainType: 'phone',
							getDataService: getDataService
						}
					},
					{
						id: 'contacttelephone2',
						field: 'ContactFk',
						displayMember: 'Telephone2',
						name: 'Contact Telephone 2',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactTel2',
						formatter: communicationFormatter,
						formatterOptions: {
							lookupDisplayColumn: true,
							domainType: 'phone',
							getDataService: getDataService
						}
					},
					{
						id: 'contacttelefax',
						field: 'ContactFk',
						displayMember: 'Telefax',
						name: 'Contact Fax Number',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactFax',
						formatter: communicationFormatter,
						formatterOptions: {
							lookupDisplayColumn: true,
							domainType: 'phone',
							getDataService: getDataService
						}
					},
					{
						id: 'contactmobile',
						field: 'ContactFk',
						displayMember: 'Mobile',
						name: 'Contact Mobile',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactMobile',
						formatter: communicationFormatter,
						formatterOptions: {
							lookupDisplayColumn: true,
							domainType: 'phone',
							getDataService: getDataService
						}
					},
					{
						lookupDisplayColumn: true,
						field: 'ContactFk',
						displayMember: 'Internet',
						name: 'Contact Internet',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactInternet'
					},
					{
						id: 'contactemail',
						field: 'ContactFk',
						displayMember: 'Email',
						name: 'Contact Email',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactEmail',
						formatter: communicationFormatter,
						formatterOptions: {
							lookupDisplayColumn: true,
							domainType: 'email',
							getDataService: getDataService
						}
					},
					{
						lookupDisplayColumn: true,
						field: 'ContactFk',
						displayMember: 'Description',
						name: 'Contact Subsidiary Description',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryDescription'
					},
					{
						lookupDisplayColumn: true,
						field: 'ContactFk',
						displayMember: 'AddressLine',
						name: 'Contact Address',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryAddress'
					},
					{
						lookupDisplayColumn: true,
						id: 'SupplierDescription',
						field: 'SupplierFk',
						name: 'Supplier Description',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerSupplierDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Supplier',
							displayMember: 'Description'
						},
						width: 150,
						grouping: {
							// title: translationGrid.initial,
							title$tr$: 'procurement.rfq.rfqBusinessPartnerSupplierDescription',
							getter: 'SupplierFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						lookupDisplayColumn: true,
						id: 'SupplierStatus',
						field: 'SupplierFk',
						name: 'Supplier Status',
						name$tr$: 'procurement.rfq.rfqBusinessPartnerSupplierStatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Supplier',
							displayMember: 'SupplierStatusDescriptionInfo.Translated'
						},
						width: 150,
						grouping: {
							// title: translationGrid.initial,
							title$tr$: 'procurement.rfq.rfqBusinessPartnerSupplierStatus',
							getter: 'SupplierFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					}
				],
				'detail': [
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Family Name',
						'label$tr$': 'procurement.common.contactFamilyName',
						'options': {
							displayMember: 'FamilyName'
						}
					},
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Title',
						'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactTitle',
						'options': {
							displayMember: 'Title'
						}
					},
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Telephone 1',
						'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactTel1',
						'type': 'directive',
						'directive': 'basics-common-telephone-dialog',
						'options': {
							hideEditButton: true,
							getItemText: function (id) {
								return getDataService().getFieldDisplayText('ContactFk', id, 'Telephone1');
							}
						}
					},
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Telephone 2',
						'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactTel2',
						'type': 'directive',
						'directive': 'basics-common-telephone-dialog',
						'options': {
							hideEditButton: true,
							getItemText: function (id) {
								return getDataService().getFieldDisplayText('ContactFk', id, 'Telephone2');
							}
						}
					},
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Fax Number',
						'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactFax',
						'type': 'directive',
						'directive': 'basics-common-telephone-dialog',
						'options': {
							hideEditButton: true,
							getItemText: function (id) {
								return getDataService().getFieldDisplayText('ContactFk', id, 'Telefax');
							}
						}
					},
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Mobile',
						'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactMobile',
						'type': 'directive',
						'directive': 'basics-common-telephone-dialog',
						'options': {
							hideEditButton: true,
							getItemText: function (id) {
								return getDataService().getFieldDisplayText('ContactFk', id, 'Mobile');
							}
						}
					},
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Internet',
						'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactInternet',
						'options': {
							displayMember: 'Internet'
						}
					},
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Email',
						'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactEmail',
						type: 'directive',
						directive: 'basics-common-email-input',
						'options': {
							displayMember: 'Email',
							getItemText: function (id) {
								return getDataService().getFieldDisplayText('ContactFk', id, 'Email');
							}
						}
					},
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Subsidiary Description',
						'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryDescription',
						'options': {
							displayMember: 'Description'
						}
					},
					{
						readonly: true,
						lookupDisplayColumn: true,
						'model': 'ContactFk',
						'label': 'Contact Address',
						'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryAddress',
						'options': {
							displayMember: 'AddressLine'
						}
					}
				]
			},
			'translationInfos': {
				'extraModules': [moduleName,cloudCommonModule,procurementRfqModule],
				'extraWords': {
					BusinessPartnerFk: {
						location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'
					},
					ContactFk: {
						location: moduleName, identifier: 'contactFirstName', initial: 'Contact First Name'
					},
					SubsidiaryFk: {
						location: cloudCommonModule, identifier: 'entitySubsidiary', initial: 'Subsidiary'
					},
					BpName1:{
						location: cloudCommonModule, identifier: 'entityBusinessPartnerName1', initial: 'Business Partner Name1'
					},
					BpName2: {
						location: cloudCommonModule, identifier: 'entityBusinessPartnerName2', initial: 'Business Partner Name2'
					},
					Street: {
						location: cloudCommonModule, identifier: 'entityStreet', initial: 'Street'
					},
					City: {
						location: cloudCommonModule, identifier: 'entityCity', initial: 'City'
					},
					Zipcode: {
						location: cloudCommonModule, identifier: 'entityZipCode', initial: 'Zip Code'
					},
					Email:{
						location: cloudCommonModule, identifier: 'email', initial: 'E-Mail'
					},
					CountryFk: {
						location: cloudCommonModule, identifier: 'entityCountry', initial: 'Country'
					},
					Telephone: {
						location: cloudCommonModule, identifier: 'TelephoneDialogPhoneNumber', initial: 'Phone Number'
					},
					UserDefined1:{
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined1',param: {'p_0': '1'}
					},
					UserDefined2:{
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined2',param: {'p_0': '2'}
					},
					UserDefined3:{
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined3',param: {'p_0': '3'}
					},
					UserDefined4:{
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined4',param: {'p_0': '4'}
					},
					UserDefined5:{
						location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'UserDefined5',param: {'p_0': '5'}
					},
					CommentText: {
						location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'
					},
					Remark: {
						location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'
					}
				}
			}
		};
	}
	angular.module(moduleName).factory('procurementCommonSuggestedBiddersUIStandardService',procurementCommonSuggestedBiddersUIStandardService);

	procurementCommonSuggestedBiddersUIStandardService.$inject=['platformUIStandardConfigService','procurementCommonSuggestedBiddersLayout','procurementCommonTranslationService','platformSchemaService','procurementCommonSuggestedBiddersLayout','platformUIStandardExtentService'];

	function procurementCommonSuggestedBiddersUIStandardService(platformUIStandardConfigService,procurementCommonBiddersLayout,procurementCommonTranslationService,platformSchemaService,layout,platformUIStandardExtentService){

		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'PrcSuggestedBidderDto',moduleSubModule: 'Procurement.Common'}).properties;
		var service = new BaseService(procurementCommonBiddersLayout, domains, procurementCommonTranslationService);
		platformUIStandardExtentService.extend(service, layout.addition, domains);
		return service;
	}
})();
