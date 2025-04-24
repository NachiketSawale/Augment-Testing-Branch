/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';
	var modName = 'basics.procurementconfiguration',
		cloudCommonModule = 'cloud.common';
	angular.module(modName)
		.factory('basicsProcurementConfigurationLayout',
			['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'basics.procurement.configuration.header',
					'version': '1.1.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['descriptioninfo', 'sorting', 'isdefault', 'prcawardmethodfk',
								'prccontracttypefk','prjcontracttypefk', 'bilinvoicetypefk', 'billingmethodfk', 'paymenttermfifk', 'paymenttermpafk', 'provingperiod', 'provingdealdline', 'approvalperiod', 'approvaldealdline','baselineintegration','ismaterial','isservice', 'islive','isnotaccrualprr']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
							IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'},
							PrcAwardMethodFk: {
								location: cloudCommonModule,
								identifier: 'entityAwardMethod',
								initial: 'Award Method'
							},
							PrcContractTypeFk: {
								location: modName,
								identifier: 'configuration.prccontracttypeFk',
								initial: 'Contract Type'
							},
							PrjContractTypeFk: {
								location: modName,
								identifier: 'configuration.prjcontracttypeFk',
						initial: 'Project Contract Type'
							},
							PaymentTermFiFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermFI',
								initial: 'Payment Term (FI)'
							},
							PaymentTermPaFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermPA',
								initial: 'Payment Term (PA)'
							},
							ProvingPeriod: {
								location: modName,
								identifier: 'entityProvingPeriod',
								initial: 'Proving Period'
							},
							ProvingDealdline: {
								location: modName,
								identifier: 'entityProvingDealdline',
								initial: 'Proving Deadline'
							},
							ApprovalPeriod: {
								location: modName,
								identifier: 'entityApprovalPeriod',
								initial: 'Approval Period'
							},
							ApprovalDealdline: {
								location: modName,
								identifier: 'entityApprovalDealdline',
								initial: 'Approval Deadline'
							},
							BaselineIntegration: {
								location: modName,
								identifier: 'entityBaselineIntegration',
								initial: 'Baseline Integration'
							},
							IsMaterial: {
								location: modName,
								identifier: 'entityIsMaterial',
								initial: 'Is Material'
							},
							IsService: {
								location: modName,
								identifier: 'entityIsService',
								initial: 'Is Service'
							},
							IsLive: {
								location: modName,
								identifier: 'entityIsLive',
								initial: 'Is Live'
							},
							IsNotAccrualPrr: {location: modName, identifier: 'IsNotAccrualPrr', initial: 'Is Not Accrual'},
							BilInvoiceTypeFk: {
								location: modName,
								identifier: 'entityBilInvoiceType',
								initial: 'Bill Invoice Type'
							},
							BillingMethodFk: {
								location: modName,
								identifier: 'entityBillingMethod',
								initial: 'Billing Method'
							},
						}
					},
					'overloads': {
						'descriptioninfo': {
							'mandatory': true
						},
						'sorting': {
							'mandatory': true
						},
						'prcawardmethodfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurement-configuration-award-method-combobox'
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-procurement-configuration-award-method-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcAwardMethod',
									displayMember: 'Description'
								}
							}
						},
						'prccontracttypefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurement-configuration-contract-type-combobox'
							},

							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-procurement-configuration-contract-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcContractType',
									displayMember: 'Description'
								}
							}
						},

						'prjcontracttypefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurement-configuration-prj-contract-type-combobox'
							},

							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-procurement-configuration-prj-contract-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'prjcontracttype',
									displayMember: 'Description'
								}
							}
						},
						'bilinvoicetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('billing.invoicetype', null, { customBoolProperty: 'ISLUMPSUM' }),
						'billingmethodfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salesbillingmethod'),
						'paymenttermfifk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-payment-term-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: false
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
									lookupOptions: {showClearButton: false},
									directive: 'basics-lookupdata-payment-term-lookup'
								},
								width: 150
							}
						},
						'paymenttermpafk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-payment-term-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: false
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
									lookupOptions: {showClearButton: false},
									directive: 'basics-lookupdata-payment-term-lookup'
								},
								width: 170
							}
						}
					},
					'addition': {
						'grid': [{
							'lookupDisplayColumn': true,
							'field': 'PaymentTermFiFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermFiDescription',
							'width': 170
						}, {
							'lookupDisplayColumn': true,
							'field': 'PaymentTermPaFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermPaDescription',
							'width': 170
						}]
					}
				};
			}])
		.factory('basicsProcurementConfigurationUIStandardService',
			['$translate', 'platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfigurationLayout', 'platformSchemaService', 'platformUIStandardExtentService',
				function ($translate, platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfigurationDto',
						moduleSubModule: 'Basics.ProcurementConfiguration'
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
					platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
					return service;
				}
			]);
})(angular);
