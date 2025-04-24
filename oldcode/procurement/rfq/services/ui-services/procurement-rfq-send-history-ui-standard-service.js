/**
 * Created by lvy on 4/2/2019.
 */
(function () {
	'use strict';

	const moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqSendHistoryLayout', [
		'_',
		'basicsLookupdataConfigGenerator',
		function (
			_,
			basicsLookupdataConfigGenerator
		) {
			return {
				'fid': 'procurement.rfq.send.history',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': false,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': [
							'prccommunicationchannelfk',
							'rfqstatusfk', 'rfqbpstatusprefk',
							'rfqbpstatuspostfk',
							'protocol',
							'contactfk',
							'recipient',
							'subject',
							'datesent',
							'emaillink',
							'sender'
						]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'recipient': {
						maxLength: 100,
						readonly: true
					},
					'subject': {
						maxLength: 252,
						readonly: true
					},
					'datesent': {
						readonly: true
					},
					'emaillink': {
						maxLength: 2000,
						readonly: true
					},
					'sender': {
						maxLength: 100,
						readonly: true
					},
					'contactfk': {
						'detail': {
							'label$tr$': 'procurement.rfq.SendHistoryContact',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'FamilyName',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						'grid': {
							'name$tr$': 'procurement.rfq.SendHistoryContact',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'FamilyName',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'FamilyName'
							},
							width: 120
						},
						'readonly': true
					},
					'prccommunicationchannelfk': {
						detail: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.lookup.prccommunicationchannel', 'Description', null, false, {}),
						grid: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.lookup.prccommunicationchannel',
							att2BDisplayed: 'Description',
							readOnly: true,
							options: {}
						}),
						'readonly': true
					},
					'rfqstatusfk': {
						'readonly': true,
						'detail': {
							'type': 'directive',
							'label': 'Status RFQ',
							'label$tr$': 'procurement.rfq.statusRfq',
							'directive': 'procurement-rfq-header-status-combobox',
							'options': {
								readOnly: true
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'rfqStatus',
								displayMember: 'Description',
								imageSelector: 'platformStatusIconService'
							},
							name: 'Status RFQ',
							name$tr$: 'procurement.rfq.statusRfq',
							width: 100
						}
					},
					'rfqbpstatusprefk': {
						'readonly': true,
						'detail': {
							'type': 'directive',
							'directive': 'procurement-rfq-business-partner-status-combobox',
							'readonly': true
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-rfq-business-partner-status-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RfqBusinessPartnerStatus',
								displayMember: 'Description'
							},
							width: 100
						}
					},
					'rfqbpstatuspostfk': {
						'readonly': true,
						'detail': {
							'type': 'directive',
							'directive': 'procurement-rfq-business-partner-status-combobox',
							'readonly': true
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-rfq-business-partner-status-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RfqBusinessPartnerStatus',
								displayMember: 'Description'
							},
							width: 100
						}
					},
					'protocol': {
						'readonly': true
					}
				},
				'addition': {
					grid: [
						{
							field: 'RfqCode',
							name: 'RFQ',
							name$tr$: 'documents.project.entityRfqHeaderCode',
							width: 125,
							formatter: 'code',
							grouping: {
								title: 'documents.project.entityRfqHeaderCode',
								getter: 'RfqCode',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							field: 'RfqDescription',
							name: 'RFQ Description',
							name$tr$: 'documents.project.rfqDescription',
							width: 125,
							formatter: 'description',
							grouping: {
								title: 'documents.project.rfqDescription',
								getter: 'RfqDescription',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						_.extend(basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'documents.project.documenttype',
							att2BDisplayed: 'Description',
							readOnly: true,
							confObj: {
								id: 'DocumentTypeFk',
								field: 'DocumentTypeFk',
								name: 'Project Document Type',
								name$tr$: 'documents.project.entityPrjDocumentType',
								width: 125
							}
						}), {
							grouping: {
								title: 'documents.project.entityPrjDocumentType',
								getter: 'DocumentTypeFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						}),
						{
							field: 'BusinessPartnerName1',
							name: 'Business Partner',
							name$tr$: 'procurement.rfq.BusinessPartner',
							width: 125,
							formatter: 'description',
							grouping: {
								title: 'procurement.rfq.BusinessPartner',
								getter: 'BusinessPartnerName1',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							field: 'OriginFileName',
							name: 'Origin File Name',
							name$tr$: 'procurement.rfq.originFileName',
							width: 125,
							formatter: 'description',
							grouping: {
								title: 'procurement.rfq.originFileName',
								getter: 'OriginFileName',
								aggregators: [],
								aggregateCollapsed: true
							}
						}
					],
					detail: [
						{
							afterId: 'rfqbpstatuspostfk',
							rid: 'rfqCode',
							gid: 'baseGroup',
							model: 'RfqCode',
							label: 'RFQ',
							label$tr$: 'documents.project.entityRfqHeaderCode',
							type: 'code',
							readonly: true
						},
						{
							afterId: 'rfqCode',
							rid: 'rfqDescription',
							gid: 'baseGroup',
							model: 'RfqDescription',
							label: 'RFQ Description',
							label$tr$: 'documents.project.rfqDescription',
							type: 'description',
							readonly: true
						},
						{
							afterId: 'rfqDescription',
							rid: 'requisitionCode',
							gid: 'baseGroup',
							model: 'RequisitionCode',
							label: 'REQ',
							label$tr$: 'procurement.rfq.prcRfqSendHistoryReq',
							type: 'code',
							readonly: true
						},
						{
							afterId: 'requisitionCode',
							rid: 'requisitionDescription',
							gid: 'baseGroup',
							model: 'RequisitionDescription',
							label: 'REQ Description',
							label$tr$: 'procurement.rfq.prcRfqSendHistoryReqDescription',
							type: 'description',
							readonly: true
						},
						{
							afterId: 'requisitionDescription',
							rid: 'packageCode',
							gid: 'baseGroup',
							model: 'PackageCode',
							label: 'Package',
							label$tr$: 'documents.project.entityPackage',
							type: 'code',
							readonly: true
						},
						{
							afterId: 'packageCode',
							rid: 'packageDescription',
							gid: 'baseGroup',
							model: 'PackageDescription',
							label: 'Package Description',
							label$tr$: 'documents.project.packageDescription',
							type: 'description',
							readonly: true
						},
						{
							afterId: 'packageDescription',
							rid: 'prjProjectFk',
							gid: 'baseGroup',
							model: 'PrjProjectFk',
							label: 'Project No.',
							label$tr$: 'documents.project.entityPrjProject',
							type: 'text',
							readonly: true
						},
						{
							afterId: 'prjProjectFk',
							rid: 'projectName',
							gid: 'baseGroup',
							model: 'ProjectName',
							label: 'Project Name 1',
							label$tr$: 'documents.project.project_name1',
							type: 'text',
							readonly: true
						},
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('documents.project.documenttype', 'Description', {
							rid: 'documentTypeFk',
							gid: 'baseGroup',
							model: 'DocumentTypeFk',
							label: 'Project Document Type',
							label$tr$: 'documents.project.entityPrjDocumentType',
							type: 'lookup',
							readonly: true
						}),
						{
							afterId: 'documentTypeFk',
							rid: 'businessPartnerName1',
							gid: 'baseGroup',
							model: 'BusinessPartnerName1',
							label: 'Business Partner',
							label$tr$: 'procurement.rfq.BusinessPartner',
							type: 'description',
							readonly: true
						},
						{
							afterId: 'businessPartnerName1',
							rid: 'originFileName',
							gid: 'baseGroup',
							model: 'OriginFileName',
							label: 'Origin File Name',
							label$tr$: 'procurement.rfq.originFileName',
							type: 'text',
							readonly: true
						}
					]
				}
			};
		}]);

	angular.module(moduleName).factory('procurementRfqSendHistoryUIStandardService', [
		'platformUIStandardConfigService',
		'platformSchemaService',
		'procurementRfqTranslationService',
		'procurementRfqSendHistoryLayout',
		'platformUIStandardExtentService',
		function (
			platformUIStandardConfigService,
			platformSchemaService,
			translationService,
			layout,
			platformUIStandardExtentService
		) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'RfqSendHistoryDto',
				moduleSubModule: 'Procurement.RfQ'
			});
			domainSchema = domainSchema.properties;

			function RfqUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			RfqUIStandardService.prototype = Object.create(BaseService.prototype);
			RfqUIStandardService.prototype.constructor = RfqUIStandardService;

			let service = new BaseService(layout, domainSchema, translationService);
			platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
			return service;
		}
	]);

})();