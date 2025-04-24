/**
 * Created by spr on 2017-05-10.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleParameterValueUIConfigurationService', ['$injector','estimateRuleParameterConstant',
		function ($injector,estimateRuleParameterConstant) {
			return {
				'fid': 'estimate.rule.parametervalue.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['description', 'valuedetail', 'value', 'isdefault', 'parametercode', 'valuetype', 'sorting']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'description':{
						required: true,
						'grid': {
							editor: 'dynamic',
							formatter: 'dynamic',
							domain: function (entity, column) {
								let item = $injector.get('estimateRuleParameterService').getSelected();
								let domain ='description';
								if(item !== null) {
									if(item.ValueType === estimateRuleParameterConstant.TextFormula){
										column.regex ='^([a-zA-Z0-9\\u4e00-\\u9fa5])*$';
									}else{
										column.regex = null;
									}
								}
								return domain;
							},
							width: 100
						}

					},
					'parametercode': {
						'grid': {
							editor: 'directive',
							formatter: 'code',
							required: true,
							editorOptions: {
								showClearButton: true,
								directive: 'estimate-rule-parameter-code-lookup',
								lookupField: 'Code',
								gridOptions: {
									multiSelect: false
								}
							}
						}
					},
					'value': {
						'grid': {
							editor: 'dynamic',
							formatter: 'dynamic',
							domain: function (item, column) {
								let domain ='quantity';
								if(item !== null) {
									if(item.ValueType === estimateRuleParameterConstant.Text || item.ValueType === estimateRuleParameterConstant.TextFormula){
										domain = 'description';
										column.field = 'ValueText';
										column.editorOptions = null;
										column.formatterOptions = null;
										column.maxLength=255;
										column.regex = null;

									}else{   // means the valueType is Decimal2 or is Boolean or the valueType is Undefined
										domain = 'quantity';
										column.field = 'Value';
										column.editorOptions = {decimalPlaces: 3};
										column.formatterOptions = {decimalPlaces: 3};
									}

								}
								return domain;
							},
							width: 100
						}
					},
					'valuetype': {
						'readonly': true,
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
					}
				}
			};
		}
	]);
})(angular);
