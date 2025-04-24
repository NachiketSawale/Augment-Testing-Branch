(function () {
	'use strict';
	/* jshint -W072 */

	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'basics.material';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('basicsMaterialRecordLayout',
		['basicsLookupdataConfigGenerator', 'basicsMaterialRecordService', 'basicsMaterialLookUpItems', 'basicsLookupdataConfigGenerator','basicsCommonRoundingService',
			function (lookupDataToolsService, basicsMaterialRecordService, lookUpItems, basicsLookupdataConfigGenerator,basicsCommonRoundingService) {
				let layout={
					fid: 'basics.material.record.detail',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'basicData',
							'attributes': ['materialcatalogfk', 'materialgroupfk', 'code', 'matchcode', 'descriptioninfo1', 'descriptioninfo2',
								'mdcmaterialabcfk', 'bascurrencyfk', 'uomfk', 'retailprice', 'listprice', 'leadtime', 'minquantity', 'discount', 'charges',
								'prcpriceconditionfk', 'priceextra', 'cost', 'estimateprice', 'dayworkrate', 'priceunit', 'basuompriceunitfk',
								'factorpriceunit', 'factorhour', 'sellunit', 'materialdiscountgroupfk', 'weighttype', 'weightnumber',
								'weight', 'externalcode', 'mdctaxcodefk', 'neutralmaterialcatalogfk', 'mdcmaterialfk', 'agreementfk', 'specificationinfo', 'estcosttypefk', 'leadtimeextra', 'islive', 'isproduct',
								'modelname', 'mdcbrandfk', 'materialtemptypefk', 'materialtempfk', 'basuomweightfk', 'materialtypefk', 'stockmaterialcatalogfk', 'mdcmaterialstockfk','priceextradwrate','priceextraestprice','eangtin','supplier',
								'co2source','basco2sourcefk','co2project','materialstatusfk']
						},
						{
							'gid': 'dangerousGoods',
							'attributes': ['dangerclassfk', 'packagetypefk', 'uomvolumefk', 'volume']
						},
						{
							'gid': 'userDefinedFields',
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5',
								'userdefinedtext1', 'userdefinedtext2', 'userdefinedtext3', 'userdefinedtext4', 'userdefinedtext5',
								'userdefineddate1', 'userdefineddate2', 'userdefineddate3', 'userdefineddate4', 'userdefineddate5',
								'userdefinednumber1', 'userdefinednumber2', 'userdefinednumber3', 'userdefinednumber4', 'userdefinednumber5']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					translationInfos: {
						'extraModules': [moduleName, 'basics.materialcatalog', 'basics.common', 'basics.company'],
						'extraWords': {
							moduleName: {
								location: moduleName,
								identifier: 'moduleName',
								initial: 'Material'
							},
							MaterialCatalogFk: {
								location: moduleName,
								identifier: 'record.materialCatalog',
								initial: 'Material Catalog'
							},
							MaterialGroupFk: {
								location: moduleName,
								identifier: 'record.materialGroup',
								initial: 'Material Group'
							},
							Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
							IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
							MatchCode: {
								location: moduleName,
								identifier: 'record.matchCode',
								initial: 'Match Code1'
							},
							DescriptionInfo1: {
								location: cloudCommonModule,
								identifier: 'entityDescription',
								initial: 'Description'
							},
							DescriptionInfo2: {
								location: moduleName,
								identifier: 'record.furtherDescription',
								initial: 'Description'
							},
							MdcMaterialabcFk: {
								location: moduleName,
								identifier: 'record.aBCGroup',
								initial: 'ABCGroup'
							},
							BasCurrencyFk: {
								location: cloudCommonModule,
								identifier: 'entityCurrency',
								initial: 'Currency'
							},
							UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'Uom'},
							RetailPrice: {
								location: moduleName,
								identifier: 'record.retailPrice',
								initial: 'Retail Price'
							},
							ListPrice: {
								location: moduleName,
								identifier: 'record.listPrice',
								initial: 'List Price'
							},
							Discount: {location: moduleName, identifier: 'record.discount', initial: 'Discount'},
							Charges: {location: moduleName, identifier: 'record.charges', initial: 'Charges'},
							PrcPriceconditionFk: {
								location: cloudCommonModule,
								identifier: 'entityPriceCondition',
								initial: 'Price Condition'
							},
							PriceExtra: {
								location: moduleName,
								identifier: 'record.priceExtras',
								initial: 'Price Extras'
							},
							PriceExtraEstPrice: {
								location: moduleName,
								identifier: 'record.PriceExtraEstPrices',
								initial: 'Price Extra(Estimate Price)'
							},
							EanGtin: {
								location: moduleName,
								identifier: 'record.eanGtin',
								initial: 'EAN / GTIN'
							},
							Supplier: {
								location: moduleName,
								identifier: 'record.supplier',
								initial: 'Supplier'
							},
							PriceExtraDwRate: {
								location: moduleName,
								identifier: 'record.PriceExtraDwRates',
								initial: 'Price Extra(Daywork Rate)'
							},
							Cost: {location: moduleName, identifier: 'record.costPrice', initial: 'Cost Price'},
							EstimatePrice: {
								location: moduleName,
								identifier: 'record.estimatePrice',
								initial: 'Estimate Price'
							},
							DayworkRate: {
								location: moduleName,
								identifier: 'record.dayworkRate',
								initial: 'Daywork Rate'
							},
							PriceUnit: {
								location: cloudCommonModule,
								identifier: 'entityPriceUnit',
								initial: 'Price Unit'
							},
							LeadTime: {
								location: moduleName,
								identifier: 'materialSearchLookup.htmlTranslate.leadTimes',
								initial: 'Lead Time(Days)'
							},
							MinQuantity: {
								location: moduleName,
								identifier: 'record.minQuantity',
								initial: 'Minimum Order Qty'
							},
							BasUomPriceUnitFk: {
								location: cloudCommonModule,
								identifier: 'entityPriceUnitUoM',
								initial: 'Unit UoM'
							},
							FactorPriceUnit: {
								location: cloudCommonModule,
								identifier: 'entityFactor',
								initial: 'Factor'
							},
							FactorHour: {
								location: moduleName,
								identifier: 'record.factorHour',
								initial: 'Hour Factor'
							},
							SellUnit: {location: moduleName, identifier: 'record.sellUnit', initial: 'Sell Unit'},
							MaterialDiscountGroupFk: {
								location: moduleName,
								identifier: 'record.discountGroup',
								initial: 'Discount Group Description'
							},
							WeightType: {
								location: moduleName,
								identifier: 'record.weightType',
								initial: 'Weight Type'
							},
							WeightNumber: {
								location: moduleName,
								identifier: 'record.weightNumber',
								initial: 'Weight Number'
							},
							Weight: {location: moduleName, identifier: 'record.weight', initial: 'Weight'},
							ExternalCode: {
								location: moduleName,
								identifier: 'record.externalCode',
								initial: 'External Code'
							},
							MdcTaxCodeFk: {
								location: cloudCommonModule,
								identifier: 'entityTaxCode',
								initial: 'Code Description'
							},
							NeutralMaterialCatalogFk: {
								location: moduleName,
								identifier: 'record.neutralMaterialCatalog',
								initial: 'Neutral Material Catalog'
							},
							MdcMaterialFk: {
								location: moduleName,
								identifier: 'record.neutralMaterial',
								initial: 'Material Code'
							},
							StockMaterialCatalogFk: {
								location: moduleName,
								identifier: 'record.stockMaterialCatalog',
								initial: 'Stock Material Catalog'
							},
							MdcMaterialStockFk: {
								location: moduleName,
								identifier: 'record.stockMaterial',
								initial: 'Stock Material'
							},
							AgreementFk: {
								location: moduleName,
								identifier: 'record.partnerAgreement',
								initial: 'Partner Agreement'
							},
							SpecificationInfo: {
								location: cloudCommonModule,
								identifier: 'EntitySpec',
								initial: 'Specification'
								// todo:BasBlobsSpecificationFk
							},
							EstCostTypeFk: {
								location: moduleName,
								identifier: 'record.estCostTypeFk',
								initial: 'Cost Type'
							},
							LeadTimeExtra: {
								location: moduleName,
								identifier: 'leadTimeExtra',
								initial: 'Express Lead Time'
							},
							Userdefined1: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 1',
								param: {'p_0': '1'}
							},
							Userdefined2: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 2',
								param: {'p_0': '2'}
							},
							Userdefined3: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 3',
								param: {'p_0': '3'}
							},
							Userdefined4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 4',
								param: {'p_0': '4'}
							},
							Userdefined5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 5',
								param: {'p_0': '5'}
							},
							userDefinedFields: {
								location: moduleName,
								identifier: 'record.entityUserDefinedFields',
								initial: 'User Defined Fields'
							},
							IsProduct: {
								location: moduleName,
								identifier: 'record.isProduct',
								initial: 'Is Product'
							},
							MdcBrandFk: {
								location: moduleName,
								identifier: 'entityMdcBrandFk',
								initial: 'Material Brand'
							},
							ModelName: {
								location: moduleName,
								identifier: 'entityModelName',
								initial: 'modelName'
							},
							UserDefinedText1: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedText',
								initial: 'User Defined Text 1',
								param: {'p_0': '1'}
							},
							UserDefinedText2: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedText',
								initial: 'User Defined Text 2',
								param: {'p_0': '2'}
							},
							UserDefinedText3: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedText',
								initial: 'User Defined Text 3',
								param: {'p_0': '3'}
							},
							UserDefinedText4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedText',
								initial: 'User Defined Text 4',
								param: {'p_0': '4'}
							},
							UserDefinedText5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedText',
								initial: 'User Defined Text 5',
								param: {'p_0': '5'}
							},
							UserDefinedDate1: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedDate',
								initial: 'User Defined Date 1',
								param: {'p_0': '1'}
							},
							UserDefinedDate2: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedDate',
								initial: 'User Defined Date 2',
								param: {'p_0': '2'}
							},
							UserDefinedDate3: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedDate',
								initial: 'User Defined Date 3',
								param: {'p_0': '3'}
							},
							UserDefinedDate4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedDate',
								initial: 'User Defined Date 4',
								param: {'p_0': '4'}
							},
							UserDefinedDate5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedDate',
								initial: 'User Defined Date 5',
								param: {'p_0': '5'}
							},
							UserDefinedNumber1: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedNumber',
								initial: 'User Defined Number 1',
								param: {'p_0': '1'}
							},
							UserDefinedNumber2: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedNumber',
								initial: 'User Defined Number 2',
								param: {'p_0': '2'}
							},
							UserDefinedNumber3: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedNumber',
								initial: 'User Defined Number 3',
								param: {'p_0': '3'}
							},
							UserDefinedNumber4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedNumber',
								initial: 'User Defined Number 4',
								param: {'p_0': '4'}
							},
							UserDefinedNumber5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedNumber',
								initial: 'User Defined Number 5',
								param: {'p_0': '5'}
							},
							MaterialTempTypeFk: {
								location: moduleName,
								identifier: 'record.materialTemplateType',
								initial: 'Template Type'
							},
							MaterialTempFk: {
								location: moduleName,
								identifier: 'record.materialTemplate',
								initial: 'Template'
							},
							dangerousGoods: {
								location: cloudCommonModule,
								identifier: 'entityDangerousGoods',
								initial: 'Dangerous Goods'
							},
							DangerClassFk: {
								location: cloudCommonModule,
								identifier: 'entityDangerClass',
								initial: 'Dangerous Goods Class'
							},
							PackageTypeFk: {
								location: cloudCommonModule,
								identifier: 'entityPackagingType',
								initial: 'Packaging Type'
							},
							UomVolumeFk: {
								location: cloudCommonModule,
								identifier: 'entityUomVolume',
								initial: 'UoM Volume'
							},
							Volume: {
								location: cloudCommonModule,
								identifier: 'entityVolume',
								initial: 'Volume'
							},
							BasUomWeightFk: {
								location: moduleName,
								identifier: 'record.uomWeight',
								initial: 'Weight UoM'
							},
							MaterialTypeFk: {
								location: moduleName,
								identifier: 'record.materialType',
								initial: 'Material Type'
							},
							Co2Source:{
								location: moduleName,
								identifier: 'record.entityCo2Source',
								initial: 'CO2/kg (Source)'
							},
							BasCo2SourceFk:{
								location: moduleName,
								identifier: 'record.entityBasCo2SourceFk',
								initial: 'CO2/kg (Source Name)'
							},
							Co2Project:{
								location: moduleName,
								identifier: 'record.entityCo2Project',
								initial: 'CO2/kg (Project)'
							},
							MaterialStatusFk: {
								location: moduleName,
								identifier: 'record.materialStatus',
								initial: 'Material Status'
							}
						}
					},
					overloads: {
						'islive': {
							'readonly': true
						},
						'specificationinfo': {
							'grid': {
								'maxLength': 2000
							},
							'detail': {
								'maxLength': 2000
							}
						},
						'priceextra': {
							readonly: true,
							'grid': {
								formatter: 'money'
							}
						},
						'priceextradwrate': {
							readonly: true,
							'grid': {
								formatter: 'money'
							}
						},
						'priceextraestprice': {
							readonly: true,
							'grid': {
								formatter: 'money'
							}
						},
						'cost': {
							readonly: true,
							'grid': {
								formatter: 'money'
							}
						},
						'materialcatalogfk': {
							navigator: {
								moduleName: 'basics.materialcatalog'
							},
							'readonly': true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-material-catalog-lookup',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialCatalog',
									displayMember: 'Code'
								}
							}
						},
						'materialgroupfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-material-group-lookup',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-material-material-group-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialGroup',
									displayMember: 'Code'
								}
							}
						},
						'mdcmaterialabcfk': lookupDataToolsService.provideGenericLookupConfig('basics.material.materialabc'),
						'bascurrencyfk': {
							mandatory: true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-currency-combobox',
								'options': {
									lookupOptions: {
										showClearButton: false
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-lookupdata-currency-combobox',
									lookupOptions: {
										showClearButton: false
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'currency',
									displayMember: 'Currency'
								}
							}
						},
						'uomfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-uom-lookup',
								'options': {
									'eagerLoad': true
								}
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
						'prcpriceconditionfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-Material-Price-Condition-Combobox',
								'options': {
									showClearButton: true,
									dataService: 'basicsMaterialPriceConditionDataServiceNew'
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										dataService: 'basicsMaterialPriceConditionDataServiceNew'
									},
									directive: 'basics-Material-Price-Condition-Combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcPricecondition',
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'basuompriceunitfk': {
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
									lookupType: 'Uom',
									displayMember: 'Unit'
								}
							}
						},
						'materialdiscountgroupfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-material-discount-group-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'basics-material-discount-group-filter',
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-material-material-discount-group-lookup',
									lookupOptions: {
										filterKey: 'basics-material-discount-group-filter',
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialDiscountGroup',
									displayMember: 'Code'
								}
							}
						},
						'weighttype': {
							'detail': {
								options: {
									displayMember: 'Description',
									valueMember: 'Id',
									items: lookUpItems.weightType
								}
							},
							'grid': {
								bulkSupport: false,
								editorOptions: {
									displayMember: 'Description',
									valueMember: 'Id',
									items: lookUpItems.weightType
								}
							}
						},
						'weightnumber': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-material-weight-number-combo-box',
								'options': {
									'eagerLoad': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-material-weight-number-combo-box'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'weightNumber',
									displayMember: 'Description'
								}
							}
						},
						'mdctaxcodefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-master-data-context-tax-code-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-master-data-context-tax-code-lookup',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'TaxCode',
									displayMember: 'Code'
								}
							}
						},
						'neutralmaterialcatalogfk': {
							navigator: {
								moduleName: 'basics.materialcatalog'
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-material-catalog-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'basics-material-records-neutral-materialCatalog-filter',
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'basics-material-records-neutral-materialCatalog-filter',
										showClearButton: true
									},
									directive: 'basics-material-material-catalog-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialCatalog',
									displayMember: 'Code'
								}
							}
						},
						'mdcmaterialfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-common-material-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'basics-material-records-neutral-material-filter',
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'basics-material-records-neutral-material-filter',
										showClearButton: true
									},
									directive: 'basics-material-common-material-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialRecord',
									displayMember: 'Code'
								}
							}
						},
						'stockmaterialcatalogfk': {
							navigator: {
								moduleName: 'basics.materialcatalog'
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-material-catalog-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'basics-material-records-stock-materialCatalog-filter',
										showClearButton: true,
										title: {
											'name': 'Stock Material Catalog Search Dialog',
											'name$tr$': 'basics.material.record.stockMaterialCatalogSearchDialog'
										}
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'basics-material-records-stock-materialCatalog-filter',
										showClearButton: true,
										title: {
											'name': 'Stock Material Catalog Search Dialog',
											'name$tr$': 'basics.material.record.stockMaterialCatalogSearchDialog'
										}
									},
									directive: 'basics-material-material-catalog-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialCatalog',
									displayMember: 'Code'
								}
							}
						},
						'mdcmaterialstockfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-common-material-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'basics-material-records-stock-material-filter',
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'basics-material-records-stock-material-filter',
										showClearButton: true
									},
									directive: 'basics-material-common-material-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialRecord',
									displayMember: 'Code'
								}
							}
						},
						'agreementfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-agreement-lookup',
									lookupOptions: {
										filterKey: 'basics-material-records-agreement-filter',
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Agreement',
									displayMember: 'Description'
								},
								width: 120
							},
							'detail': {
								'model': 'AgreementFk',
								'type': 'directive',
								'directive': 'business-partner-main-agreement-lookup',
								'options': {
									filterKey: 'basics-material-records-agreement-filter',
									showClearButton: true
								}
							}
						},
						'estcosttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.costtype', 'Description'),
						'mdcbrandfk': {
							detail: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.material.brand', null, null, false, {}),
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-lookupdata-simple',
									lookupOptions: {
										displayMember: 'Description',
										lookupModuleQualifier: 'basics.material.brand',
										lookupType: 'basics.material.brand',
										showClearButton: true,
										valueMember: 'Id'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'Description',
									lookupModuleQualifier: 'basics.material.brand',
									lookupType: 'basics.material.brand',
									lookupSimpleLookup: true,
									valueMember: 'Id'
								}
							}
						},
						'materialtemptypefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-material-material-temp-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'materialtemptype',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 120
							},
							'detail': {
								'model': 'MaterialTempTypeFk',
								'type': 'directive',
								'directive': 'basics-material-material-temp-type-combobox'
							}
						}, // lookupDataToolsService.provideGenericLookupConfig('basics.customize.materialtemplatetype'),
						'materialtempfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-common-material-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'basics-material-records-material-template-filter',
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'basics-material-records-material-template-filter',
										showClearButton: true
									},
									directive: 'basics-material-common-material-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialRecord',
									displayMember: 'Code'
								}
							}
						},
						dangerclassfk: {
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										disableInput: true
									},
									directive: 'basics-lookupdata-danger-class-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'dangerclass',
									displayMember: 'Code'
								}
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookupdata-danger-class-combobox',
									descriptionMember: 'DescriptionInfo.Translated',
									eagerLoad: true
								}
							}
						},
						packagetypefk: {
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										disableInput: true
									},
									directive: 'basics-lookupdata-packaging-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PackagingType',
									displayMember: 'DescriptionInfo.Translated'
								}
							},
							detail: {
								'type': 'directive',
								'directive': 'basics-lookupdata-packaging-type-combobox',
								'options': {
									'eagerLoad': true
								}
							}
						},
						uomvolumefk: {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-uom-lookup',
								'options': {
									'eagerLoad': true
								}
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
						basuomweightfk: {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-uom-lookup',
								'options': {
									filterKey: 'basics-material-weight-uom-filter',
									showClearButton: true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-lookupdata-uom-lookup',
									lookupOptions: {
										filterKey: 'basics-material-weight-uom-filter',
										showClearButton: true,
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
						materialtypefk: lookupDataToolsService.provideGenericLookupConfig('basics.customize.materialtype'),
						co2source:{
							readonly: true
						},
						basco2sourcefk: {
							readonly: true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-source-name-lookup',
								'options': {
									version: 3,
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-lookupdata-source-name-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'co2sourcename',
									displayMember: 'DescriptionInfo.Translated',
									version: 3,
								}
							}
						},
						materialstatusfk: {
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'material-status-combobox',
								'options': {
									readOnly: true,
									imageSelector: 'platformStatusIconService'
								}
							},
							readonly: true
						},
					},
					addition: {
						grid: [
							{
								formatter: 'money',
								field: 'CostPriceGross',
								name: 'Cost Price (Gross)',
								name$tr$: 'basics.material.record.costPriceGross',
								width: 150,
								editor: 'decimal',
								editorOptions: {decimalPlaces: 2},
								formatterOptions: {decimalPlaces: 2}
							},
							{
								lookupDisplayColumn: true,
								field: 'MaterialCatalogFk',
								name$tr$: 'basics.material.record.materialCatalogDescription',
								displayMember: 'DescriptionInfo.Translated',
								width: 150
							},
							{
								lookupDisplayColumn: true,
								field: 'MaterialGroupFk',
								name$tr$: 'basics.material.record.materialGroupDescription',
								displayMember: 'DescriptionInfo.Translated',
								width: 150
							},
							{
								lookupDisplayColumn: true,
								field: 'MaterialDiscountGroupFk',
								name$tr$: 'basics.material.record.discountGroupDescription',
								displayMember: 'DescriptionInfo.Translated',
								width: 150
							},
							{
								lookupDisplayColumn: true,
								field: 'MdcTaxCodeFk',
								name$tr$: 'cloud.common.entityTaxCodeDescription',
								displayMember: 'DescriptionInfo.Translated',
								width: 150
							},
							{
								lookupDisplayColumn: true,
								field: 'MdcMaterialFk',
								name$tr$: 'basics.material.record.neutralMaterialDescription',
								displayMember: 'DescriptionInfo.Translated',
								width: 150
							},
							{
								lookupDisplayColumn: true,
								field: 'MaterialTempFk',
								name$tr$: 'basics.material.record.materialTemplateDescription',
								displayMember: 'DescriptionInfo.Translated',
								width: 150
							},
							{
								lookupDisplayColumn: true,
								field: 'DangerClassFk',
								name: 'Dangerous Goods Class Description',
								name$tr$: 'cloud.common.DangerClassDescription',
								displayMember: 'DescriptionInfo.Translated',
								width: 150
							},
							{
								lookupDisplayColumn: true,
								field: 'MdcMaterialStockFk',
								name$tr$: 'basics.material.record.stockMaterialDescription',
								displayMember: 'DescriptionInfo.Translated',
								width: 150
							},
							{
								lookupDisplayColumn: true,
								field: 'StockMaterialCatalogFk',
								name$tr$: 'basics.material.record.stockMaterialCatalogDescription',
								displayMember: 'DescriptionInfo.Translated',
								width: 150
							}
						],
						detail: [
							{
								afterId: 'estimateprice',
								rid: 'costPriceGross',
								gid: 'basicData',
								model: 'CostPriceGross',
								label: 'Cost Price (Gross)',
								label$tr$: 'basics.material.record.costPriceGross',
								type: 'decimal',
								readonly: false,
								options: {
									decimalPlaces: 2
								}
							}
						]
					}
				};

				basicsCommonRoundingService.getService('basics.material').uiRoundingConfig(layout);

				return layout;
			}]);

	angular.module(moduleName).factory('basicsMaterialRecordUIConfigurationService',
		['platformUIStandardConfigService', 'basicsMaterialTranslationService', 'basicsMaterialLookUpItems',
			'basicsMaterialRecordLayout', 'platformSchemaService', 'platformUIStandardExtentService','basicsMaterialRecordService',

			function (platformUIStandardConfigService, translationService, mterialLookUpItems,
				layout, platformSchemaService, platformUIStandardExtentService,basicsMaterialRecordService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialDto',
					moduleSubModule: 'Basics.Material'
				});

				if (domainSchema.properties && domainSchema.properties.BasCurrencyFk) {
					angular.extend(domainSchema.properties.BasCurrencyFk, {mandatory: true});
				}

				if (domainSchema.properties && domainSchema.properties.Code) {
					var length = basicsMaterialRecordService.materialCodeLimitLength;
					if (length){
						angular.extend(domainSchema.properties.Code, {maxlen: length});
					}
				}

				function MaterialUIStandardService(layout, schema, translateService) {
					BaseService.call(this, layout, schema, translateService);
				}

				MaterialUIStandardService.prototype = Object.create(BaseService.prototype);
				MaterialUIStandardService.prototype.constructor = MaterialUIStandardService;

				var service = new MaterialUIStandardService(layout, domainSchema.properties, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema.properties);
				return service;
			}
		]);
})();
