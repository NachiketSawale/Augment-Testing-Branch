// eslint-disable-next-line no-redeclare
/* global angular */

(function () {
	'use strict';

	var modName = 'procurement.stock',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('procurementStockLayout', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			var detailReconciliationColumns = [
				['TotalValue', 'TotalValue', 'procurement.stock.header.totalvalue', 'AmountNet',
					'TotalReceipt', 'TotalConsumed', 'TotalValue'],
				['TotalValue', 'TotalProvision', 'procurement.stock.header.totalprovision',
					'AmountNet', 'ProvisionReceipt', 'ProvisionConsumed', 'TotalProvision'],
				['TotalProvision', 'Expenses', 'procurement.stock.header.expenses', 'AmountNet', 'ExpenseTotal', 'ProvisionReceipt', 'Expenses']
			];

			/* jshint -W072 */ // really need so many parameters
			function generateReconciliationRow(afterId, rid, label, model, netField, vatField, grossField) {
				return {
					afterId: afterId,
					'rid': rid,
					'gid': 'reconciliation',
					'type': 'directive',
					'directive': 'platform-composite-input',
					'label$tr$': label,
					'model': model,
					'options': {
						'rows': [
							{
								readonly: true,
								'type': 'money',
								'model': netField,
								'cssLayout': 'stock-composite xs-4 sm-4 md-4 lg-4'
							},
							{
								readonly: true,
								'type': 'money',
								'model': vatField,
								'cssLayout': 'stock-composite xs-4 sm-4 md-4 lg-4'
							},
							{
								readonly: true,
								'type': 'money',
								'model': grossField,
								'cssLayout': 'stock-composite xs-4 sm-4 md-4 lg-4'
							}]
					}
				};
			}

			function generateDetailReconciliationConfig() {
				var config = [],
					i = 0;
				for (; i < detailReconciliationColumns.length; i++) {
					config.push(generateReconciliationRow.apply(null, detailReconciliationColumns[i]));
				}
				return config;
			}
			var config = {
				'fid': 'procurement.stock.header',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['projectfk','prjstockfk','stockvaluationrulefk','stockaccountingtypefk','stocktypefk','currencyfk','clerkfk',
							'total','provisiontotal','totalreceipt','totalconsumed', 'totalvalue','provisionreceipt','provisionconsumed',
							'totalprovision','expensetotal','expenseconsumed','expenses','companyfk']

					},
					{
						'gid': 'reconciliation',
						'attributes': []
					}
				],
				'translationInfos': {
					'extraModules': [modName],
					'extraWords': {
						'moduleName': {
							'location': modName,
							'identifier': 'moduleName',
							'initial': 'Stock'
						},
						'Code':{'location': modName, 'identifier': 'header.PrjStockFk', 'initial': 'Code'},
						'ProjectFk':{'location': cloudCommonModule, 'identifier': 'entityProjectNo', 'initial': 'Project No.'},
						'PrjStockFk':{'location': modName, 'identifier': 'header.PrjStockFk', 'initial': 'Stock Code' },
						'StockValuationRuleFk':{'location': modName, 'identifier': 'header.PrjStockvaluationruleFk', 'initial': 'Stock Valuation Rule' },
						'StockAccountingTypeFk':{'location': modName, 'identifier': 'header.PrjStockaccountingtypeFk', 'initial': 'Stock Accounting Type' },
						'StockTypeFk':{'location': modName, 'identifier': 'header.PrjStocktypeFk', 'initial': 'Stock Type' },
						'CurrencyFk':{'location': modName, 'identifier': 'header.BasCurrencyFk', 'initial': 'Currency' },
						'CompanyFk':{'location': cloudCommonModule, 'identifier': 'entityCompany', 'initial': 'Company' },
						'ClerkFk':{'location': modName, 'identifier': 'header.BasClerkFk', 'initial': 'Clerk' },
						'Total':{'location': modName, 'identifier': 'header.total', 'initial': 'Total' },
						'ProvisionTotal':{'location': modName, 'identifier': 'header.ProvisionTotal', 'initial': 'Provision Total' },
						reconciliation: {
							location: modName,
							identifier: 'group.reconciliation',
							initial: 'Reconciliation'
						},
						'TotalReceipt': {location: modName, identifier: 'stocktotal.TotalReceipt', initial: 'Total Value(Receipt)'},
						'TotalConsumed': {location: modName, identifier: 'stocktotal.TotalConsumed', initial: 'Total Value(Consumed)'},
						'TotalValue': {location: modName, identifier: 'stocktotal.TotalValue', initial: 'Total Value(Difference)'},
						'ProvisionReceipt': {location: modName, identifier: 'stocktotal.ProvisionReceipt', initial: 'Total Provision(Receipt)'},
						'ProvisionConsumed': {location: modName, identifier: 'stocktotal.ProvisionConsumed', initial: 'Total Provision(Consumed)'},
						'TotalProvision': {location: modName, identifier: 'stocktotal.TotalProvision', initial: 'Total Provision(Difference)'},
						'ExpenseTotal': {location: modName, identifier: 'stocktotal.ExpenseTotal', initial: 'Expense(Receipt)'},
						'ExpenseConsumed': {location: modName, identifier: 'stocktotal.ExpenseConsumed', initial: 'Expense(Consumed)'},
						'Expenses': {location: modName, identifier: 'stocktotal.Expenses', initial: 'Expenses(Difference)'}
					}
				},
				'overloads':{
					'prjstockfk':{
						'grid': {
							// 'editor': 'lookup',
							// 'editorOptions': {
							//     'directive': 'procurement-stock-lookup-dialog'
							// },
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ProjectStock', 'displayMember': 'Code'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'procurement-stock-lookup-dialog',
								descriptionMember: 'Description'
							}
						},
						'readonly': true
					},
					'projectfk': {
						'navigator': {
							moduleName: 'project.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-project-lookup-dialog',
								'displayMember': 'ProjectName',
								'lookupOptions': {
									'filterKey': 'prc-invoice-header-project-filter',
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcProject', 'displayMember': 'ProjectNo'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-project-lookup-dialog',
								'descriptionMember': 'ProjectName',
								'lookupOptions': {
									'showClearButton': true,
									'lookupKey': 'prc-invoice-header-project-property',
									'filterKey': 'prc-invoice-header-project-filter'
								}
							}
						},
						'readonly':true
					},
					'stockvaluationrulefk':{
						'grid': {
							// 'editor': 'lookup',
							// 'editorOptions': {
							//     'directive': 'procurement-stock-stockvaluationrule-dialog'
							// },
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'StockValuationRule', 'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-stock-stockvaluationrule-dialog'
						},
						'readonly': true
					},
					'stockaccountingtypefk':{
						'grid': {
							// 'editor': 'lookup',
							// 'editorOptions': {
							//     'directive': 'procurement-stock-stockaccountingtype-dialog'
							// },
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'StockAccountingType', 'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-stock-stockaccountingtype-dialog'
						},
						'readonly': true
					},
					'stocktypefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectstocktype', 'Description'),
					'currencyfk': {
						'grid': {
							// 'editor': 'lookup',
							// 'editorOptions': {'directive': 'basics-lookupdata-currency-combobox', 'lookupOptions': {}},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Currency', 'displayMember': 'Currency'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-currency-combobox',
							'options': {'showClearButton': true}
						},
						'readonly': true
					},
					'companyfk': {
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
							width: 120
						},
						detail: {
							model: 'CompanyFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName'
							}
						}
					},
					clerkfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							},
							requiredInErrorHandling: true
						},
						grid: {
							// editor: 'lookup',
							// directive: 'basics-lookupdata-lookup-composite',
							// editorOptions: {
							//     lookupDirective: 'cloud-clerk-clerk-dialog',
							//     lookupOptions: {
							//         showClearButton: true
							//     }
							// },
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							}
						},
						'readonly': true
					},
					'total':{'readonly':true,formatter: 'money'},
					'provisiontotal':{'readonly':true,formatter: 'money'},
					'totalreceipt':{ detail: {visible:false},'readonly':true,formatter: 'money'},
					'totalconsumed':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'totalvalue':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'provisionreceipt':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'provisionconsumed':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'totalprovision':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'expensetotal':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'expenseconsumed':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'expenses':{detail: {visible:false},'readonly':true,formatter: 'money'}
				},
				'addition': {
					grid: [
						{
							'id': 'IsChecked',
							'field': 'IsChecked',
							'name$tr$': 'basics.material.record.filter',
							'formatter': 'boolean',
							'editor': 'boolean',
							'width': 50,
							'fixed': true,
							'isTransient':true,
							'headerChkbox': true,
							'sortable': true,
							'focusable': false
						},
						{
							'lookupDisplayColumn': true,
							'field': 'PrjStockFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.stock.header.PrjStockDescription',
							'width': 100
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ProjectFk',
							'displayMember': 'ProjectName',
							'name$tr$': 'cloud.common.entityProjectName',
							'width': 100
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ProjectFk',
							'displayMember': 'ProjectIndex',
							'name':'Project Index',
							'name$tr$': 'procurement.stock.header.ProjectIndex',
							'width': 100
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ClerkFk',
							'displayMember': 'Description',
							// 'name':'Clerk Description',
							'name$tr$': 'procurement.stock.header.ClerkDescription',
							'width': 100
						}
					],
					detail: [
						{
							'rid': 'reconciliationTitle',
							'gid': 'reconciliation',
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label': ' ',
							'model'    : 'AmountNet',
							'options': {
								'rows': [{
									'type': 'directive',
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.stock.header.receipt'}
								}, {
									'type': 'directive',
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.stock.header.consumed'}
								}, {
									'type': 'directive',
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.stock.header.difference'}
								}]
							}
						}
					]
				}
			};
			config.addition.detail = config.addition.detail.concat(generateDetailReconciliationConfig());
			return config;
		}]);

	angular.module(modName).factory('procurementStockUIStandardService',
		['platformUIStandardConfigService', 'procurementStockTranslationService',
			'procurementStockLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'StockHeaderVDto',
					moduleSubModule: 'Procurement.Stock'
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
