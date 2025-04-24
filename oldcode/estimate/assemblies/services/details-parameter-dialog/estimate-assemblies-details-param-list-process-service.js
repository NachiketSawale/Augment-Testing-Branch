/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	angular.module('estimate.assemblies').factory('estimateAssembliesDetailsParamListProcessor',
		['platformRuntimeDataService', 'estimateRuleParameterConstant',
			function (platformRuntimeDataService,estimateRuleParameterConstant) {

				let service = {
					processItems : processItems
				};

				let valueTypes = estimateRuleParameterConstant;

				function processItem(item) {
					let fields = [];
					fields.push({field: 'AssignedStructureId', readonly: true});

					if (item && !item.Action) {
						fields.push({field: 'DefaultValue', readonly: true});
						fields.push({field: 'ValueType', readonly: true});
						fields.push({field: 'IsLookup', readonly: true});
					}

					if (item.ValueType === valueTypes.Decimal2 && !item.IsLookup) {

						fields.push({field: 'EstRuleParamValueFk', readonly: true});

					}else if(item.ValueType === valueTypes.Text && !item.IsLookup){

						fields.push({field: 'EstRuleParamValueFk', readonly: true});

					}else if(item.ValueType === valueTypes.Text && item.IsLookup){

						fields.push({field: 'EstRuleParamValueFk', readonly: false});
						fields.push({field: 'ParameterValue', readonly: true});
						fields.push({field: 'ValueDetail', readonly: true});
						fields.push({field: 'ValueText', readonly: true});
						fields.push({field: 'ParameterText', readonly: true});


					}else if (item.ValueType === valueTypes.Decimal2 && item.IsLookup) {

						fields.push({field: 'EstRuleParamValueFk', readonly: false});
						fields.push({field: 'ParameterValue', readonly: true});
						fields.push({field: 'ValueDetail', readonly: true});
						fields.push({field: 'DefaultValue', readonly: true});
						fields.push({field: 'ParameterText', readonly: true});
					}
					else if (item.ValueType === valueTypes.Boolean) {

						fields.push({field: 'EstRuleParamValueFk', readonly: true}, {field: 'IsLookup', readonly: true});
						fields.push({field: 'ValueDetail', readonly: true});

					}else if (item.ValueType === valueTypes.Text) {

						fields.push({field: 'EstRuleParamValueFk', readonly: true}, {field: 'IsLookup', readonly: true});
						fields.push({field: 'ValueText', readonly: true});
						fields.push({field: 'DefaultValue', readonly: true});
					}


					if (fields.length > 0) {
						platformRuntimeDataService.readonly(item, fields);
					}
				}

				function processItems(items) {
					angular.forEach(items, function(item){
						processItem(item);
					});
				}

				return service;

			}]);
})(angular);
