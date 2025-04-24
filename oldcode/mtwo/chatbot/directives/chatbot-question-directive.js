(function () {
	'use strict';
	/* global globals */
	/**
	 *
	 * @param _
	 * @param cloudDesktopSidebarService
	 * @param $state
	 * @returns {{compile: (function(): {pre: preLink, post: postLink}), require: string, restrict: string, templateUrl: string}}
	 */
	function mtwoChatbotQuestionActionDirective(_, cloudDesktopSidebarService, $state, $translate) {  // jshint ignore:line

		return {
			restrict: 'A',
			require: 'ngModel',
			compile: function () {
				return {
					pre: preLink,
					post: postLink
				};
			},
			templateUrl: globals.appBaseUrl + 'mtwo.chatbot/templates/chatbot-question-editor.html',
		};

		function provideTranslationOrDefault(key, fallback) {
			var res = $translate.instant(key);

			if (res === key) {
				res = fallback;
			}

			return res;
		}


		function preLink(scope ) {

			// prepare scope data, must be palced here !!!
			scope.dlgOptions = {
				hint: provideTranslationOrDefault('basic.workflow.action.chatbot.hint','Hint'),
			};

		}

		/**
		 *
		 * @param scope
		 * @param iElement
		 * @param attrs
		 * @param ngModelCtrl
		 */
		function postLink(scope, iElement, attrs, ngModelCtrl) {
			scope.data={};
			// parameter
			// self.Input = ['recipient','subject','body'];
			// self.Output = ['Context'];
			var inputPar1 = 'Question';
			var inputPar2 = 'Hint';
			var outputPar1 = 'Context';

			function validateParams(response) {
				// validate input and output parameters
				var valid = true;
				var errMsg = [];
				if (response.task.input) {
					if (response.task.input[0] && response.task.input[1]) {
						if (!((response.task.input[0].key === inputPar1) && _.isString(response.task.input[0].value))) {
							errMsg.push('Parameter: ' + inputPar1 + ' is missing or having none valid value');
							valid = false;
						}
						if (!((response.task.input[1].key === inputPar2) && _.isString(response.task.input[1].value))) {
							errMsg.push('Parameter: ' + inputPar2 + ' is missing or having none valid value');
							valid = false;
						}
					} else {
						errMsg.push('no Input Parameters found');
						valid = false;
					}
					if (response.task.output[0]) {
						if (!((response.task.output[0].key === outputPar1) && _.isString(response.task.output[0].value))) {
							errMsg.push('Output Parameter: ' + outputPar1 + ' is missing, required destination definition');
							valid = false;
						}
					} else {
						errMsg.push('not Output Parameters found');
						valid = false;
					}
				} else {
					errMsg.push('not Parameters found');
					valid = false;
				}
				return {valid: valid, error: _.join(errMsg, '<br>')};
			}
			scope.response.Context[scope.response.task.input[2].key] = scope.response.task.input[2].value;

			/**
			 *
			 */
			ngModelCtrl.$render = function () {
				// save ngmodel into scope
				scope.response = ngModelCtrl.$viewValue;

				// validate input and output parameters
				var validated = validateParams(scope.response);

				if (!validated.valid) {
					scope.parameterInvalid = true;
					scope.parameterInvalidInfo = validated;
					return;
				}
				scope.data.question = scope.response.task.input[0].value; // JSON.parse(scope.response.task.input[0].value);
				scope.data.answer='';
				scope.data.hint = scope.response.task.input[1].value;// JSON.parse(scope.response.task.input[1].value);
			};

			scope.$watch(function () {
				return scope.response;
			}, function (newVal, oldVal) {
				if (newVal && newVal !== oldVal) {
					ngModelCtrl.$setViewValue(scope.response);
				}
			}, true);

			scope.$watch('data.answer', function() {
				scope.response.Context[scope.response.task.output[0].value] = scope.data.answer;
			});
		}
	}

	mtwoChatbotQuestionActionDirective.$inject = ['_', 'cloudDesktopSidebarService', '$state', '$translate'];
	angular.module('mtwo.chatbot')
		.directive('mtwoChatbotQuestionActionDirective', mtwoChatbotQuestionActionDirective);

})(angular);
