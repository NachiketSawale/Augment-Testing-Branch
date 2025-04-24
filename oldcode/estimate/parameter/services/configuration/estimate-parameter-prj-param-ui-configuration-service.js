/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParameterPrjParamUIConfigurationService
	 * @function
	 *
	 * @description
	 * This is the config service for all estimate parameter views.
	 */
	angular.module(moduleName).factory('estimateParameterPrjParamUIConfigurationService', ['basicsLookupdataConfigGenerator','estimateRuleParameterConstant',

		function (basicsLookupdataConfigGenerator,estimateRuleParameterConstant) {

			return {
				getEstimatePrjParamDetailLayout: function () {
					return {
						'fid': 'estimate.parameter.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'descriptioninfo', 'valuedetail', 'parametervalue', 'islookup', 'defaultvalue','valuetype','estruleparamvaluefk','uomfk', 'estparametergroupfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'code':{
								grid:{
									editor: 'directive',
									formatter: 'code',
									required: true,
									editorOptions: {
										showClearButton: true,
										directive: 'estimate-parameter-prj-param-lookup',
										lookupField: 'Code',
										gridOptions: {
											multiSelect: false
										},
										isTextEditable: true,
									}
								}
							},
							'valuetype': {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-rule-parameter-type-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ParameterValueType',
										dataServiceName: 'estimateRuleParameterTypeDataService',
										displayMember: 'Description'
									},
									width: 100
								}
							},
							'estruleparamvaluefk':{
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-parameter-value-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'EstMainParameterValues',
										dataServiceName: 'estimateMainParameterValueLookupService',
										displayMember: 'DescriptionInfo.Translated'
									},
									width: 100
								}
							},
							'defaultvalue': {
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										let domain;
										if(item.ValueType === estimateRuleParameterConstant.Boolean ){

											domain = 'boolean';
											column.DefaultValue = 0;
											column.ValueText = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											column.formatterOptions = null;

										}else if(item.ValueType === estimateRuleParameterConstant.Text || item.ValueType === estimateRuleParameterConstant.TextFormula){

											domain = 'description';
											column.DefaultValue = null;
											column.field = 'ValueText';
											column.editorOptions = null;
											column.formatterOptions = null;
											column.maxLength= 255;
											column.regex = null;

										}else{   // means the valueType is Decimal2 or the valueType is Undefined
											domain = 'quantity';
											column.field = 'DefaultValue';
											column.ValueText = null;
											column.editorOptions = { decimalPlaces: 3 };
											column.formatterOptions = { decimalPlaces: 3 };

										}
										return domain;
									},
									width: 100
								}
							},

							'parametervalue':{
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										let domain;
										if (item.ValueType === estimateRuleParameterConstant.Boolean) {
											domain = 'boolean';
											column.DefaultValue = false;
											column.field = 'ParameterValue';
											column.editorOptions = null;
											column.formatterOptions = null;
											column.regex = null;

										} else if (item.ValueType === estimateRuleParameterConstant.Text ) {

											domain = 'description';
											column.ParameterValue = 0;
											column.field = 'ParameterText';
											column.editorOptions = null;
											column.formatterOptions = null;
											column.maxLength = 255;
											column.regex = null;

										}else if(item.ValueType === estimateRuleParameterConstant.TextFormula){
											domain = 'directive';
											column.field = 'ParameterText';
											column.ValueText = null;
											column.editorOptions = {
												lookupDirective: 'parameter-value-type-text-formula-lookup',
												lookupType: 'ParamValueTypeTextFormulaLookup',
												dataServiceName: 'estimateMainParameterValueLookupService',
												displayMember: 'Value',
												isTextEditable: true,
												multiSelect: true,
												showClearButton: true
											};

											column.formatterOptions = {
												lookupType: 'ParamValueTypeTextFormulaLookup',
												dataServiceName: 'estimateMainParameterValueLookupService',
												displayMember: 'Value',
												field: 'ParameterText',
												isTextEditable: true,
												multiSelect: true
											};
										}else {   // means the valueType is Decimal2 or the valueType is Undefined
											domain = 'quantity';
											column.DefaultValue = null;
											column.field = 'ParameterValue';
											column.editorOptions = {decimalPlaces: 3};
											column.formatterOptions = {decimalPlaces: 3};
										}

										return domain;
									},
									width: 100
								}
							},

							'estparametergroupfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.parametergroup'),
							'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true })

						}
					};
				}
			};
		}
	]);
})(angular);

