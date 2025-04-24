(function () {
	'use strict';
	var modName = 'procurement.invoice',
		cloudCommonModule = 'cloud.common',
		procurementCommonModule = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(modName).factory('procurementInvoiceContractLayout', ['procurementCommonPrcItemFormatter', 'procurementInvoiceContractDataService', 'basicsLookupdataConfigGenerator', 'procurementInvoiceHeaderDataService',
		'$injector', 'platformLayoutHelperService', 'basicsCommonRoundingService', '_',
		function (prcItemFormatter, procurementInvoiceContractDataService, basicsLookupdataConfigGenerator, parentService, $injector, platformLayoutHelperService, roundingService, _) {

			let basRoundingDataService = roundingService.getService('basics.material');
			let specialPlaces5 = ['Quantity', 'AlternativeQuantity'];

			function roundingByMaterial(field) {
				return basRoundingDataService.getDecimalPlaces(field);
			}

			function getDecimalPlacesOption() {
				return {
					decimalPlaces: function (columnDef, field) {
						return roundingByMaterial(columnDef.roundingField || field);
					}
				};
			}

			function getDecimalPlaces(column, item) {
				let decimalPlaces = 3;
				if (item.PrcBoqFk) {
					if (specialPlaces5.indexOf(column.field) !== -1) {
						decimalPlaces = 5;
					} else {
						decimalPlaces = 2;
					}
				}
				if (item.PrcItemFk) {
					decimalPlaces = roundingByMaterial(column.roundingField || column.field);
				}
				return decimalPlaces;
			}

			function getFormatterOption(row, cell, value, column, item) {
				if (_.isNil(value)) {
					value = 0;
				}
				return '<div class="text-right" >' + value.toFixed(getDecimalPlaces(column, item)) + '</div>';
			}

			function getDomainOption(item, column) {
				let domain = 'decimal';
				let decimalPlaces = getDecimalPlaces(column, item);
				column.editorOptions = {decimalPlaces: decimalPlaces};
				column.formatterOptions = {decimalPlaces: decimalPlaces};
				return domain;
			}


			let layout = {
				'fid': 'procurement.invoice.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'invoiceContract',
						'attributes': ['conheaderfk', 'prcitemfk', 'prcboqfk', 'description',
							'orderquantity', 'uom', 'price', 'basuompriceunit', 'orderquantityconverted', 'priceoc', 'totalprice', 'totalpriceoc', 'lotno', 'prcstocktransactionfk', 'prcstocktransactiontypefk',
							'prjstockfk', 'prjstocklocationfk', 'provisionpercent', 'provisiontotal', 'isassetmanagement', 'controllinggrpsetfk', 'fixedassetfk', 'expirationdate', 'discountsplit', 'discountsplitoc',
							'alternativeuomfk', 'alternativequantity', 'materialstockfk', 'co2project', 'co2projecttotal', 'co2sourcetotal', 'co2source', 'account', 'accountdesc']
					},
					{
						'gid': 'invoiceDelivery',
						'attributes': ['prcstructurefk', 'controllingunitfk', 'quantity', 'totalvalue', 'totalvalueoc', 'totalvaluegross', 'totalvaluegrossoc', 'isfinaldelivery', 'mdcsalestaxgroupfk']
					},
					{
						'gid': 'invoiceOther',
						'attributes': ['commenttext', 'taxcodefk']
					},
					{'gid': 'entityHistory', 'isHistory': true}
				],
				'translationInfos': {
					'extraModules': [procurementCommonModule],
					'extraWords': {
						ConHeaderFk: {location: modName, identifier: 'entityConCode', initial: 'entityConCode'},
						PrcItemFk: {
							location: modName,
							identifier: 'contract.itemTitle',
							initial: 'contract.itemTitle'
						},
						MdcSalesTaxGroupFk: {
							location: cloudCommonModule,
							identifier: 'entityMdcSalesTaxGroup',
							initial: 'Sales Tax Group'
						},
						PrcBoqFk: {
							location: modName,
							identifier: 'contract.boqTitle',
							initial: 'contract.boqTitle'
						},
						OrderQuantity: {
							location: modName,
							identifier: 'contract.orderQuantity',
							initial: 'contract.orderQuantity'
						},
						BasUomPriceUnit: {
							location: cloudCommonModule,
							identifier: 'entityPriceUnitUoM',
							initial: 'Price Unit UoM'
						},
						OrderQuantityConverted: {
							location: modName,
							identifier: 'contract.orderFactoredQuantity',
							initial: 'Factored Order Qty'
						},
						Price: {location: modName, identifier: 'contract.price', initial: 'contract.price'},
						PriceOc: {location: modName, identifier: 'contract.priceOc', initial: 'contract.priceOc'},
						TotalPrice: {
							location: modName,
							identifier: 'contract.totalPrice',
							initial: 'contract.totalPrice'
						},
						TotalPriceOc: {
							location: modName,
							identifier: 'contract.totalPriceOc',
							initial: 'contract.totalPriceOc'
						},
						TotalValueGross: {
							location: procurementCommonModule,
							identifier: 'totalValueGross',
							initial: 'Total Value (Gross)'
						},
						TotalValueGrossOc: {
							location: procurementCommonModule,
							identifier: 'totalValueOcGross',
							initial: 'Total Value (OC)(Gross)'
						},
						TotalValue: {
							location: modName,
							identifier: 'contract.totalValue',
							initial: 'contract.totalValue'
						},
						TotalValueOc: {
							location: modName,
							identifier: 'contract.totalValueOc',
							initial: 'contract.totalValueOc'
						},
						IsFinalDelivery: {
							location: modName,
							identifier: 'contract.finalDelivery',
							initial: 'contract.finalDelivery'
						},
						CommentText: {
							location: cloudCommonModule,
							identifier: 'entityComment',
							initial: 'entityComment'
						},
						Uom: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'entityUoM'},
						invoiceContract: {
							location: modName,
							identifier: 'group.contract',
							initial: 'group.contract'
						},
						invoiceDelivery: {
							location: modName,
							identifier: 'group.delivery',
							initial: 'group.delivery'
						},
						invoiceOther: {location: modName, identifier: 'group.other', initial: 'group.other'},
						PrcStockTransactionTypeFk: {
							location: procurementCommonModule,
							identifier: 'entityPrcStockTransactionType',
							initial: 'Stock Transaction Type'
						},
						PrjStockFk: {
							location: procurementCommonModule,
							identifier: 'entityPrjStock',
							initial: 'Stock'
						},
						PrjStockLocationFk: {
							location: procurementCommonModule,
							identifier: 'entityPrjStockLocation',
							initial: 'Stock Location'
						},
						ProvisionPercent: {
							location: procurementCommonModule,
							identifier: 'entityProvisionPercent',
							initial: 'Provision Percent'
						},
						ProvisionTotal: {
							location: procurementCommonModule,
							identifier: 'entityProvisonTotal',
							initial: 'Provision Total'
						},
						PrcStockTransactionFk: {
							location: procurementCommonModule,
							identifier: 'entityPrcStockTransaction',
							initial: 'Stock Transaction'
						},
						LotNo: {
							location: procurementCommonModule,
							identifier: 'entityLotNo',
							initial: 'Lot No.'
						},
						ExpirationDate: {location: modName, identifier: 'ExpirationDate', initial: 'Expiration Date'},
						IsAssetManagement: {
							location: modName,
							identifier: 'entityIsAssetmanagement',
							initial: 'Is Assetmanagement'
						},
						FixedAssetFk: {
							location: cloudCommonModule,
							identifier: 'entityFixedAsset',
							initial: 'Fixed Asset'
						},
						ControllinggrpsetFk: {
							location: cloudCommonModule,
							identifier: 'entityControllinggrpset',
							initial: 'Controlling grp set'
						},
						DiscountSplit: {
							location: procurementCommonModule,
							identifier: 'DiscountSplitEntity',
							initial: 'Discount Split'
						},
						DiscountSplitOc: {
							location: procurementCommonModule,
							identifier: 'DiscountSplitOcEntity',
							initial: 'Discount Split Oc'
						},
						MaterialStockFk: {
							location: procurementCommonModule,
							identifier: 'prcItemMaterialStockFk',
							initial: 'Stock Material'
						},
						AlternativeUomFk: {
							location: procurementCommonModule,
							identifier: 'AlternativeUom',
							initial: 'Alternative Uom'
						},
						AlternativeQuantity: {
							location: procurementCommonModule,
							identifier: 'AlternativeQuantity',
							initial: 'Alternative Quantity'
						},
						Co2Project: {
							location: modName,
							identifier: 'entityCo2Project',
							initial: 'CO2/kg (Project)'
						},
						Co2ProjectTotal: {
							location: modName,
							identifier: 'entityCo2ProjectTotal',
							initial: 'CO2/kg (Project Total)'
						},
						Co2SourceTotal: {
							location: modName,
							identifier: 'entityCo2SourceTotal',
							initial: 'CO2/kg (Source Total)'
						},
						Co2Source: {
							location: modName,
							identifier: 'entityCo2Source',
							initial: 'CO2/kg (Source)'
						},
						Account: {location: modName, identifier: 'account', initial: 'Account'},
						AccountDesc: {location: modName, identifier: 'accountDesc', initial: 'Account Description'}
					}
				},
				'overloads': {
					'code': {
						'mandatory': true
					},
					'account': {
						readonly: true
					},
					'accountdesc': {
						readonly: true
					},
					'quantity': {
						'grid': {
							'name': 'Quantity',
							'name$tr$': 'procurement.contract.Quantity'
						},
						'detail': {
							'label': 'Quantity',
							'label$tr$': 'procurement.contract.Quantity'
						}
					},
					'prcstructurefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-invoice-procurement-structure-filter'
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-invoice-procurement-structure-filter'
								},
								directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Prcstructure',
								displayMember: 'Code'
							}
						}
					},
					'mdcsalestaxgroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomSalesTaxGroupLookupDataService',
						desMember: 'DescriptionInfo.Translated',
						enableCache: true,
						showClearButton: true,
						filterKey: 'saleTaxCodeByLedgerContext-filter'
					}),
					'statusid': {
						'grid': {
							'editor': '',
							'editorOptions': null,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'ConStatus',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-contract-header-status-combobox',
							'options': {
								readOnly: true
							}
						}
					},
					'controllingunitfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'prc-invoice-controlling-unit-filter',
									showClearButton: true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementInvoiceContractDataService);
									}
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									filterKey: 'prc-invoice-controlling-unit-filter',
									showClearButton: true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementInvoiceContractDataService);
									}
								},
								directive: 'controlling-structure-dialog-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Controllingunit',
								displayMember: 'Code'
							},
							width: 130
						}
					},
					'taxcodefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: false
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: false},
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
					'prcboqfk': {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-merged-boq-lookup',
							'options': {
								showClearButton: true,
								filterKey: 'inv-boq-con-merge-boq-filter'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'inv-boq-con-merge-boq-filter'
								},
								directive: 'procurement-common-merged-boq-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcMergeBoqView',
								displayMember: 'Reference',
								version: 3
							},
							width: 100
						}
					},
					'prcitemfk': {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-item-merged-lookup',
							'options': {
								showClearButton: true,
								filterKey: 'prc-invoice-item-filter'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-invoice-item-filter'
								},
								directive: 'procurement-common-item-merged-lookup'
							},
							// formatter: prcItemFormatter,
							formatter: 'lookup',
							formatterOptions: {
								// create: {
								//     action: procurementInvoiceContractDataService.createOtherContracts
								// },
								lookupType: 'PrcItemMergedLookup',
								displayMember: 'Itemno',
								version: 3
							},
							width: 100
						}
					},
					'conheaderfk': {
						navigator: {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						},
						'detail': {
							'type': 'directive',
							'directive': 'prc-con-header-dialog',
							'options': {
								'filterKey': 'prc-invoice-con-header-filter',
								'showClearButton': false,
								'title': {name: 'cloud.common.dialogTitleContract'}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'prc-con-header-dialog',
								'lookupOptions': {
									'filterKey': 'prc-invoice-con-header-filter',
									'showClearButton': false,
									'title': {name: 'cloud.common.dialogTitleContract'}
								}
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ConHeaderView',
								displayMember: 'Code'
							}
						}
					},
					'basuompriceunit': {
						readonly: true
					},
					'orderquantityconverted': {
						readonly: true
					},
					'prjstockfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'Code',
						filterKey: 'prc-invoice-item-stock-type-filter',
						filter: function (item) {
							var prj = {PKey1: null, PKey2: null, PKey3: null};
							if (item) {
								prj.PKey2 = item.MaterialStockFk||item.MdcMaterialFk;
							} else {
								var headerSelectedItem = parentService.getSelected();
								if (headerSelectedItem) {
									prj.PKey3 = headerSelectedItem.ProjectFk;
								} else {
									prj.PKey3 = 0;
								}
							}
							return prj;
						}
					}),
					/*
					'prjstocklocationfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLocationLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'Code',
						filter: function (item) {
							var prj = {PKey1: null, PKey2: null};
							if (item) {
								prj.PKey1 = item.PrjStockFk;
							} else {
								var headerSelectedItem = parentService.getSelected();
								if (headerSelectedItem) {
									prj.PKey2 = headerSelectedItem.ProjectFk;
								} else {
									prj.PKey2 = 0;
								}
							}
							return prj;
						}
					}),
*/
					'prjstocklocationfk': platformLayoutHelperService.provideProjectStockLocationLookupOverload(null, [{
						'projectFk': 'ProjectFk',
						projectFkReadOnly: false,
						getAdditionalEntity: function (item) {
							let prj = null;
							if (item) {
								let headerSelectedItem = parentService.getSelected();
								if (headerSelectedItem) {
									prj = headerSelectedItem.ProjectFk;
								}
							}
							return {'ProjectFk': prj};
						}
					}, {
						'projectStockFk': 'PrjStockFk',
						projectStockFkReadOnly: false,
						getAdditionalEntity: function (item) {
							return item;
						}
					}]),

					'prcstocktransactiontypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procument-pes-stock-transactiontype-lookup-diaglog',
								'lookupOptions': {
									'filterKey': 'prc-invoice-item-transactiontype-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcStocktransactiontype',
								'valueMember': 'Id',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procument-pes-stock-transactiontype-lookup-diaglog',
							'options': {
								'filterKey': 'prc-invoice-item-transactiontype-filter'
							}
						}

					},
					'prcstocktransactionfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procument-pes-stock-transaction-lookup-diaglog',
								'lookupOptions': {
									'filterKey': 'prc-invoice-transaction-filter',
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcStocktransaction',
								'displayMember': 'MaterialDescription'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procument-pes-stock-transaction-lookup-diaglog',
							'options': {
								'filterKey': 'prc-invoice-transaction-filter',
								'showClearButton': true
							}
						}
					},
					'controllinggrpsetfk': {
						'readonly': true,
						'detail': {
							visible: false
						},
						'grid': {
							field: 'image',
							formatter: 'image',
							formatterOptions: {
								imageSelector: 'controllingStructureGrpSetDTLActionProcessor'
							}
						}
					},
					fixedassetfk: {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-fixed-asset-lookup',
								lookupOptions: {
									filterKey: 'procurement-invoice-item-fixed-asset-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'FixedAsset',
								displayMember: 'Asset'
							},
							width: 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-lookupdata-fixed-asset-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'procurement-invoice-item-fixed-asset-filter',
									showClearButton: true
								}
							}
						}
					},
					'alternativeuomfk': {
						'readonly': true,
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup'
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Uom',
								displayMember: 'Unit'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									isFastDataRecording: true
								}
							},
							width: 100
						}
					},
					'materialstockfk': {
						'readonly': true,
						'detail': {
							'type': 'directive',
							'directive': 'basics-material-material-lookup',
							'options': {
								'showClearButton': true,
								'gridOptions': {
									'multiSelect': true
								}
							},
						},
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'MaterialCommodity',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									'gridOptions': {
										'multiSelect': true
									}
								},
								'directive': 'basics-material-material-lookup'
							},
							'width': 100
						}
					},
					'alternativequantity': {
						readonly: true
					},
					'co2projecttotal': {
						'readonly': true
					},
					'co2sourcetotal': {
						'readonly': true
					},
					'co2source': {
						'readonly': true
					},
					'co2project': {
						'readonly': true
					},
					'totalprice': {
						'roundingField': 'Inv2Con_TotalPrice' // basRoundingType.Amounts
					},
					'totalpriceoc': {
						'roundingField': 'Inv2Con_TotalPriceOc' // basRoundingType.Amounts
					}
				},
				'addition': {
					grid: [
						{
							formatter: 'money',
							field: 'Percentage',
							name: 'Percentage',
							name$tr$: 'procurement.invoice.contract.percentage',
							width: 150,
							readonly: false,
							editor: 'decimal',
							editorOptions: {decimalPlaces: 2},
							formatterOptions: {decimalPlaces: 2}
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ConHeaderFk',
							'name$tr$': 'procurement.invoice.header.conHeaderDes',
							'displayMember': 'Description',
							'width': 180
						},
						{
							lookupDisplayColumn: true,
							field: 'ConHeaderFk',
							displayMember: 'StatusDescriptionInfo.Translated',
							name: 'Status',
							imageSelector: 'platformStatusIconService',
							name$tr$: 'cloud.common.entityStatus',
							width: 100
						},
						{
							lookupDisplayColumn: true,
							field: 'ConHeaderFk',
							name: 'DateOrdered',
							name$tr$: 'procurement.invoice.contract.dateOrdered',
							width: 100,
							'displayMember': 'DateOrdered',
							'lookupDomain': 'dateutc'
						},
						{
							lookupDisplayColumn: true,
							field: 'PrcStructureFk',
							name$tr$: 'cloud.common.entityStructureDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 145
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ControllingUnitFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							'width': 150
						}, {
							'lookupDisplayColumn': true,
							'field': 'TaxCodeFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityTaxCodeDescription',
							'width': 150
						}, {
							'formatter': 'description',
							'field': 'MaterialCode',
							'name': 'Material Code',
							'name$tr$': 'basics.common.entityMaterialCode',
							'width': 150
						}, {
							'afterId': 'materialcode',
							'id': 'MaterialExternalCode',
							'field': 'MaterialExternalCode',
							'name': 'Material External Code',
							'name$tr$': 'procurement.common.prcItemMaterialExternalCode',
							'width': 170
						}, {
							'formatter': 'money',
							'field': 'PriceGross',
							'name': 'Price Gross',
							'name$tr$': 'procurement.common.priceGross',
							'width': 150,
							'editorOptions': {decimalPlaces: 2},
							'formatterOptions': {decimalPlaces: 2}
						}, {
							'formatter': 'money',
							'field': 'PriceOcGross',
							'name': 'Price Gross (OC)',
							'name$tr$': 'procurement.common.priceOcGross',
							'width': 150,
							'editorOptions': {decimalPlaces: 2},
							'formatterOptions': {decimalPlaces: 2}
						}, {
							'formatter': 'money',
							'field': 'PrcItemTotalGross',
							'name': 'Total Gross',
							'name$tr$': 'procurement.common.totalGross',
							'width': 150
						}, {
							'formatter': 'money',
							'field': 'PrcItemTotalGrossOc',
							'name': 'Total Gross (OC)',
							'name$tr$': 'procurement.common.totalOcGross',
							'width': 150
						}, {
							'formatter': 'description',
							'field': 'FurtherDescription',
							'name': 'Further Description',
							'name$tr$': 'procurement.common.prcItemFurtherDescription',
							'width': 150
						},
						{
							lookupDisplayColumn: true,
							field: 'MaterialStockFk',
							name$tr$: 'procurement.common.prcItemMaterialStockDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 150
						}, {
							'formatter': 'description',
							'field': 'PrcItemJobCode',
							'name': 'Job Code',
							'name$tr$': 'procurement.common.jobCode',
							'width': 150
						}, {
							'formatter': 'description',
							'field': 'PrcItemJobDescription',
							'name': 'Job Description',
							'name$tr$': 'procurement.common.jobDescription',
							'width': 150
						}
					],
					detail: [
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'ConHeaderFk',
							label: 'Description',
							label$tr$: 'cloud.common.entityDescription',
							'options': {
								'displayMember': 'Description'
							}
						},
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'ConHeaderFk',
							label: 'Status',
							label$tr$: 'cloud.common.entityStatus',
							'options': {
								'lookupKey': 'prc-invoice-con-header-conheaderfk',
								'displayMember': 'StatusDescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'ConHeaderFk',
							lookupDomain: 'date',
							label: 'Date Ordered',
							label$tr$: 'procurement.invoice.contract.dateOrdered',
							'options': {
								'displayMember': 'DateOrdered',
								formatter: 'dateutc'
							}
						}, {
							afterId: 'furtherdescription',
							rid: 'materialCode',
							gid: 'invoiceContract',
							model: 'MaterialCode',
							label: 'Material Code',
							label$tr$: 'basics.common.entityMaterialCode',
							type: 'description',
							readonly: false
						}, {
							afterId: 'materialcode',
							rid: 'materialexternalcode',
							gid: 'invoiceContract',
							model: 'MaterialExternalCode',
							label: 'Material External Code',
							label$tr$: 'procurement.common.prcItemMaterialExternalCode',
							type: 'description',
							readonly: true
						},
						{
							afterId: 'quantity',
							rid: 'percentage',
							gid: 'invoiceDelivery',
							model: 'Percentage',
							label: 'Percentage',
							label$tr$: 'procurement.invoice.contract.percentage',
							type: 'decimal',
							readonly: false,
							options: {
								decimalPlaces: 2
							}
						}, {
							afterId: 'percentage',
							rid: 'priceGross',
							gid: 'invoiceContract',
							model: 'PriceGross',
							label: 'Price (Gross)',
							label$tr$: 'procurement.common.priceGross',
							type: 'decimal',
							readonly: true
						}, {
							afterId: 'priceGross',
							rid: 'priceOcGross',
							gid: 'invoiceContract',
							model: 'PriceOcGross',
							label: 'Price (Oc)(Gross)',
							label$tr$: 'procurement.common.priceOcGross',
							type: 'decimal',
							readonly: true
						}, {
							afterId: 'priceOcGross',
							rid: 'totalGross',
							gid: 'invoiceContract',
							model: 'PrcItemTotalGross',
							label: 'Total (Gross)',
							label$tr$: 'procurement.common.totalGross',
							type: 'decimal',
							readonly: true
						}, {
							afterId: 'totalGross',
							rid: 'totalOcGross',
							gid: 'invoiceContract',
							model: 'PrcItemTotalGrossOc',
							label: 'Total (Gross OC)',
							label$tr$: 'procurement.common.totalOcGross',
							type: 'decimal',
							readonly: true
						}, {
							afterId: 'materialexternalcode',
							rid: 'FurtherDescription',
							gid: 'invoiceContract',
							model: 'FurtherDescription',
							label: 'Further Description',
							label$tr$: 'procurement.common.prcItemFurtherDescription',
							type: 'description',
							readonly: true
						}, {
							afterId: 'furtherdescription',
							rid: 'prcitemjobcode',
							gid: 'invoiceContract',
							model: 'PrcItemJobCode',
							label: 'Job Code',
							label$tr$: 'procurement.common.jobCode',
							type: 'description',
							readonly: true
						}, {
							afterId: 'prcitemjobcode',
							rid: 'prcitemjobdescription',
							gid: 'invoiceContract',
							model: 'PrcItemJobDescription',
							label: 'Job Description',
							label$tr$: 'procurement.common.jobDescription',
							type: 'description',
							readonly: true
						}]
				}
			};

			let specialConfig = {
				overloads: {
					detail: {
						type: 'decimal',
						options: getDecimalPlacesOption()
					},
					grid: {
						editor: 'decimal',
						formatter: getFormatterOption,
						domain: getDomainOption
					}
				},
				addition: {
					detail: {
						type: 'decimal',
						options: getDecimalPlacesOption()
					},
					grid: {
						editor: 'decimal',
						formatter: getFormatterOption,
						domain: getDomainOption
					}
				}
			};
			basRoundingDataService.uiRoundingConfig(layout, undefined, specialConfig);

			return layout;
		}]
	);

	angular.module(modName).factory('procurementInvoiceContractUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceContractLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'Inv2ContractDto',
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
