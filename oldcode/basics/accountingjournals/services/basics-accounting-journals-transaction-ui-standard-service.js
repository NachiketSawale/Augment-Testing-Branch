/**
 * Created by jhe on 11/21/2018.
 */
(function () {
	'use strict';
	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).factory('basicsAccountingJournalsTransactionUIStandardService',
		['platformUIStandardConfigService', 'basicsAccountingJournalsTranslationService', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, basicsAccountingJournalsTranslationService, platformSchemaService, platformUIStandardExtentService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.accountingjournals.transactiondetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['documenttype', 'currency', 'postingdate', 'vouchernumber', 'voucherdate', 'account', 'offsetaccount', 'postingnarritive', 'amount',
									'amountoc', 'quantity', 'pesheaderfk', 'invheaderfk', 'nominaldimension', 'nominaldimension2', 'nominaldimension3', 'postingarea', 'wipheaderfk', 'bilheaderfk', 'prrheaderdes','prjstockfk','iscancel']
							},
							{
								gid: 'controllingUnit',
								attributes: ['controllingunitcode', 'controllingunitassign01', 'controllingunitassign01desc', 'controllingunitassign02', 'controllingunitassign02desc', 'controllingunitassign03', 'controllingunitassign03desc',
									'controllingunitassign04', 'controllingunitassign04desc', 'controllingunitassign05', 'controllingunitassign05desc', 'controllingunitassign06', 'controllingunitassign06desc', 'controllingunitassign07', 'controllingunitassign07desc',
									'controllingunitassign08', 'controllingunitassign08desc', 'controllingunitassign09', 'controllingunitassign09desc', 'controllingunitassign10', 'controllingunitassign10desc']
							},
							{
								gid: 'offsetContUnit',
								attributes: ['offsetcontunitcode', 'offsetcontunitassign01', 'offsetcontunitassign01desc', 'offsetcontunitassign02', 'offsetcontunitassign02desc', 'offsetcontunitassign03', 'offsetcontunitassign03desc', 'offsetcontunitassign04',
									'offsetcontunitassign04desc', 'offsetcontunitassign05', 'offsetcontunitassign05desc', 'offsetcontunitassign06', 'offsetcontunitassign06desc', 'offsetcontunitassign07', 'offsetcontunitassign07desc',
									'offsetcontunitassign08', 'offsetcontunitassign08desc', 'offsetcontunitassign09', 'offsetcontunitassign09desc', 'offsetcontunitassign10', 'offsetcontunitassign10desc']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							pesheaderfk: {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'procurement-invoice-pes-lookup',
										descriptionMember: 'Description',
										'lookupOptions': {
											'filterKey': 'defect-main-pes-header-filter',
											'showClearButton': true
										}
									}
								},
								'grid': {
									navigator: {
										moduleName: 'procurement.pes'
									},
									name$tr$: 'procurement.invoice.header.pes',
									editor: 'lookup',
									editorOptions: {
										directive: 'procurement-invoice-pes-lookup',
										'lookupOptions': {
											'filterKey': 'defect-main-pes-header-filter',
											'showClearButton': true
										}
									},
									width: 150,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'InvoicePes',
										displayMember: 'Code',
										navigator: {
											moduleName: 'procurement.pes'
										}
									}
								},
								readonly: true
							},
							prjstockfk: {
								'grid': {
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'ProjectStock', 'displayMember': 'Code'
									},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'procurement-stock-lookup-dialog'
								},
								'readonly': true
							},
							invheaderfk: {
								detail: {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'procurement-invoice-header-dialog',
										'descriptionMember': 'Reference',
										'lookupOptions': {
											'showClearButton': true
										}
									}
								},
								grid: {
									navigator: {
										moduleName: 'procurement.invoice',
										registerService: 'procurementInvoiceHeaderDataService'
									},
									editor: 'lookup',
									editorOptions: {
										directive: 'procurement-invoice-header-dialog',
										'lookupOptions': {
											'showClearButton': true
										}
									},
									width: 125,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'InvHeaderChained',
										displayMember: 'Code'
									}
								},
								'mandatory': true,
								readonly: true
							},
							amount: {
								grid: {
									regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
								},
								detail: {
									regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
								}
							},
							amountoc: {
								grid: {
									regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
								},
								detail: {
									regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
								}
							},
							quantity: {
								grid: {
									regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,3})?)$'
								},
								detail: {
									regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,3})?)$'
								}
							},
							wipheaderfk: {
								readonly: 'true',
								grid: {
									width: 125,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'SalesWip',
										displayMember: 'Code'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'sales-common-wip-dialog',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											showClearButton: true
										}
									}
								}
							},
							bilheaderfk: {
								readonly: 'true',
								grid: {
									width: 125,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'SalesBilling',
										displayMember: 'BillNo'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'sales-common-bill-dialog',
										descriptionMember: 'DescriptionInfo.Translated'
									}
								}
							},
							prrheaderdes: {readonly: true}
						},
						addition: {
							grid: [
								{
									'id': 'wipHeaderDescription',
									'lookupDisplayColumn': true,
									'field': 'WipHeaderFk',
									'displayMember': 'DescriptionInfo.Translated',
									'name$tr$': 'basics.accountingJournals.entityWipHeaderFkDesc',
									'sortable': true,
									'width': 150
								},
								{
									'id': 'bilHeaderDescription',
									'lookupDisplayColumn': true,
									'field': 'BilHeaderFk',
									'displayMember': 'DescriptionInfo.Translated',
									'name$tr$': 'basics.accountingJournals.entityBillHeaderFkDesc',
									'sortable': true,
									'width': 150
								}
							]
						}
					};
				}

				var companyTransactionDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyTransactionAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyTransactionDto',
					moduleSubModule: 'Basics.Company'
				});

				companyTransactionAttributeDomains = companyTransactionAttributeDomains.properties;

				var service = new BaseService(companyTransactionDetailLayout, companyTransactionAttributeDomains, basicsAccountingJournalsTranslationService);
				platformUIStandardExtentService.extend(service, companyTransactionDetailLayout.addition, companyTransactionAttributeDomains);

				return service;
			}
		]);
})();