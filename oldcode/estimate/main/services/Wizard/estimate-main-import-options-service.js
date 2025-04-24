(function () {
	'use strict';

	var moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainImportOptionsService', ['$q','platformContextService','estimateMainService',
		function ($q,platformContextService, estimateMainService) {
			var service = {};

			let _estimateMainService;

			service._estimateMainService = _estimateMainService;

			var setRibExcelMappingNames = function (fields) {
				angular.forEach(fields, function (field) {
					if (Object.prototype.hasOwnProperty.call(field, 'ribFormatMappingName')) {
						field.MappingName = field.ribFormatMappingName;
					} else {
						field.MappingName = '';
					}
				});
			};

			var importOptions = {
				ModuleName: moduleName,
				DoubletFindMethodsPage: { skip: true },
				WizardId: 'ExcelImport',
				// todo: Pages can be skipped
				/* FieldMappingsPage: { skip: true or false },
				EditImportPage: { skip: true or false },
				PreviewResultPage: { skip: true or false }, */
				ImportDescriptor: {
					DoubletFindMethods: [], // todo: ??
					Fields: [

						{
							PropertyName: 'Code',
							DomainName: 'Code',
							ribFormatMappingName: 'Code'
						},
						{
							PropertyName: 'Description',
							DomainName: 'Description',
							ribFormatMappingName: 'Description'
						},
						{
							PropertyName: 'AssemblyCategory',
							DomainName: 'Description',
							ribFormatMappingName: 'Assembly Category'
						},
						{
							PropertyName: 'AssemblyTemplate',
							DomainName: 'Description',
							ribFormatMappingName: 'Assembly Template'
						},
						{
							PropertyName: 'GeneralCost',
							DomainName: 'Description',
							ribFormatMappingName: 'General Cost'
						},
						{
							PropertyName: 'Quantity',
							DomainName: 'Description',
							ribFormatMappingName: 'Quantity'
						},
						{
							PropertyName: 'QuantityDetails',
							DomainName: 'Description',
							ribFormatMappingName: 'Quantity Details'
						},
						{
							PropertyName: 'AQQuantityItem',
							DomainName: 'Description',
							ribFormatMappingName: 'AQ Quantity Item'
						},
						{
							PropertyName: 'AQQuantityDetailsItem',
							DomainName: 'Description',
							ribFormatMappingName: 'AQ Quantity Details Item'
						},
						{
							PropertyName: 'WQQuantityItem',
							DomainName: 'Description',
							ribFormatMappingName: 'WQ Quantity Item'
						},
						{
							PropertyName: 'WQQuantityDetailsItem',
							DomainName: 'Description',
							ribFormatMappingName: 'WQ Quantity Details Item'
						},
						{
							PropertyName: 'UoM',
							DomainName: 'Description',
							ribFormatMappingName: 'UoM'
						},
						{
							PropertyName: 'UoMItem',
							DomainName: 'Description',
							ribFormatMappingName: 'UoM Item'
						},
						{
							PropertyName: 'QuantityTotal',
							DomainName: 'Description',
							ribFormatMappingName: 'Quantity Total'
						},
						{
							PropertyName: 'NoMarkup',
							DomainName: 'Description',
							ribFormatMappingName: 'No Markup'
						},
						{
							PropertyName: 'FixBudget',
							DomainName: 'Description',
							ribFormatMappingName: 'FixBudget'
						},
						{
							PropertyName: 'Budget',
							DomainName: 'Description',
							ribFormatMappingName: 'Budget'
						},
						{
							PropertyName: 'FixBudgetUnit',
							DomainName: 'Description',
							ribFormatMappingName: 'FixBudgetUnit'
						},
						{
							PropertyName: 'BudgetUnit',
							DomainName: 'Description',
							ribFormatMappingName: 'BudgetUnit'
						},
						{
							PropertyName: 'Job',
							DomainName: 'Description',
							ribFormatMappingName: 'Job'
						},
						{
							PropertyName: 'ActivitySchedule',
							DomainName: 'Description',
							ribFormatMappingName: 'ActivitySchedule'
						},
						{
							PropertyName: 'Activity',
							DomainName: 'Description',
							ribFormatMappingName: 'Activity'
						},
						{
							PropertyName: 'AdvAllowanceTotal',
							DomainName: 'Description',
							ribFormatMappingName: 'AdvAllowanceTotal'
						},
						{
							PropertyName: 'AdvAllowance/Unit',
							DomainName: 'Description',
							ribFormatMappingName: 'AdvAllowance/Unit'
						},
						{
							PropertyName: 'AdvAllowance/Unit Item',
							DomainName: 'Description',
							ribFormatMappingName: 'AdvAllowance/Unit Item'
						},
						{
							PropertyName: 'AssetMaster',
							DomainName: 'Description',
							ribFormatMappingName: 'AssetMaster'
						},
						{
							PropertyName: 'CostGroupCatalogue',
							DomainName: 'Description',
							ribFormatMappingName: 'Cost Group Catalogue'
						},
						{
							PropertyName: 'CostGroup1',
							DomainName: 'Description',
							ribFormatMappingName: 'CostGroup1'
						},
						{
							PropertyName: 'CostGroup2',
							DomainName: 'Description',
							ribFormatMappingName: 'CostGroup2'
						},
						{
							PropertyName: 'CostGroup3',
							DomainName: 'Description',
							ribFormatMappingName: 'CostGroup3'
						},
						{
							PropertyName: 'CostGroup4',
							DomainName: 'Description',
							ribFormatMappingName: 'CostGroup4'
						},
						{
							PropertyName: 'CostGroup5',
							DomainName: 'Description',
							ribFormatMappingName: 'CostGroup5'
						},
						{
							PropertyName: 'CostGroup6',
							DomainName: 'Description',
							ribFormatMappingName: 'CostGroup6'
						},
						{
							PropertyName: 'BOQReferenceNo',
							DomainName: 'Description',
							ribFormatMappingName: 'BoQ Reference No'
						},
						{
							PropertyName: 'BOQHeader',
							DomainName: 'Description',
							ribFormatMappingName: 'BoQ Header.'
						},
						{
							PropertyName: 'BoQRootItemNo',
							DomainName: 'Description',
							ribFormatMappingName: 'BoQ Root Item No.'
						},
						{
							PropertyName: 'BoQItemRefNo',
							DomainName: 'Description',
							ribFormatMappingName: 'BoQ Item Ref. No.'
						},
						{
							PropertyName: 'Comment',
							DomainName: 'Description',
							ribFormatMappingName: 'Comment'
						},
						{
							PropertyName: 'ControllingUnits',
							DomainName: 'Description',
							ribFormatMappingName: 'Controlling Units'
						},
						{
							PropertyName: 'CostFactor1',
							DomainName: 'Description',
							ribFormatMappingName: 'Cost Factor 1'
						},
						{
							PropertyName: 'CostFactor2',
							DomainName: 'Description',
							ribFormatMappingName: 'Cost Factor 2'
						},
						{
							PropertyName: 'CostFactorDetails1',
							DomainName: 'Description',
							ribFormatMappingName: 'Cost Factor Details 1'
						},
						{
							PropertyName: 'CostFactorDetails2',
							DomainName: 'Description',
							ribFormatMappingName: 'Cost Factor Details 2'
						},
						{
							PropertyName: 'Disabled',
							DomainName: 'Description',
							ribFormatMappingName: 'Disabled'
						},
						{
							PropertyName: 'FixedPrice',
							DomainName: 'Description',
							ribFormatMappingName: 'FixedPrice'
						},
						{
							PropertyName: 'GrandCostUnitItem',
							DomainName: 'Description',
							ribFormatMappingName: 'Grand Cost/ Unit Item'
						},
						{
							PropertyName: 'Included',
							DomainName: 'Description',
							ribFormatMappingName: 'Included'
						},
						{
							PropertyName: 'LumpSum',
							DomainName: 'Description',
							ribFormatMappingName: 'Lump Sum'
						},
						{
							PropertyName: 'NoEscalation',
							DomainName: 'Description',
							ribFormatMappingName: 'No Escalation'
						},
						{
							PropertyName: 'NoLeadQuantity',
							DomainName: 'Description',
							ribFormatMappingName: 'No Lead Quantity'
						},
						{
							PropertyName: 'Optional',
							DomainName: 'Description',
							ribFormatMappingName: 'Optional'
						},
						{
							PropertyName: 'OptionalIT',
							DomainName: 'Description',
							ribFormatMappingName: 'Optional IT'
						},
						{
							PropertyName: 'ManualMarkup',
							DomainName: 'Description',
							ribFormatMappingName: 'Manual Markup'
						},
						{
							PropertyName: 'ManualMarkupUnit',
							DomainName: 'Description',
							ribFormatMappingName: 'Manual Markup/Unit'
						},
						{
							PropertyName: 'ManualMarkupUnitItem',
							DomainName: 'Description',
							ribFormatMappingName: 'Manual Markup/Unit Item'
						},
						{
							PropertyName: 'ProcurementStructure',
							DomainName: 'Description',
							ribFormatMappingName: 'Procurement Structure'
						},
						{
							PropertyName: 'ProductivityFactor',
							DomainName: 'Description',
							ribFormatMappingName: 'Productivity Factor'
						},
						{
							PropertyName: 'ProductivityFactorDetail',
							DomainName: 'Description',
							ribFormatMappingName: 'Productivity Factor Detail'
						},
						{
							PropertyName: 'Project Change',
							DomainName: 'Description',
							ribFormatMappingName: 'ProjectChange'
						},
						{
							PropertyName: 'QuantityFactor1',
							DomainName: 'Description',
							ribFormatMappingName: 'Quantity Factor 1'
						},
						{
							PropertyName: 'QuantityFactor2',
							DomainName: 'Description',
							ribFormatMappingName: 'QuantityFactor2'
						},
						{
							PropertyName: 'QuantityFactor3',
							DomainName: 'Description',
							ribFormatMappingName: 'Quantity Factor 3'
						},
						{
							PropertyName: 'QuantityFactor4',
							DomainName: 'Description',
							ribFormatMappingName: 'QuantityFactor4'
						},
						{
							PropertyName: 'QuantityFactorDetails1',
							DomainName: 'Description',
							ribFormatMappingName: 'Quantity Factor Details 1'
						},
						{
							PropertyName: 'QuantityFactorDetails2',
							DomainName: 'Description',
							ribFormatMappingName: 'QuantitFactoDetails2'
						},
						{
							PropertyName: 'Rules',
							DomainName: 'Description',
							ribFormatMappingName: 'Rules'
						},
						{
							PropertyName: 'SortCode1',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 1'
						},
						{
							PropertyName: 'SortCode2',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 2'
						},
						{
							PropertyName: 'SortCode3',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 3'
						},
						{
							PropertyName: 'SortCode4',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 4'
						},
						{
							PropertyName: 'SortCode5',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 5'
						},
						{
							PropertyName: 'SortCode6',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 6'
						},
						{
							PropertyName: 'SortCode7',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 7'
						},
						{
							PropertyName: 'SortCode8',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 8'
						},
						{
							PropertyName: 'SortCode9',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 9'
						},
						{
							PropertyName: 'SortCode10',
							DomainName: 'Description',
							ribFormatMappingName: 'Sort Code 10'
						},
						{
							PropertyName: 'UserDefined1',
							DomainName: 'Description',
							ribFormatMappingName: 'User Defined 1'
						},
						{
							PropertyName: 'UserDefined2',
							DomainName: 'Description',
							ribFormatMappingName: 'User Defined 2'
						},
						{
							PropertyName: 'UserDefined3',
							DomainName: 'Description',
							ribFormatMappingName: 'User Defined 3'
						},
						{
							PropertyName: 'UserDefined4',
							DomainName: 'Description',
							ribFormatMappingName: 'User Defined 4'
						},
						{
							PropertyName: 'WICGroupRefNo',
							DomainName: 'Description',
							ribFormatMappingName: 'WIC Group Ref.No.'
						},
						{
							PropertyName: 'WICBoQCatalog',
							DomainName: 'Description',
							ribFormatMappingName: 'WIC BoQ Catalog'
						},
						{
							PropertyName: 'WICBoQRootItemRefNo',
							DomainName: 'Description',
							ribFormatMappingName: 'WIC BoQ -Root Item Ref.No.'
						},
						{
							PropertyName: 'WICBoQItemRefNo',
							DomainName: 'Description',
							ribFormatMappingName: 'WIC BoQ -Item Ref.No.'
						},
						{
							PropertyName: 'Location',
							DomainName: 'Description',
							ribFormatMappingName: 'Location'
						},
						{
							PropertyName: 'ResourceId',
							DomainName: 'Description',
							ribFormatMappingName: 'ResourceId'
						},
						{
							PropertyName: 'ParentId',
							DomainName: 'Description',
							ribFormatMappingName: 'ParentId'
						},
						{
							PropertyName: 'ShortKey',
							DomainName: 'Description',
							ribFormatMappingName: 'Short Key'
						},
						{
							PropertyName: 'ResourceCode',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Code'
						},
						{
							PropertyName: 'MaterialCatalogue',
							DomainName: 'code',
							ribFormatMappingName: 'Material Catalogue'
						},
						{
							PropertyName: 'MaterialGroup',
							DomainName: 'code',
							ribFormatMappingName: 'Material Group'
						},
						{
							PropertyName: 'ResourceDescription',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Description'
						},
						{
							PropertyName: 'Additional Description',
							DomainName: 'code',
							ribFormatMappingName: 'Additional Description'
						},
						{
							PropertyName: 'ResourceComment',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Comment'
						},
						{
							PropertyName: 'ResourceQuantity',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Quantity'
						},
						{
							PropertyName: 'ResourceQuantityDetails',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Quantity Details'
						},
						{
							PropertyName: 'ResourceUoM',
							DomainName: 'code',
							ribFormatMappingName: 'Resource UoM'
						},
						{
							PropertyName: 'Hours/Unit',
							DomainName: 'code',
							ribFormatMappingName: 'Hours/Unit'
						},
						{
							PropertyName: 'CostPerUnit',
							DomainName: 'code',
							ribFormatMappingName: 'CostPerUnit'
						},
						{
							PropertyName: 'Currency',
							DomainName: 'code',
							ribFormatMappingName: 'Currency'
						},
						{
							PropertyName: 'ResourceJob',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Job'
						},
						{
							PropertyName: 'ResourceFixBudget',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Fix Budget'
						},
						{
							PropertyName: 'ResourceBudget',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Budget'
						},
						{
							PropertyName: 'ResourceFixBudgetPerUnit',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Fix Budget/Unit'
						},
						{
							PropertyName: 'ResourceBudgetPerUnit',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Budget/Unit'
						},
						{
							PropertyName: 'ResourceQuantityFactor1',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Quantity Factor 1'
						},
						{
							PropertyName: 'ResourceQuantityFactorDetails1',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Quantity Factor Details 1'
						},
						{
							PropertyName: 'ResourceQuantityFactor2',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Quantity Factor 2'
						},
						{
							PropertyName: 'ResourceQuantityFactorDetails2',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Quantity Factor Details 2'
						},
						{
							PropertyName: 'ResourceQuantityFactor3',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Quantity Factor 3'
						},
						{
							PropertyName: 'ResourceQuantityFactor4',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Quantity Factor 4'
						},
						{
							PropertyName: 'ResourceCostFactor1',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Cost Factor 1'
						},
						{
							PropertyName: 'ResourceCostFactorDetails1',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Cost Factor Details 1'
						},
						{
							PropertyName: 'ResourceCostFactor2',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Cost Factor 2'
						},
						{
							PropertyName: 'ResourceCostFactorDetails2',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Cost Factor Details 2'
						},
						{
							PropertyName: 'EfficiencyFactor1',
							DomainName: 'code',
							ribFormatMappingName: 'Efficiency Factor 1'
						},
						{
							PropertyName: 'EfficiencyFactorDetails1',
							DomainName: 'code',
							ribFormatMappingName: 'Efficiency Factor Details 1'
						},
						{
							PropertyName: 'EfficiencyFactor2',
							DomainName: 'code',
							ribFormatMappingName: 'Efficiency Factor 2'
						},
						{
							PropertyName: 'EfficiencyFactorDetails2',
							DomainName: 'code',
							ribFormatMappingName: 'Efficiency Factor Details 2'
						},
						{
							PropertyName: 'ResourceProductivityFactor',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Productivity Factor'
						},
						{
							PropertyName: 'ResourceProductivityFactorDetail',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Productivity Factor Detail'
						},
						{
							PropertyName: 'ResourceLumpSum',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Lump Sum'
						},
						{
							PropertyName: 'ResourceDisabled',
							DomainName: 'code',
							ribFormatMappingName: 'Resource Disabled'
						},
						{
							PropertyName: 'Co2Project',
							DomainName: 'code',
							ribFormatMappingName: 'CO2/kg (Project)'
						}
					]
				},
				GetSelectedMainEntityCallback: function () {
					let estHeaderFk = estimateMainService.getSelectedEstHeaderId();
					if (estHeaderFk) {
						return estHeaderFk;
					}
					else {
						return null;
					}
				},
				PreventNextStepAsync: function () {
					return $q.when().then(function () {
						return '';
					});
				},
				ShowProtocollAfterImport: true,
			};

			service.getImportOptions = function (estimateMainService) {
				_estimateMainService = estimateMainService;
				setRibExcelMappingNames(importOptions.ImportDescriptor.Fields);
				importOptions.ExcelProfileContexts = [];
				return importOptions;
			};

			return service;
		}
	]);
})(angular);
