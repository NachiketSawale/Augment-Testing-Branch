/**
 * Created by joy on 06.01.2022.
 */
(function (angular) {
	/* global globals */
	'use strict';
	function chatbotDisplayActionContainerDirective(basicsWorkflowActionEditorService,moduleLookupDataService, _, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'mtwo.chatbot/templates/chatbot-display-editor-container.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						function provideTranslationOrDefault(key, fallback) {
							var res = $translate.instant(key);
							if (res === key) {
								res = fallback;
							}
							return res;
						}
						var action = {};

						// accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMultiMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
						var displayTypeOptions = {
							displayMember: 'desc', valueMember: 'key',
							items: [
								{key: 'text', desc: provideTranslationOrDefault('basic.workflow.action.chatbot.text', 'Text')},
								{key: 'card', desc: provideTranslationOrDefault('basic.workflow.action.chatbot.card', 'Card')}],
						};

						var cardStyleOptions = {
							displayMember: 'desc', valueMember: 'key',
							items: [
								{key: 'grid', desc: provideTranslationOrDefault('basic.workflow.action.chatbot.grid', 'Grid')},
								{key: 'list', desc: provideTranslationOrDefault('basic.workflow.action.chatbot.list', 'List')}],
						};

						var isNavigationOptions = {
							displayMember: 'desc', valueMember: 'key',
							items: [
								{key: 1, desc: provideTranslationOrDefault('basic.workflow.action.chatbot.true', 'True')},
								{key: 0, desc: provideTranslationOrDefault('basic.workflow.action.chatbot.false', 'False')}],
						};
						// prepare module option
						/*
						var moduleData = getModuleOption();
						_.forEach(moduleData.value,function(modu) {
							var item = {
								key:modu.InternalName,
								desc:modu.Description.Description
							};
							optionlist.push(item);
						});
						*/
						// prepare scope data, must be palced here !!!
						scope.displayTypeOptions = displayTypeOptions;
						scope.cardStyleOptions = cardStyleOptions;
						scope.displayType = $translate.instant('basics.workflow.action.customEditor.chatbot.displayType');
						scope.cardStyle = $translate.instant('basics.workflow.action.customEditor.chatbot.cardStyle');
						//  hint: provideTranslationOrDefault('basic.workflow.action.chatbot.hint', 'Hint'),
						scope.isNavigate = $translate.instant('basics.workflow.action.customEditor.chatbot.isNavigate');
						scope.isNavigationOptions = isNavigationOptions;

						scope.isOptionalOptions = {
							ctrlId: 'isPopUpCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.chatbot.isOptional')
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var displayType = basicsWorkflowActionEditorService.getEditorInput('DisplayType', action);
								var content = basicsWorkflowActionEditorService.getEditorInput('Content', action);
								var cardStyle = basicsWorkflowActionEditorService.getEditorInput('CardStyle', action);
								var cardCaptain = basicsWorkflowActionEditorService.getEditorInput('CardCaptain', action);
								var isNavigate = basicsWorkflowActionEditorService.getEditorInput('IsNavigate', action);
								var module = basicsWorkflowActionEditorService.getEditorInput('Module', action);
								var navigateField = basicsWorkflowActionEditorService.getEditorInput('NavigateField', action);
								return {
									displayType: displayType ? displayType.value : 'text',
									content: content ? content.value : '',
									cardStyle: cardStyle ? cardStyle.value : 'grid',
									cardCaptain: cardCaptain ? cardCaptain.value : '',
									isNavigate: isNavigate ? isNavigate.value : '',
									module: module ? module.value : '',
									navigateField: navigateField ? navigateField.value : '',
									result: 'display'
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.displayType = ngModelCtrl.$viewValue.displayType ? ngModelCtrl.$viewValue.displayType : 'text';
								scope.input.content = ngModelCtrl.$viewValue.content;
								scope.input.cardStyle = ngModelCtrl.$viewValue.cardStyle ? ngModelCtrl.$viewValue.cardStyle : 'grid';
								scope.input.cardCaptain = ngModelCtrl.$viewValue.cardCaptain;
								scope.input.isNavigate = ngModelCtrl.$viewValue.isNavigate;
								scope.input.module = ngModelCtrl.$viewValue.module;
								scope.input.navigateField = ngModelCtrl.$viewValue.navigateField;
								scope.output.result = 'display';
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.displayType, 'DisplayType', action);
							basicsWorkflowActionEditorService.setEditorInput(value.content, 'Content', action);
							basicsWorkflowActionEditorService.setEditorInput(value.cardStyle, 'CardStyle', action);
							basicsWorkflowActionEditorService.setEditorInput(value.cardCaptain, 'CardCaptain', action);
							basicsWorkflowActionEditorService.setEditorInput(value.isNavigate, 'IsNavigate', action);
							basicsWorkflowActionEditorService.setEditorInput(value.module, 'Module', action);
							basicsWorkflowActionEditorService.setEditorInput(value.navigateField, 'NavigateField', action);
							basicsWorkflowActionEditorService.setEditorOutput('display', 'Result', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								displayType: scope.input.displayType,
								content: scope.input.content,
								cardStyle: scope.input.cardStyle,
								cardCaptain: scope.input.cardCaptain,
								isNavigate: scope.input.isNavigate,
								module: scope.input.module,
								navigateField: scope.input.navigateField,
								result: 'display'
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

						scope.$watch('input.displayType', watchfn);
						scope.$watch('input.content', watchfn);
						scope.$watch('input.cardStyle', watchfn);
						scope.$watch('input.cardCaptain', watchfn);
						scope.$watch('input.isNavigate', watchfn);
						scope.$watch('input.module', watchfn);
						scope.$watch('input.navigateField', watchfn);

					}
				};
			}
		};
	}

	chatbotDisplayActionContainerDirective.$inject = ['basicsWorkflowActionEditorService', 'moduleLookupDataService', '_','$translate'];

	angular.module('basics.workflow')
		.directive('chatbotDisplayActionContainerDirective', chatbotDisplayActionContainerDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '3B2AFEBA74A548F3A4CAEF7F35D46702',
					directive: 'chatbotDisplayActionContainerDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
