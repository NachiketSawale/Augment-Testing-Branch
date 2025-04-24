/**
 * Created by sus on 2015/6/5.
 */

(function (angular) {

	'use strict';

	angular.module('basics.common').factory('basicsCommonEvaluationFormatter',
		['$injector', 'basicsCommonFormatterHelper', function ($injector, basicsCommonFormatterHelper) {
			return function evaluationFormatter(row, cell, value, columnDef, dataContext) {

				const result = '@image@<span style="padding-left:4px;">@result@</span>';
				const options = columnDef.formatterOptions;

				const item = basicsCommonFormatterHelper.getValue(dataContext, columnDef.field);
				let icon = '';
				if (options.imageSelector) {
					icon = $injector.get(options.imageSelector).select(item);
				}
				if (angular.isString(options.displayMember)) {
					value = basicsCommonFormatterHelper.getValue(item || {}, options.displayMember, options.formatterDictionary);
				}

				if (icon) {
					icon = '<img alt="" src="' + icon + '">';
				}
				return result.replace('@image@', icon || '').replace('@result@', value || '');
			};

		}]);

})(angular);