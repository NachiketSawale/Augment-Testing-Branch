/**
 * Created by wul on 1/15/2019.
 */
(function () {

	'use strict';

	let moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonStringFormatService
	 * @function
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCommonStringFormatService', ['_', '$translate', '$injector',
		function (_, $translate, $injector) {

			let service = {};

			service.validateInvalidFormulaChar = function (str) {

				if (str.match(/[`§@#$?:"\\]/gi)) {
					return {
						valid: false,
						error: $translate.instant('basics.common.error.invalidChar', {invalidChar: '`§@#$?: \'\'\\'})
					};
				}

				return {
					valid: true,
					error: ''
				};
			};

			service.validateInvalidChar = function (str, ignoreReg) {
				let errorInfo = '`~§!@#$&|=?;:\' \'\'<>{}[]\\￥【】《》？、。，‘“；';
				if(ignoreReg){
					str = str.replace(ignoreReg, '');
					errorInfo = errorInfo.replace(ignoreReg, '');
				}

				if (str.match(/[`~§!@#$&|=?;:'"<>{}[\]\\￥【】《》？、。，‘“；]/gi)) {
					return {
						valid: false,
						error: $translate.instant('basics.common.error.invalidChar', {invalidChar: errorInfo})
					};
				}

				return {
					valid: true,
					error: ''
				};
			};

			service.includeChineseChar = function (str) {
				if (str.match(/[\u4e00-\u9fa5]/gi)) {
					return {
						valid: false,
						error: $translate.instant('basics.common.error.includeChineseChar')
					};
				}

				return {
					valid: true,
					error: ''
				};
			};

			// check invalid parameter
			// e.g.  x.2 x1.2 2.x 2.2x 2x x.x x2.2x .x .2 x. 2.
			service.validateInvalidParameter = function (param) {
				if (param.match(/(\d+\.*[a-zA-Z\u4e00-\u9fa5]+)|([a-zA-Z\u4e00-\u9fa5]+\d*\.[a-zA-Z0-9\u4e00-\u9fa5]*)|(^[.,].*)|(^.*[.,]$)/gi)) {
					return {
						valid: false,
						error: $translate.instant('basics.common.error.invalidParam')
					};
				}

				return {
					valid: true,
					error: ''
				};
			};

			service.detail2CultureFormatter = function (row, cell, value, columnDef, dataContext) {
				let formatter = $injector.get('platformGridDomainService').formatter('description');
				// has errors or no defined value, will no change.
				if ((dataContext.__rt$data && dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field]) ||
					angular.isUndefined(value) || value === null) {
					return formatter(row, cell, value, columnDef, dataContext);
				}

				let formattedValue;
				// replace decimal as current culture
				let cultureInfo = $injector.get('platformLanguageService').getLanguageInfo($injector.get('platformContextService').culture());
				if (value && cultureInfo && cultureInfo.numeric && cultureInfo.numeric.decimal !== '.') {
					formattedValue = _.isString(value) ? value.replace(/[.]/gi, cultureInfo.numeric.decimal) : value.toString().replace(/[.]/gi, cultureInfo.numeric.decimal);
				} else {
					formattedValue = value;
				}

				dataContext[columnDef.field] = formattedValue;
				formattedValue = formatter(row, cell, formattedValue, columnDef, dataContext);

				return formattedValue;
			};

			service.format = function format(string) {
				let s = string;
				let replacements = _.drop(arguments, 1);
				let i = 0;
				_.forEach(replacements, function (replacement) {
					s = s.replace(new RegExp('\\{' + i + '\\}'), replacement);
					++i;
				});
				return s;
			};

			/*
			* base on mouse section on formula string, use variables to replace it
			* */
			service.appendVariables = function appendVariables(formulaStr, variables, sectionStart, sectionEnd) {
				if(!formulaStr || formulaStr === ''){
					return variables;
				}

				let start = getLeftIndex(formulaStr,sectionStart);
				let end = getRightIndex(formulaStr,sectionEnd);

				formulaStr = formulaStr.slice(0, start) + variables + formulaStr.slice(end);


				return formulaStr;
			};

			service.getSelectionVariables = function getSelectionVariables(formulaStr, sectionStart, sectionEnd) {
				if(!formulaStr || formulaStr === ''){
					return formulaStr;
				}
				return formulaStr.substring(getLeftIndex(formulaStr, sectionStart), getRightIndex(formulaStr, sectionEnd));
			};

			let pRegex = new RegExp('^[a-zA-Z0-9_]+$', 'g');
			function getLeftIndex(formulaStr,sectionStart) {
				let start = sectionStart;
				if (start === 0) {
					return start;
				}
				let formula = formulaStr;

				let left = start - 1;
				while (left >= 0) {
					let previous = formula.substring(left, start);
					pRegex.lastIndex = 0;
					if (!pRegex.test(previous)) {
						break;
					}
					left--;
				}
				return left + 1;
			}

			function getRightIndex(formulaStr,sectionEnd) {
				let end = sectionEnd;
				let formula = formulaStr;
				if (end === formula.length) {
					return end;
				}

				let right = end + 1;
				while (right <= formula.length) {
					let next = formula.substring(end, right);
					pRegex.lastIndex = 0;
					if (!pRegex.test(next)) {
						break;
					}
					right++;
				}
				return right - 1;
			}

			// replace variables by its value
			service.replaceVar2Value = function replaceVar2Value(formulaStr, variables, value) {
				if(!formulaStr || formulaStr === '' || !variables || variables === ''){
					return formulaStr;
				}

				let regex = new RegExp('\\b' + variables + '\\b', 'gi');
				formulaStr = formulaStr.replace(regex, value);

				return formulaStr;
			};

			return service;

		}
	]);
})(angular);
