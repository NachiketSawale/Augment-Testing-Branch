/**
 * Created by wui on 5/11/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('businesspartnerCertificateCertificateLayoutCommon', ['platformModalService', 'platformModuleNavigationService', '$translate', 'businesspartnerCertificateTranslations', function (platformModalService, platformModuleNavigationService, $translate, businesspartnerCertificateTranslations) {
		return {
			'fid': 'businesspartner.certificate.master.data',
			'version': '1.1.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['companyfk', 'certificatestatusfk', 'certificatetypefk',
						'code', 'certificatedate', 'issuer', 'businesspartnerissuerfk', 'validfrom', 'validto', 'reference',
						'referencedate', 'projectfk', 'amount', 'currencyfk', 'expirationdate', 'requireddate', 'dischargeddate',
						'validateddate', 'commenttext',  'guaranteecost', 'guaranteecostpercent', 'reclaimdate1', 'reclaimdate2', 'reclaimdate3',
						'islimited', 'costreimbursable', 'costreimburseddate', 'ordheaderfk'/* , 'subsidiaryfk' */
					]
				},
				{
					'gid': 'userDefText',
					'isUserDefText': true,
					'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': businesspartnerCertificateTranslations.translationInfos,
			'overloads': {
				'guaranteecostpercent': {
					regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?\\d{0,8})([.,]\\d{0,2})?)$'
				},
				'businesspartnerfk': {
					'navigator': {
						moduleName: 'businesspartner.main',
						registerService: 'businesspartnerMainHeaderDataService',
						navFunc: function (options, entity) {
							if (entity && entity.BusinessPartnerFk > 0) {
								platformModuleNavigationService.navigate(options.navigator, entity, options.field);
							} else {
								platformModalService.showMsgBox($translate.instant('businesspartner.certificate.businessPartnerRequire'), 'Warning', 'warning');
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-business-partner-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						}
					},
					'detail': {
						'type': 'directive',
						directive: 'business-partner-main-business-partner-dialog'
					},
					'change': 'formOptions.onPropertyChanged'
				},
				'conheaderfk': {

					'navigator': {
						moduleName: 'procurement.contract',
						registerService: 'procurementContractHeaderDataService'
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'prc-con-header-dialog',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'businesspartner-certificate-certificate-contract-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'conheader',
							displayMember: 'Code'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'prc-con-header-dialog',
							'descriptionMember': 'Description',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'businesspartner-certificate-certificate-contract-filter'
							}
						},
						'change': 'formOptions.onPropertyChanged'
					}
				},
				'companyfk': {
					'navigator': {
						moduleName: 'basics.company-certificate',
						registerService: 'basicsCompanyMainService'
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-company-company-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						},
						width: 120
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-company-company-lookup',
						'change': 'formOptions.onPropertyChanged'
					},
					'readonly': true
				},
				'certificatestatusfk': {
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'businesspartner-certificate-status-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CertificateStatus',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService'
						},
						width: 120
					},
					'detail': {
						'type': 'directive',
						'directive': 'businesspartner-certificate-status-combobox',
						'change': 'formOptions.onPropertyChanged'
					},
					'readonly': true
				},
				'certificatetypefk': {
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'businesspartner-certificate-certificate-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CertificateType',
							displayMember: 'Description'
						},
						width: 80
					},
					'detail': {
						'type': 'directive',
						'directive': 'businesspartner-certificate-certificate-type-combobox',
						'options': {
							descriptionMember: 'Description'
						}
					}
				},
				'businesspartnerissuerfk': {
					navigator: {
						moduleName: 'businesspartner.main',
						registerService: 'businesspartnerMainHeaderDataService'
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-business-partner-dialog',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-main-business-partner-dialog',
						'options': {
							showClearButton: true
						}
					},
					'change': 'formOptions.onPropertyChanged'
				},
				'projectfk': {

					navigator: {
						moduleName: 'project.main'
					},
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							directive: 'basics-lookup-data-project-project-dialog',
							displayMember: 'ProjectName',
							lookupOptions: {
								showClearButton: true
							}
						},
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'procurement-project-lookup-dialog',
							'descriptionMember': 'ProjectName',
							'lookupOptions': {
								'lookupType': 'PrcProject',
								'showClearButton': true
							}
						}
					}
				},
				'currencyfk': {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'basics-lookupdata-currency-combobox',
							lookupOptions: {
								showClearButton: true
							}
						},
						'formatter': 'lookup',
						'formatterOptions': {'lookupType': 'currency', 'displayMember': 'Currency'}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-currency-combobox',
						'options': {
							showClearButton: true
						}
					}
				},
				'ordheaderfk': {
					'navigator': {
						moduleName: 'sales.contract'
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'sales-common-contract-dialog',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SalesContract',
							displayMember: 'Code'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'sales-common-contract-dialog',
							'descriptionMember': 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								lookupType: 'SalesContract'
							}
						},
						'change': 'formOptions.onPropertyChanged'
					}
				},
				'code': {
					'navigator': {
						moduleName: 'businesspartner.certificate',
						registerService: 'businesspartnerCertificateCertificateDataService'
					}
				}
			},
			'addition': {
				'grid': extendGrouping([
					{
						'afterId': 'conheaderfk',
						'id': 'ConHeaderDescription',
						'field': 'ConHeaderFk',
						'name': 'Contract Description',
						'name$tr$': 'businesspartner.certificate.contractDescription',
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'conheader',
							displayMember: 'Description'
						},
						'width': 140
					},
					{
						id: 'projectName',
						afterId: 'projectfk',
						lookupDisplayColumn: true,
						field: 'ProjectFk',
						displayMember: 'ProjectName',
						name$tr$: 'cloud.common.entityProjectName',
						width: 120
					},
					{
						'afterId': 'ordheaderfk',
						'id': 'OrdHeaderDescription',
						'field': 'OrdHeaderFk',
						'name': 'Sales Contract Description',
						'name$tr$': 'businesspartner.certificate.orderHeaderDescription',
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'SalesContract',
							displayMember: 'DescriptionInfo.Translated'
						},
						'width': 140
					}
				])
			}
		};
	}]);

	// certificate reminder
	angular.module(moduleName).value('businesspartnerCertificateReminderLayout', {
		'fid': 'businesspartner.certificate.reminder.detail',
		'version': '1.1.0',
		'showGrouping': true,
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['batchid', 'batchdate', 'description', 'certificatestatusfk', 'commenttext', 'telefax', 'email']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [moduleName],
			'extraWords': {
				BatchId: {location: moduleName, identifier: 'reminder.label.batch', initial: 'Batch Id'},
				BatchDate: {location: moduleName, identifier: 'reminder.label.batchDate', initial: 'Batch Date'},
				CertificateStatusFk: {location: moduleName, identifier: 'status', initial: 'Status'},
				Email: {location: moduleName, identifier: 'reminder.label.useEmail', initial: 'Email'},
				Telefax: {location: moduleName, identifier: 'reminder.label.useTelefax', initial: 'Telefax'},
				CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'}
			}
		},
		'overloads': {
			'certificatestatusfk': {
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'businesspartner-certificate-status-combobox'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CertificateStatus',
						displayMember: 'Description',
						imageSelector: 'platformStatusIconService'
					},
					width: 120
				},
				'detail': {
					'type': 'directive',
					'directive': 'businesspartner-certificate-status-combobox'
				}
			}
		},
		'addition': {
			'grid': extendGrouping([])
		}
	});

	// Main Certificate
	angular.module(moduleName).factory('businesspartnerCertificateCertificateLayout', ['businesspartnerCertificateCertificateLayoutCommon',
		function (certificateLayoutCommon) {
			var copy = angular.copy(certificateLayoutCommon);
			copy.groups[0].attributes.splice(0, 0, 'businesspartnerfk', 'conheaderfk');
			return copy;
		}
	]);

	// Certificate to Business Partner
	angular.module(moduleName).factory('businesspartnerCertificateToBpLayout', ['businesspartnerCertificateCertificateLayoutCommon',
		function (certificateLayoutCommon) {
			var copy = angular.copy(certificateLayoutCommon);
			copy.groups[0].attributes.splice(0, 0, 'conheaderfk');
			return copy;
		}
	]);

	// Certificate to Project
	angular.module(moduleName).factory('businesspartnerCertificateToProjectLayout', ['businesspartnerCertificateCertificateLayoutCommon',
		function (certificateLayoutCommon) {
			let copy = angular.copy(certificateLayoutCommon);
			copy.groups[0].attributes.splice(0, 0, 'businesspartnerfk', 'conheaderfk');
			copy.overloads.businesspartnerfk = {
				'navigator': {
					moduleName: 'businesspartner.main'
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						'directive': 'filter-business-partner-dialog-lookup',
						},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				},
				'detail': {
					'type': 'directive',
					'directive': 'filter-business-partner-dialog-lookup',
				},
				'change': 'formOptions.onPropertyChanged'
			};
			return copy;
		}
	]);

	// Certificate to Quote
	angular.module(moduleName).factory('businesspartnerCertificateToQuoteLayout', ['businesspartnerCertificateCertificateLayoutCommon',
		function (certificateLayoutCommon) {
			var copy = angular.copy(certificateLayoutCommon);
			// copy.groups[0].attributes.splice(0, 0, 'conheaderfk');
			copy.groups[0].attributes.splice(0, 0, 'businesspartnerfk');
			copy.addition = {
				'grid': extendGrouping([
					{
						id: 'projectName',
						afterId: 'projectfk',
						lookupDisplayColumn: true,
						field: 'ProjectFk',
						displayMember: 'ProjectName',
						name$tr$: 'cloud.common.entityProjectName',
						width: 120
					}
				])
			};

			copy.overloads.businesspartnerfk = {
				'navigator': {
					moduleName: 'businesspartner.main'
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						// 'directive': 'business-partner-main-business-partner-dialog',
						'directive': 'filter-business-partner-dialog-lookup',
						lookupOptions: {
							filterKey: 'businesspartner-certificate-quote-bp-filter'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				},
				'detail': {
					'type': 'directive',
					// 'directive': 'business-partner-main-business-partner-dialog',
					'directive': 'filter-business-partner-dialog-lookup',
					options: {
						filterKey: 'businesspartner-certificate-quote-bp-filter'
					}
				},
				'change': 'formOptions.onPropertyChanged'
			};
			return copy;
		}
	]);

	// Certificate to Contract
	angular.module(moduleName).factory('businesspartnerCertificateToContractLayout', ['businesspartnerCertificateCertificateLayoutCommon',
		function (certificateLayoutCommon) {
			var copy = angular.copy(certificateLayoutCommon);
			copy.groups[0].attributes.splice(0, 0, 'businesspartnerfk', 'conheaderfk');
			copy.overloads.businesspartnerfk = {
				'navigator': {
					moduleName: 'businesspartner.main'
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						// 'directive': 'business-partner-main-business-partner-dialog',
						'directive': 'filter-business-partner-dialog-lookup',
						lookupOptions: {
							filterKey: 'businesspartner-certificate-contract-bp-filter'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				},
				'detail': {
					'type': 'directive',
					// 'directive': 'business-partner-main-business-partner-dialog',
					'directive': 'filter-business-partner-dialog-lookup',
					options: {
						filterKey: 'businesspartner-certificate-contract-bp-filter'
					}
				},
				'change': 'formOptions.onPropertyChanged'
			};
			return copy;
		}
	]);

	// Certificate to Sales.
	angular.module(moduleName).factory('businesspartnerCertificateToSalesLayout', ['businesspartnerCertificateCertificateLayoutCommon',
		function (certificateLayoutCommon) {
			var copy = angular.copy(certificateLayoutCommon);
			copy.groups[0].attributes.splice(0, 0, 'businesspartnerfk', 'conheaderfk');
			copy.overloads.businesspartnerfk = {
				'navigator': {
					moduleName: 'businesspartner.main'
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						'directive': 'filter-business-partner-dialog-lookup',
						lookupOptions: {
							filterKey: 'businesspartner-certificate-sales-bp-filter'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				},
				'detail': {
					'type': 'directive',
					'directive': 'filter-business-partner-dialog-lookup',
					options: {
						filterKey: 'businesspartner-certificate-sales-bp-filter'
					}
				},
				'change': 'formOptions.onPropertyChanged'
			};
			copy.overloads.businesspartnerissuerfk = {
				navigator: {
					moduleName: 'businesspartner.main',
					registerService: 'businesspartnerMainHeaderDataService'
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-business-partner-dialog',
						lookupOptions: {
							showGuarantor: true,
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				},
				'detail': {
					'type': 'directive',
					'directive': 'business-partner-main-business-partner-dialog',
					'options': {
						showGuarantor: true,
						showClearButton: true
					}
				},
				'change': 'formOptions.onPropertyChanged'
			};
			return copy;
		}
	]);

	// Certificate to Invoice
	angular.module(moduleName).factory('businesspartnerCertificateToInvoiceLayout', ['businesspartnerCertificateCertificateLayoutCommon',
		function (certificateLayoutCommon) {
			var copy = angular.copy(certificateLayoutCommon);
			copy.groups[0].attributes.splice(0, 0, 'businesspartnerfk', 'conheaderfk');
			copy.overloads.businesspartnerfk = {
				'navigator': {
					moduleName: 'businesspartner.main'
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						// 'directive': 'business-partner-main-business-partner-dialog',
						'directive': 'filter-business-partner-dialog-lookup',
						lookupOptions: {
							filterKey: 'businesspartner-certificate-invoice-bp-filter'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				},
				'detail': {
					'type': 'directive',
					// 'directive': 'business-partner-main-business-partner-dialog',
					'directive': 'filter-business-partner-dialog-lookup',
					options: {
						filterKey: 'businesspartner-certificate-invoice-bp-filter'
					}
				},
				'change': 'formOptions.onPropertyChanged'
			};
			return copy;
		}
	]);

	angular.module(moduleName).value('businesspartnerCertificateReportReminderLetterDialoglayout', {
		'fid': 'businesspartner.certificate.report.reminder.letter',
		'version': '1.1.0',
		'showGrouping': false,
		'groups': [
			{
				'gid': 'basicData',
				'isOpen': true,
				'visible': true,
				'sortOrder': 1
			}
		],
		'rows': [
			{
				'rid': 'batchId',
				'gid': 'basicData',
				'label$tr$': 'businesspartner.certificate.report.label.batchId',
				'model': 'BatchId',
				'type': 'description'
			}
		]
	});

	angular.module(moduleName).value('businesspartnerCertificateEmailSettinglayout', {
		'fid': 'businesspartner.certificate.email.setting',
		'version': '1.1.0',
		'showGrouping': false,
		'groups': [
			{
				'gid': 'basicData',
				'isOpen': true,
				'visible': true,
				'sortOrder': 1
			}
		],
		'rows': [
			{
				'rid': 'batchId',
				'gid': 'basicData',
				'label$tr$': 'businesspartner.certificate.report.label.batchId',
				'model': 'BatchId',
				'type': 'description',
				'required': true
			},
			{
				'afterId': 'batchId',
				'rid': 'company',
				'gid': 'basicData',
				'label$tr$': 'cloud.common.entityCompany',
				'type': 'directive',
				'directive': 'basics-lookupdata-lookup-composite',
				'model': 'CompanyId',
				'options': {
					lookupDirective: 'basics-company-company-lookup',
					descriptionMember: 'CompanyName',
					lookupOptions: {}
				}
			}
		]
	});

	angular.module(moduleName).factory('businesspartnerCertificateEmailRecipientlayout', businesspartnerCertificateEmailRecipientlayout);

	function businesspartnerCertificateEmailRecipientlayout() {
		return {
			getStandardConfigForListView: function () {
				return {
					addValidationAutomatically: true,
					columns: [
						{
							id: 'isCheckToSend',
							field: 'IsCheckToSend',
							name$tr$: 'basics.common.wizardDialog.gridEntity.doesSend',
							editor: 'boolean',
							formatter: 'boolean',
							cssClass: 'cell-center',
							width: 100
						},
						{
							id: 'bpName1',
							field: 'BusinessPartnerName1',
							name$tr$: 'businesspartner.certificate.wizard.dialogEntity.bpName1',
							formatter: 'description',
							width: 180
						},
						{
							id: 'fax',
							field: 'Telefax',
							name$tr$: 'businesspartner.certificate.wizard.dialogEntity.fax',
							formatter: 'description',
							width: 180
						},
						{
							id: 'email',
							field: 'Email',
							name$tr$: 'businesspartner.certificate.wizard.dialogEntity.email',
							formatter: 'description',
							width: 180
						}
					]
				};
			}
		};
	}

	angular.module(moduleName).factory('businessPartnerCertificateEmailDialogFormConfig', businessPartnerCertificateEmailDialogFormConfig);

	function businessPartnerCertificateEmailDialogFormConfig() {
		return {
			fid: moduleName + '.wizard.email',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 1,
					header: 'Email Settings',
					header$tr$: moduleName + '.wizard.dialogTitle.emailSettings',
					isOpen: true,
					visible: true,
					sortOrder: 1
				},
				{
					gid: 2,
					header: 'Email Recipients',
					header$tr$: moduleName + '.wizard.dialogTitle.emailRecipients',
					isOpen: true,
					visible: true,
					sortOrder: 2
				},
				{
					gid: 3,
					header: 'Sender',
					header$tr$: 'basics.common.sender',
					isOpen: true,
					visible: true,
					sortOrder: 3
				}
			],
			rows: [
				{
					rid: 1,
					gid: 1,
					label: '',
					type: 'directive',
					directive: 'business-partner-certificate-email-setting'
				},
				{
					'rid': 2,
					'gid': 2,
					'label': '',
					'type': 'directive',
					'directive': 'business-partner-certificate-email-recipient'
				},
				{
					'rid': 3,
					'gid': 3,
					'label': '',
					'type': 'directive',
					'directive': 'basics-common-communicate-account-directive'
				}
			]
		};
	}

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});

		return gridColumns;
	}

})(angular);