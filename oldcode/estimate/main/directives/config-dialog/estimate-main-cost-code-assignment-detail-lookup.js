/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'basics.costcodes';

	angular.module(moduleName).directive('estimateMainCostCodeAssignmentDetailLookup',
		['$injector', 'basicsCostCodesImageProcessor', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($injector, imageProcessor, BasicsLookupdataLookupDirectiveDefinition) {
				let defaults = {
					lookupType: 'costcode',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: 'fb6fb3d658534b3f91feb591406ea361',
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							width: 70,
							name$tr$: 'cloud.common.entityCode'
						}, {
							id: 'Description',
							field: 'DescriptionInfo',
							name: 'Description',
							formatter: 'translation',
							width: 100,
							name$tr$: 'cloud.common.entityDescription'
						}, {
							id: 'UomFk',
							field: 'UomFk',
							name: 'Uom',
							width: 50,
							name$tr$: 'basics.costcodes.uoM',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}, {
							id: 'Rate',
							field: 'Rate',
							name: 'Market Rate',
							formatter: 'money',
							width: 70,
							name$tr$: 'basics.costcodes.unitRate'
						}, {
							id: 'CurrencyFk',
							field: 'CurrencyFk',
							name: 'Currency',
							width: 80,
							name$tr$: 'cloud.common.entityCurrency',
							searchable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'currency',
								displayMember: 'Currency'
							}
						}, {
							id: 'IsLabour',
							field: 'IsLabour',
							name: 'Labour',
							formatter: 'boolean',
							width: 100,
							name$tr$: 'basics.costcodes.isLabour'
						}, {
							id: 'IsRate',
							field: 'IsRate',
							name: 'Fix',
							formatter: 'boolean',
							width: 100,
							name$tr$: 'basics.costcodes.isRate'
						}, {
							id: 'FactorCosts',
							field: 'FactorCosts',
							name: 'FactorCosts',
							formatter: 'factor',
							width: 100,
							name$tr$: 'basics.costcodes.factorCosts'
						}, {
							id: 'RealFactorCosts',
							field: 'RealFactorCosts',
							name: 'RealFactorCosts',
							formatter: 'factor',
							width: 120,
							name$tr$: 'basics.costcodes.realFactorCosts'
						}, {
							id: 'FactorQuantity',
							field: 'FactorQuantity',
							name: 'FactorQuantity',
							formatter: 'factor',
							width: 100,
							name$tr$: 'basics.costcodes.factorQuantity'
						}, {
							id: 'RealFactorQuantity',
							field: 'RealFactorQuantity',
							name: 'RealFactorQuantity',
							formatter: 'factor',
							width: 100,
							name$tr$: 'basics.costcodes.realFactorQuantity'
						}, {
							id: 'CostCodeTypeFk',
							field: 'CostCodeTypeFk',
							name: 'Type',
							width: 100,
							name$tr$: 'basics.costcodes.entityType',
							searchable: true,
							formatter: 'lookup',
							formatterOptions: {
								// lookupType: 'costcodetype',
								lookupSimpleLookup: true,
								lookupModuleQualifier: 'basics.costcodes.costcodetype',
								valueMember: 'Id',
								displayMember: 'Description'
							}
						}, {
							id: 'DayWorkRate',
							field: 'DayWorkRate',
							name: 'DW/T+M Rate',
							formatter: 'money',
							width: 100,
							name$tr$: 'basics.costcodes.dayWorkRate'
						}, {
							id: 'Remark',
							field: 'Remark',
							name: 'remarks',
							formatter: 'remark',
							width: 100,
							name$tr$: 'cloud.common.entityRemark'
						}
					],
					width: 1200,
					height: 800,
					title: {
						name: 'Cost Codes',
						name$tr$: 'basics.costcodes.costCodes'
					},
					treeOptions: {
						parentProp: 'CostCodeParentFk',
						childProp: 'CostCodes',
						inlineFilters: true,
						hierarchyEnabled: true,
						dataProcessor: function (dataList) {
							imageProcessor.processData(dataList);
							return dataList;
						}
					},
					events: [
						{
							name: 'onSelectedItemsChanged',
							handler: function (e, args) {
								let selectedItems = angular.copy(args.selectedItems),
									usageContext = args.lookupOptions.usageContext;

								// handle selected item in the service, (e.g update other entity fields based on single lookup selection)
								if (usageContext){
									let serviceContext = $injector.get(usageContext);
									if (serviceContext && angular.isFunction(serviceContext.getCostCodeLookupSelectedItems)){
										serviceContext.getCostCodeLookupSelectedItems({} , selectedItems || []);
									}
								}
							}
						}
					],
					dialogOptions: {
						id: 'fb6fb3d658534b3f91feb591406ea361',
						resizeable: true
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
					dataProvider: 'estimateMainCostCodeAssignmentDetailLookupDataService'
				});
			}
		]);
})(angular);
