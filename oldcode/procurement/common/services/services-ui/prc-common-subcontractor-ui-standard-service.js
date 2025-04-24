( function ()
{
	'use strict';
	var modName = 'procurement.common',
		cloudCommonModule = 'cloud.common';

	angular.module( modName ).value( 'procurementCommonSubcontractorLayout',{
		'fid': 'requisition.subcontractor.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				'baseGroup':{
					'location': cloudCommonModule,
					'identifier': 'entityProperties',
					'initial': 'Basic Data'
				},
				'PrcStructureFk': {
					'location': cloudCommonModule,
					'identifier': 'entityStructureCode',
					'initial': 'Structure'
				},
				'BpdBusinesspartnerFk': {'location': cloudCommonModule, 'identifier': 'entityBusinessPartner', 'initial': 'Business Partner'},
				'BpdSubsidiaryFk': {'location': cloudCommonModule, 'identifier': 'entitySubsidiary', 'initial': 'Subsidiary'},
				'BpdSupplierFk': {
					'location': cloudCommonModule,
					'identifier': 'entitySupplier',
					'initial': 'Supplier'
				},
				'BpdContactFk': {'location': cloudCommonModule, 'identifier': 'contactFamilyName', 'initial': 'Family Name'},
				'Description': {'location': cloudCommonModule, 'identifier': 'entityComment', 'initial': 'Comment'},
				'UserDefinedDate1': { 'location': cloudCommonModule, 'identifier': 'entityUserDefinedDate', 'initial': 'entityUserDefinedDate', 'param': {'p_0': '1'} },
				'UserDefinedDate2': { 'location': cloudCommonModule, 'identifier': 'entityUserDefinedDate', 'initial': 'entityUserDefinedDate', 'param': {'p_0': '2'} },
				'UserDefinedDate3': { 'location': cloudCommonModule, 'identifier': 'entityUserDefinedDate', 'initial': 'entityUserDefinedDate', 'param': {'p_0': '3'} },
				'UserDefinedDate4': { 'location': cloudCommonModule, 'identifier': 'entityUserDefinedDate', 'initial': 'entityUserDefinedDate', 'param': {'p_0': '4'} },
				'UserDefinedDate5': { 'location': cloudCommonModule, 'identifier': 'entityUserDefinedDate', 'initial': 'entityUserDefinedDate', 'param': {'p_0': '5'} }
			}
		},
		'groups': [{
			'gid': 'baseGroup',
			'attributes': ['prcstructurefk', 'bpdbusinesspartnerfk', 'bpdsubsidiaryfk', 'bpdsupplierfk', 'bpdcontactfk', 'description',
				'userdefineddate1', 'userdefineddate2', 'userdefineddate3', 'userdefineddate4', 'userdefineddate5']
		}, {'gid': 'entityHistory', isHistory:true}],
		'overloads': {
			'prcstructurefk': {
				navigator : {
					moduleName : 'basics.procurementstructure'
					// registerService : 'basicsProcurementStructureService'
				},
				'grid': {
					'editor': 'lookup',
					'editorOptions': {
						'lookupOptions': {'showClearButton': true},
						'directive': 'basics-procurementstructure-structure-dialog'
					},
					'formatter': 'lookup',
					'formatterOptions': {'lookupType': 'PrcStructure', 'displayMember': 'Code'},
					'width': 120
				},
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						'lookupDirective': 'basics-procurementstructure-structure-dialog',
						'descriptionMember': 'DescriptionInfo.Translated',
						'lookupOptions': {'showClearButton': true}
					}
				}
			},
			'bpdbusinesspartnerfk': {
				'navigator': {
					moduleName: 'businesspartner.main'
				},
				'grid': {
					'editor': 'lookup',
					'editorOptions': {
						'lookupOptions': {
							// 'filterKey': 'prc-subcontactor-bussinesspartner-filter',
							'showClearButton': true,
							'IsShowBranch': true,
							'mainService':'procurementContractSubcontractorDataService',
							'BusinessPartnerField':'BpdBusinesspartnerFk',
							'SubsidiaryField':'BpdSubsidiaryFk',
							'SupplierField':'BpdSupplierFk',
							'ContactField': 'BpdContactFk'
						}, // 'directive': 'business-partner-main-business-partner-dialog',
						'directive': 'filter-business-partner-dialog-lookup'
					},
					'formatter': 'lookup',
					'formatterOptions': {'lookupType': 'BusinessPartner', 'displayMember': 'BusinessPartnerName1',
						'navigator': {
							'moduleName': 'businesspartner.main'
						}},
					'grouping': false,
					'width': 120
				},
				'detail': {
					'type': 'directive',
					// 'directive': 'business-partner-main-business-partner-dialog',
					'directive': 'filter-business-partner-dialog-lookup',
					'options': {
						// 'filterKey': 'prc-subcontactor-bussinesspartner-filter',
						'showClearButton': true,
						'IsShowBranch': true,
						'mainService':'procurementContractSubcontractorDataService',
						'BusinessPartnerField':'BpdBusinesspartnerFk',
						'SubsidiaryField':'BpdSubsidiaryFk',
						'SupplierField':'BpdSupplierFk',
						'ContactField': 'BpdContactFk'
					}
				}
			},
			'bpdsubsidiaryfk': {
				'grid': {
					'editor': 'lookup',
					'editorOptions': {
						'lookupOptions': {
							'filterKey': 'prc-subcontactor-subsidiary-filter',
							'showClearButton': true,
							'displayMember': 'AddressLine'
						}, 'directive': 'business-partner-main-subsidiary-lookup'
					},
					'formatter': 'lookup',
					'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
					'width': 120
				},
				'detail': {
					'type': 'directive',
					'directive': 'business-partner-main-subsidiary-lookup',
					'options': {
						'filterKey': 'prc-subcontactor-subsidiary-filter',
						'showClearButton': true,
						'displayMember': 'AddressLine'
					}
				}
			},
			'bpdsupplierfk': {
				'grid': {
					'editor': 'lookup',
					'editorOptions': {
						'lookupOptions': {
							'filterKey': 'prc-subcontactor-supplier-filter',
							'showClearButton': true
						}, 'directive': 'business-partner-main-supplier-lookup'
					},
					'formatter': 'lookup',
					'formatterOptions': {'lookupType': 'supplier', 'displayMember': 'Code'},
					'width': 120
				},
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						'lookupDirective': 'business-partner-main-supplier-lookup',
						'descriptionMember': 'Description',
						'lookupOptions': {
							'filterKey': 'prc-subcontactor-supplier-filter',
							'showClearButton': true
						}
					}
				}
			},
			'bpdcontactfk': {
				'grid': {
					'editor': 'lookup',
					'editorOptions': {
						'lookupOptions': {
							'filterKey': 'prc-subcontactor-bpdcontact-filter',
							'showClearButton': true,
							'displayMember': 'FamilyName'
						}, 'directive': 'business-partner-main-contact-dialog-without-teams'
					},
					'formatter': 'lookup',
					'formatterOptions': {'lookupType': 'contact', 'displayMember': 'FamilyName'},
					'width': 120
				},
				'detail': {
					'type': 'directive',
					'directive': 'business-partner-main-contact-dialog-without-teams',
					'options': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'displayMember': 'FamilyName',
						'showClearButton': true
					}
				}
			},
			'userdefineddate1':{
				'detail':{
					'type': 'dateutc',
					'formatter': 'dateutc'
				},
				'grid':{
					'editor': 'dateutc',
					'formatter': 'dateutc'
				}
			},
			'userdefineddate2':{
				'detail':{
					'type': 'dateutc',
					'formatter': 'dateutc'
				},
				'grid':{
					'editor': 'dateutc',
					'formatter': 'dateutc'
				}
			},
			'userdefineddate3':{
				'detail':{
					'type': 'dateutc',
					'formatter': 'dateutc'
				},
				'grid':{
					'editor': 'dateutc',
					'formatter': 'dateutc'
				}
			},
			'userdefineddate4':{
				'detail':{
					'type': 'dateutc',
					'formatter': 'dateutc'
				},
				'grid':{
					'editor': 'dateutc',
					'formatter': 'dateutc'
				}
			},
			'userdefineddate5':{
				'detail':{
					'type': 'dateutc',
					'formatter': 'dateutc'
				},
				'grid':{
					'editor': 'dateutc',
					'formatter': 'dateutc'
				}
			}
		},
		'addition': {
			'grid': [{
				'lookupDisplayColumn': true,
				'field': 'PrcStructureFk',
				'displayMember': 'DescriptionInfo.Translated',
				'name$tr$': 'cloud.common.entityStructureDescription',
				'width': 150
			}, {
				'lookupDisplayColumn': true,
				'field': 'BpdSupplierFk',
				'displayMember': 'Description',
				'name$tr$': 'cloud.common.entitySupplierDescription',
				'width': 150
			}, {
				'id': 'FirstName',
				'field': 'BpdContactFk',
				'name': 'First Name',
				'name$tr$': 'cloud.common.contactFirstName',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'FirstName'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'FirstName'
					}, 'directive': 'business-partner-main-contact-dialog'
				},
				'width': 120,
				'grouping': {
					'title': 'cloud.common.contactFirstName',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'bpdcontactfk'
			}, {
				'id': 'Title',
				'field': 'BpdContactFk',
				'name': 'Title',
				'name$tr$': 'procurement.common.contactTitle',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Title'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'Title'
					}, 'directive': 'business-partner-main-contact-dialog-without-teams'
				},
				'width': 120,
				'grouping': {
					'title': 'procurement.common.contactTitle',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'FirstName'
			}, {
				'id': 'Telephone1',
				'field': 'BpdContactFk',
				'name': 'Telephone1',
				'name$tr$': 'procurement.common.contactTelephone1',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Telephone1'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'Telephone1'
					}, 'directive': 'business-partner-main-contact-dialog-without-teams'
				},
				'width': 120,
				'grouping': {
					'title': 'procurement.common.contactTelephone1',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'Title'
			}, {
				'id': 'Telephone2',
				'field': 'BpdContactFk',
				'name': 'Telephone2',
				'name$tr$': 'procurement.common.contactTelephone2',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Telephone2'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'Telephone2'
					}, 'directive': 'business-partner-main-contact-dialog-without-teams'
				},
				'width': 120,
				'grouping': {
					'title': 'procurement.common.contactTelephone2',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'Telephone1'
			}, {
				'id': 'Telefax',
				'field': 'BpdContactFk',
				'name': 'Telefax',
				'name$tr$': 'procurement.common.contactTelefax',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Telefax'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'Telefax'
					}, 'directive': 'business-partner-main-contact-dialog-without-teams'
				},
				'width': 120,
				'grouping': {
					'title': 'procurement.common.contactTelefax',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'Telephone2'
			}, {
				'id': 'Mobile',
				'field': 'BpdContactFk',
				'name': 'Mobile',
				'name$tr$': 'procurement.common.contactMobile',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Mobile'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'Mobile'
					}, 'directive': 'business-partner-main-contact-dialog-without-teams'
				},
				'width': 120,
				'grouping': {
					'title': 'procurement.common.contactMobile',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'Telefax'
			}, {
				'id': 'Internet',
				'field': 'BpdContactFk',
				'name': 'Internet',
				'name$tr$': 'procurement.common.contactInternet',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Internet'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'Internet'
					}, 'directive': 'business-partner-main-contact-dialog-without-teams'
				},
				'width': 120,
				'grouping': {
					'title': 'procurement.common.contactInternet',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'Mobile'
			}, {
				'id': 'Email',
				'field': 'BpdContactFk',
				'name': 'Email',
				'name$tr$': 'procurement.common.contactEmail',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Email'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'Email'
					}, 'directive': 'business-partner-main-contact-dialog-without-teams'
				},
				'width': 120,
				'grouping': {
					'title': 'procurement.common.contactEmail',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'Internet'
			}, {
				'id': 'BpdSubsidiaryFk',
				'field': 'BpdContactFk',
				'name': 'Subsidiary Description',
				'name$tr$': 'cloud.common.entitySubsidiaryDescription',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Description'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'Description'
					}, 'directive': 'business-partner-main-contact-dialog-without-teams'
				},
				'width': 120,
				'grouping': {
					'title': 'cloud.common.entitySubsidiaryDescription',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'Email'
			}, {
				'id': 'AddressLine',
				'field': 'BpdContactFk',
				'name': 'Address',
				'name$tr$': 'procurement.common.contactAddress',
				'formatter': 'lookup',
				'formatterOptions': {'lookupType': 'contact', 'displayMember': 'AddressLine'},
				'editor': 'lookup',
				'editorOptions': {
					'lookupOptions': {
						'filterKey': 'prc-subcontactor-bpdcontact-filter',
						'showClearButton': true,
						'displayMember': 'AddressLine'
					}, 'directive': 'business-partner-main-contact-dialog-without-teams'
				},
				'width': 120,
				'grouping': {
					'title': 'procurement.common.contactAddress',
					'getter': 'BpdContactFk',
					'aggregators': [],
					'aggregateCollapsed': true
				},
				'afterId': 'BpdSubsidiaryFk'
			}],
			'detail': [{
				'rid': 'firstName',
				'afterId': 'bpdcontactfk',
				'gid': 'baseGroup',
				'label': 'First Name',
				'label$tr$': 'cloud.common.contactFirstName',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'FirstName',
					showClearButton: true
				}
			},
			{
				'rid': 'title',
				'afterId': 'firstName',
				'gid': 'baseGroup',
				'label': 'Title',
				'label$tr$': 'procurement.common.contactTitle',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog-without-teams',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'Title',
					showClearButton: true
				}
			},
			{
				'rid': 'telephone1',
				'gid': 'baseGroup',
				'afterId': 'title',
				'label': 'Telephone1',
				'label$tr$': 'procurement.common.contactTelephone1',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog-without-teams',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'Telephone1',
					showClearButton: true
				}
			},
			{
				'rid': 'telephone2',
				'gid': 'baseGroup',
				'afterId': 'telephone1',
				'label': 'Telephone2',
				'label$tr$': 'procurement.common.contactTelephone2',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog-without-teams',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'Telephone2',
					showClearButton: true
				}
			},
			{
				'rid': 'telefax',
				'gid': 'baseGroup',
				'afterId': 'telephone2',
				'label': 'Telefax',
				'label$tr$': 'procurement.common.contactTelefax',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog-without-teams',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'Telefax',
					showClearButton: true
				}
			},
			{
				'rid': 'mobile',
				'gid': 'baseGroup',
				'afterId': 'telefax',
				'label': 'Mobile',
				'label$tr$': 'procurement.common.contactMobile',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog-without-teams',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'Mobile',
					showClearButton: true
				}
			},
			{
				'rid': 'internet',
				'gid': 'baseGroup',
				'afterId': 'mobile',
				'label': 'Internet',
				'label$tr$': 'procurement.common.contactInternet',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog-without-teams',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'Internet',
					showClearButton: true
				}
			},
			{
				'rid': 'email',
				'gid': 'baseGroup',
				'afterId': 'internet',
				'label': 'Email',
				'label$tr$': 'procurement.common.contactEmail',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog-without-teams',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'Email',
					showClearButton: true
				}
			},
			{
				'rid': 'subsidiaryDescription',
				'gid': 'baseGroup',
				'afterId': 'email',
				'label': 'Subsidiary Description',
				'label$tr$': 'cloud.common.entitySubsidiaryDescription',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog-without-teams',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'Description',
					showClearButton: true
				}
			},
			{
				'rid': 'subsidiaryAddress',
				'gid': 'baseGroup',
				'afterId': 'subsidiaryDescription',
				'label': 'Address',
				'label$tr$': 'procurement.common.contactAddress',
				'model': 'BpdContactFk',
				'type': 'directive',
				'directive': 'business-partner-main-contact-dialog-without-teams',
				'options': {
					filterKey: 'prc-subcontactor-bpdcontact-filter',
					displayMember: 'AddressLine',
					showClearButton: true
				}
			}]
		}}
	);

	angular.module( modName ).factory( 'procurementCommonSubcontractorUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonSubcontractorLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function ( platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService )
			{

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache( {
					typeName: 'PrcSubreferenceDto',
					moduleSubModule: 'Procurement.Common'
				} );
				if ( domainSchema )
				{
					domainSchema = domainSchema.properties;
				}
				function UIStandardService( layout, scheme, translateService )
				{
					BaseService.call( this, layout, scheme, translateService );
				}

				UIStandardService.prototype = Object.create( BaseService.prototype );
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function (){
					return angular.copy(basicGetStandardConfigForDetailView());
				};
				return service;
			}
		] );
} )();
