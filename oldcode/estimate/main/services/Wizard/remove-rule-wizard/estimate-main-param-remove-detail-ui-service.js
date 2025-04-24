
(function () {
	'use strict';
	/* global _ */
	angular.module('estimate.main').factory('estimateMainParamRemoveDetailUIService',
		['$injector', 'estimateParamColumnConfigService', 'platformTranslateService',
			function ($injector, estimateParamColumnConfigService, platformTranslateService) {
				let service = {};
				service.getStandardConfigForListView = function () {
					let columns = [
						{
							id: 'isChecked',
							field: 'isChecked',
							name: 'Select',
							name$tr$: 'basics.common.checkbox.select',
							formatter: 'boolean',
							editor: 'boolean',
							headerChkbox: true,
							cssClass: 'cell-center',
							width: 50,
							sorting: 1,
							sortOrder: 0
						}
					];

					let gridColumns = estimateParamColumnConfigService.getAllColumns();
					let sorting = 2;
					_.forEach(gridColumns, function (d) {
						d.sorting = sorting;
						d.sortOrder = sorting;
						sorting++;
					});
					columns = columns.concat(gridColumns);
					let additionalCols = [
						{
							id: 'valuetype',
							field: 'ValueType',
							name: 'Value Type',
							width: 120,
							toolTip: 'Value Type',
							name$tr$: 'estimate.parameter.valueType',
							required: false,
							sorting: 11,
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'estimate-rule-parameter-type-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ParameterValueType',
								dataServiceName: 'estimateRuleParameterTypeDataService',
								displayMember: 'Description'
							},
							sortOrder: 11
						},
						{
							id: 'estruleparamvaluefk',
							field: 'EstRuleParamValueFk',
							name: 'Item Value',
							width: 100,
							toolTip: 'Item Value',
							name$tr$: 'estimate.parameter.estRuleParamValueFk',
							required: false,
							sorting: 12,
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
								} else {
									domain = 'decimal';
									column.DefaultValue = null;
									column.field = 'EstRuleParamValueFk';
									column.editorOptions = null;
									column.formatterOptions = null;
								}
								return domain;
							},
							sortOrder: 12
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
							},
							sortOrder: 13
						}
					];

					let prjEstRuleConfig = _.find(additionalCols, function (item) {
						return item.id === 'prjEstRuleFk';
					});

					let prjEstRuleLookupConfig = $injector.get('basicsLookupdataConfigGenerator').provideDataServiceLookupConfig({
						dataServiceName: 'projectEstimateRuleLookupDataService',
						enableCache: true,
						readOnly: true,
						filter: function () {
							let prjId = $injector.get('estimateMainService').getSelectedProjectId();
							return prjId ? prjId : -1;
						}
					});

					angular.extend(prjEstRuleConfig, prjEstRuleLookupConfig.grid);

					columns = columns.concat(additionalCols);

					angular.forEach(columns, function (column) {
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
					columns = _.sortBy(columns, 'sortOrder');
					platformTranslateService.translateGridConfig(columns);
					return {
						columns: columns,
						isTranslated: true,
						addValidationAutomatically: false
					};
				};
				return service;
			}
		]);

})(angular);
