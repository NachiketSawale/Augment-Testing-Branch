// eslint-disable-next-line no-redeclare
/* global angular */
(function () {
	'use strict';
	var modName = 'procurement.stock';
	var cloudCommonModule = 'cloud.common';
	angular.module(modName).factory('procurementStockOrderProposalLayout', [
		function () {

			return {
				'fid': 'procurement.stock.orderproposal',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [
							'prcconfigurationfk', 'basclerkprcfk', 'basclerkreqfk', 'prcpackagefk', 'description',
							'bpdbusinesspartnerfk', 'bpdsubsidiaryfk', 'bpdsupplierfk', 'bpdcontactfk', 'islive', 'leadtime', 'tolerance', 'log',
							'deliveryaddressfk', 'proposedquantity'
						]
					},
					{
						'gid': 'StockTotal',
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
					'extraModules': [modName, cloudCommonModule, 'basics.common', 'basics.procurementstructure'],
					'extraWords': {
						'StockTotal': {location: modName, identifier: 'title.stocktotal', initial: 'Stock Total'},
						PrcStructureFk: {location: modName, identifier: 'stocktotal.PrcStructure', initial: 'Structure'},
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
						reconciliation: {location: modName, identifier: 'group.reconciliation', initial: 'Reconciliation'},
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
						PendingQuantity: {location: modName, identifier: 'stocktotal.PendingQuantity', initial: 'Pending Quantity'},
						TotalQuantityByPending: {location: modName, identifier: 'stocktotal.TotalQuantityByPending', initial: 'Total Quantity(Pending)'},
						PrcConfigurationFk: {location: modName, identifier: 'orderProposal.Configuration', initial: 'Configuration'},
						BasClerkPrcFk: {location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible'},
						BasClerkReqFk: {location: cloudCommonModule, identifier: 'entityRequisitionOwner', initial: 'Requisition Owner'},
						PrcPackageFk: {location: cloudCommonModule, identifier: 'entityPackage', initial: 'Package'},
						Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
						BpdBusinessPartnerFk: {location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner'},
						BpdSubsidiaryFk: {location: cloudCommonModule, identifier: 'entitySubsidiary', initial: 'Subsidiary'},
						BpdSupplierFk: {location: cloudCommonModule, identifier: 'entitySupplierDescription', initial: 'Supplier'},
						BpdContactFk: {location: modName, identifier: 'Contact', initial: 'Contact'},
						IsLive: {location: modName, identifier: 'orderProposal.IsLive', initial: 'IsLive'},
						LeadTime: {location: modName, identifier: 'orderProposal.LeadTime', initial: 'LeadTime'},
						Tolerance: {location: modName, identifier: 'orderProposal.Tolerance', initial: 'Tolerance'},
						Log: {location: modName, identifier: 'orderProposal.Log', initial: 'Log'},
						DeliveryAddressFk: {location: modName, identifier: 'orderProposal.DeliveryAddress', initial: 'Delivery Address'},
						ProposedQuantity: {location: modName, identifier: 'orderProposal.ProposedQuantity', initial: 'Proposed Quantity'}
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
								filterKey: 'prc-invoice-configuration-filter'
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
									filterKey: 'prc-pes-configuration-filter'
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
							}
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
							}
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
									filterKey: 'prc-con-package-filter-for-order-proposal',
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
									'filterKey': 'prc-con-package-filter-for-order-proposal'
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
					bpdbusinesspartnerfk: {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'business-partner-main-business-partner-dialog',
								lookupOptions: {}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog',
							'options': {
								'displayMember': 'BusinessPartnerName1'
							}
						}
					},
					bpdsubsidiaryfk: {
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
									filterKey: 'businesspartner-main-evaluation-subsidiary-filter',
									showClearButton: true,
									displayMember: 'AddressLine'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								filterKey: 'businesspartner-main-evaluation-subsidiary-filter',
								showClearButton: true,
								displayMember: 'AddressLine'
							},
							'model': 'SubsidiaryFk'
						}
					},
					bpdsupplierfk: {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									'filterKey': 'prc-subcontactor-supplier-filter',
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
									'filterKey': 'prc-subcontactor-supplier-filter',
									'showClearButton': true
								}
							}
						}
					},
					bpdcontactfk: {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog',
								'lookupOptions': {'filterKey': 'prc-req-contact-filter'},
								'displayMember': 'FamilyName'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'contact', 'displayMember': 'FamilyName'},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog',
							'options': {'filterKey': 'prc-req-contact-filter', 'displayMember': 'FamilyName'}
						}
					},
					deliveryaddressfk: {
						detail: {
							type: 'directive',
							directive: 'basics-common-address-dialog',
							model: 'DeliveryAddress',
							options: {
								titleField: 'cloud.common.entityAddress',
								foreignKey: 'DeliveryAddressFk',
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							field: 'DeliveryAddress',
							editorOptions: {
								lookupDirective: 'basics-common-address-dialog',
								'lookupOptions': {
									foreignKey: 'DeliveryAddressFk',
									titleField: 'cloud.common.entityAddress'
								}
							}
						}
					}
				}
			};
		}]);

	angular.module(modName).factory('procurementStockOrderProposalUIStandardService',
		['platformUIStandardConfigService', 'procurementStockTranslationService',
			'procurementStockOrderProposalLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrjStockOrderProposalDto',
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
