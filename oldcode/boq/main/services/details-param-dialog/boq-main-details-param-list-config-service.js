/**
 * Created by zos on 3/14/2018.
 */
(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainDetailsParamListConfigService
	 * @function
	 *
	 * @description
	 * This service provides details formula parameter list UI Config for dialog.
	 */
	angular.module(moduleName).factory('boqMainDetailsParamListConfigService',
		['$injector', 'estimateParamColumnConfigService', 'platformTranslateService', 'estimateCommonLookupValidationService',
			function ($injector, estimateParamColumnConfigService, platformTranslateService, estimateCommonLookupValidationService) {
				var service = {};
				service.getStandardConfigForListView = function () {
					var gridColumns = estimateParamColumnConfigService.getAllColumns(),
						additionalCols = [
							{
								id: 'assignStructId',
								field: 'AssignedStructureId',
								name: 'Assigned Structure',
								width: 120,
								toolTip: 'Assigned Structure',
								name$tr$: 'estimate.parameter.assignedStructure',
								required: false,
								sorting: 10,
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'boq-main-param-structure-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									dataServiceName: 'boqMainParamStructureLookupDataService',
									displayMember: 'DescriptionInfo.Translated'
								}
							},
							{
								id: 'info',
								field: 'image',
								name: 'Available',
								width: 50,
								toolTip: 'Available',
								readonly: true,
								name$tr$: 'estimate.main.availableParamInfo',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'estimateMainDetailsParamImageProcessor'
								},
								sorting: 0
							},
							{
								id: 'valuetype',
								field: 'ValueType',
								name: 'Value Type',
								width: 120,
								toolTip: 'Value Type',
								name$tr$: 'estimate.parameter.valueType',
								required: false,
								sorting: 8,
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
								sorting: 10,
								editor: 'dynamic',
								formatter: 'dynamic',
								domain: function (item, column) {
									var domain;
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
								}
							}
						];

					gridColumns = gridColumns.concat(additionalCols);
					gridColumns = _.sortBy(gridColumns, 'sorting');
					platformTranslateService.translateGridConfig(gridColumns);
					var paramValidationService = $injector.get('boqMainDetailsParamListValidationService');
					estimateCommonLookupValidationService.addValidationAutomatically(gridColumns, paramValidationService);
					return {
						columns: gridColumns,
						isTranslated: true
					};
				};
				return service;
			}
		]);

})(angular);
