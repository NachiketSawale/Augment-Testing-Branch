(function () {
	'use strict';
	var modName = 'procurement.common',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('procurementCommonContactLayout', ['basicsLookupdataConfigGenerator', 'basicsCommonCommunicationFormatter',
		function (basicsLookupdataConfigGenerator, communicationFormatter) {
			return {
				'fid': 'requisition.contact.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'translationInfos': {
					'extraModules': [modName],
					'extraWords': {
						'baseGroup': {
							location: cloudCommonModule,
							'identifier': 'entityProperties',
							'initial': 'Basic Data'
						},

						'BpdContactRoleFk': {
							location: cloudCommonModule,
							'identifier': 'contactRole',
							'initial': 'Role'
						},
						'BpdContactFk': {
							location: cloudCommonModule,
							'identifier': 'contactFamilyName',
							'initial': 'Family Name'
						},
						'CommentText': {
							location: cloudCommonModule,
							'identifier': 'entityComment',
							'initial': 'Comment'
						},
						'ContactRoleTypeFk': {
							location: modName,
							'identifier': 'entityContactRoleTypeFk',
							'initial': 'Contact Role Type'
						},
						'InsertedAt': {
							location: cloudCommonModule,
							'identifier': 'entityInsertedAt',
							'initial': 'Inserted'
						},
						'UpdatedAt': {
							location: cloudCommonModule,
							'identifier': 'entityUpdatedAt',
							'initial': 'Updated'
						}
					}
				},
				'groups': [
					{'gid': 'baseGroup', 'attributes': ['bpdcontactrolefk', 'bpdcontactfk', 'commenttext','contactroletypefk']},
					{'gid': 'entityHistory', isHistory: true}],
				'overloads': {
					'bpdcontactrolefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.contact.role'),
					'bpdcontactfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter'},
								'displayMember': 'FamilyName'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'FamilyName'},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'FamilyName'}
						}
					},
					// 'contactroletypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontractroletype')
					'contactroletypefk': {
						'detail': {
							'type': 'directive',
							'directive': 'contact-role-type-lookup',
							'options': {
								showClearButton: false
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'contact-role-type-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ContactRoleType',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'bpdcontactfk',
							'id': 'BpdContactFirstName',
							'field': 'BpdContactFk',
							'name': 'First Name',
							'name$tr$': 'cloud.common.contactFirstName',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'FirstName'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'FirstName'},
							'width': 120,
							'grouping': {
								'title': 'cloud.common.contactFirstName',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'BpdContactFirstName',
							'id': 'BpdContactTitle',
							'field': 'BpdContactFk',
							'name': 'Title',
							'name$tr$': 'procurement.common.contactTitle',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'Title'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Title'},
							'width': 120,
							'grouping': {
								'title': 'procurement.common.contactTitle',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'BpdContactTitle',
							'id': 'BpdContactTelephone1',
							'field': 'BpdContactFk',
							'name': 'Telephone1',
							'name$tr$': 'procurement.common.contactTelephone1',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'Telephone1'}
							},
							'formatter': communicationFormatter,
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Telephone1', 'domainType': 'lookup', 'communicationType': 'phone'},
							'width': 120,
							'grouping': {
								'title': 'procurement.common.contactTelephone1',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'BpdContactTelephone1',
							'id': 'BpdContactTelephone2',
							'field': 'BpdContactFk',
							'name': 'Telephone2',
							'name$tr$': 'procurement.common.contactTelephone2',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'Telephone2'}
							},
							'formatter': communicationFormatter,
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Telephone2', 'domainType': 'lookup', 'communicationType': 'phone'},
							'width': 120,
							'grouping': {
								'title': 'procurement.common.contactTelephone2',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'BpdContactTelephone2',
							'id': 'BpdContactTelefax',
							'field': 'BpdContactFk',
							'name': 'Telefax',
							'name$tr$': 'procurement.common.contactTelefax',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'Telefax'}
							},
							'formatter': communicationFormatter,
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Telefax', 'domainType': 'lookup', 'communicationType': 'phone'},
							'width': 120,
							'grouping': {
								'title': 'procurement.common.contactTelefax',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'BpdContactTelefax',
							'id': 'BpdContactMobile',
							'field': 'BpdContactFk',
							'name': 'Mobile',
							'name$tr$': 'procurement.common.contactMobile',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'Mobile'}
							},
							'formatter': communicationFormatter,
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Mobile', 'domainType': 'lookup', 'communicationType': 'phone'},
							'width': 120,
							'grouping': {
								'title': 'procurement.common.contactMobile',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'BpdContactMobile',
							'id': 'BpdContactInternet',
							'field': 'BpdContactFk',
							'name': 'Internet',
							'name$tr$': 'procurement.common.contactInternet',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'Internet'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Internet'},
							'width': 120,
							'grouping': {
								'title': 'procurement.common.contactInternet',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'BpdContactInternet',
							'id': 'BpdContactEmail',
							'field': 'BpdContactFk',
							'name': 'Email',
							'name$tr$': 'procurement.common.contactEmail',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'Email'}
							},
							'formatter': communicationFormatter,
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Email', 'domainType': 'lookup', 'communicationType': 'email'},
							'width': 120,
							'grouping': {
								'title': 'procurement.common.contactEmail',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'BpdContactEmail',
							'id': 'BpdContactSubsidiary',
							'field': 'BpdContactFk',
							'name': 'Subsidiary',
							'name$tr$': 'cloud.common.entitySubsidiary',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'Description'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'Description'},
							'width': 120,
							'grouping': {
								'title': 'cloud.common.entitySubsidiary',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'BpdContactSubsidiary',
							'id': 'BpdContactAddressLine',
							'field': 'BpdContactFk',
							'name': 'Address',
							'name$tr$': 'procurement.common.contactAddress',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog-without-teams',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'AddressLine'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'AddressLine'},
							'width': 120,
							'grouping': {
								'title': 'procurement.common.contactAddress',
								'getter': 'BpdContactFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}],
					'detail': [
						{
							'afterId': 'bpdcontactfk',
							'rid': 'contactFirstName',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'First Name',
							'label$tr$': 'procurement.common.contactFirstName',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'FirstName'
							}
						},
						{
							'afterId': 'contactFirstName',
							'rid': 'contactTitle',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'Title',
							'label$tr$': 'procurement.common.contactTitle',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'Title'
							}
						},
						{
							'afterId': 'contactTitle',
							'rid': 'contactTelephone1',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'Telephone1',
							'label$tr$': 'procurement.common.contactTelephone1',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'Telephone1'
							}
						},
						{
							'afterId': 'contactTelephone1',
							'rid': 'contactTelephone2',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'Telephone2',
							'label$tr$': 'procurement.common.contactTelephone2',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'Telephone2'
							}
						},
						{
							'afterId': 'contactTelephone2',
							'rid': 'contactTelefax',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'Telefax',
							'label$tr$': 'procurement.common.contactTelefax',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'Telefax'
							}
						},
						{
							'afterId': 'contactTelefax',
							'rid': 'contactMobile',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'Mobile',
							'label$tr$': 'procurement.common.contactMobile',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'Mobile'
							}
						},
						{
							'afterId': 'contactMobile',
							'rid': 'contactInternet',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'Internet',
							'label$tr$': 'procurement.common.contactInternet',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'Internet'
							}
						},
						{
							'afterId': 'contactInternet',
							'rid': 'contactEmail',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'Email',
							'label$tr$': 'procurement.common.contactEmail',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'Email'
							}
						},
						{
							'afterId': 'contactEmail',
							'rid': 'contactSubsidiary',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'Subsidiary',
							'label$tr$': 'cloud.common.entitySubsidiary',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'Description'
							}
						},
						{
							'afterId': 'contactSubsidiary',
							'rid': 'contactAddressLine',
							'gid': 'baseGroup',
							'model': 'BpdContactFk',
							'label': 'Address',
							'label$tr$': 'procurement.common.contactAddress',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								'filterKey': 'prc-req-contact-filter',
								'displayMember': 'AddressLine'
							}
						}]
				}
			};

		}]);

	angular.module(modName).factory('procurementCommonContactUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonContactLayout', 'platformSchemaService','platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService,platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcContactDto',
					moduleSubModule: 'Procurement.Common'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;


				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service,layout.addition, domainSchema);

				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function (){
					return angular.copy(basicGetStandardConfigForDetailView());
				};


				return service;
			}
		]);
})();
