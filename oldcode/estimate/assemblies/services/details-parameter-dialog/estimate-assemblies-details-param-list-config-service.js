/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateMainDetailsParamListConfigService
	 * @function
	 *
	 * @description
	 * This service provides details formula parameter list UI Config for dialog.
	 */
	angular.module(moduleName).factory('estimateAssembliesDetailsParamListConfigService',
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
									lookupDirective: 'estimate-assemblies-param-structure-combobox',
									lookupOptions: {
										'events': [
											{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													let selectedItem = args.selectedItem;
													let item = args.entity;
													if (selectedItem && item) {
														let detailsParamListDataService =  $injector.get('estimateAssembliesDetailsParamListDataService');
														let itemsCache = detailsParamListDataService.getItemsTOCache();
														item.AssignedStructureId = 1001;
														item.SameCodeButNoConlict = false;
														$injector.get('estimateMainCommonFeaturesService').changeAssignedStructureId(item, itemsCache);

														detailsParamListDataService.onUpdateList.fire([item]);
													}
												}
											}
										]
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									dataServiceName: 'estimateAssembliesParamStructureLookupDataService',
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
							}
						];

					gridColumns = gridColumns.concat(additionalCols);
					gridColumns = _.sortBy(gridColumns, 'sorting');
					platformTranslateService.translateGridConfig(gridColumns);
					let paramValidationService = $injector.get('estimateAssembliesDetailsParamListValidationService');
					estimateCommonLookupValidationService.addValidationAutomatically(gridColumns, paramValidationService);
					return {
						columns : gridColumns,
						isTranslated : true
					};
				};
				return service;
			}
		]);

})(angular);
