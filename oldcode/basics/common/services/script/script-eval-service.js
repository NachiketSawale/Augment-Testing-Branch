/**
 * Created by wul on 2/7/2018.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('scriptEvalService', ['$log', '$q', 'moment',
		function ($log, $q, moment) {

			/**
			 * wrap eval code to an immediate function to protect external scope.
			 * @param code
			 * @returns {string}
			 */
			function wrap(code) {
				return '(function(){\n' + code + '\n})()';
			}

			/**
			 * Validator constructor, used in eval code.
			 * @constructor
			 */
			function Validator() {
				this.response = [];

				this.check = function (parameter, condition, error) {
					let isValid = false;

					if (typeof condition === 'boolean') {
						isValid = condition;
					} else if (typeof condition === 'function') {
						isValid = condition();
					} else {
						$log('check error');
					}

					this.response.push({
						Name: parameter,
						HasError: !isValid,
						Error: error
					});

					return this;
				};

				this.show = function (parameter, condition) {
					let isShown = false;

					if (typeof condition === 'boolean') {
						isShown = condition;
					} else if (typeof condition === 'function') {
						isShown = condition();
					} else {
						$log('show error');
					}

					this.response.push({
						Name: parameter,
						IsHidden: !isShown
					});

					return this;
				};

				this.hide = function (parameter, condition) {
					let isHidden = false;

					if (typeof condition === 'boolean') {
						isHidden = condition;
					} else if (typeof condition === 'function') {
						isHidden = condition();
					} else {
						$log('hide error');
					}

					this.response.push({
						Name: parameter,
						IsHidden: isHidden
					});

					return this;
				};

				this.enable = function (parameter, condition) {
					let isEnabled = false;

					if (typeof condition === 'boolean') {
						isEnabled = condition;
					} else if (typeof condition === 'function') {
						isEnabled = condition();
					} else {
						$log('enable error');
					}

					this.response.push({
						Name: parameter,
						IsDisabled: !isEnabled
					});

					return this;
				};

				this.disable = function (parameter, condition) {
					let isDisabled = false;

					if (typeof condition === 'boolean') {
						isDisabled = condition;
					} else if (typeof condition === 'function') {
						isDisabled = condition();
					} else {
						$log('disable error');
					}

					this.response.push({
						Name: parameter,
						IsDisabled: isDisabled
					});

					return this;
				};

				this.readonly = function (parameter, condition) {
					let isReadonly = false;

					if (typeof condition === 'boolean') {
						isReadonly = condition;
					} else if (typeof condition === 'function') {
						isReadonly = condition();
					} else {
						$log('readonly error');
					}

					this.response.push({
						Name: parameter,
						IsReadonly: isReadonly
					});

					return this;
				};
			}

			function getActualCode(script, parameterList) {
				let code = '';

				// create validator
				code += 'var validator = new Validator();\n';
				// create variable enum
				code += 'var pe = {};';
				// create parameter variable
				parameterList.forEach(function (item) {
					if (item.VariableName) {
						let value;

						if (moment.isMoment(item.InputValue)) {
							value = new Date(item.InputValue.format('YYYY-MM-DD')).getTime();
						} else if (angular.isString(item.InputValue)) {
							value = '"' + item.InputValue + '"';
						} else if (angular.isObject(item.InputValue)) {
							value = JSON.stringify(item.InputValue).replace(/"/g, '\'');
						} else {
							value = item.InputValue;
						}

						code += 'var ' + item.VariableName + '=' + value + ';\n';
						code += 'pe.' + item.VariableName + '="' + item.VariableName + '";\n';
						code += 'pe.' + item.VariableName + 'value =' + value + ';\n';
					}
				});
				// validation script
				code += script;
				// return validation result
				code += '\nreturn validator.response;\n';

				return code;
			}

			function validate(request) {
				/* jshint -W061 */
				let response = [];
				try {
					response = eval(wrap(getActualCode(request.ValidateScriptData, request.ParameterList)));
				} catch (e) {
					console.log(e.toString());
				}
				return $q.when(response);
			}

			function synValidate(request) {
				let response = [];
				try {
					response = eval(wrap(getActualCode(request.ValidateScriptData, request.ParameterList)));
				} catch (e) {
					console.log(e.toString());
				}
				return response;
			}

			return {
				validator: Validator,
				synValidate: synValidate,
				validate: validate
			};
		}
	]);

})(angular);
