/**
 * Created by zos on 3/14/2018.
 */

(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainDeatailsParamListProcessor', ['$injector', 'platformRuntimeDataService',
		function ($injector, platformRuntimeDataService) {

			var service = {
				processItems: processItems
			};

			var valueTypes = $injector.get('estimateRuleParameterConstant');

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

				if (item.ValueType === valueTypes.Decimal2 && !item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: true});

				} else if (item.ValueType === valueTypes.Text && !item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: true});
				} else if (item.ValueType === valueTypes.Decimal2 && item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: false});
					fields.push({field: 'ParameterValue', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});
					fields.push({field: 'DefaultValue', readonly: true});
					fields.push({field: 'ParameterText', readonly: true});
					fields.push({field: 'ValueText', readonly: true});

				} else if (item.ValueType === valueTypes.Text && item.IsLookup) {

					fields.push({field: 'EstRuleParamValueFk', readonly: false});
					fields.push({field: 'ParameterValue', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});
					fields.push({field: 'ValueText', readonly: true});
					fields.push({field: 'ParameterText', readonly: true});
					fields.push({field: 'DefaultValue', readonly: true});

				} else if (item.ValueType === valueTypes.Boolean) {

					fields.push({field: 'EstRuleParamValueFk', readonly: true}, {field: 'IsLookup', readonly: true});
					fields.push({field: 'ValueDetail', readonly: true});

				} else if (item.ValueType === valueTypes.Text) {

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
