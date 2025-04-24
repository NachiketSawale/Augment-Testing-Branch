
(function (angular) {
	/* global */
	'use strict';
	let moduleName = 'estimate.main';


	angular.module(moduleName).factory('estimateAllowanceCostCodeAssigmentDialogUIServices',
		['$injector', 'platformTranslateService',
			function ($injector, platformTranslateService) {

				let service = {};

				service.getColumns = function getColumns(){
					// let editType = $injector.get('estimateMainCostCodeAssignmentDetailLookupDataService').getEditType();
					return [
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
					];
				};

				let gridColumns =  service.getColumns();

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function(){
					return{
						addValidationAutomatically: true,
						columns : gridColumns
					};
				};

				return service;

			}
		]);

})(angular);
