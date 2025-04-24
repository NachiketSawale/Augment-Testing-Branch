/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainLineItemParameterUiService', [
		'_','$injector', 'estimateParamColumnConfigService', 'platformTranslateService', 'estimateCommonLookupValidationService',
		function (_, $injector, estimateParamColumnConfigService, platformTranslateService, estimateCommonLookupValidationService){
			let service = {};
			service.getStandardConfigForListView = function(){
				let gridColumns = angular.copy( estimateParamColumnConfigService.getAllColumns()),
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
					return item.field === 'ProjectEstRuleFk';
				});

				let prjEstRuleLookupConfig = $injector.get('basicsLookupdataConfigGenerator').provideDataServiceLookupConfig({
					dataServiceName: 'projectEstimateRuleLookupDataService',
					enableCache: true,
					readOnly : true,
					filter: function () {
						let prjId = $injector.get('estimateMainService').getSelectedProjectId();
						return prjId ? prjId : -1;
					}});

				delete prjEstRuleLookupConfig.grid.editor;
				delete prjEstRuleLookupConfig.grid.editorOptions;

				angular.extend(prjEstRuleConfig,prjEstRuleLookupConfig.grid);

				_.forEach(gridColumns,function (column) {
					if(['code','desc','estparamgrpfk','islookup','defaultvalue'].indexOf(column.id) > -1){
						delete column.editor;
						delete column.editorOptions;
					}
				});

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

			service.getDtoScheme = function () {
				return {};
			};

			return service;

		}]);

})(angular);