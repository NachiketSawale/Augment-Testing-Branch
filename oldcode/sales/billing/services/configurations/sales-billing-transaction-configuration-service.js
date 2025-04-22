/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingTransactionConfigurationService', ['_', '$injector', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'salesCommonLookupConfigsService', 'salesBillingTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',
		function (_, $injector, platformUIStandardConfigService, platformUIStandardExtentService, salesCommonLookupConfigsService, salesBillingTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

			var billingTransactionDetailLayout = {
				'fid': 'sales.billing.Transaction.detailform',
				'version': '0.0.1',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [ // TODO: organize attributes in groups
					{
						'gid': 'basicData',
						'attributes': [
							'documenttype', 'documentno', 'linetype', 'currency', 'vouchernumber', 'voucherdate', 'postingnarritive', 'postingdate', 'netduedate',
							'discountduedate', 'discountamount', 'debtor', 'debtorgroup', 'businesspostinggroup', 'accountreceiveable', 'nominalaccount',
							'amount', 'quantity', 'isdebit', 'vatamount', 'vatcode', 'isprogress', 'ordernumber', 'amountauthorized', 'controllingunitcode',
							'controllingunitassign01', 'controllingunitassign01desc', 'controllingunitassign01comment',
							'controllingunitassign02', 'controllingunitassign02desc', 'controllingunitassign02comment',
							'controllingunitassign03', 'controllingunitassign03desc', 'controllingunitassign03comment',
							'controllingunitassign04', 'controllingunitassign04desc', 'controllingunitassign04comment',
							'controllingunitassign05', 'controllingunitassign05desc', 'controllingunitassign05comment',
							'controllingunitassign06', 'controllingunitassign06desc', 'controllingunitassign06comment',
							'controllingunitassign07', 'controllingunitassign07desc', 'controllingunitassign07comment',
							'controllingunitassign08', 'controllingunitassign08desc', 'controllingunitassign08comment',
							'controllingunitassign09', 'controllingunitassign09desc', 'controllingunitassign09comment',
							'controllingunitassign10', 'controllingunitassign10desc', 'controllingunitassign10comment',
							'issuccess', 'transactionid', 'handoverid', 'returnvalue', 'lineno',
							'assetno', 'postingtype', 'coderetention', 'paymenttermfk', 'nominaldimension', 'nominaldimension2', 'nominaldimension3',
							'controllinggrpsetfk', 'itemreference', 'extorderno', 'nominalaccountfi', 'iscanceled', 'taxcodefk', 'taxcodematrixcode', 'vatgroupfk', 'controllinguniticfk', 'bilitemdescription', 'linereference']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'paymenttermfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-lookupdata-payment-term-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-lookupdata-payment-term-lookup'
							},
							width: 150
						},
						readonly: true
					},
					'controllinggrpsetfk': {
						'readonly': true,
						'detail' : {
							visible : false
						},
						'grid': {
							field: 'image',
							formatter: 'image',
							formatterOptions: {
								imageSelector: 'controllingStructureGrpSetDTLActionProcessor'
							}
						}
					},
					'taxcodefk': {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'Code'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						readonly: true
					},
					'vatgroupfk': {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								displayMember: 'Description',
								lookupModuleQualifier: 'businesspartner.vatgroup',
								lookupType: 'businesspartner.vatgroup',
								lookupSimpleLookup: true,
								valueMember: 'Id'
							}
						},
						detail: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('businesspartner.vatgroup', null, null, false, {}),
						readonly: true
					},
					'controllinguniticfk': {
						readonly: true,
						'navigator': {
							moduleName: 'controlling.structure'
						},
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'ControllingUnit', 'displayMember': 'Code'},
							'width': 80
						},
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'controlling-structure-dialog-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'showClearButton': true
								}
							}
						}
					},
				}
			};

			// make all attributes readonly // TODO: extract to common service function
			var overloads = billingTransactionDetailLayout.overloads;
			_.each(_.flatten(_.map(billingTransactionDetailLayout.groups, 'attributes')), function (attribute) {
				if (angular.isUndefined(overloads[attribute])) {
					overloads[attribute] = angular.extend(overloads[attribute] || {}, {readonly: true});
				}
			});

			salesCommonLookupConfigsService.addCommonLookupsToLayout(billingTransactionDetailLayout);

			var BaseService = platformUIStandardConfigService;

			var salesBillingTransactionDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'TransactionDto',
				moduleSubModule: 'Sales.Billing'
			});

			if (salesBillingTransactionDomainSchema) {
				salesBillingTransactionDomainSchema = salesBillingTransactionDomainSchema.properties;
			}

			function SalesBillingUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			SalesBillingUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesBillingUIStandardService.prototype.constructor = SalesBillingUIStandardService;
			var service = new BaseService(billingTransactionDetailLayout, salesBillingTransactionDomainSchema, salesBillingTranslationService);

			return service;
		}
	]);
})();
