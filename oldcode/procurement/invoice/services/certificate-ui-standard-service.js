(function () {
	'use strict';
	var modName = 'procurement.invoice',
		prcCommonModule = 'procurement.common',
		bpModuleName = 'businesspartner.main',
		cloudCommonModule = 'cloud.common';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(modName).value('procurementInvoiceCertificateLayout', {
		'fid': 'procurement.invoice.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['code', 'description', 'bpname1', 'bpdcertificatetypefk', 'isrequired',
					'ismandatory', 'isrequiredsubsub', 'ismandatorysubsub', 'requiredby', 'requiredamount', 'commenttext']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [bpModuleName, prcCommonModule],
			'extraWords': {
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'entityCode'},
				BpdCertificateTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'entityType'},
				BPName1: {location: bpModuleName, identifier: 'name1', initial: 'Name'},
				IsRequired: {
					location: prcCommonModule,
					identifier: 'certificateIsRequired',
					initial: 'certificateIsRequired'
				},
				IsMandatory: {
					location: prcCommonModule,
					identifier: 'certificateIsMandatory',
					initial: 'certificateIsMandatory'
				},
				IsRequiredSubSub: {
					location: prcCommonModule,
					identifier: 'certificateIsRequiredSubSub',
					initial: 'certificateIsRequiredSubSub'
				},
				IsMandatorySubSub: {
					location: prcCommonModule,
					identifier: 'certificateIsMandatorySubSub',
					initial: 'certificateIsMandatorySubSub'
				},
				RequiredBy: {
					location: prcCommonModule,
					identifier: 'certificateRequiredBy',
					initial: 'certificateRequiredBy'
				},
				RequiredAmount: {
					location: prcCommonModule,
					identifier: 'certificateRequiredAmount',
					initial: 'certificateRequiredAmount'
				},
				CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'entityComment'}
			}
		},
		'overloads': {
			'bpdcertificatetypefk': {
				'detail': {
					'type': 'directive',
					'directive': 'businesspartner-certificate-certificate-type-combobox',
					'options': {
						descriptionMember: 'Description',
						lookupOptions: {
							filterKey: 'prc-certificate-type-filter'
						}
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'businesspartner-certificate-certificate-type-combobox',
						lookupOptions: {filterKey: 'prc-certificate-type-filter'}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CertificateType',
						displayMember: 'Description'
					},
					width: 80
				}
			},
			'code': {
				navigator: {
					moduleName: 'businesspartner.certificate',
					registerService: 'businesspartnerCertificateCertificateDataService'
				}
			},
			'description': {
				detail: {
					label: 'Reference',
					label$tr$: 'procurement.invoice.entityReference'
				},
				grid: {
					name: 'Reference',
					name$tr$: 'procurement.invoice.entityReference'
				}
			},
			'bpname1':{
				navigator: {
					moduleName: 'businesspartner.main'
				}
			},
			'isrequired': {
				'mandatory': true
			},
			'ismandatory': {
				'mandatory': true
			},
			'isrequiredsubsub': {
				'mandatory': true
			},
			'ismandatorysubsub': {
				'mandatory': true
			},
			'requiredby': {
				'mandatory': true
			},
			'requiredamount': {
				'mandatory': true
			},
			'commenttext': {
				'mandatory': true
			}
		}
	});

	angular.module(modName).factory('procurementInvoiceCertificateUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceCertificateLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;
				var service;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvCertificateDto',
					moduleSubModule: 'Procurement.Invoice'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				service = new BaseService(layout, domainSchema, translationService);

				return service;
			}
		]);
})();
