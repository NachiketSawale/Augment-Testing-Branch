/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCostCodeAssignmentDetailUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('estimateMainCostCodeAssignmentDetailUIConfigurationService', ['platformTranslateService', 'estimateMainCostCodeAssignmentDetailLookupDataService',
		function (platformTranslateService, estimateMainCostCodeAssignmentDetailLookupDataService) {

			let service = {};

			service.getGridColumns = function() {
				let editType = estimateMainCostCodeAssignmentDetailLookupDataService.getEditType();

				let formatterOptions = {};
				if (editType === 'estimate'){
					formatterOptions = {
						lookupType: 'estmasterprojectcostcode',
						dataServiceName: 'estimateMainOnlyCostCodeAssignmentDetailLookupDataService',
						displayMember: 'Code'
					};
				}else{
					formatterOptions = {
						lookupType: 'costcode',
						displayMember: 'Code',
						version: 3
					};
				}

				let formatterOptionsDescription = {};
				if (editType === 'estimate'){
					formatterOptionsDescription = {
						lookupType: 'estmasterprojectcostcode',
						dataServiceName: 'estimateMainOnlyCostCodeAssignmentDetailLookupDataService',
						displayMember: 'DescriptionInfo.Translated'
					};
				}else{
					formatterOptionsDescription = {
						lookupType: 'costcode',
						displayMember: 'DescriptionInfo.Translated',
						version: 3
					};
				}

				let gridColumns = [
					{
						id: 'estMdcCostCodeFk',
						field: 'MdcCostCodeFk',
						name: 'Code',
						name$tr$: 'estimate.main.costCodeAssignmentDetails.MdcCostCodeFk',
						toolTip: 'Code',
						sortable: true,
						editor: 'directive',
						editorOptions: {
							usageContext: 'estimateMainCostCodeAssignmentDetailDataService',
							directive:  editType === 'estimate'? 'estimate-main-master-project-cost-code-lookup': 'estimate-main-cost-code-assignment-detail-lookup',
							gridOptions: {
								multiSelect: true
							}
						},
						formatter: 'lookup',
						formatterOptions: formatterOptions,
						width: 80
					},
					{
						id: 'description',
						field: 'MdcCostCodeFk',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						toolTip: 'Description',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: formatterOptionsDescription,
						readonly: true,
						width: 160
					},
					{
						id: 'Type',
						field: 'CostcodeTypeFk',
						name: 'Type',
						name$tr$: 'estimate.main.costCodeAssignmentDetails.Type',
						toolTip: 'Type',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.costcodes.costcodetype',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						readonly: true,
						width: 160
					},
					{
						id: 'estBasUoMFk',
						field: 'BasUomFk',
						name: 'UoM',
						name$tr$: 'estimate.main.totalsConfigDetails.BasUoMFk',
						toolTip: 'UoM',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						},
						readonly: true,
						width: 80
					},
					{
						id: 'currency',
						field: 'CurrencyFk',
						name: 'Currency',
						name$tr$: 'estimate.main.costCodeAssignmentDetails.Currency',
						toolTip: 'Currency',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'currency',
							displayMember: 'Currency'
						},
						readonly: true,
						width: 60
					},
					{
						id: 'calculateway',
						field: 'Addorsubtract',
						name: '+/-',
						name$tr$: 'estimate.main.costCodeAssignmentDetails.AddandSubtract',
						toolTip: '+/-',
						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-cost-code-add-subtract-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'getaddsubtracts',
							displayMember: 'ShortKeyInfo.Translated',
							dataServiceName: 'estimateMainEstCostcodeAddSubtractComboboxService'
						},
						mandatory: true,
						width: 60
					},
					{
						id: 'isDirectRulesCost',
						field: 'IsDirectRulesCost',
						name: 'DirectRulesCost',
						name$tr$: 'estimate.main.costCodeAssignmentDetails.DirectRulesCost',
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: false,
						width: 100
					},
					{
						id: 'isDirectEnteredCost',
						field: 'IsDirectEnteredCost',
						name: 'DirectEnteredCost',
						name$tr$: 'estimate.main.costCodeAssignmentDetails.DirectEnteredCost',
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: false,
						width: 120
					},
					{
						id: 'isIndirectCost',
						field: 'IsIndirectCost',
						name: 'IndirectCost',
						name$tr$: 'estimate.main.costCodeAssignmentDetails.IsIndirectCost',
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: false,
						width: 100
					},
					{
						id: 'isCostRisk',
						field: 'IsCostRisk',
						name: 'CostRisk',
						name$tr$: 'estimate.main.costCodeAssignmentDetails.IsCostRisk',
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: false,
						width: 60
					},
					{
						id: 'isNonCostRisk',
						field: 'IsNonCostRisk',
						name: 'Non CostRisk',
						name$tr$: 'estimate.main.costCodeAssignmentDetails.IsNonCostRisk',
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: false,
						width: 100
					}
				];

				platformTranslateService.translateGridConfig(gridColumns);

				return gridColumns;
			};

			service.getStandardConfigForListView = function(){

				return{
					addValidationAutomatically: true,
					columns : service.getGridColumns()
				};
			};

			return service;
		}]);
})(angular);
