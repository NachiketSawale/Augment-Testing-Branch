/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainDetailsParamListConfigService
	 * @function
	 *
	 * @description
	 * This service provides details formula parameter list UI Config for dialog.
	 */
	angular.module(moduleName).factory('estimateMainDetailsParamListConfigService',
		['$injector', 'estimateParamColumnConfigService', 'platformTranslateService', 'estimateCommonLookupValidationService',
			function ($injector, estimateParamColumnConfigService, platformTranslateService, estimateCommonLookupValidationService) {
				let service = {};
				service.getStandardConfigForListView = function(){
					let gridColumns = estimateParamColumnConfigService.getAllColumns(),
						additionalCols = [
							{
								id: 'assignStructId',
								field: 'AssignedStructureId',
								name: 'Assigned Structure',
								width: 120,
								toolTip: 'Assigned Structure',
								name$tr$: 'estimate.parameter.assignedStructure',
								required: false,
								sorting : 10,
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'estimate-main-param-structure-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									dataServiceName: 'estimateMainParamStructureLookupDataService',
									displayMember: 'DescriptionInfo.Translated'
								}
							},
							{
								id: 'info',
								field: 'image',
								name: 'Available',
								width: 50,
								toolTip: 'Available',
								readonly : true,
								name$tr$: 'estimate.main.availableParamInfo',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'estimateMainDetailsParamImageProcessor'
								},
								sorting : 0
							},
							{
								id: 'valuetype',
								field: 'ValueType',
								name: 'Value Type',
								width: 120,
								toolTip: 'Value Type',
								name$tr$: 'estimate.parameter.valueType',
								required: false,
								sorting : 8,
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'estimate-rule-parameter-type-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ParameterValueType',
									dataServiceName: 'estimateRuleParameterTypeDataService',
									displayMember: 'Description'
								}
							},
							{
								id: 'estruleparamvaluefk',
								field: 'EstRuleParamValueFk',
								name: 'Item Value',
								width: 100,
								toolTip: 'Item Value',
								name$tr$: 'estimate.parameter.estRuleParamValueFk',
								required: false,
								sorting : 10,
								editor: 'dynamic',
								formatter: 'dynamic',
								domain: function (item, column) {
									let domain;
									if (item.IsLookup === true) {
										domain = 'lookup';
										column.field = 'EstRuleParamValueFk';
										column.editorOptions = {
											lookupDirective: 'estimate-main-parameter-value-lookup',
											lookupType: 'EstMainParameterValues',
											dataServiceName: 'estimateMainParameterValueLookupService',
											valueMember: 'Id',
											displayMember: 'DescriptionInfo.Translated',
											showClearButton: true
										};
										column.formatterOptions = {
											lookupType: 'EstMainParameterValues',
											dataServiceName: 'estimateMainParameterValueLookupService',
											displayMember: 'DescriptionInfo.Translated',
											'valueMember': 'Id'
										};
									}
									else {
										domain = 'decimal';
										column.DefaultValue = null;
										column.field = 'EstRuleParamValueFk';
										column.editorOptions = null;
										column.formatterOptions = null;
									}
									return domain;
								}
							},
							{
								id: 'prjEstRuleFk',
								field: 'ProjectEstRuleFk',
								name: 'Project Rule',
								width: 120,
								toolTip: 'Project Rule',
								name$tr$: 'estimate.parameter.prjEstRule',
								grouping: {
									title: 'estimate.parameter.prjEstRule',
									getter: 'ProjectEstRuleFk',
									aggregators: [],
									aggregateCollapsed: true
								}
							}
						];

					let prjEstRuleConfig = _.find(additionalCols, function (item) {
						return item.id === 'prjEstRuleFk';
					});

					let prjEstRuleLookupConfig = $injector.get('basicsLookupdataConfigGenerator').provideDataServiceLookupConfig({
						dataServiceName: 'projectEstimateRuleLookupDataService',
						enableCache: true,
						readOnly : true,
						filter: function () {
							let prjId = $injector.get('estimateMainService').getSelectedProjectId();
							return prjId ? prjId : -1;
						}});

					angular.extend(prjEstRuleConfig,prjEstRuleLookupConfig.grid);

					gridColumns = gridColumns.concat(additionalCols);

					angular.forEach(gridColumns, function (column) {
						angular.extend(column, {
							grouping: {
								title: column.name,
								getter: column.field,
								aggregators: [],
								aggregateCollapsed: true,
								generic: true
							},
							sortable: true
						});
					});

					gridColumns = _.sortBy(gridColumns, 'sorting');
					platformTranslateService.translateGridConfig(gridColumns);
					let paramValidationService = $injector.get('estimateMainDetailsParamListValidationService');
					estimateCommonLookupValidationService.addValidationAutomatically(gridColumns, paramValidationService);
					return {
						columns : gridColumns,
						isTranslated : true,
						addValidationAutomatically: true
					};
				};
				return service;
			}
		]);

})(angular);
