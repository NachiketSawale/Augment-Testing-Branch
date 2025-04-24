/**
 * Created by wui on 3/2/2016.
 */

(function(angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionsystemMasterScriptEvalService', ['$log', '$q', 'moment',
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
					var isValid = false;

					if (typeof condition === 'boolean') {
						isValid = condition;
					}
					else if (typeof condition === 'function') {
						isValid = condition();
					}
					else {
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
					var isShown = false;

					if (typeof condition === 'boolean') {
						isShown = condition;
					}
					else if (typeof condition === 'function') {
						isShown = condition();
					}
					else {
						$log('show error');
					}

					this.response.push({
						Name: parameter,
						IsHidden: !isShown
					});

					return this;
				};

				this.hide = function (parameter, condition) {
					var isHidden = false;

					if (typeof condition === 'boolean') {
						isHidden = condition;
					}
					else if (typeof condition === 'function') {
						isHidden = condition();
					}
					else {
						$log('hide error');
					}

					this.response.push({
						Name: parameter,
						IsHidden: isHidden
					});

					return this;
				};

				this.enable = function (parameter, condition) {
					var isEnabled = false;

					if (typeof condition === 'boolean') {
						isEnabled = condition;
					}
					else if (typeof condition === 'function') {
						isEnabled = condition();
					}
					else {
						$log('enable error');
					}

					this.response.push({
						Name: parameter,
						IsDisabled: !isEnabled
					});

					return this;
				};

				this.disable = function (parameter, condition) {
					var isDisabled = false;

					if (typeof condition === 'boolean') {
						isDisabled = condition;
					}
					else if (typeof condition === 'function') {
						isDisabled = condition();
					}
					else {
						$log('disable error');
					}

					this.response.push({
						Name: parameter,
						IsDisabled: isDisabled
					});

					return this;
				};
			}

			function getActualCode(script, parameterList) {
				var code = '';

				// create validator
				code += 'var validator = new Validator();\n';
				// create variable enum
				code += 'var pe = {};';
				// create parameter variable
				parameterList.forEach(function (item) {
					if (item.VariableName) {
						var value;

						if (moment.isMoment(item.InputValue)) {
							value = new Date(item.InputValue.format('YYYY-MM-DD')).getTime();
						}
						else if (angular.isString(item.InputValue)) {
							value = '"' + item.InputValue + '"';
						}
						else {
							value = item.InputValue;
						}

						code += 'var ' + item.VariableName + '=' + value + ';\n';
						code += 'pe.' + item.VariableName + '="' + item.VariableName + '";\n';
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
				var response = [];
				try {
					response = eval(wrap(getActualCode(request.ValidateScriptData, request.ParameterList)));
				} catch (e) {
					console.log(e.toString());
				}
				return $q.when(response);
			}

			function synValidate(request){
				var response = [];
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