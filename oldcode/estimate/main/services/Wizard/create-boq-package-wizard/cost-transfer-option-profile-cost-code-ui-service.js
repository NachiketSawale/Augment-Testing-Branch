/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moudleName= 'estimate.main';
	angular.module(moudleName).factory('costTransferOptionProfileCostCodeUIService',['platformTranslateService','basicsLookupdataConfigGenerator',
		function (platformTranslateService,basicsLookupdataConfigGenerator) {

			let service = {};
			let columns = [
				{
					id: 'isSelect',
					field: 'isSelect',
					name: 'Select',
					name$tr$: 'basics.common.checkbox.select',
					formatter: 'boolean',
					editor: 'boolean',
					headerChkbox: true,
					cssClass: 'cell-center',
					width: 75
				},
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					formatter: 'description',
					readonly : true,
					width: 250
				},
				{
					id: 'Description',
					field: 'Description',
					name: 'Description',
					formatter: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					readonly : true,
					width: 250
				},
				{
					id: 'isIndirectCost',
					field: 'IsIndirectCost',
					name: 'Is Indirect Cost',
					name$tr$: 'estimate.main.createBoqPackageWizard.IsIndirectCost',
					formatter: 'boolean',
					editor: 'boolean',
					readonly : true,
					width: 100
				},
				{
					id: 'isbudget',
					field: 'IsBudget',
					name: 'Is Budget',
					name$tr$: 'estimate.main.IsBudget',
					formatter: 'boolean',
					editor: 'boolean',
					readonly : true,
					width: 100
				},
				{
					id: 'iseditable',
					field: 'IsEditable',
					name: 'Editable',
					name$tr$: 'estimate.main.IsEditable',
					formatter: 'boolean',
					editor: 'boolean',
					readonly : true,
					width: 100
				},
				{
					id: 'isprojectchildallowed',
					field: 'IsProjectChildAllowed',
					name: 'Child Allowed',
					name$tr$: 'estimate.main.isChildAllowed',
					formatter: 'boolean',
					editor: 'boolean',
					readonly : true,
					width: 100
				},
				{
					id: 'isCost',
					field: 'IsCost',
					name: 'Is Cost',
					name$tr$: 'estimate.main.isCost',
					formatter: 'boolean',
					editor: 'boolean',
					readonly : true,
					width: 100
				},
				{
					id: 'description2info',
					field: 'Description2Info',
					name: 'Further Description',
					formatter: 'Description',
					name$tr$: 'estimate.main.description2',
					readonly : true,
					width: 250
				},
				{
					id: 'factorcosts',
					field: 'FactorCosts',
					name: 'Factor(Costs)',
					name$tr$: 'estimate.main.factorcosts',
					formatter: 'factor',
					editor: 'factor',
					readonly : true,
					width: 100
				},
				{
					id: 'realfactorcosts',
					field: 'RealFactorCosts',
					name: 'Real Factor(Costs)',
					name$tr$: 'estimate.main.realfactorcosts',
					formatter: 'factor',
					editor: 'factor',
					readonly : true,
					width: 100
				},
				{
					id: 'factorquantity',
					field: 'FactorQuantity',
					name: 'Factor(Quantity)',
					name$tr$: 'estimate.main.FactorQuantity',
					formatter: 'factor',
					editor: 'factor',
					readonly : true,
					width: 100
				},
				{
					id: 'realfactorquantity',
					field: 'RealFactorQuantity',
					name: 'Real Factor(Quantity)',
					name$tr$: 'estimate.main.RealFactorQuantity',
					formatter: 'factor',
					editor: 'factor',
					readonly : true,
					width: 100
				},
				{
					id: 'userdefined1',
					field: 'UserDefined1',
					name: 'User Define 1',
					name$tr$: 'estimate.main.userDefText.userDefined1',
					readonly: true,
					width: 100
				},
				{
					id: 'userdefined2',
					field: 'UserDefined2',
					name: 'User Define 2',
					name$tr$: 'estimate.main.userDefText.userDefined2',
					readonly: true,
					width: 100
				},
				{
					id: 'userdefined3',
					field: 'UserDefined3',
					name: 'User Define 3',
					name$tr$: 'estimate.main.userDefText.userDefined3',
					readonly: true,
					width: 100
				},
				{
					id: 'userdefined4',
					field: 'UserDefined4',
					name: 'User Define 4',
					name$tr$: 'estimate.main.userDefText.userDefined4',
					readonly: true,
					width: 100
				},
				{
					id: 'userdefined5',
					field: 'UserDefined5',
					name: 'User Define 5',
					name$tr$: 'estimate.main.userDefText.userDefined5',
					readonly: true,
					width: 100
				},
				{
					id: 'factorhour',
					field: 'FactorHour',
					name: 'Factor (Hour)',
					width: 100,
					toolTip: 'Factor (Hour)',
					formatter: 'factor',
					name$tr$: 'estimate.main.factorHour',
					editor: 'factor',
					readonly: true
				},
				{
					id: 'efbtype222fk',
					field: 'EfbType222Fk',
					name: 'EFB Type 223',
					width: 100,
					name$tr$: 'estimate.main.efbType222',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.efbtype', 'Description').grid.formatterOptions,
					readonly: true
				},
				{
					id: 'efbtype221fk',
					field: 'EfbType221Fk',
					name: 'EFB Type 221',
					width: 100,
					name$tr$: 'estimate.main.efbType221',
					formatter: 'lookup',
					formatterOptions:basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.efbtype', 'Description').grid.formatterOptions,
					readonly: true
				},
				{
					id: 'contrcostcodefk',
					field: 'ContrCostCodeFk',
					name: 'Controlling CostCode',
					width:100,
					toolTip: 'Controlling CostCode',
					formatter: 'lookup',
					name$tr$: 'estimate.main.controllingCostCode',
					formatterOptions: {
						lookupType: 'ControllingCostCode',
						displayMember: 'Code',
						valueMember: 'Id',
					},
					editor: 'lookup',
					editorOptions:{
						lookupDirective: 'basics-cost-codes-controlling-lookup',
						lookupOptions:{
							displayMember: 'Description.Translated',
							lookupModuleQualifier: 'ControllingCostCode',
							lookupType: 'ControllingCostCode',
							showClearButton: true,
							valueMember: 'Id'
						},
						showClearButton: true
					},
					readonly: true
				},
				{
					'afterId': 'contrcostcodefk',
					'id': 'controllingCostCodeDescription',
					'lookupDisplayColumn': true,
					'field': 'ContrCostCodeFk',
					'name': 'Controlling CostCode Description',
					'name$tr$': 'estimate.main.controllingCostCodeDescription',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'ControllingCostCode',
						displayMember: 'DescriptionInfo.Translated'
					},
					'width': 145,
					readonly : true
				},
				{
					id: 'prcstructurefk',
					field: 'PrcStructureFk',
					name: 'Procurement Structure',
					width: 100,
					toolTip: 'Procurement Structure',
					formatter: 'lookup',
					name$tr$: 'estimate.main.prcstructurefk',
					formatterOptions: {
						lookupType: 'prcstructure',
						valueMember: 'Id',
						displayMember: 'Code'
					},
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'basics-procurementstructure-structure-dialog',
						lookupOptions: {
							displayMember: 'Code',
							lookupModuleQualifier: 'prcstructure',
							lookupType: 'prcstructure',
							showClearButton: true,
							valueMember: 'Id'
						},
						showClearButton: true
					},
					readonly: true
				},
				{
					'afterId': 'prcstructurefk',
					'id': 'prcstructureDescription',
					'lookupDisplayColumn': true,
					'field': 'PrcStructureFk',
					'name': 'Procurement Structure Description',
					'name$tr$': 'estimate.main.prcStructureDescription',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'prcstructure',
						displayMember: 'DescriptionInfo.Translated'
					},
					'width': 145,
					readonly : true
				},
				{
					id: 'abcclassificationfk',
					field: 'AbcClassificationFk',
					name: 'Abc Classification',
					width:100,
					toolTip: 'Abc Classification',
					formatter: 'lookup',
					name$tr$: 'estimate.main.abcClassification',
					formatterOptions:basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.abcclassification', 'Description').grid.formatterOptions,
					readonly: true
				},
				{
					id: 'costgroupportionsfk',
					field: 'CostGroupPortionsFk',
					name: 'Cost Group Portions',
					width:100,
					toolTip: 'Cost Group Portions',
					formatter: 'lookup',
					name$tr$: 'estimate.main.costGroupPortions',
					formatterOptions:basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costgroupportions', 'Description').grid.formatterOptions,
					readonly: true
				},
				{
					id: 'costcodeportionsfk',
					field: 'CostCodePortionsFk',
					name: 'Cost Portions',
					width:100,
					toolTip: 'Cost Portions',
					formatter: 'lookup',
					name$tr$: 'estimate.main.costCodePortions',
					formatterOptions:basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costcodeportions', 'Description').grid.formatterOptions,
					readonly: true
				},
				{
					id: 'costcodetypefk',
					field: 'CostCodeTypeFk',
					name: 'cost type',
					width:60,
					toolTip: 'Type',
					formatter: 'lookup',
					name$tr$: 'estimate.main.entityType',
					formatterOptions:basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costcodetype', 'Description').grid.formatterOptions,
					readonly: true
				},
				{
					id: 'estcosttypefk',
					field: 'EstCostTypeFk',
					name: 'cost type',
					width:60,
					toolTip: 'Type',
					formatter: 'lookup',
					name$tr$: 'basics.costcodes.costType',
					formatterOptions:basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.costtype', 'Description').grid.formatterOptions,
					readonly: true
				},
				{
					id: 'islabour',
					field: 'IsLabour',
					name: 'Labour Cost Code',
					width:100,
					toolTip: 'Labour Cost Code',
					formatter: 'boolean',
					name$tr$: 'estimate.main.isLabour',
					editor: 'boolean',
					readonly: true
				},
				{
					id: 'israte',
					field: 'IsRate',
					name: 'Fixed Unit IsRate',
					width:100,
					toolTip: 'IsRate',
					formatter: 'boolean',
					name$tr$: 'estimate.main.costTransfer.isRate',
					editor: 'boolean',
					readonly: true
				},
				{
					id: 'uomfk',
					field: 'UomFk',
					name: 'UoM',
					width: 60,
					toolTip: 'UoM',
					name$tr$: 'project.costcodes.costTransfer.uoM',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					readonly: true
				},

				{
					'afterId': 'uomfk',
					'id': 'UoMDescription',
					'lookupDisplayColumn': true,
					'field': 'UomFk',
					'name': 'UoM Description',
					'name$tr$': 'estimate.main.uomDescription',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'DescriptionInfo.Translated'
					},
					'width': 145,
					readonly : true
				},
				{
					id: 'rate',
					field: 'Rate',
					name: 'Rate',
					width:100,
					toolTip: 'Market Rate',
					formatter: 'money',
					name$tr$: 'estimate.main.costTransfer.rate',
					editor: 'money',
					readonly: true
				},
				{
					id: 'currencyfk',
					field: 'CurrencyFk',
					name: 'Currency(Project)',
					width:100,
					toolTip: 'Currency',
					name$tr$: 'estimate.main.costTransfer.currency',
					formatter:'lookup',
					formatterOptions: {
						lookupType: 'basicsCurrencyLookupDataService',
						displayMember: 'Currency',
						dataServiceName: 'basicsCurrencyLookupDataService'
					},
					readonly : true
				},

				{
					'afterId': 'currencyfk',
					'id': 'currencyDescription',
					'lookupDisplayColumn': true,
					'field': 'CurrencyFk',
					'name': 'Currency Description',
					'name$tr$': 'estimate.main.currencyDescription',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Currency',
						displayMember: 'DescriptionInfo.Translated'
					},
					'width': 145,
					readonly : true
				},
				{
					id: 'dayworkrate',
					field: 'DayWorkRate',
					name: 'DW/T+M Rate',
					width:100,
					toolTip: 'DW/T+M Rate',
					formatter: 'money',
					name$tr$: 'estimate.main.costTransfer.dayWorkRate',
					editor: 'money',
					readonly : true
				},
				{
					id: 'remark',
					field: 'Remark',
					name: 'Remark',
					width:100,
					toolTip: 'Remark',
					formatter: 'comment',
					name$tr$: 'estimate.main.remark',
					editor: 'comment',
					readonly : true
				}
			];
			platformTranslateService.translateGridConfig(columns);
			service.getListColumnsView = function () {
				return columns;
			};

			return service;
		}]);
})(angular);


