/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainResourceSummaryCombineUIService
	 * @function
	 *
	 * @description
	 * This service provides Estimate  resource summary Configuration Grid UI Config for config dialog.
	 */
	angular.module(moduleName).factory('estimateMainResourceSummaryCombineUIService',
		['basicsLookupdataConfigGenerator', 'platformTranslateService', 'basicsLookupdataSimpleLookupService', 'estimateMainResourceSummaryColumnFilterLookupService',
			function (basicsLookupdataConfigGenerator, platformTranslateService, basicsLookupdataSimpleLookupService, estimateMainResourceSummaryColumnFilterLookupService) {

				let service = {};

				let gridColumns = [
					{
						id: 'f1',
						field: 'ColumnId',
						name: 'Column ID',
						name$tr$: 'estimate.main.summaryConfig.gridConfigColumnIdEntity',
						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-resource-summary-column-ids-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EstSummaryColumnId',
							displayMember: 'Description',
							dataServiceName: 'estimateMainResourceSummaryColumnIdsComboboxService'
						},
						mandatory: true,
						required: true,
						width: 200
					},
					{
						id: 'f2',
						field: 'ExceptionKeyValues',
						name: 'Details',
						name$tr$: 'estimate.main.summaryConfig.exceptionKeys',
						width: 100,
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'estimate.lookup.costtype',
							displayMember: 'Description',
							valueMember: 'Id'
						},
						formatter: function displayFormatter(value, lookupItem, displayValue, lookupConfig, _data) {
							let data = displayValue || [];
							return estimateMainResourceSummaryColumnFilterLookupService.getFormatter(data, lookupItem, displayValue, lookupConfig, _data);
						},
						editor: 'directive',
						editorOptions: {
							directive: 'estimate-main-resource-summary-column-filter-lookup'
						}
					}
				];

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function () {
					return {
						addValidationAutomatically: false,
						columns: gridColumns
					};
				};

				return service;
			}
		]);
})(angular);
