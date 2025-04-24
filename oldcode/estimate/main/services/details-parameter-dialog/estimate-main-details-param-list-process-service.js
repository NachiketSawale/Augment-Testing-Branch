/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainDeatailsParamListProcessor', ['_', '$injector', 'platformRuntimeDataService', 'estimateRuleParameterConstant',
		function (_, $injector, platformRuntimeDataService, estimateRuleParameterConstant) {

			let service = {
				processItems: processItems,
				processItem:processItem
			};

			let valueTypes = estimateRuleParameterConstant;

			// TO DO: set detail by culture
			let culture = $injector.get('platformContextService').culture();
			let cultureInfo = $injector.get('platformLanguageService').getLanguageInfo(culture);
			let numberDecimal = cultureInfo.numeric.decimal;

			function processItem(item) {
				let fields = [];
				if (item && (!item.Action || item.Action === 'ToSave')){

					fields.push({field: 'ValueType', readonly: !item.isFromProjectParameter});
					fields.push({field: 'IsLookup', readonly: !item.isFromProjectParameter});
				}

				fields.push({field: 'DefaultValue', readonly: true});
				// fields.push({field: 'IsLookup', readonly: true});
				fields.push({field: 'ProjectEstRuleFk', readonly: true});

				if (item.ValueType === valueTypes.Decimal2 && !item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: true});
					fields.push({field: 'ValueDetail', readonly: false});

				}else if(item.ValueType === valueTypes.Text && !item.IsLookup){

					fields.push({field: 'EstRuleParamValueFk', readonly: true});
				}
				else if (item.ValueType === valueTypes.Decimal2 && item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: false});
					fields.push({field: 'ParameterValue', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});
					fields.push({field: 'ParameterText', readonly: true});
					fields.push({field: 'ValueText', readonly: true});

				}else if(item.ValueType === valueTypes.Text && item.IsLookup){

					fields.push({field: 'EstRuleParamValueFk', readonly: false});
					fields.push({field: 'ParameterValue', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});
					fields.push({field: 'ValueText', readonly: true});
					fields.push({field: 'ParameterText', readonly: true});

				}
				else if (item.ValueType === valueTypes.Boolean) {

					fields.push({field: 'EstRuleParamValueFk', readonly: true}, {field: 'IsLookup', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});

				}else if(item.ValueType === valueTypes.Text){

					fields.push({field: 'EstRuleParamValueFk', readonly: true}, {field: 'IsLookup', readonly: true});
					fields.push({field: 'ValueText', readonly: true});
					fields.push({field: 'ValueDetail', readonly: false});

				}else if(item.ValueType === valueTypes.TextFormula &&  item.IsLookup){
					fields.push({field: 'EstRuleParamValueFk', readonly: true}, {field: 'IsLookup', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});
					fields.push({field: 'ValueText', readonly: true});
					fields.push({field: 'ParameterText', readonly: false});
					item.EstRuleParamValueFk = null;
				}

				if(item.ValueDetail !== null && _.isString(item.ValueDetail)){
					item.ValueDetail = item.ValueDetail.replace(/[.]/gi, numberDecimal);
				}

				if(item.isFormulaFromBoq){
					fields.push({field: 'AssignedStructureId', readonly: true});
					fields.push({field: 'EstRuleParamValueFk', readonly: true});
				}

				if (fields.length > 0) {
					platformRuntimeDataService.readonly(item, fields);
				}
			}

			function processItems(items) {
				angular.forEach(items, function (item) {
					processItem(item);
				});
			}

			return service;

		}]);
})(angular);
