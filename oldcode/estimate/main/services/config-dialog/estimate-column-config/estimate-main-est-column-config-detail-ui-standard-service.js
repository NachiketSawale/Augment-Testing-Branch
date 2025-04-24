/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainEstColumnConfigDetailUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('estimateMainEstColumnConfigDetailUIStandardService', [
		'basicsLookupdataConfigGenerator', 'platformTranslateService', 'estimateMainCostCodeAssignmentDetailLookupDataService',
		function (basicsLookupdataConfigGenerator, platformTranslateService, estimateMainCostCodeAssignmentDetailLookupDataService) {

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
						id: 'estColumnId',
						field: 'ColumnId',
						name: 'Column ID',
						name$tr$: moduleName + '.columnConfigDetails.ColumnId',
						toolTip: 'Column ID',
						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-column-config-column-ids-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'DynamicColumns',
							displayMember: 'Description',
							dataServiceName: 'estimateMainEstColumnConfigColumnIdsComboboxService'
						},
						mandatory: true,
						required: true,
						width: 110
					},
					{
						id: 'estLineType',
						field: 'LineType',
						name: 'Type',
						name$tr$: moduleName + '.columnConfigDetails.LineType',
						toolTip: 'Type',
						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-column-config-line-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'getlinetypes',
							displayMember: 'ShortKeyInfo.Translated',
							dataServiceName: 'estimateMainEstColumnConfigLineTypeComboboxService'
						},
						mandatory: true,
						width: 60
					},
					{
						id: 'estMdcCostCodeFk',
						field: 'MdcCostCodeFk',
						name: 'Code',
						name$tr$: moduleName + '.columnConfigDetails.MdcCostCodeFk',
						toolTip: 'Code',
						editor: 'directive',
						editorOptions: {
							directive:  editType === 'estimate'? 'estimate-main-master-project-cost-code-lookup': 'estimate-main-cost-code-assignment-detail-lookup',
						},
						formatter: 'lookup',
						formatterOptions: formatterOptions,
						width: 80
					},
					{
						id: 'estMdcCostCodeDescription',
						field: 'MdcCostCodeFk',
						name: 'Cost Code Description',
						name$tr$: moduleName + '.columnConfigDetails.MdcCostCodeFkDescription',
						toolTip: 'Cost Code Description',
						formatter: 'lookup',
						formatterOptions: formatterOptionsDescription,
						readonly: true,
						width: 140
					},
					{
						id: 'estMaterialLineId',
						field: 'MaterialLineId',
						name: 'Material ID',
						name$tr$: moduleName + '.columnConfigDetails.MaterialLineId',
						toolTip: 'Material ID',
						editor: 'integer',
						formatter: 'integer',
						width: 60
					},
					{
						id: 'estColumnHeader',
						field: 'DescriptionInfo',
						name: 'Column Header',
						name$tr$: moduleName + '.columnConfigDetails.Description',
						toolTip: 'Column Header',
						editor: 'directive',
						editorOptions: {
							directive: 'basics-common-translate-cell',
							dataService: 'estimateMainEstColumnConfigDetailDataService',
							containerDataFunction: 'getContainerData'
						},
						formatter: 'translation',
						width: 160
					}
				];

				platformTranslateService.translateGridConfig(gridColumns);

				return gridColumns;
			};

			service.getStandardConfigForListView = function () {
				return {
					addValidationAutomatically: true,
					columns: service.getGridColumns()
				};
			};

			return service;
		}]);
})();
