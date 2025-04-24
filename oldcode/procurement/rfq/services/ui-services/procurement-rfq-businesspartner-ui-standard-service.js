(function () {
	'use strict';

	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular $ */
	/**
	 * @ngdoc service
	 * @name procurementRfqBusinessPartnerDetailLayout
	 * @function
	 * @requires []
	 *
	 * @description
	 * # ui layout service for entity RfqBusinessPartner.
	 */
	angular.module(moduleName).factory('procurementRfqBusinessPartnerDetailLayout', ['basicsCommonCommunicationFormatter', '$injector', 'platformPermissionService',
		function (communicationFormatter, $injector, platformPermissionService) {
			return {
				'fid': 'procurement.rfq.businesspartner.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['prccommunicationchannelfk', 'firstquotefrom', 'rfqbusinesspartnerstatusfk', 'daterequested', 'daterejected', 'rfqrejectionreasonfk', 'extendeddate', 'comments']
					},
					{
						'gid': 'businesspartnerGroup',
						'attributes': ['businesspartnerfk', 'subsidiaryfk', 'supplierfk']
					},
					{
						'gid': 'contactGroup',
						'attributes': ['contactfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'firstquotefrom': {
						'readonly': true,
						'navigator': {
							moduleName: 'procurement.quote',
							registerService: 'procurementQuoteHeaderDataService'
						},
						'detail': {
							'type': 'date',
							'formatter': 'date'
						},
						'grid': {
							editor: 'date',
							formatter: 'date'
						}
					},
					'businesspartnerfk': {
						'navigator': {
							moduleName: 'businesspartner.main',
							registerService: 'businesspartnerMainHeaderDataService'
						},
						'detail': {
							'type': 'directive',
							// 'directive': 'business-partner-main-business-partner-dialog',
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								displayMember: 'BusinessPartnerName1',
								showClearButton: false,
								showAddButton: platformPermissionService.hasCreate('75dcd826c28746bf9b8bbbf80a1168e8') && platformPermissionService.hasExecute('a87a85389a804c92bdc67cd325ab0974'),
								requisitionService: 'procurementRfqRequisitionService',
								filterKey: 'procurement-rfq-businesspartner-businesspartner-filter',
								'approvalBPRequired': true,
								'IsShowBranch': true,
								'mainService': 'procurementRfqBusinessPartnerService',
								'BusinessPartnerField': 'BusinesspartnerFk',
								'SubsidiaryField': 'SubsidiaryFk',
								'SupplierField': 'SupplierFk',
								'ContactField': 'ContactFk'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								// 'directive': 'business-partner-main-business-partner-dialog',
								'directive': 'filter-business-partner-dialog-lookup',
								lookupOptions: {
									showClearButton: false,
									showAddButton: platformPermissionService.hasCreate('75dcd826c28746bf9b8bbbf80a1168e8') && platformPermissionService.hasExecute('a87a85389a804c92bdc67cd325ab0974'),
									filterKey: 'procurement-rfq-businesspartner-businesspartner-filter',
									requisitionService: 'procurementRfqRequisitionService',
									'approvalBPRequired': true,
									'IsShowBranch': true,
									'mainService': 'procurementRfqBusinessPartnerService',
									'BusinessPartnerField': 'BusinesspartnerFk',
									'SubsidiaryField': 'SubsidiaryFk',
									'SupplierField': 'SupplierFk',
									'ContactField': 'ContactFk'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							width: 150
						}
					},
					'subsidiaryfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'business-partner-main-subsidiary-lookup',
								descriptionMember: 'Address',
								lookupOptions: {
									displayMember: 'SubsidiaryDescription',
									filterKey: 'procurement-rfq-businesspartner-subsidiary-filter',
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									displayMember: 'SubsidiaryDescription',
									filterKey: 'procurement-rfq-businesspartner-subsidiary-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'SubsidiaryDescription'
							},
							width: 150
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
									filterKey: 'procurement-rfq-businesspartner-supplier-filter',
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-supplier-dialog',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-supplier-filter',
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
					},
					'contactfk': {
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'FamilyName',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						'grid': {
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
						}
					},
					'prccommunicationchannelfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-prc-communication-channel-combobox',
							'options': {
								showClearButton: false
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-prc-communication-channel-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcCommunicationChannel',
								displayMember: 'Description'
							},
							width: 180
						}
					},
					'rfqbusinesspartnerstatusfk': {
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
					// the domain is 'dateutc' in server end, and you can not specify the formatter or type here.
					// If you like to do that, you must use 'dateutc' rather then 'date' as the value of 'type' and 'formatter.'
					// For example: detail: { 'type': 'dateutc', 'formatter': 'dateutc'}, grid: { 'editor': 'dateutc', 'formatter': 'dateutc'}.
					// otherwise, it will cause an issue that it is not the correct date.
					'rfqrejectionreasonfk': {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-rfq-rejection-reason-combobox',
							'options': {
								showClearButton: true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-rfq-rejection-reason-combobox',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RfqRejectionReason',
								displayMember: 'Description'
							},
							width: 180
						}
					}
				},
				'addition': {
					'grid': [
						{
							id: 'partialReq',
							field: 'partialReqFk',
							name: 'Partial Req. Assigned',
							name$tr$: 'procurement.rfq.partialReqAssigned',
							editor: 'lookup',
							editorOptions: {
								'directive': 'procurement-rfq-complex-lookup',
								lookupOptions: {}
							},
							formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
								$injector.get('procurementRfqPartialreqAssignedDataDirectiveDataService').getSelectedCodeAsync(dataContext)
									.then(function (selectedCode) {
										const node = $('#' + uniqueId);
										if (!node.hasClass('editable')) {
											node.html(selectedCode);
										}
									});
								return '';
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'BusinessPartnerStatus',
							field: 'BusinessPartnerFk',
							name: 'BusinessPartnerStatus',
							name$tr$: 'procurement.rfq.businessPartnerStatus',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'StatusDescriptionTranslateInfo.Translated',
								imageSelector: 'platformStatusIconService'
							},
							width: 150,
							grouping: {
								title$tr$: 'procurement.rfq.businessPartnerStatus',
								getter: 'BusinessPartnerFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'BusinessPartnerStatus2',
							field: 'BusinessPartnerFk',
							name: 'BusinessPartnerStatus2',
							name$tr$: 'businesspartner.main.entityStatus2',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'Status2DescriptionTranslateInfo.Translated',
								imageSelector: 'businesspartnerMainStatusSalesIconService'
							},
							width: 150,
							grouping: {
								title$tr$: 'businesspartner.main.entityStatus2',
								getter: 'BusinessPartnerFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'BpEmail',
							field: 'BusinessPartnerFk',
							name: 'Email',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerBpEmail',
							formatter: communicationFormatter,
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'Email',
								domainType: 'lookup',
								communicationType: 'email'
							},
							width: 150,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerBpEmail',
								getter: 'BusinessPartnerFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'Userdefined1',
							field: 'BusinessPartnerFk',
							name: 'Userdefined1',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '1'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'Userdefined1'
							},
							width: 150,
							grouping: {
								title$tr$: 'Userdefined1',
								getter: 'BusinessPartnerFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'Userdefined2',
							field: 'BusinessPartnerFk',
							name: 'Userdefined2',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '2'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'Userdefined2'
							},
							width: 150,
							grouping: {
								title$tr$: 'Userdefined2',
								getter: 'BusinessPartnerFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'Userdefined3',
							field: 'BusinessPartnerFk',
							name: 'Userdefined3',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '3'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'Userdefined3'
							},
							width: 150,
							grouping: {
								title$tr$: 'Userdefined3',
								getter: 'BusinessPartnerFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'Userdefined4',
							field: 'BusinessPartnerFk',
							name: 'Userdefined4',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '4'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'Userdefined4'
							},
							width: 150,
							grouping: {
								title$tr$: 'Userdefined4',
								getter: 'BusinessPartnerFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'Userdefined5',
							field: 'BusinessPartnerFk',
							name: 'Userdefined5',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '5'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'Userdefined5'
							},
							width: 150,
							grouping: {
								title$tr$: 'Userdefined5',
								getter: 'BusinessPartnerFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'BpSubsidiaryDescription',
							field: 'SubsidiaryFk',
							name: 'Subsidiary Address',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryAddress',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'Address'
							},
							width: 230,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryAddress',
								getter: 'SubsidiaryFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'BpSubsidiaryEmail',
							field: 'SubsidiaryFk',
							name: 'Branch E-mail',
							name$tr$: 'procurement.rfq.wizard.businessPartner.BranchEmail',
							formatter: communicationFormatter,
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'Email',
								domainType: 'lookup',
								communicationType: 'email'
							},
							width: 230,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.wizard.businessPartner.BranchEmail',
								getter: 'SubsidiaryFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'BpSubsidiaryTel',
							field: 'SubsidiaryFk',
							name: 'Telephone Number',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryTel',
							formatter: communicationFormatter,
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'TelephoneNumber1',
								domainType: 'lookup',
								communicationType: 'phone'
							},
							width: 200,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryTel',
								getter: 'SubsidiaryFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'BpSubsidiaryFax',
							field: 'SubsidiaryFk',
							name: 'Fax Number',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryFax',
							formatter: communicationFormatter,
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'Telefax',
								domainType: 'lookup',
								communicationType: 'phone'
							},
							width: 200,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryFax',
								getter: 'SubsidiaryFk',
								aggregators: [],
								aggregateCollapsed: true
							}
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
							id: 'ContactFirstName',
							field: 'ContactFk',
							//field: 'ContactFirstNameFk',
							name: 'Contact First Name',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactFirstName',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'FirstName',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'FirstName'
							},
							width: 120,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactFirstName',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'ContactTitle',
							field: 'ContactFk',
							name: 'Contact Title',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactTitle',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'Title',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'Title'
							},
							width: 120,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactTitle',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'ContactTel1',
							field: 'ContactFk',
							name: 'Contact Telephone 1',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactTel1',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'Telephone1',
									showClearButton: true
								}
							},
							formatter: communicationFormatter,
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'Telephone1',
								domainType: 'lookup',
								communicationType: 'phone'
							},
							width: 130,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactTel1',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'ContactTel2',
							field: 'ContactFk',
							name: 'Contact Telephone 2',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactTel2',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'Telephone2',
									showClearButton: true
								}
							},
							formatter: communicationFormatter,
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'Telephone2',
								domainType: 'lookup',
								communicationType: 'phone'
							},
							width: 130,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactTel2',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'ContactFax',
							field: 'ContactFk',
							name: 'Contact Fax Number',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactFax',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'Telefax',
									showClearButton: true
								}
							},
							formatter: communicationFormatter,
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'Telefax',
								domainType: 'lookup',
								communicationType: 'phone'
							},
							width: 130,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactFax',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'ContactMobile',
							field: 'ContactFk',
							name: 'Contact Mobile',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactMobile',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'Mobile',
									showClearButton: true
								}
							},
							formatter: communicationFormatter,
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'Mobile',
								domainType: 'lookup',
								communicationType: 'phone'
							},
							width: 130,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactMobile',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'ContactInternet',
							field: 'ContactFk',
							name: 'Contact Internet',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactInternet',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'Internet',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'Internet'
							},
							width: 130,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactInternet',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'ContactEmail',
							field: 'ContactFk',
							name: 'Contact Email',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactEmail',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'Email',
									showClearButton: true
								}
							},
							formatter: communicationFormatter,
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'Email',
								domainType: 'lookup',
								communicationType: 'email'
							},
							width: 130,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactEmail',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'ContactSubsidiaryDescription',
							field: 'ContactFk',
							name: 'Contact Subsidiary Description',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryDescription',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'Description',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'Description'
							},
							width: 180,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryDescription',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'ContactSubsidiaryAddress',
							field: 'ContactFk',
							name: 'Contact Address',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryAddress',
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-contact-dialog-without-teams',
								lookupOptions: {
									filterKey: 'procurement-rfq-businesspartner-contact-filter',
									displayMember: 'AddressLine',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'AddressLine'
							},
							width: 150,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryAddress',
								getter: 'ContactFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'contactHasPortalUser',
							field: 'ContactHasPortalUser',
							name: 'Contact has Portal-User',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerContactHasPortalUser',
							formatter: 'boolean',
							width: 130,
							grouping: {
								title$tr$: 'procurement.rfq.rfqBusinessPartnerContactHasPortalUser',
								getter: 'contactHasPortalUser',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'Remark',
							field: 'ContactFk',
							name: 'Contact Remarks',
							name$tr$: 'procurement.rfq.bidder.contactRemarks',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'Remark'
							},
							width: 150
						},
					],
					'detail': [
						{
							lookupDisplayColumn: true,
							'rid': 'bpEmail',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'Email',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerBpEmail',
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'Email',
								readOnly: true
							}
						},
						{
							'rid': 'BusinessPartnerStatus',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'BusinessPartnerStatus',
							'label$tr$': 'procurement.rfq.businessPartnerStatus',
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'StatusDescriptionTranslateInfo.Translated',
								readOnly: true,
								imageSelector: 'platformStatusIconService'
							}
						},
						{
							'rid': 'BusinessPartnerStatus2',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'BusinessPartnerStatus2',
							'label$tr$': 'businesspartner.main.entityStatus2',
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'Status2DescriptionTranslateInfo.Translated',
								imageSelector: 'businesspartnerMainStatusSalesIconService',
								readOnly: true
							}
						},
						{
							'rid': 'Userdefined1',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'Userdefined1',
							'label$tr$': 'cloud.common.entityUserDefined',
							'label$tr$param$': {'p_0': '1'},
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'Userdefined1',
								readOnly: true
							}
						},
						{
							'rid': 'Userdefined2',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'Userdefined2',
							'label$tr$': 'cloud.common.entityUserDefined',
							'label$tr$param$': {'p_0': '2'},
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'Userdefined2',
								readOnly: true
							}
						},
						{
							'rid': 'Userdefined3',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'Userdefined3',
							'label$tr$': 'cloud.common.entityUserDefined',
							'label$tr$param$': {'p_0': '3'},
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'Userdefined3',
								readOnly: true
							}
						},
						{
							'rid': 'Userdefined4',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'Userdefined4',
							'label$tr$': 'cloud.common.entityUserDefined',
							'label$tr$param$': {'p_0': '4'},
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'Userdefined4',
								readOnly: true
							}
						},
						{
							'rid': 'Userdefined5',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'Userdefined5',
							'label$tr$': 'cloud.common.entityUserDefined',
							'label$tr$param$': {'p_0': '5'},
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'Userdefined5',
								readOnly: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'subsidiaryTel',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'Telephone Number',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryTel',
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'TelephoneNumber1',
								readOnly: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'subsidiaryFax',
							'gid': 'businesspartnerGroup',
							'model': 'BusinessPartnerFk',
							'label': 'Fax Number',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryFax',
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog-without-teams',
							'options': {
								displayMember: 'FaxNumber',
								readOnly: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactFirstName',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact First Name',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactFirstName',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog',
							'options': {
								displayMember: 'FirstName',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactTitle',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Title',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactTitle',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'Title',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactTel1',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Telephone 1',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactTel1',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'Telephone1',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactTel2',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Telephone 2',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactTel2',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'Telephone2',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactFax',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Fax Number',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactFax',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'Telefax',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactMobile',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Mobile',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactMobile',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'Mobile',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactInternet',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Internet',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactInternet',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'Internet',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactEmail',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Email',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactEmail',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'Email',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactSubsidiaryDescription',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Subsidiary Description',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryDescription',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'Description',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactSubsidiaryAddress',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Address',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryAddress',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog-without-teams',
							'options': {
								displayMember: 'AddressLine',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							'rid': 'contactHasPortalUser',
							'gid': 'contactGroup',
							'model': 'ContactHasPortalUser',
							'label': 'Contact has Portal-User',
							'label$tr$': 'procurement.rfq.rfqBusinessPartnerContactHasPortalUser',
							'type': 'boolean',
							'readonly': true
						},
						{
							'rid': 'partialReq',
							'gid': 'baseGroup',
							'model': 'partialReqFk',
							'label': 'Partial Req. Assigned',
							'label$tr$': 'procurement.rfq.partialReqAssigned',
							'type': 'directive',
							'directive': 'procurement-rfq-complex-lookup',
							'options': {}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'contactRemark',
							'gid': 'contactGroup',
							'model': 'ContactFk',
							'label': 'Contact Remarks',
							'label$tr$': 'procurement.rfq.bidder.contactRemarks',
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog',
							'options': {
								displayMember: 'Remark',
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								showClearButton: true
							}
						},
						{
							lookupDisplayColumn: true,
							'rid': 'bpSubsidiaryEmail',
							'gid': 'businesspartnerGroup',
							'model': 'SubsidiaryFk',
							'label': 'Branch E-mail',
							'label$tr$': 'procurement.rfq.wizard.businessPartner.BranchEmail',
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								displayMember: 'Email',
								readOnly: true
							}
						}
					]
				}
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name procurementRfqBusinessPartnerUIStandardService
	 * @function
	 * @requires platformUIStandardConfigService
	 *
	 * @description
	 * # ui standard service for entity RfqBusinessPartner.
	 */
	angular.module(moduleName).factory('procurementRfqBusinessPartnerUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'procurementRfqTranslationService', 'procurementRfqBusinessPartnerDetailLayout', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, platformSchemaService, translationService, layout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'RfqBusinessPartnerDto',
					moduleSubModule: 'Procurement.RfQ'
				});
				domainSchema = domainSchema.properties;

				function RfqUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				RfqUIStandardService.prototype = Object.create(BaseService.prototype);
				RfqUIStandardService.prototype.constructor = RfqUIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);

	/**
	 * @ngdoc service
	 * @name procurementRfqBusinessPartnerWizardUIStandardService
	 * @function
	 * @requires platformUIStandardConfigService
	 *
	 * @description
	 * # ui standard service for entity RfqBusinessPartner in wizard.
	 */
	angular.module(moduleName).factory('procurementRfqBusinessPartnerWizardUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'procurementRfqTranslationService', 'procurementRfqBusinessPartnerDetailLayout', 'platformUIStandardExtentService', 'basicsLookupdataLookupFilterService', '$injector',
			function (platformUIStandardConfigService, platformSchemaService, translationService, layout, platformUIStandardExtentService, basicsLookupdataLookupFilterService, $injector) {

				layout = angular.copy(layout);
				layout.overloads.contactfk.grid.editorOptions.lookupOptions.filterKey = 'procurement-rfq-businesspartner-contact-filter-rfq-wizard';

				layout.groups[0].attributes.push('biddercontactcc');
				layout.groups[0].attributes.push('companycc');
				layout.groups[0].attributes.push('branchcc');

				// needed for generic wizard bidder columns to work
				let columnsForOverride = [
					{
						idList: ['BusinessPartnerStatus', 'BusinessPartnerStatus2', 'BpEmail', 'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
						field: 'BusinessPartnerFk'
					},
					{
						idList: ['BpSubsidiaryEmail', 'BpSubsidiaryTel', 'BpSubsidiaryFax',],
						field: 'SubsidiaryFk'
					},
					{
						idList: ['SupplierDescription'],
						field: 'SupplierFk'
					},
					{
						idList: ['ContactFirstName', 'ContactTitle', 'ContactTel1', 'ContactTel2', 'ContactFax', 'ContactMobile', 'ContactInternet', 'ContactEmail',
							'ContactSubsidiaryDescription', 'ContactSubsidiaryAddress', 'Remark'],
						field: 'ContactFk'
					}
				];

				_.forEach(layout.addition.grid, function (gridCol) {
					_.forEach(columnsForOverride, function (col) {
						if (_.includes(col.idList, gridCol.id)) {
							gridCol.field = col.field;
							return false;
						}
					});
				});

				var BaseService = platformUIStandardConfigService;

				var filters = [{
					key: 'procurement-rfq-businesspartner-contact-filter-rfq-wizard',
					serverSide: true,
					serverKey: 'procurement-rfq-businesspartner-contact-filter',
					fn: function () {
						let genWizardService = $injector.get('genericWizardService');
						var currentItem = genWizardService.getDataServiceByName('procurementRfqBusinessPartnerService').getSelected();
						currentItem ??= genWizardService.getDataServiceByName('businesspartnerMainHeaderDataService').getSelected();
						return {
							BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null
						};
					}
				}];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'RfqBusinessPartnerDto',
					moduleSubModule: 'Procurement.RfQ'
				});
				domainSchema = domainSchema.properties;
				domainSchema.CompanyCC = {domain: 'boolean', mandatory: false};
				domainSchema.BidderContactCC = {domain: 'boolean', mandatory: false};
				domainSchema.BranchCC = {domain: 'boolean', mandatory: false};

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema, true);

				return service;
			}
		]);

})();
