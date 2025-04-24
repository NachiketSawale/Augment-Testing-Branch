(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var modName = 'procurement.invoice';
	var cloudCommonModule = 'cloud.common';
	var procurementCommonModule = 'procurement.common';

	angular.module(modName).factory('procurementInvoiceIcTransactionLayout', ['$injector', function ($injector) {
		return {
			'fid': 'procurement.invoice.ic.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			readonly: true,
			'groups': [
				{
					'gid': 'invoiceIcTransaction',
					'attributes': ['invtransactionfk','bascompanycreditorfk', 'bascompanydebtorfk',  'bilheaderfk', 'bilitemfk', 'postingdate', 'amount', 'quantity', 'basuomfk', 'controllingunitfk',
						'controllinguniticfk', 'taxcodefk', 'prcstructurefk', 'issurcharge']
				},
				{'gid': 'entityHistory', 'isHistory': true}
			],
			'translationInfos': {
				'extraModules': [modName, cloudCommonModule, procurementCommonModule],
				'extraWords': {
					PostingDate: {location: modName, identifier: 'transaction.postingDate', initial: 'Posting Date'},
					Amount: {location: modName, identifier: 'transaction.amount', initial: 'Amount'},
					Quantity: {location: modName, identifier: 'transaction.quantity', initial: 'Quantity'},
					IsSurcharge: {location: modName, identifier: 'ictransaction.isSurcharge', initial: 'Is Surcharge'},
					BilHeaderFk:{location: modName, identifier: 'ictransaction.bilHeader', initial: 'Bill Header'},
					BilItemFk:{location: modName, identifier: 'ictransaction.bilItem', initial: 'Bill Item'},
					invoiceIcTransaction: {location: modName, identifier: 'group.ictransaction', initial: 'IC Transaction'},
					InvTransactionFk:{location: modName, identifier: 'ictransaction.invTransactionfk', initial: 'Invoice Transaction Id'},
					TaxCodeFk: {location: cloudCommonModule,identifier: 'entityTaxCode',initial: 'Tax Code'},
					ControllingUnitFk: {location: cloudCommonModule,identifier: 'entityControllingUnitCode',initial: 'Controlling Unit Code'},
					ControllingUnitIcFk: {location: procurementCommonModule,identifier: 'transaction.controllingUnitIc',initial: 'Clearing Controlling Unit'},
					BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM'},
					BasCompanyCreditorFk:{location: cloudCommonModule, identifier: 'creditorCompany', initial: 'Creditor Company'},
					BasCompanyDebtorFk:{location: cloudCommonModule, identifier: 'debtorCompany', initial: 'Debtor Company'},
					PrcStructureFk:{location: cloudCommonModule, identifier: 'entityStructureCode', initial: 'Structure Code'}
				}
			},
			'overloads': {
				'postingdate': {readonly: true},
				'amount': {readonly: true},
				'quantity': {readonly: true},
				'issurcharge': {readonly: true},
				'invtransactionfk': {readonly: true},
				'bilitemfk':{readonly: true},
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
				'controllingunitfk': {
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
								'showClearButton': true,
								considerPlanningElement: true,
								selectableCallback: function (dataItem) {
									return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
								}
							}
						}
					}
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
								'showClearButton': true,
								considerPlanningElement: true,
								selectableCallback: function (dataItem) {
									return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
								}
							}
						}
					}
				},
				'bilheaderfk': {
					'readonly': 'true',
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'sales-common-bill-dialog',
							'lookupOptions': {
								'showClearButton': true
							}
						},
						width: 125,
						formatter: 'lookup',
						'formatterOptions': {
							'lookupType': 'SalesBilling',
							'displayMember': 'BillNo'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'sales-common-bill-dialog',
							'descriptionMember': 'DescriptionInfo.Translated',
							'lookupOptions': {
								'showClearButton': true
							}
						}
					}
				},
				'basuomfk': {
					'readonly': 'true',
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-uom-lookup'
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'basics-lookupdata-uom-lookup',
							lookupOptions: {
								isFastDataRecording: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					}

				},
				'bascompanycreditorfk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-company-company-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						},
						width: 140
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-company-company-lookup',
							descriptionMember: 'CompanyName',
							lookupOptions: {}
						}
					},
					readonly: true
				},
				'bascompanydebtorfk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-company-company-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						},
						width: 140
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-company-company-lookup',
							descriptionMember: 'CompanyName',
							lookupOptions: {}
						}
					},
					readonly: true
				},
				prcstructurefk: {
					readonly: true,
					'grid': {
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'Prcstructure',
							'displayMember': 'Code'
						},
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'basics-procurementstructure-structure-dialog',
							'lookupOptions': {
								'showClearButton': true
							}
						},
						'width': 150
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'basics-procurementstructure-structure-dialog',
							'descriptionMember': 'DescriptionInfo.Translated',
							'lookupOptions': {
								'showClearButton': true
							}
						}
					}
				}
			}

		};
	}]);

	angular.module(modName).factory('procurementInvoiceIcTransactionUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceIcTransactionLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvTransactionIcDto',
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

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})();
