/**
 * Created by zos on 6/6/2018.
 */

(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainParamListProcessor', ['$injector', 'platformRuntimeDataService', 'estimateRuleParameterConstant',
		function ($injector, platformRuntimeDataService, estimateRuleParameterConstant) {

			var service = {
				processItems: processItems
			};

			// TO DO: set detail by culture
			var culture = $injector.get('platformContextService').culture();
			var cultureInfo = $injector.get('platformLanguageService').getLanguageInfo(culture);
			var numberDecimal = cultureInfo.numeric.decimal;

			// var numberThousand = cultureInfo.numeric.thousand;

			function processItem(item) {
				var fields = [];
				if (item && !item.Action) {
					fields.push({field: 'DefaultValue', readonly: true});
					fields.push({field: 'ValueType', readonly: true});
					fields.push({field: 'IsLookup', readonly: true});
				}

				fields.push({field: 'IsLookup', readonly: true});

				if (item.ValueType === estimateRuleParameterConstant.Decimal2 && !item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: true});

				} else if (item.ValueType === estimateRuleParameterConstant.Text && !item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: true});
				} else if (item.ValueType === estimateRuleParameterConstant.Decimal2 && item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: false});
					fields.push({field: 'ParameterValue', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});
					fields.push({field: 'DefaultValue', readonly: true});
					fields.push({field: 'ParameterText', readonly: true});
					fields.push({field: 'ValueText', readonly: true});

				} else if (item.ValueType === estimateRuleParameterConstant.Text && item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: false});
					fields.push({field: 'ParameterValue', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});
					fields.push({field: 'ValueText', readonly: true});
					fields.push({field: 'ParameterText', readonly: true});
					fields.push({field: 'DefaultValue', readonly: true});

				} else if (item.ValueType === estimateRuleParameterConstant.Boolean) {

					fields.push({field: 'EstRuleParamValueFk', readonly: true}, {field: 'IsLookup', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});

				} else if (item.ValueType === estimateRuleParameterConstant.Text) {

					fields.push({field: 'EstRuleParamValueFk', readonly: true}, {field: 'IsLookup', readonly: true});
					fields.push({field: 'ValueText', readonly: true});
				}

				if (item.ValueDetail !== null && _.isString(item.ValueDetail)) {
					item.ValueDetail = item.ValueDetail.replace(/[.]/gi, numberDecimal);
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
