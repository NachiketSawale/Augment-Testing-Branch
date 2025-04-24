
(function () {
	'use strict';
	var moduleName = 'procurement.orderproposals';
	var modName = 'procurement.stock';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('procurementOrderProposalsLayout', ['basicsCommonComplexFormatter',
		function procurementOrderProposalsLayout(basicsCommonComplexFormatter) {

			return {
				'fid': 'procurement.orderproposals.header',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [
							'prcconfigurationfk','prcconfigurationreqfk', 'basclerkprcfk', 'basclerkreqfk', 'prcpackagefk', 'description',
							'businesspartnerfk', 'subsidiaryfk', 'supplierfk', 'contactfk', 'islive', 'leadtime', 'tolerance', 'log',
							'deliveryaddress', 'proposedquantity'
						]
					},
					{
						'gid': 'stockData',
						'attributes': ['projectfk','prjstockfk','stockvaluationrulefk','stockaccountingtypefk','currencyfk','clerkfk',
							'stocktotal','stockprovisiontotal','stocktotalreceipt','stocktotalconsumed', 'stocktotalvalue','stockprovisionreceipt','stockprovisionconsumed',
							'stocktotalprovision','stockexpensetotal','stockexpenseconsumed','stockexpenses']

					},
					{
						'gid': 'StockTotalData',
						'attributes': ['catalogcode', 'catalogdescription', 'prcstructurefk', 'materialcode', 'description1', 'description2', 'specification', 'quantity', 'uom', 'total', 'provisiontotal', 'provisionpercent', 'provisionperuom', 'islotmanagement',
							'minquantity', 'maxquantity', 'quantityreceipt', 'quantityconsumed', 'totalquantity', 'totalreceipt', 'totalconsumed',
							'totalvalue', 'provisionreceipt', 'provisionconsumed', 'totalprovision', 'expensetotal', 'expenseconsumed', 'expenses', 'quantityreserved', 'quantityavailable', 'orderproposalstatuses', 'lasttransactiondays',
							'quantityonorder', 'quantitytotal', 'pendingquantity', 'totalquantitybypending'
						]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName, moduleName, cloudCommonModule, 'basics.common', 'basics.procurementstructure'],
					'extraWords': {
						'moduleName': { 'location': modName, 'identifier': 'moduleName', 'initial': 'Order Proposals'},
						'basicData': { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
						entityHistory: { location: cloudCommonModule, identifier: 'entityHistory', initial: 'History' },
						'stockData': {location: modName, identifier: 'title.header', initial: 'Stock Header'},
						'StockTotalData': {location: modName, identifier: 'title.stocktotal', initial: 'Stock Total'},
						PrcStructureFk: {location: modName, identifier: 'stocktotal.PrcStructure', initial: 'Structure'},
						CatalogCode: { location: modName, identifier: 'stocktotal.materialcatalog', initial: 'Material Catalog'},
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
						reconciliation: {location: modName, identifier: 'group.reconciliation', initial: 'Reconciliation'},
						QuantityReceipt: {location: modName, identifier: 'stocktotal.QuantityReceipt', initial: 'Total Quantity(Receipt)'},
						QuantityConsumed: {location: modName, identifier: 'stocktotal.QuantityConsumed', initial: 'Total Quantity(Consumed)'},
						TotalQuantity: {location: modName, identifier: 'stocktotal.TotalQuantity', initial: 'Total Quantity(Difference)'},
						'TotalReceipt': { location: modName, identifier: 'stocktotal.TotalReceipt', initial: 'Total Value(Receipt)'},
						'TotalConsumed': {location: modName, identifier: 'stocktotal.TotalConsumed', initial: 'Total Value(Consumed)'},
						'TotalValue': {location: modName, identifier: 'stocktotal.TotalValue', initial: 'Total Value(Difference)'},
						'ProvisionReceipt': {location: modName, identifier: 'stocktotal.ProvisionReceipt', initial: 'Total Provision(Receipt)'},
						'ProvisionConsumed': {location: modName, identifier: 'stocktotal.ProvisionConsumed', initial: 'Total Provision(Consumed)'},
						'TotalProvision': { location: modName, identifier: 'stocktotal.TotalProvision', initial: 'Total Provision(Difference)'},
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
						PendingQuantity: {location: modName, identifier: 'stocktotal.PendingQuantity', initial: 'Pending Quantity'},
						TotalQuantityByPending: {location: modName, identifier: 'stocktotal.TotalQuantityByPending', initial: 'Total Quantity(Pending)'},
						PrcConfigurationFk: {location: moduleName, identifier: 'header.ContractConfiguration', initial: 'Contract Configuration'},
						PrcConfigurationReqFk: {location: moduleName, identifier: 'header.ReqConfiguration', initial: 'Requisition Configuration'},
						BasClerkPrcFk: {location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible'},
						BasClerkReqFk: { location: cloudCommonModule, identifier: 'entityRequisitionOwner', initial: 'Requisition Owner'},
						PrcPackageFk: {location: cloudCommonModule, identifier: 'entityPackage', initial: 'Package'},
						Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
						BusinessPartnerFk: {location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner'},
						SubsidiaryFk: {location: cloudCommonModule, identifier: 'entitySubsidiary', initial: 'Subsidiary'},
						SupplierFk: {location: cloudCommonModule, identifier: 'entitySupplierDescription', initial: 'Supplier'},
						ContactFk: {location: modName, identifier: 'Contact', initial: 'Contact'},
						IsLive: {location: moduleName, identifier: 'header.IsLive', initial: 'IsLive'},
						LeadTime: {location: moduleName, identifier: 'header.LeadTime', initial: 'LeadTime'},
						Tolerance: {location: moduleName, identifier: 'header.Tolerance', initial: 'Tolerance'},
						Log: {location: moduleName, identifier: 'header.Log', initial: 'Log'},
						DeliveryAddress:{location: moduleName, identifier: 'header.DeliveryAddress', initial: 'Delivery Address'},
						ProposedQuantity:{location: moduleName, identifier: 'header.ProposedQuantity', initial: 'Proposed Quantity'},

						'Code':{'location': modName, 'identifier': 'header.PrjStockFk', 'initial': 'Code'},
						'ProjectFk':{'location': cloudCommonModule, 'identifier': 'entityProjectNo', 'initial': 'Project No.'},
						'PrjStockFk':{'location': modName, 'identifier': 'header.stockCode', 'initial': 'Stock Code' },
						'StockValuationRuleFk':{'location': modName, 'identifier': 'header.PrjStockvaluationruleFk', 'initial': 'Stock Valuation Rule' },
						'StockAccountingTypeFk':{'location': modName, 'identifier': 'header.PrjStockaccountingtypeFk', 'initial': 'Stock Accounting Type' },
						'CurrencyFk':{'location': modName, 'identifier': 'header.BasCurrencyFk', 'initial': 'Currency' },
						'ClerkFk':{'location': modName, 'identifier': 'header.BasClerkFk', 'initial': 'Clerk' },
						'StockTotal':{'location': modName, 'identifier': 'header.total', 'initial': 'Total' },
						'StockProvisionTotal':{'location': modName, 'identifier': 'header.ProvisionTotal', 'initial': 'Provision Total' },
						'StockTotalReceipt': {location: modName, identifier: 'stocktotal.TotalReceipt', initial: 'Total Value(Receipt)'},
						'StockTotalConsumed': {location: modName, identifier: 'stocktotal.TotalConsumed', initial: 'Total Value(Consumed)'},
						'StockTotalValue': {location: modName, identifier: 'stocktotal.TotalValue', initial: 'Total Value(Difference)'},
						'StockProvisionReceipt': {location: modName, identifier: 'stocktotal.ProvisionReceipt', initial: 'Total Provision(Receipt)'},
						'StockProvisionConsumed': {location: modName, identifier: 'stocktotal.ProvisionConsumed', initial: 'Total Provision(Consumed)'},
						'StockTotalProvision': {location: modName, identifier: 'stocktotal.TotalProvision', initial: 'Total Provision(Difference)'},
						'StockExpenseTotal': {location: modName, identifier: 'stocktotal.ExpenseTotal', initial: 'Expense(Receipt)'},
						'StockExpenseConsumed': {location: modName, identifier: 'stocktotal.ExpenseConsumed', initial: 'Expense(Consumed)'},
						'StockExpenses': {location: modName, identifier: 'stocktotal.Expenses', initial: 'Expenses(Difference)'}
					}
				},
				'overloads': {
					catalogcode: {
						navigator: {
							moduleName: 'basics.materialcatalog'
						},
						readonly: true
					},
					catalogdescription: {readonly: true},
					prcstructurefk: {
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
						readonly: true
					},
					materialcode: {
						navigator: {
							moduleName: 'basics.material'
						},
						readonly: true
					},
					description1: {readonly: true},
					description2: {readonly: true},
					quantity: {readonly: true},
					uom: {readonly: true},
					total: {readonly: true, formatter: 'money', detail: {formatter: 'money'}},
					provisiontotal: {readonly: true, formatter: 'money', detail: {formatter: 'money'}},
					provisionpercent: {readonly: true, formatter: 'money', detail: {formatter: 'money'}},
					provisionperuom: {readonly: true, formatter: 'money', detail: {formatter: 'money'}},
					islotmanagement: {readonly: true},
					minquantity: {readonly: true},
					maxquantity: {readonly: true},
					quantityreceipt: {detail: {visible: false}, readonly: true},
					quantityconsumed: {detail: {visible: false}, readonly: true},
					totalquantity: {detail: {visible: false}, readonly: true},
					'totalreceipt': {detail: {visible: false}, 'readonly': true, formatter: 'money'},
					'totalconsumed': {detail: {visible: false}, 'readonly': true, formatter: 'money'},
					'totalvalue': {detail: {visible: false}, 'readonly': true, formatter: 'money'},
					'provisionreceipt': {detail: {visible: false}, 'readonly': true, formatter: 'money'},
					'provisionconsumed': {detail: {visible: false}, 'readonly': true, formatter: 'money'},
					'totalprovision': {detail: {visible: false}, 'readonly': true, formatter: 'money'},
					'expensetotal': {detail: {visible: false}, 'readonly': true, formatter: 'money'},
					'expenseconsumed': {detail: {visible: false}, 'readonly': true, formatter: 'money'},
					'expenses': {detail: {visible: false}, 'readonly': true, formatter: 'money'},
					'quantityreserved': {readonly: true, formatter: 'quantity', detail: {formatter: 'quantity'}},
					'quantityavailable': {readonly: true, formatter: 'quantity', detail: {formatter: 'quantity'}},
					lasttransactiondays: {readonly: true},
					quantityonorder: {readonly: true},
					quantitytotal: {readonly: true},
					specification: {readonly: true},
					pendingquantity: {readonly: true},
					totalquantitybypending: {readonly: true},
					prcconfigurationfk: {
						detail: {
							'type': 'directive',
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								filterKey: 'prc-order-con-configuration-filter'
							}
						},
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'PrcConfiguration',
								displayMember: 'DescriptionInfo.Translated'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'basics-configuration-configuration-combobox',
								lookupOptions: {
									filterKey: 'prc-order-con-configuration-filter'
								}
							}
						}
					},
					prcconfigurationreqfk: {
						detail: {
							'type': 'directive',
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								filterKey: 'prc-order-req-configuration-filter'
							}
						},
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'PrcConfiguration',
								displayMember: 'DescriptionInfo.Translated'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'basics-configuration-configuration-combobox',
								lookupOptions: {
									filterKey: 'prc-order-req-configuration-filter'
								}
							}
						}
					},
					basclerkprcfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionField: 'ClerkPrcDescription',
								descriptionMember: 'Description',
								lookupOptions: {
									initValueField: 'ClerkPrcCode',
									readOnly: false,
									disableInput: false,
									showClearButton: true,
									showEditButton: true
								}
							}
						},
						grid: {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'cloud-clerk-clerk-dialog'
							},
							formatter: 'lookup',
							formatterOptions: { lookupType: 'clerk', displayMember: 'Code' }
						}
					},
					basclerkreqfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionField: 'ClerkReqDescription',
								descriptionMember: 'Description',
								lookupOptions: {
									initValueField: 'ClerkReqCode',
									readOnly: false,
									disableInput: false,
									showClearButton: true,
									showEditButton: true
								}
							}
						},
						grid: {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'cloud-clerk-clerk-dialog'
							},
							formatter: 'lookup',
							formatterOptions: { lookupType: 'clerk', displayMember: 'Code' }
						}
					},
					prcpackagefk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'procurement-common-package-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'prc-order-con-package-filter-for-order-proposal',
									disableInput: false,
									showClearButton: true,
									showEditButton: true
								}
							}
						},
						grid: {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-package-lookup',
								'lookupOptions': {
									'filterKey': 'prc-order-con-package-filter-for-order-proposal'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PrcPackage', 'displayMember': 'Code'},
						}
					},
					description: {
						detail: {maxLength: 252},
						grid: {maxLength: 252}
					},
					businesspartnerfk: {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'business-partner-main-business-partner-dialog',
								lookupOptions: {
									'IsShowBranch': true,
									'mainService':'procurementOrderProposalsDataService',
									'BusinessPartnerField':'BusinessPartnerFk',
									'SubsidiaryField':'SubsidiaryFk',
									'SupplierField':'SupplierFk',
									'ContactField': 'ContactFk'

								}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog',
							'options': {
								'IsShowBranch': true,
								'mainService':'procurementOrderProposalsDataService',
								'BusinessPartnerField':'BusinessPartnerFk',
								'SubsidiaryField':'SubsidiaryFk',
								'SupplierField':'SupplierFk',
								'ContactField': 'ContactFk',

							}
						}
					},
					subsidiaryfk: {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'Subsidiary',
								displayMember: 'AddressLine'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									filterKey: 'order-businesspartner-main-evaluation-subsidiary-filter',
									showClearButton: true,
									displayMember: 'AddressLine'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								filterKey: 'order-businesspartner-main-evaluation-subsidiary-filter',
								showClearButton: true,
								displayMember: 'AddressLine'
							}
						}
					},
					supplierfk: {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									'filterKey': 'prc-order-subcontactor-supplier-filter',
									'showClearButton': true
								}, 'directive': 'business-partner-main-supplier-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'supplier', 'displayMember': 'Code'},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'business-partner-main-supplier-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'filterKey': 'prc-order-subcontactor-supplier-filter',
									'showClearButton': true
								}
							}
						}
					},
					contactfk: {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog',
								'lookupOptions': {'filterKey': 'prc-order-req-contact-filter'},
								'displayMember': 'FullName'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'FullName'},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog',
							'options': {'filterKey': 'prc-order-req-contact-filter', 'displayMember': 'FullName'}
						}
					},
					deliveryaddress:{
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-common-address-complex-control',
								'lookupOptions': {
									foreignKey: 'DeliveryAddressFk',
									titleField: 'cloud.common.entityAddress'
								}
							},
							'formatter': basicsCommonComplexFormatter,
							'formatterOptions': {'displayMember': 'AddressLine'}
						},
						detail: {
							type: 'directive',
							directive: 'procurement-common-address-complex-control',
							options: {
								titleField: 'cloud.common.entityAddress',
								foreignKey: 'DeliveryAddressFk',
								showClearButton: true
							}
						}
					},
					// StockHeaderVDto
					'prjstockfk':{
						'grid': {
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
									'filterKey': 'prc-order-invoice-header-project-filter',
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
									'filterKey': 'prc-order-invoice-header-project-filter'
								}
							}
						},
						'readonly':true
					},
					'stockvaluationrulefk':{
						'grid': {
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
					'currencyfk': {
						'grid': {
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
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							}
						},
						'readonly': true
					},
					'stocktotal':{'readonly':true,formatter: 'money'},
					'stockprovisiontotal':{'readonly':true,formatter: 'money'},
					'stocktotalreceipt':{ detail: {visible:false},'readonly':true,formatter: 'money'},
					'stocktotalconsumed':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'stocktotalvalue':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'stockprovisionreceipt':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'stockprovisionconsumed':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'stocktotalprovision':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'stockexpensetotal':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'stockexpenseconsumed':{detail: {visible:false},'readonly':true,formatter: 'money'},
					'stockexpenses':{detail: {visible:false},'readonly':true,formatter: 'money'}
				},
				'addition':{
					grid:[
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
							'field': 'ClerkFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.stock.header.ClerkDescription',
							'width': 100
						}
					]
				}
			};
		}]);

	/**
	 * @ngdoc service
	 * @name procurementOrderProposalsUIConfigurationService
	 * @function
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('procurementOrderProposalsUIStandardService',
		['platformUIStandardConfigService', 'procurementOrderProposalsTranslationService',
			'procurementOrderProposalsLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function procurementOrderProposalsUIStandardService(platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'OrderProposalDto',
					moduleSubModule: 'Procurement.OrderProposals'
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
})(angular);
