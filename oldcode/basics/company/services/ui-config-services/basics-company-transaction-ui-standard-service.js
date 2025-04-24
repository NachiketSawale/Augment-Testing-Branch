/**
 * Created by henkel on 01.02.2018
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyTransactionUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of company entities
	 */
	angular.module(moduleName).factory('basicsCompanyTransactionUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, platformSchemaService, platformUIStandardExtentService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.transactiondetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['documenttype', 'currency', 'postingdate', 'vouchernumber', 'voucherdate', 'account', 'offsetaccount', 'postingnarritive', 'amount',
									'amountoc', 'quantity', 'pesheaderfk', 'invheaderfk', 'nominaldimension', 'postingarea', 'wipheaderfk', 'bilheaderfk', 'nominaldimension2', 'nominaldimension3']
							},
							{
								gid: 'controllingUnit',
								attributes: ['controllingunitcode', 'controllingunitassign01', 'controllingunitassign01desc', 'controllingunitassign02', 'controllingunitassign02desc', 'controllingunitassign03', 'controllingunitassign03desc',
									'controllingunitassign04', 'controllingunitassign04desc', 'controllingunitassign05', 'controllingunitassign05desc', 'controllingunitassign06', 'controllingunitassign06desc', 'controllingunitassign07', 'controllingunitassign07desc',
									'controllingunitassign08', 'controllingunitassign09desc', 'controllingunitassign10', 'controllingunitassign10desc']
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
							}

						},
						addition: {
							grid: [
								{
									'id': 'wipHeaderDescription',
									'lookupDisplayColumn': true,
									'field': 'WipHeaderFk',
									'displayMember': 'DescriptionInfo.Translated',
									'name$tr$': 'basics.company.entityWipHeaderFkDesc',
									'sortable': true,
									'width': 150
								},
								{
									'id': 'bilHeaderDescription',
									'lookupDisplayColumn': true,
									'field': 'BilHeaderFk',
									'displayMember': 'DescriptionInfo.Translated',
									'name$tr$': 'basics.company.entityBillHeaderFkDesc',
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

				var service = new BaseService(companyTransactionDetailLayout, companyTransactionAttributeDomains, basicsCompanyTranslationService);
				platformUIStandardExtentService.extend(service, companyTransactionDetailLayout.addition, companyTransactionAttributeDomains);

				return service;
			}
		]);
})();
