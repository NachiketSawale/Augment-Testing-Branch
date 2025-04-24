/**
 * Created by joy on 06.01.2022.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function chatbotQuestionActionContainerDirective(basicsWorkflowActionEditorService, _, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'mtwo.chatbot/templates/chatbot-question-editor-container.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						// accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMultiMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						scope.isOptionalOptions = {
							ctrlId: 'isPopUpCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.chatbot.isOptional')
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var question = basicsWorkflowActionEditorService.getEditorInput('Question', action);
								var hint = basicsWorkflowActionEditorService.getEditorInput('Hint', action);
								var isOptional = basicsWorkflowActionEditorService.getEditorInput('IsOptional', action);
								var context = basicsWorkflowActionEditorService.getEditorOutput('Context', action);
								return {
									question: question ? question.value : '',
									hint: hint ? hint.value : '',
									isOptional: isOptional ? isOptional.value : '',
									context: context ? context.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.question = ngModelCtrl.$viewValue.question;
								scope.input.hint = ngModelCtrl.$viewValue.hint;
								scope.input.isOptional = ngModelCtrl.$viewValue.isOptional;
								scope.input.body = ngModelCtrl.$viewValue.body;
								scope.output.context = ngModelCtrl.$viewValue.context;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.question, 'Question', action);
							basicsWorkflowActionEditorService.setEditorInput(value.hint, 'Hint', action);
							basicsWorkflowActionEditorService.setEditorInput(value.isOptional, 'IsOptional', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.context, 'Context', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								question: scope.input.question,
								hint: scope.input.hint,
								isOptional: scope.input.isOptional,
								context: scope.output.context
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.changeCheckbox = function () {
							saveNgModel();
						};

						scope.$watch('input.question', watchfn);
						scope.$watch('input.hint', watchfn);
						scope.$watch('output.context', watchfn);
					}
				};
			}
		};
	}

	chatbotQuestionActionContainerDirective.$inject = ['basicsWorkflowActionEditorService', '_', '$translate'];

	angular.module('basics.workflow')
		.directive('chatbotQuestionActionContainerDirective', chatbotQuestionActionContainerDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '00006D1F021542C798756F136F0F716B',
					directive: 'chatbotQuestionActionContainerDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
