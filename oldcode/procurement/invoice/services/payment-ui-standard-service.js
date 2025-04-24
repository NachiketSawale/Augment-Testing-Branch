/**
 * Created by ltn on 11/18/2016.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var modName = 'procurement.invoice',
		cloudCommonModule = 'cloud.common',
		mod = angular.module(modName);

	mod.value('procurementInvoicePaymentLayout', {
		'fid': 'procurement.invoice.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['paymentdate','postingdate','amount','discountamount','isretention',
					'bankvoucherno','bankaccount','postingnarritive','commenttext',
					'amount_net', 'discountamountnet', // transient fields
					'amountvat','discountamountvat','taxcodefk','coderetention', 'isoverpayment', 'bankentryno']
			},
			{'gid': 'entityHistory', 'isHistory': true}
		],
		'translationInfos': {
			'extraModules': [cloudCommonModule],
			'extraWords': {
				PaymentDate: { location: modName, identifier: 'paymentDate', initial: 'paymentDate' },
				PostingDate: { location: modName, identifier: 'header.datePosted', initial: 'PostingDate' },
				Amount: { location: cloudCommonModule, identifier: 'entityAmount', initial: 'entityAmount' },
				DiscountAmount: {location: modName, identifier: 'header.discountAmount', initial: 'DiscountAmount'},
				IsRetention: {location: modName, identifier: 'isRetention', initial: 'IsRetention'},
				BankVoucherNo: {location: modName, identifier: 'bankVoucherNo', initial: 'BankVoucherNo'},
				BankAccount: {location: modName, identifier: 'bankAccount', initial: 'BankAccount'},
				PostingNarritive:{location: modName, identifier: 'postingNarritive', initial: 'PostingNarritive'},
				CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'entityComment'},
				AmountVat: { location: modName, identifier: 'entityAmountVat', initial: 'VAT Amount' },
				Amount_Net: { location: modName, identifier: 'entityAmountNet', initial: 'Net Amount' },// jshint ignore : line
				DiscountAmountVat: { location: modName, identifier: 'entityDiscountAmountVat', initial: 'VAT Discount Amount' },
				DiscountAmountNet: { location: modName, identifier: 'entityDiscountAmountNet', initial: 'Net Discount Amount' },
				CodeRetention: { location: modName, identifier: 'entityCodeRetention', initial: 'Code Retention' },
				TaxCodeFk: {location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'Tax Code'},
				IsOverPayment: {location: modName, identifier: 'entityIsOverPayment', initial: 'Is Over Payment'},
				BankEntryNo: {location: modName, identifier: 'bankEntryNo', initial: 'Bank entry No.'}
			}
		},
		'overloads': {
			'paymentDate': {
				'mandatory': true
			},
			'postingDate': {
				'mandatory': true
			},
			'amount': {
				'mandatory': true
			},
			'discountAmount': {
				'mandatory': true
			},
			'isRetention': {
				'mandatory': true
			},
			'bankVoucherNo': {
				'optional':true
			},
			'bankAccount': {
				'optional':true
			},
			'postingNarritive': {
				'optional':true
			},
			'commentText': {
				'optional':true
			},
			'coderetention': {
				maxLength: 4
			},
			'taxcodefk': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						lookupDirective: 'basics-master-data-context-tax-code-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {showClearButton: true}
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {showClearButton: true},
						directive: 'basics-master-data-context-tax-code-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'TaxCode',
						displayMember: 'Code'
					},
					width: 100
				}
			},
			'amount_net': {
				mandatory: true
			},
			'discountamountnet': {
				mandatory: true
			},
			'amountvat': {
				readonly: true
			},
			'discountamountvat': {
				readonly: true
			},
			'bankentryno': {
				readonly: true
			}

		}
	});

	mod.factory('procurementInvoicePaymentUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoicePaymentLayout', 'platformSchemaService','platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService,
				layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvPaymentDto',
					moduleSubModule: 'Procurement.Invoice'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				// extend scheme for additional attributes
				domainSchema.Amount_Net = {domain: 'money'};// jshint ignore : line
				domainSchema.DiscountAmountNet = {domain: 'money'};

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service,layout.addition, domainSchema);

				return service;
			}
		]);
})();