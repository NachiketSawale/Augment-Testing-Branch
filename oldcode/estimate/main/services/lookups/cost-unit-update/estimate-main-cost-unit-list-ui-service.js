/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let modName = 'estimate.main';

	angular.module(modName).factory('estimateMainCostUnitListOfCostCodeUI',['platformTranslateService',function (platformTranslateService) {

		let service = {};

		let isReadOnly = false;
		service.setReadOnly = function (readOnly) {
			isReadOnly = readOnly;
		};

		let gridColumns = [
			{ id: 'lgmjobfk2', field: 'LgmJobFk', name: 'LgmJob', width:100, toolTip: 'LgmJob', name$tr$: 'project.costcodes.lgmJobFk', formatter:'lookup',
				formatterOptions: {
					lookupType: 'logisticJobLookupByProjectDataService',
					displayMember: 'Code',
					dataServiceName: 'logisticJobLookupByProjectDataService'
				}},
			{ id: 'code2', field: 'Code', name: 'Code', width:100, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode'},
			{ id: 'descriptioninfo2', field: 'Description', name: 'Description', width:100, toolTip: 'Description', formatter: 'description', name$tr$: 'cloud.common.entityDescription'},
			{ id: 'rate2', field: 'Rate', name: 'Rate(Project)', width:100, toolTip: 'Rate(Project)', formatter: 'money', name$tr$: 'project.costcodes.rate',editor: 'money', required: true},
			{ id: 'uomfk2', field: 'UomFk', name: 'UoM(Project)', width: 100, toolTip: 'UoM(Project)', name$tr$: 'project.costcodes.uoM', formatter: 'lookup',
				formatterOptions: {
					lookupType: 'uom',
					displayMember: 'Unit'
				}// ,
				// editor: 'lookup',
				// editorOptions:{
				//     lookupDirective: 'basics-lookup-data-by-custom-data-service',
				//     lookupType: 'basicsUnitLookupDataService',
				//     showClearButton: true,
				//     lookupOptions:{
				//         additionalColumns: true,
				//         columns:[{
				//             field: 'UnitInfo',
				//             formatter: 'translation',
				//             id: 'Unit',
				//             name: 'Unit',
				//             name$tr$: 'basics.unit.entityUnit'
				//         },{
				//             field: 'DescriptionInfo',
				//             formatter: 'translation',
				//             id: 'Description',
				//             name: 'Description',
				//             name$tr$: 'cloud.common.entityDescription'
				//         }],
				//
				//         dataServiceName: 'basicsUnitLookupDataService',
				//         disableDataCaching: true,
				//         displayMember: 'UnitInfo.Translated',
				//         isClientSearch: true,
				//         isTextEditable: false,
				//         lookupModuleQualifier: 'basicsUnitLookupDataService',
				//         lookupType: 'basicsUnitLookupDataService',
				//         showClearButton: true,
				//         uuid: '787caf38fc844f9fb14c3580dc322e6c',
				//         valueMember: 'Id'
				//     }
				// }
			},
			{ id: 'uomfkdescription2', field: 'UomFk', name: 'UoM(Project)-Description', name$tr$: 'project.costcodes.uoMDescription', width:120, toolTip: 'UoM(Project)-Description', formatter: 'lookup',
				formatterOptions: {
					dataServiceName: 'basicsUnitLookupDataService',
					displayMember: 'DescriptionInfo.Translated',
					isClientSearch: true,
					lookupType: 'basicsUnitLookupDataService'
				},
				grouping: {
					title: 'UoM(Project)',
					getter: 'UomFk',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{ id: 'currencyfk2', field: 'CurrencyFk', name: 'Currency(Project)', width:100, toolTip: 'Currency', toolTip$tr$: 'project.costcodes.currency', name$tr$: 'project.costcodes.currency', formatter:'lookup',
				formatterOptions: {
					lookupType: 'basicsCurrencyLookupDataService',
					displayMember: 'Currency',
					dataServiceName: 'basicsCurrencyLookupDataService'
				}// ,
				// editor: 'lookup',
				// editorOptions:{
				//     lookupDirective: 'basics-lookup-data-by-custom-data-service',
				//     lookupType: 'basicsCurrencyLookupDataService',
				//     showClearButton: true,
				//     lookupOptions:{
				//         additionalColumns: true,
				//         columns:[{
				//             field: 'Currency',
				//             formatter: 'code',
				//             id: 'Currency',
				//             name: 'Currency',
				//             name$tr$: 'cloud.common.entityCurrency'
				//         },{
				//             field: 'DescriptionInfo',
				//             formatter: 'translation',
				//             id: 'Description',
				//             name: 'Description',
				//             name$tr$: 'cloud.common.entityDescription'
				//         }],
				//         dataServiceName: 'basicsCurrencyLookupDataService',
				//         disableDataCaching: true,
				//         displayMember: 'Currency',
				//         isClientSearch: true,
				//         isTextEditable: false,
				//         lookupModuleQualifier: 'basicsCurrencyLookupDataService',
				//         lookupType: 'basicsCurrencyLookupDataService',
				//         showClearButton: true,
				//         uuid: '62e5dcb67d8144eea1b27fd903ca283f',
				//         valueMember: 'Id'
				//     }
				// }
			},
			{ id: 'currencyfkdescription2', field: 'CurrencyFk', name: 'Currency(Project)-Description', name$tr$: 'project.costcodes.currencyDescription', width:120, toolTip: 'Currency(Project)-Description', toolTip$tr$: 'project.costcodes.currencyDescription',  formatter: 'lookup',
				formatterOptions: {
					dataServiceName: 'basicsCurrencyLookupDataService',
					displayMember: 'DescriptionInfo.Translated',
					isClientSearch: true,
					lookupType: 'basicsCurrencyLookupDataService'
				},
				grouping: {
					title: 'Currency(Project)',
					getter: 'CurrencyFk',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{ id: 'factorcosts2', field: 'FactorCosts', name: 'Factor (Project Costs)', width:100, toolTip: 'Factor (Project Costs)', formatter: 'factor', name$tr$: 'project.costcodes.factorCosts',editor: 'factor', required: true},
			{ id: 'realfactorcosts2', field: 'RealFactorCosts', name: 'RealFactor (Project Costs)', width:100, toolTip: 'RealFactor (Project Costs)', formatter: 'factor', name$tr$: 'project.costcodes.realFactorCosts'},
			{ id: 'factorquantity2', field: 'FactorQuantity', name: 'Factor (Project Quantity)', width:100, toolTip: 'Factor (Project Quantity)', formatter: 'factor', name$tr$: 'project.costcodes.factorQuantity',editor: 'factor',required: true},
			{ id: 'realfactorquantity2', field: 'RealFactorQuantity', name: 'RealFactor (Project Quantity)', width:100, toolTip: 'RealFactor (Project Quantity)', formatter: 'factor', name$tr$: 'project.costcodes.realFactorQuantity'},
			{ id: 'dayworkrate2', field: 'DayWorkRate', editor: 'money', name: 'DW/T+M Rate(Project)', width:100, toolTip: 'DW/T+M Rate(Project)', formatter: 'money', name$tr$: 'project.costcodes.dayWorkRate'},
			{ id: 'israte2', field: 'IsRate', name: 'IsRate(Project)', width:100, toolTip: 'IsRate(Project)', formatter: 'boolean', name$tr$: 'project.costcodes.isRate'},
			{ id: 'islabour2', field: 'IsLabour', name: 'IsLabour(Project)', width:100, toolTip: 'IsLabour(Project)', formatter: 'boolean', name$tr$: 'project.costcodes.isLabour'},
			{ id: 'remark2', field: 'Remark', name: 'Remark(Project)', width:100, toolTip: 'Remark(Project)', formatter: 'comment', name$tr$: 'project.costcodes.remark'}, // editor: 'comment'},
			{ id: 'estcosttypefk2', field: 'EstCostTypeFk', name: 'Cost Type(Project)', width:100, toolTip: 'Cost Type(Project)', formatter: 'lookup', name$tr$: 'project.costcodes.costType',
				formatterOptions: {
					displayMember: 'Description',
					imageSelector: '',
					lookupModuleQualifier: 'estimate.lookup.costtype',
					lookupSimpleLookup: true,
					valueMember: 'Id'
				}// ,
				// editor: 'lookup',
				// editorOptions:{
				//     lookupDirective: 'basics-lookupdata-simple',
				//     lookupOptions:{
				//         displayMember: 'Description',
				//         eagerLoad: true,
				//         lookupModuleQualifier: 'estimate.lookup.costtype',
				//         lookupType: 'estimate.lookup.costtype',
				//         showClearButton: true,
				//         valueMember: 'Id'
				//     },
				//     showClearButton: true
				// }
			},
			{ id: 'factorhour2', field: 'FactorHour', name: 'Factor (Project Hour)', width:100, toolTip: 'Factor (Project Hour)', formatter: 'factor', name$tr$: 'project.costcodes.factorHour',editor: 'factor',required: true},
			{ id: 'bascostcode.costcodetypefk2', field: 'BasCostCode.CostCodeTypeFk', name: 'Type', width:60, toolTip: 'Type', formatter: 'lookup', name$tr$: 'cloud.common.entityType',
				formatterOptions: {
					displayMember: 'Description',
					imageSelector: '',
					lookupModuleQualifier: 'estimate.lookup.costtype',
					lookupSimpleLookup: true,
					valueMember: 'Id'
				}},
			{ id: 'bascostcode.costcodeportionsfk2', field: 'BasCostCode.CostCodePortionsFk', name: 'Cost Portions', width:100, toolTip: 'Cost Portions', formatter: 'lookup', name$tr$: 'basics.costcodes.costCodePortions',
				formatterOptions: {
					displayMember: 'Description',
					imageSelector: '',
					lookupModuleQualifier: 'basics.costcodes.costcodeportions',
					lookupSimpleLookup: true,
					valueMember: 'Id'
				}},
			{ id: 'bascostcode.costgroupportionsfk2', field: 'BasCostCode.CostGroupPortionsFk', name: 'Cost Group Portions', width:100, toolTip: 'Cost Group Portions', formatter: 'lookup', name$tr$: 'basics.costcodes.costGroupPortions',
				formatterOptions: {
					displayMember: 'Description',
					imageSelector: '',
					lookupModuleQualifier: 'basics.costcodes.costgroupportions',
					lookupSimpleLookup: true,
					valueMember: 'Id'
				}},

			{ id: 'bascostcode.abcclassificationfk2', field: 'BasCostCode.AbcClassificationFk', name: 'Abc Classification', width:100, toolTip: 'Abc Classification', formatter: 'lookup', name$tr$: 'basics.costcodes.abcClassification',
				formatterOptions: {
					displayMember: 'Description',
					imageSelector: '',
					lookupModuleQualifier: 'basics.costcodes.abcclassification',
					lookupSimpleLookup: true,
					valueMember: 'Id'
				}},
			{ id: 'bascostcode.description2info2', field: 'BasCostCode.Description2Info', name: 'Further Description', width:100, toolTip: 'Further Description', formatter: 'translation', name$tr$: 'basics.costcodes.description2'},

			{ id: 'bascostcode.userdefined12', field: 'BasCostCode.UserDefined1', name: 'Text 1', width:100, toolTip: 'Text 1', formatter: 'description', name$tr$: 'cloud.common.entityUserDefText', name$tr$param$:{p_0:'1'}},
			{ id: 'bascostcode.userdefined22', field: 'BasCostCode.UserDefined2', name: 'Text 2', width:100, toolTip: 'Text 2', formatter: 'description', name$tr$: 'cloud.common.entityUserDefText', name$tr$param$:{p_0:'2'}},
			{ id: 'bascostcode.userdefined32', field: 'BasCostCode.UserDefined3', name: 'Text 3', width:100, toolTip: 'Text 3', formatter: 'description', name$tr$: 'cloud.common.entityUserDefText', name$tr$param$:{p_0:'3'}},
			{ id: 'bascostcode.userdefined42', field: 'BasCostCode.UserDefined4', name: 'Text 4', width:100, toolTip: 'Text 4', formatter: 'description', name$tr$: 'cloud.common.entityUserDefText', name$tr$param$:{p_0:'4'}},
			{ id: 'bascostcode.userdefined52', field: 'BasCostCode.UserDefined5', name: 'Text 5', width:100, toolTip: 'Text 5', formatter: 'description', name$tr$: 'cloud.common.entityUserDefText', name$tr$param$:{p_0:'5'}},
		];

		platformTranslateService.translateGridConfig(gridColumns);

		service.getStandardConfigForListView = function () {
			let columns = angular.copy(gridColumns);

			if(isReadOnly){
				_.forEach(columns, function (item) {
					item.editor = null;
				});
			}else{
				columns = _.filter(columns, function (item) {
					return item.id !== 'lgmjobfk';
				});
			}
			return {
				addValidationAutomatically: true,
				columns: columns
			};
		};

		service.getBaseStandardColunms = function(){
			let columns = angular.copy(gridColumns);
			if(isReadOnly){
				_.forEach(columns, function (item) {
					item.editor = null;
				});
			}else{
				columns = _.filter(columns, function (item) {
					return item.id !== 'lgmjobfk';
				});
			}
			return columns;
		};

		return service;

	}]);
})(angular);

(function(angular) {
	'use strict';

	let modName = 'estimate.main';

	angular.module(modName).factory('estimateMainCostUnitListOfMaterialUI',['platformTranslateService',function (platformTranslateService) {

		let service = {};

		let isReadOnly = false;
		service.setReadOnly = function (readOnly) {
			isReadOnly = readOnly;
		};

		let gridColumns = [
			{ id: 'lgmjobfk1', field: 'LgmJobFk', name: 'Job', width:100, toolTip: 'Job', name$tr$: 'project.costcodes.lgmJobFk', formatter:'lookup',
				formatterOptions: {
					lookupType: 'logisticJobLookupByProjectDataService',
					displayMember: 'Code',
					dataServiceName: 'logisticJobLookupByProjectDataService'
				}},
			{ id: 'code1', field: 'BasMaterial.Code', name: 'Code', width:80, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode'},
			{ id: 'descriptioninfo1', field: 'BasMaterial.DescriptionInfo1', name: 'Description', width:100, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription'},
			{ id: 'estimateprice1', field: 'EstimatePrice', name: 'Estimate Price(Project)', width:100, toolTip: 'Estimate Price(Project)', formatter: 'money', name$tr$: 'project.material.prjEstimatePrice', editor: 'money', required: true},
			{ id: 'uomfk1', field: 'UomFk', name: 'UoM(Project)', width: 60, toolTip: 'UoM(Project)', name$tr$: 'project.costcodes.uoM', formatter: 'lookup',
				formatterOptions: {
					lookupType: 'uom',
					displayMember: 'Unit'
				}},
			{ id: 'dayworkrate1', field: 'DayWorkRate', editor: 'money', name: 'DW/T+M Rate(Project)', width:100, toolTip: 'DW/T+M Rate(Project)', formatter: 'money', name$tr$: 'project.material.dayWorkRateBas'},
			{ id: 'currencyfk1', field: 'BasCurrencyFk', name: 'Currency(Project)', width:100, toolTip: 'Currency', name$tr$: 'project.costcodes.currency', formatter:'lookup',
				formatterOptions: {
					lookupType: 'basicsCurrencyLookupDataService',
					displayMember: 'Currency',
					dataServiceName: 'basicsCurrencyLookupDataService'
				}},
			{ id: 'retailprice1', field: 'RetailPrice', name: 'Retail Price(Project)', width:100, toolTip: 'Retail Price(Project)', formatter: 'money', name$tr$: 'project.material.prjRetailPrice'},
			{ id: 'listprice1', field: 'ListPrice', name: 'List Price(Project)', width:100, toolTip: 'List Price(Project)', formatter: 'money', name$tr$: 'project.material.prjListPrice', editor: 'money', required: true},
			{ id: 'discount1', field: 'Discount', name: 'Discount(Project)', width:100, toolTip: 'Discount(Project)', formatter: 'money', name$tr$: 'project.material.prjDiscount', editor: 'money', required: true},
			{ id: 'charges1', field: 'Charges', name: 'Charges(Project)', width:100, toolTip: 'Charges(Project)', formatter: 'money', name$tr$: 'project.material.prjCharges', editor: 'money', required: true},
			{ id: 'cost1', field: 'Cost', name: 'Cost(Project)', width:100, toolTip: 'Cost(Project)', formatter: 'money', name$tr$: 'project.material.prjCost'},
			{ id: 'priceunit1', field: 'PriceUnit', name: 'Price Unit(Project)', width:100, toolTip: 'Price Unit(Project)', formatter: 'money', name$tr$: 'project.material.prjPriceUnit'},
			{ id: 'basuompriceunitfk1', field: 'BasUomPriceUnitFk', name: 'Uom PriceUnit(Project)', width: 60, toolTip: 'Uom PriceUnit(Project)', name$tr$: 'project.material.prjBasUomPriceUnitFk', formatter: 'lookup',
				formatterOptions: {
					lookupType: 'uom',
					displayMember: 'Unit'
				}},
			{ id: 'priceextra1', field: 'PriceExtra', name: 'Price Extra(Project)', width:100, toolTip: 'Price Extra(Project)', formatter: 'money', name$tr$: 'project.material.prjPriceExtra', editor: 'money', required: true},
			{ id: 'factorpriceunit1', field: 'FactorPriceUnit', name: 'Factor Price Unit(Project)', width:100, toolTip: 'Factor Price Unit(Project)', formatter: 'money', name$tr$: 'project.material.prjFactorPriceUnit'},
			{ id: 'prcpriceconditionfk1', field: 'PrcPriceconditionFk', name: 'Prc Price Condition(Project)', width:100, toolTip: 'Prc Price Condition(Project)', formatter: 'lookup', name$tr$: 'project.material.prjPrcPriceConditionFk',
				formatterOptions: {
					displayMember: 'DescriptionInfo.Translated',
					lookupType: 'PrcPricecondition',
				},
				editor: 'lookup',
				editorOptions:{
					directive: 'basics-Material-Price-Condition-Combobox',
					lookupOptions:{
						dataService: 'projectMaterialPriceConditionServiceNew',
						showClearButton: true,
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if(args.selectedItem){
									args.entity.PrcPriceconditionFk = args.selectedItem.Id;
								}
							}
						}]
					},
					showClearButton: true
				}},
			{ id: 'materialdiscountgroupfk1', field: 'MaterialDiscountGroupFk', name: 'Material Discount Group(Project)', width:100, toolTip: 'Material Discount Group(Project)', formatter: 'lookup', name$tr$: 'project.material.prjMdcMaterialDiscountGroupFk',
				formatterOptions: {
					displayMember: 'Code',
					lookupType: 'MaterialDiscountGroup',
				}},
			{ id: 'mdctaxcodefk1', field: 'MdcTaxCodeFk', name: 'Tax Code(Project)', width:100, toolTip: 'Tax Code(Project)', formatter: 'lookup', name$tr$: 'project.material.prjMdcTaxCodeFk',
				formatterOptions: {
					displayMember: 'Code',
					lookupType: 'TaxCode',
				},
				editor: 'lookup',
				editorOptions:{
					lookupDirective: 'basics-master-data-context-tax-code-lookup',
					lookupOptions:{
						showClearButton: true
					},
					showClearButton: true
				}},
			{ id: 'commenttext1', field: 'CommentText', name: 'Comment(Project)', width:100, toolTip: 'Comment(Project)', formatter: 'comment', name$tr$: 'project.material.prjComment', editor: 'comment'},
			{ id: 'estcosttypefk1', field: 'EstCostTypeFk', name: 'Cost Type(Project)', width:100, toolTip: 'Cost Type(Project)', formatter: 'lookup', name$tr$: 'project.costcodes.costType',
				formatterOptions: {
					displayMember: 'Description',
					imageSelector: '',
					lookupModuleQualifier: 'estimate.lookup.costtype',
					lookupSimpleLookup: true,
					valueMember: 'Id'
				},
				editor: 'lookup',
				editorOptions:{
					lookupDirective: 'basics-lookupdata-simple',
					lookupOptions:{
						displayMember: 'Description',
						eagerLoad: true,
						lookupModuleQualifier: 'estimate.lookup.costtype',
						lookupType: 'estimate.lookup.costtype',
						showClearButton: true,
						valueMember: 'Id'
					},
					showClearButton: true
				}},
			{ id: 'factorhour1', field: 'FactorHour', name: 'Factor Hour(Project)', width:100, toolTip: 'Factor Hour(Project)123', formatter: 'factor', name$tr$: 'project.material.factorHour',editor: 'factor',required: true},
			{ id: 'basmaterial.descriptioninfo2', field: 'BasMaterial.DescriptionInfo2', name: 'Further Description', width:100, toolTip: 'Further Description', formatter: 'translation', name$tr$: 'basics.material.record.furtherDescription'}
		];

		platformTranslateService.translateGridConfig(gridColumns);

		service.getStandardConfigForListView = function () {
			let columns = angular.copy(gridColumns);
			if(isReadOnly){
				_.forEach(columns, function (item) {
					item.editor = null;
				});
			}else{
				columns = _.filter(columns, function (item) {
					return item.id !== 'lgmjobfk';
				});
			}
			return {
				addValidationAutomatically: true,
				columns: columns
			};
		};



		service.getBaseStandardColunms = function(){
			let columns = angular.copy(gridColumns);
			if(isReadOnly){
				_.forEach(columns, function (item) {
					item.editor = null;
				});
			}else{
				columns = _.filter(columns, function (item) {
					return item.id !== 'lgmjobfk';
				});
			}
			return columns;
		};

		return service;

	}]);
})(angular);
