(function() {
	'use strict';

	angular.module('basics.material').service('materialUiConfigurationService', [function(){

		var serviceFactory = {};

		//basicsMaterialTranslationService will lose focus in grid
		/*
                serviceFactory.createUIService = function(options) {
                    var newCreatedUIService = {};
                    platformUIConfigInitService.createUIConfigurationService({
                        service: newCreatedUIService,
                        layout: basicsMaterialRecordLayout,
                        dtoSchemeId: {typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
                        translator: basicsMaterialTranslationService
                    });
                    return newCreatedUIService;
                };
                */


		serviceFactory.layout = [{
			directive: 'basics-lookupdata-lookup-composite',
			gid: 'basicData',
			label: 'Material Catalog',
			label$tr$: 'basics.material.record.materialCatalog',
			model: 'MaterialCatalogFk',
			options: {
				descriptionMember: 'DescriptionInfo.Translated',
				lookupDirective: 'basics-material-material-catalog-lookup'
			},
			readonly: true,
			rid: 'materialcatalogfk',
			sortOrder: 1,
			type: 'directive',
		}, {
			directive: 'basics-lookupdata-lookup-composite',
			gid: 'basicData',
			label: 'Neutral Material Catalog',
			label$tr$: 'basics.material.record.neutralMaterialCatalog',
			model: 'NeutralMaterialCatalogFk',
			options: {
				lookupDirective: 'basics-material-material-catalog-lookup',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					filterKey: 'basics-material-records-neutral-materialCatalog-filter',
					showClearButton: true
				}
			},
			readonly: false,
			rid: 'neutralmaterialcatalogfk',
			sortOrder: 31,
			type: 'directive'
		}, {
			gid: 'basicData',
			label: 'Code',
			label$tr$: 'cloud.common.entityCode',
			mandatory: true,
			model: 'Code',
			readonly: false,
			regex: '^[\\s\\S]{0,20}$',
			required: true,
			rid: 'code',
			sortOrder: 3,
			type: 'code'
		}, {
			gid: 'basicData',
			label: 'Match Code',
			label$tr$: 'basics.material.record.matchCode',
			maxLength: 42,
			model: 'MatchCode',
			readonly: false,
			rid: 'matchcode',
			sortOrder: 4,
			type: 'description',
		}, {
			gid: 'basicData',
			label: 'Description',
			label$tr$: 'cloud.common.entityDescription',
			model: 'DescriptionInfo1',
			readonly: false,
			rid: 'descriptioninfo1',
			sortOrder: 5,
			type: 'translation'
		}, {
			gid: 'basicData',
			label: 'Further Description',
			label$tr$: 'basics.material.record.furtherDescription',
			model: 'DescriptionInfo2',
			readonly: false,
			rid: 'descriptioninfo2',
			sortOrder: 6,
			type: 'translation',
		}, {
			directive: 'basics-lookupdata-currency-combobox',
			gid: 'basicData',
			label: 'Currency',
			label$tr$: 'cloud.common.entityCurrency',
			model: 'BasCurrencyFk',
			options: {
				lookupOptions: {
					showClearButton: false
				}
			},
			readonly: false,
			rid: 'bascurrencyfk',
			sortOrder: 8,
			type: 'directive'
		}, {
			gid: 'basicData',
			label: 'Retail Price',
			label$tr$: 'basics.material.record.retailPrice',
			model: 'RetailPrice',
			readonly: false,
			required: true,
			rid: 'retailprice',
			sortOrder: 10,
			type: 'money'
		}, {
			gid: 'basicData',
			label: 'List Price',
			label$tr$: 'basics.material.record.listPrice',
			model: 'ListPrice',
			readonly: false,
			required: true,
			rid: 'listprice',
			sortOrder: 11,
			type: 'money'
		}, {
			gid: 'basicData',
			label: 'Discount %',
			label$tr$: 'basics.material.record.discount',
			model: 'Discount',
			readonly: false,
			required: true,
			rid: 'discount',
			sortOrder: 14,
			type: 'money',
		}, {
			gid: 'basicData',
			label: 'Charges',
			label$tr$: 'basics.material.record.charges',
			model: 'Charges',
			readonly: false,
			required: true,
			rid: 'charges',
			sortOrder: 15,
			type: 'money'
		},
		{
			gid: 'basicData',
			grid: {
				formatter: 'money',
				required: true
			},
			label: 'Cost Price Gross',
			label$tr$: 'basics.material.record.costPriceGross',
			model: 'CostPriceGross',
			readonly: false,
			rid: 'cost',
			sortOrder: 18,
			type: 'money'
		},
		{
			gid: 'basicData',
			grid: {
				formatter: 'money',
				required: true
			},
			label: 'Cost Price',
			label$tr$: 'basics.material.record.costPrice',
			model: 'Cost',
			readonly: true,
			required: true,
			rid: 'cost',
			sortOrder: 18,
			type: 'money'
		}, {
			gid: 'basicData',
			label: 'Estimate Price',
			label$tr$: 'basics.material.record.estimatePrice',
			model: 'EstimatePrice',
			readonly: false,
			required: true,
			rid: 'estimateprice',
			sortOrder: 19,
			type: 'money'
		}, {
			gid: 'basicData',
			label: 'Price Unit',
			label$tr$: 'cloud.common.entityPriceUnit',
			model: 'PriceUnit',
			readonly: false,
			required: true,
			rid: 'priceunit',
			sortOrder: 20,
			type: 'quantity'
		}, {
			directive: 'basics-lookupdata-uom-lookup',
			gid: 'basicData',
			label: 'Price Unit UoM',
			label$tr$: 'cloud.common.entityPriceUnitUoM',
			model: 'BasUomPriceUnitFk',
			readonly: false,
			required: true,
			rid: 'basuompriceunitfk',
			sortOrder: 21,
			type: 'directive'
		}, {
			gid: 'basicData',
			grid: {
				formatter: 'money',
				required: true
			},
			label: 'Extras',
			label$tr$: 'asics.material.record.priceExtras',
			model: 'PriceExtra',
			readonly: true,
			required: true,
			rid: 'priceextra',
			sortOrder: 17,
			type: 'money'
		}, {
			gid:'basicData',
			label: 'Factor',
			label$tr$: 'cloud.common.entityFactor',
			model: 'FactorPriceUnit',
			readonly: false,
			rid: 'factorpriceunit',
			sortOrder: 22,
			type: 'factor',
		}, {
			gid: 'basicData',
			label: 'Sell Unit',
			label$tr$: 'basics.material.record.sellUnit',
			model: 'SellUnit',
			readonly: false,
			required: true,
			rid: 'sellunit',
			sortOrder: 24,
			type: 'quantity'
		}, {
			directive: 'basics-lookupdata-lookup-composite',
			gid: 'basicData',
			label: 'Discount Group',
			label$tr$: 'basics.material.record.discountGroup',
			model: 'MaterialDiscountGroupFk',
			options: {
				lookupDirective: 'basics-material-material-discount-group-lookup',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					descriptionMember: 'DescriptionInfo.Translated',
					lookupDirective: 'basics-material-material-discount-group-lookup',
					filterKey: 'basics-material-discount-group-filter',
					showClearButton: true
				}
			},
			readonly: false,
			rid: 'materialdiscountgroupfk',
			sortOrder: 25,
			type: 'directive'
		}, {
			gid: 'basicData',
			label: 'Weight Type',
			label$tr$: 'basics.material.record.weightType',
			model: 'WeightType',
			options: {
				displayMember: 'Description',
				valueMember: 'Id',
				items: [{
					Id: 0,
					Description: 'Gross',
					Description$tr$: 'basics.material.lookup.gross'
				},{
					Id: 1,
					Description: 'Net',
					Description$tr$: 'basics.material.lookup.net'
				},{
					Id: 2,
					Description: 'Packaging',
					Description$tr$: 'basics.material.lookup.packaging'
				}]
			},
			readonly: false,
			required: true,
			rid: 'weighttype',
			sortOrder: 26,
			type: 'select'
		}, {
			directive: 'basics-material-weight-number-combo-box',
			gid: 'basicData',
			label: 'Weight Number',
			label$tr$: 'basics.material.record.weightNumber',
			model: 'WeightNumber',
			options: {
				eagerLoad: true
			},
			readonly: false,
			required: true,
			rid: 'weightnumber',
			sortOrder: 27,
			type: 'directive'
		}, {
			gid: 'basicData',
			label: 'Weight',
			label$tr$: 'basics.material.record.weight',
			model: 'Weight',
			readonly: false,
			required: true,
			rid: 'weight',
			sortOrder: 28,
			type: 'quantity'
		}, {
			directive: 'basics-lookupdata-lookup-composite',
			gid: 'basicData',
			label: 'Tax Code',
			label$tr$: 'cloud.common.entityTaxCode',
			model: 'MdcTaxCodeFk',
			options: {
				lookupDirective: 'basics-master-data-context-tax-code-lookup',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					showClearButton: true
				}
			},
			readonly: false,
			rid: 'mdctaxcodefk',
			sortOrder: 30,
			type: 'directive'
		}, {
			directive: 'basics-lookupdata-uom-lookup',
			gid: 'basicData',
			label: 'UoM',
			label$tr$: 'cloud.common.entityUoM',
			model: 'UomFk',
			options: {
				eagerLoad: true
			},
			readonly: false,
			required: true,
			rid: 'uomfk',
			sortOrder: 9,
			type: 'directive'
		}, {
			directive: 'basics-lookupdata-lookup-composite',
			gid: 'basicData',
			label: 'Material Group',
			label$tr$: 'basics.material.record.materialGroup',
			model: 'MaterialGroupFk',
			options: {
				lookupDirective: 'basics-material-material-group-lookup',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					filterKey: 'basics-material-group-filter'
				}
			},
			readonly: false,
			required: true,
			rid: 'materialgroupfk',
			sortOrder: 2,
			type: 'directive'
		}, {
			directive: 'basics-Material-Price-Condition-Combobox',
			gid: 'basicData',
			label: 'Price Condition',
			label$tr$: 'cloud.common.entityPriceCondition',
			label$tr$param$: undefined,
			model: 'PrcPriceconditionFk',
			options: {
				showClearButton: true,
				dataService: 'basicsMaterialPriceConditionDataServiceNew'
			},
			readonly: false,
			rid: 'prcpriceconditionfk',
			sortOrder: 16,
			type: 'directive'
		}, {
			directive: 'business-partner-main-agreement-lookup',
			gid: 'basicData',
			label: 'Partner Agreement',
			label$tr$: 'basics.material.record.partnerAgreement',
			label$tr$param$: undefined,
			model: 'AgreementFk',
			options: {
				filterKey: 'basics-material-records-agreement-filter',
				showClearButton: true
			},
			readonly: false,
			rid: 'agreementfk',
			sortOrder: 33,
			type: 'directive'
		}, {
			directive: 'basics-lookupdata-lookup-composite',
			gid: 'basicData',
			label: 'Neutral Material',
			label$tr$: 'basics.material.record.neutralMaterial',
			label$tr$param$: undefined,
			model: 'MdcMaterialFk',
			options: {
				lookupDirective: 'basics-material-common-material-lookup',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					filterKey: 'basics-material-records-prc-neutral-material-filter',
					showClearButton: true
				}
			},
			readonly: false,
			rid: 'mdcmaterialfk',
			sortOrder: 32,
			type: 'directive'
		}, {
			gid: 'basicData',
			label: 'External Code ',
			label$tr$: 'basics.material.record.externalCode',
			label$tr$param$: undefined,
			maxLength: 42,
			model: 'ExternalCode',
			readonly: false,
			rid: 'externalcode',
			sortOrder: 29,
			type: 'description'
		}, {
			directive: 'basics-lookupdata-simple',
			gid: 'basicData',
			label: 'ABC Group',
			label$tr$: 'basics.material.record.aBCGroup',
			label$tr$param$: undefined,
			model: 'MdcMaterialabcFk',
			options: {
				lookupType: 'basics.material.materialabc',
				eagerLoad: true,
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'basics.material.materialabc',
				showClearButton: false
			},
			readonly: false,
			required: true,
			rid: 'mdcmaterialabcfk',
			sortOrder: 7,
			type: 'directive'
		}, {
			gid: 'basicData',
			label: 'Lead Time(Days)',
			label$tr$: 'basics.material.materialSearchLookup.htmlTranslate.leadTimes',
			label$tr$param$: undefined,
			model: 'LeadTime',
			readonly: false,
			required: true,
			rid: 'leadtime',
			sortOrder: 12,
			type: 'quantity'
		}, {
			gid: 'basicData',
			label: 'Minimum Quantity',
			label$tr$: 'project.stock.minQuantity',
			label$tr$param$: undefined,
			model: 'MinQuantity',
			readonly: false,
			required: true,
			rid: 'minquantity',
			sortOrder: 13,
			type: 'quantity'
		}, {
			directive: 'basics-lookupdata-simple',
			gid: 'basicData',
			label: 'Cost Type',
			label$tr$: 'basics.material.record.estCostTypeFk',
			model: 'EstCostTypeFk',
			options: {
				lookupType: 'estimate.lookup.costtype',
				eagerLoad: true,
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'estimate.lookup.costtype',
				showClearButton: false
			},
			readonly: false,
			rid: 'estcosttypefk',
			sortOrder: 35,
			type: 'directive'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined 1',
			label$tr$: 'cloud.common.entityUserDefined',
			label$tr$param$: {
				'p_0': '1'
			},
			maxLength: 42,
			model: 'Userdefined1',
			readonly: false,
			rid: 'userdefined1',
			sortOrder: 1,
			type: 'description'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined 2',
			label$tr$: 'cloud.common.entityUserDefined',
			label$tr$param$: {
				'p_0': '2'
			},
			maxLength: 42,
			model: 'Userdefined2',
			readonly: false,
			rid: 'userdefined2',
			sortOrder: 2,
			type: 'description'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined 3',
			label$tr$: 'cloud.common.entityUserDefined',
			label$tr$param$: {
				'p_0': '3'
			},
			maxLength: 42,
			model: 'Userdefined3',
			readonly: false,
			rid: 'userdefined3',
			sortOrder: 3,
			type: 'description'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined 4',
			label$tr$: 'cloud.common.entityUserDefined',
			label$tr$param$: {
				'p_0': '4'
			},
			maxLength: 42,
			model: 'Userdefined4',
			readonly: false,
			rid: 'userdefined4',
			sortOrder: 4,
			type: 'description'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined 5',
			label$tr$: 'cloud.common.entityUserDefined',
			label$tr$param$: {
				'p_0': '5'
			},
			maxLength: 42,
			model: 'Userdefined5',
			readonly: false,
			rid: 'userdefined5',
			sortOrder: 5,
			type: 'description'
		}, {
			gid: 'basicData',
			label: 'Express Lead Time',
			label$tr$: 'basics.material.leadTimeExtra',
			label$tr$param$: undefined,
			model: 'LeadTimeExtra',
			readonly: false,
			required: true,
			rid: 'leadtimeextra',
			sortOrder: 36,
			type: 'quantity'
		}, {
			gid: 'basicData',
			label: 'Specification',
			label$tr$: 'cloud.common.EntitySpec',
			label$tr$param$: undefined,
			maxLength: 2000,
			model: 'SpecificationInfo',
			readonly: false,
			rid: 'specificationinfo',
			sortOrder: 34,
			type: 'translation'
		}, {
			gid: 'basicData',
			label: 'Hour Factor',
			label$tr$: 'basics.material.record.factorHour',
			label$tr$param$: undefined,
			model: 'FactorHour',
			readonly: false,
			required: true,
			rid: 'factorhour',
			sortOrder: 23,
			type: 'factor'
		}, {
			gid: 'basicData',
			label: 'Active',
			label$tr$: 'cloud.common.entityIsLive',
			label$tr$param$: undefined,
			model: 'IsLive',
			readonly: true,
			required: true,
			rid: 'islive',
			sortOrder: 37,
			type: 'boolean'
		}, {
			gid: 'basicData',
			label: 'Is Product',
			label$tr$: 'basics.material.record.isProduct',
			label$tr$param$: undefined,
			model: 'IsProduct',
			readonly: false,
			required: true,
			rid: 'isproduct',
			sortOrder: 38,
			type: 'boolean'
		}, {
			directive: 'basics-lookupdata-simple',
			gid: 'basicData',
			label: 'Material Brand',
			label$tr$: 'cloud.common.entityMdcBrandFk',
			label$tr$param$: undefined,
			model: 'MdcBrandFk',
			readonly: false,
			rid: 'mdcbrandfk',
			type: 'directive',
			sortOrder: 40,
			options: {
				displayMember: 'Description',
				eagerLoad: true,
				lookupModuleQualifier: 'basics.material.brand',
				lookupType: 'basics.material.brand',
				showClearButton: true,
				valueMember: 'Id'
			}
		}, {
			gid: 'basicData',
			label: 'modelName',
			label$tr$: 'basics.material.entityModelName',
			label$tr$param$: undefined,
			maxLength: 42,
			model: 'ModelName',
			readonly: false,
			rid: 'modelname',
			sortOrder: 39,
			type: 'description'
		},
			{
				gid: 'basicData',
				label: 'CO2/kg (Project)',
				label$tr$: 'basics.material.record.entityCo2Project',
				model: 'Co2Project',
				readonly: false,
				rid: 'co2project',
				sortOrder: 41,
				type: 'money'
			},
			{
				gid: 'basicData',
				label: 'CO2/kg (Source)',
				label$tr$: 'basics.material.record.entityCo2Source',
				model: 'Co2Source',
				readonly: true,
				rid: 'co2source',
				sortOrder: 42,
				type: 'money'
			},{
				directive: 'basics-lookupdata-source-name-lookup',
				gid: 'basicData',
				label: 'CO2/kg (Source Name)',
				label$tr$: 'basics.material.record.entityBasCo2SourceFk',
				model: 'BasCo2SourceFk',
				readonly: true,
				rid: 'basco2sourcefk',
				type: 'directive',
				sortOrder: 43,
				options: {
					version: 3
				}
			},{
			gid: 'userDefinedFields',
			label: 'User Defined Text 1',
			label$tr$: 'cloud.common.entityUserDefinedText',
			label$tr$param$: {
				'p_0': '1'
			},
			maxLength: 42,
			model: 'UserDefinedText1',
			readonly: false,
			rid: 'userdefinedtext1',
			sortOrder: 6,
			type: 'description'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Text 2',
			label$tr$: 'cloud.common.entityUserDefinedText',
			label$tr$param$: {
				'p_0': '2'
			},
			maxLength: 42,
			model: 'UserDefinedText2',
			readonly: false,
			rid: 'userdefinedtext2',
			sortOrder: 7,
			type: 'description'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Text 3',
			label$tr$: 'cloud.common.entityUserDefinedText',
			label$tr$param$: {
				'p_0': '3'
			},
			maxLength: 42,
			model: 'UserDefinedText3',
			readonly: false,
			rid: 'userdefinedtext3',
			sortOrder: 8,
			type: 'description'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Text 4',
			label$tr$: 'cloud.common.entityUserDefinedText',
			label$tr$param$: {
				'p_0': '4'
			},
			maxLength: 42,
			model: 'UserDefinedText4',
			readonly: false,
			rid: 'userdefinedtext4',
			sortOrder: 9,
			type: 'description'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Text 5',
			label$tr$: 'cloud.common.entityUserDefinedText',
			label$tr$param$: {
				'p_0': '5'
			},
			maxLength: 42,
			model: 'UserDefinedText5',
			readonly: false,
			rid: 'userdefinedtext5',
			sortOrder: 10,
			type: 'description'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Date 1',
			label$tr$: 'cloud.common.entityUserDefinedDate',
			label$tr$param$: {
				'p_0': '1'
			},
			model: 'UserDefinedDate1',
			readonly: false,
			rid: 'userdefineddate1',
			sortOrder: 11,
			type: 'dateutc'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Date 2',
			label$tr$: 'cloud.common.entityUserDefinedDate',
			label$tr$param$: {
				'p_0': '2'
			},
			model: 'UserDefinedDate2',
			readonly: false,
			rid: 'userdefineddate2',
			sortOrder: 12,
			type: 'dateutc'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Date 3',
			label$tr$: 'cloud.common.entityUserDefinedDate',
			label$tr$param$: {
				'p_0': '3'
			},
			model: 'UserDefinedDate3',
			readonly: false,
			rid: 'userdefineddate3',
			sortOrder: 13,
			type: 'dateutc'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Date 4',
			label$tr$: 'cloud.common.entityUserDefinedDate',
			label$tr$param$: {
				'p_0': '4'
			},
			model: 'UserDefinedDate4',
			readonly: false,
			rid: 'userdefineddate4',
			sortOrder: 14,
			type: 'dateutc'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Date 5',
			label$tr$: 'cloud.common.entityUserDefinedDate',
			label$tr$param$: {
				'p_0': '5'
			},
			model: 'UserDefinedDate5',
			readonly: false,
			rid: 'userdefineddate5',
			sortOrder: 15,
			type: 'dateutc'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Number 1',
			label$tr$: 'cloud.common.entityUserDefinedNumber',
			label$tr$param$: {
				'p_0': '1'
			},
			model: 'UserDefinedNumber1',
			readonly: false,
			required: true,
			rid: 'userdefinednumber1',
			sortOrder: 16,
			type: 'money'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Number 2',
			label$tr$: 'cloud.common.entityUserDefinedNumber',
			label$tr$param$: {
				'p_0': '2'
			},
			model: 'UserDefinedNumber2',
			readonly: false,
			required: true,
			rid: 'userdefinednumber2',
			sortOrder: 17,
			type: 'money'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Number 3',
			label$tr$: 'cloud.common.entityUserDefinedNumber',
			label$tr$param$: {
				'p_0': '3'
			},
			model: 'UserDefinedNumber3',
			readonly: false,
			required: true,
			rid: 'userdefinednumber3',
			sortOrder: 18,
			type: 'money'
		}, {
			gid: 'userDefinedFields',
			label: 'User Defined Number 5',
			label$tr$: 'cloud.common.entityUserDefinedNumber',
			label$tr$param$: {
				'p_0': '5'
			},
			model: 'UserDefinedNumber5',
			readonly: false,
			required: true,
			rid: 'userdefinednumber5',
			sortOrder: 20,
			type: 'money'
		}];


		return serviceFactory;

	}
	]);
}
)();
