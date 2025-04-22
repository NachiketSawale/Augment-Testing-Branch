/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingPaymentConfigurationService',
		['platformUIStandardConfigService', 'basicsLookupdataConfigGenerator', 'salesCommonLookupConfigsService', 'salesBillingPaymentTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, basicsLookupdataConfigGenerator, salesCommonLookupConfigsService, salesBillingPaymentTranslationService, platformSchemaService) {

				var billingPaymentDetailLayout = {
					'fid': 'sales.billing.payment.detailform',
					'version': '0.0.1',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': [
								'paymentdate', 'postingdate',
								'currencyfk', 'exchangerate',
								'amount', 'amountvat', 'discountamount', 'discountamountvat', 'amountoc', 'amountvatoc', 'discountamountoc', 'discountamountvatoc',
								'amountnet', 'discountamountnet', 'amountnetoc', 'discountamountnetoc', // transient fields
								'taxcodefk',
								'isretention', 'coderetention',
								'bankvoucherno', 'bankaccount', 'postingnarritive', 'commenttext', 'isoverpayment', 'bankentryno', 'paymentstatusfk'
							]
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],

					'overloads': {
						'coderetention': {
							maxLength: 4
						},
						paymentstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('sales.billing.payment.status', null, {
							showIcon: true
						}),
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
						'amountvat': {
							readonly: true
						},
						'discountamountvat': {
							readonly: true
						},
						'amountvatoc': {
							readonly: true
						},
						'discountamountvatoc': {
							readonly: true
						},
						'currencyfk': {
							grid: {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'sales-Common-Basics-Currency-Combobox',
									'displayMember': 'Currency',
									'lookupOptions': {
										'filterKey': 'bas-currency-conversion-filter-in-billing'
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'BasCurrency',
									'displayMember': 'Currency'
								},
								'width': 100
							},
							detail: {
								'type': 'directive',
								'directive': 'sales-Common-Basics-Currency-Combobox',
								'options': {
									'lookupType': 'BasCurrency',
									'filterKey': 'bas-currency-conversion-filter-in-billing'
								}
							}
						},
						'bankentryno': {
							readonly: true
						}
					}
				};

				salesCommonLookupConfigsService.addCommonLookupsToLayout(billingPaymentDetailLayout);

				var BaseService = platformUIStandardConfigService;

				var salesBillingPaymentDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PaymentDto',
					moduleSubModule: 'Sales.Billing'
				});

				if (salesBillingPaymentDomainSchema) {
					salesBillingPaymentDomainSchema = salesBillingPaymentDomainSchema.properties;
				}

				function SalesBillingUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				SalesBillingUIStandardService.prototype = Object.create(BaseService.prototype);
				SalesBillingUIStandardService.prototype.constructor = SalesBillingUIStandardService;
				var service = new BaseService(billingPaymentDetailLayout, salesBillingPaymentDomainSchema, salesBillingPaymentTranslationService);

				return service;
			}
		]);
})();
