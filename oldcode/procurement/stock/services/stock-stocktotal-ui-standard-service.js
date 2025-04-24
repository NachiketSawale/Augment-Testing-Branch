// eslint-disable-next-line no-redeclare
/* global angular */

(function () {
	'use strict';
	var modName = 'procurement.stock';
	var cloudCommonModule = 'cloud.common';
	angular.module(modName).factory('procurementStockStockTotalLayout', [
		function () {
			var detailReconciliationColumns = [
				['reconciliationTitle', 'TotalQuantity', 'procurement.stock.header.totalquantity', 'AmountNet',
					'QuantityReceipt', 'QuantityConsumed', 'TotalQuantity'],
				['TotalQuantity', 'TotalValue', 'procurement.stock.header.totalvalue', 'AmountNet',
					'TotalReceipt', 'TotalConsumed', 'TotalValue'],
				['TotalValue', 'TotalProvision', 'procurement.stock.header.totalprovision',
					'AmountNet', 'ProvisionReceipt', 'ProvisionConsumed', 'TotalProvision'],
				['TotalProvision', 'Expenses', 'procurement.stock.header.expenses', 'AmountNet', 'ExpenseTotal', 'ProvisionReceipt', 'Expenses']
			];
			// todo: pass a obj into
			/* jshint -W072 */ // really need so many parameters
			function generateReconciliationRow(afterId, rid, label, model, netField, vatField, grossField) {
				var type = 'money';
				if (rid === 'TotalQuantity') {
					type = 'quantity';
				}
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
								'type': type,
								'model': netField,
								'cssLayout': 'invoice-composite xs-4 sm-4 md-4 lg-4'
							},
							{
								readonly: true,
								'type': type,
								'model': vatField,
								'cssLayout': 'invoice-composite xs-4 sm-4 md-4 lg-4'
							},
							{
								readonly: true,
								'type': type,
								'model': grossField,
								'cssLayout': 'invoice-composite xs-4 sm-4 md-4 lg-4'
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

			var config= {
				'fid': 'procurement.stock.stocktotal',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['catalogcode','catalogdescription', 'prcstructurefk','materialcode','description1','description2','specification','quantity', 'uom', 'total','provisiontotal','provisionpercent','provisionperuom','islotmanagement',
							'minquantity','maxquantity','quantityreceipt','quantityconsumed','totalquantity','totalreceipt','totalconsumed',
							'totalvalue','provisionreceipt','provisionconsumed','totalprovision','expensetotal','expenseconsumed','expenses','quantityreserved','quantityavailable','orderproposalstatuses','lasttransactiondays',
							'quantityonorder','quantitytotal','pendingquantity','totalquantitybypending','modelname','branddescription','productfk','stockcode','stockdescription'
						]
					},
					{
						'gid': 'reconciliation',
						'attributes': []
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName, 'basics.common','basics.procurementstructure'],
					'extraWords': {
						PrcStructureFk:{location: modName, identifier: 'stocktotal.PrcStructure', initial: 'Structure'},
						CatalogCode: {location: modName, identifier: 'stocktotal.materialcatalog', initial: 'Material Catalog'},
						CatalogDescription: {location: modName, identifier: 'stocktotal.materialcatalogdescription', initial: 'Material Catalog description'},
						MaterialCode: {location: modName, identifier: 'stocktotal.MdcMaterialFk', initial: 'Material Code'},
						Description1: {location: modName, identifier: 'stocktotal.MdcMaterialdescription1', initial: 'Material Description1'},
						Description2: {location: modName, identifier: 'stocktotal.MdcMaterialFurtherdescription', initial: 'Material Description2'},
						Quantity: {location: modName, identifier: 'stocktotal.Quantity', initial: 'Quantity'},
						Uom: {location: modName, identifier: 'stocktotal.BasUomFk', initial: 'Uom'},
						Total: {location: modName, identifier: 'stocktotal.Total', initial: 'Total'},
						ProvisionTotal: {location: modName, identifier: 'stocktotal.ProvisionTotal', initial: 'Provision Total'},
						ProvisionPercent: {location: modName, identifier: 'stocktotal.ProvisionPercent', initial: 'Provision Percent'},
						ProvisionPeruom: {location: modName, identifier: 'stocktotal.ProvisionPeruom', initial: 'Provision Per Uom'},
						Islotmanagement: {location: modName, identifier: 'stocktotal.IslotManagement', initial: 'Is Lot Management'},
						MinQuantity: {location: modName, identifier: 'stocktotal.MinQuantity', initial: 'Min Quantity'},
						MaxQuantity: {location: modName, identifier: 'stocktotal.MaxQuantity', initial: 'Max Quantity'},
						reconciliation: {
							location: modName,
							identifier: 'group.reconciliation',
							initial: 'Reconciliation'
						},
						QuantityReceipt: {location: modName, identifier: 'stocktotal.QuantityReceipt', initial: 'Total Quantity(Receipt)'},
						QuantityConsumed: {location: modName, identifier: 'stocktotal.QuantityConsumed', initial: 'Total Quantity(Consumed)'},
						TotalQuantity: {location: modName, identifier: 'stocktotal.TotalQuantity', initial: 'Total Quantity(Difference)'},
						'TotalReceipt': {location: modName, identifier: 'stocktotal.TotalReceipt', initial: 'Total Value(Receipt)'},
						'TotalConsumed': {location: modName, identifier: 'stocktotal.TotalConsumed', initial: 'Total Value(Consumed)'},
						'TotalValue': {location: modName, identifier: 'stocktotal.TotalValue', initial: 'Total Value(Difference)'},
						'ProvisionReceipt': {location: modName, identifier: 'stocktotal.ProvisionReceipt', initial: 'Total Provision(Receipt)'},
						'ProvisionConsumed': {location: modName, identifier: 'stocktotal.ProvisionConsumed', initial: 'Total Provision(Consumed)'},
						'TotalProvision': {location: modName, identifier: 'stocktotal.TotalProvision', initial: 'Total Provision(Difference)'},
						'ExpenseTotal': {location: modName, identifier: 'stocktotal.ExpenseTotal', initial: 'Expense(Receipt)'},
						'ExpenseConsumed': {location: modName, identifier: 'stocktotal.ExpenseConsumed', initial: 'Expense(Consumed)'},
						'Expenses': {location: modName, identifier: 'stocktotal.Expenses', initial: 'Expenses(Difference)'},
						'QuantityReserved': {location: modName, identifier: 'stocktotal.QuantityReserved', initial: 'Quantity Reserved'},
						'QuantityAvailable': {location: modName, identifier: 'stocktotal.QuantityAvailable', initial: 'Quantity Available'},
						OrderProposalStatuses: {location: modName, identifier: 'stocktotal.OrderProposalStatuses', initial: 'Order Proposal'},
						LastTransactionDays: {location: modName, identifier: 'stocktotal.LastTransactionDays', initial: 'Last Transaction(Days)'},
						QuantityOnOrder: {location: modName, identifier: 'stocktotal.QuantityOnOrder', initial: 'Quantity On Order'},
						QuantityTotal: {location: modName, identifier: 'stocktotal.QuantityTotal', initial: 'Quantity Total'},
						Specification: {location: cloudCommonModule, identifier: 'EntitySpec', initial: 'EntitySpec'},
						PendingQuantity:{location: modName, identifier: 'stocktotal.PendingQuantity', initial: 'Pending Quantity'},
						TotalQuantityByPending:{location: modName, identifier: 'stocktotal.TotalQuantityByPending', initial: 'Total Quantity(Pending)'},
						Modelname: {location: modName, identifier: 'stocktotal.Modelname', initial: 'Modelname'},
						BrandDescription: {location: modName, identifier: 'stocktotal.Brand', initial: 'Brand'},
						ProductFk: {location: modName, identifier: 'stocktotal.Product', initial: 'Product'},
						StockCode: {location: modName, identifier: 'stocktotal.StockCode', initial: 'StockCode'},
						StockDescription: {location: modName, identifier: 'stocktotal.StockDescription', initial: 'StockDescription'}
					}
				},
				'overloads': {
					catalogcode:{
						navigator : {
							moduleName: 'basics.materialcatalog'
						},
						readonly:true
					},
					catalogdescription:{readonly:true},
					prcstructurefk:{
						navigator: {
							moduleName: 'basics.procurementstructure'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-procurementstructure-structure-dialog'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcstructure',
								'displayMember': 'Code'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-procurementstructure-structure-dialog',
								'descriptionMember': 'Description'
							}
						},
						readonly:true
					},
					materialcode:{
						navigator: {
							moduleName: 'basics.material'
						},
						readonly:true
					},
					description1:{readonly:true},
					description2:{readonly:true},
					quantity:{readonly:true},
					uom:{readonly:true},
					total:{readonly:true,formatter: 'money',detail:{formatter: 'money'}},
					provisiontotal:{readonly:true,formatter: 'money',detail:{formatter: 'money'}},
					provisionpercent:{readonly:true,formatter: 'money',detail:{formatter: 'money'}},
					provisionperuom:{readonly:true,formatter: 'money',detail:{formatter: 'money'}},
					islotmanagement:{readonly:true},
					minquantity:{readonly:true},
					maxquantity:{readonly:true},
					quantityreceipt: {detail: {visible:false},readonly:true},
					quantityconsumed: {detail: {visible:false},readonly:true},
					totalquantity: {detail: {visible:false},readonly:true},
					'totalreceipt':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'totalconsumed':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'totalvalue':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'provisionreceipt':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'provisionconsumed':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'totalprovision':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'expensetotal':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'expenseconsumed':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'expenses':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'quantityreserved':{readonly:true,formatter: 'quantity',detail:{formatter: 'quantity'}},
					'quantityavailable':{readonly:true,formatter: 'quantity',detail:{formatter: 'quantity'}},
					lasttransactiondays:{readonly:true},
					quantityonorder:{readonly:true},
					quantitytotal:{readonly:true},
					specification: {readonly: true},
					pendingquantity: {readonly:true},
					totalquantitybypending: {readonly:true},
					modelname: {readonly:true},
					branddescription: {readonly:true},
					productfk: {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'productionplanning-common-product-lookup-new',
								'lookupType': 'CommonProduct'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CommonProduct',
								'displayMember': 'Code',
								'version': 3
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'productionplanning-common-product-lookup-new',
								displayMember: 'Code',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						readonly: true
					},
					stockcode: {readonly:true},
					stockdescription: {readonly:true}
				},
				'addition': {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'PrcStructureFk',
							name$tr$: 'cloud.common.entityStructureDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 145
						},
						{
							id: 'ProductDescription',
							formatter: 'text',
							field: 'ProductDescription',
							name$tr$: 'procurement.stock.stocktotal.ProductDescription',
							width: 150
						}
					],
					detail: [
						{
							'rid': 'reconciliationTitle',
							'gid': 'reconciliation',
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label': ' ',
							'model': 'AmountNet',
							'options': {
								'rows': [{
									'type': 'directive',
									'directive': 'procurement-stock-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.stock.header.receipt'}
								}, {
									'type': 'directive',
									'directive': 'procurement-stock-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.stock.header.consumed'}
								}, {
									'type': 'directive',
									'directive': 'procurement-stock-label-in-form-row',
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

	angular.module(modName).factory('procurementStockStockTotalUIStandardService',
		['platformUIStandardConfigService', 'procurementStockTranslationService',
			'procurementStockStockTotalLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'StockTotalVDto',
					moduleSubModule: 'Procurement.Stock'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
					domainSchema.OrderProposalStatuses = {domain: 'action'};
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
