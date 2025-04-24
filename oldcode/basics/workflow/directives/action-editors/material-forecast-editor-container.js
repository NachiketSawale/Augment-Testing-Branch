/**
 * Created by baitule on 17.10.2018.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowMaterialForecastEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/material-forecast-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};

						scope.codeMirrorOptionsSingle = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMirrorOptionsMulti = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						function getDataFromAction(key) {
							var param = _.find(action.input, {key: key});
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {

								var resultCode = basicsWorkflowActionEditorService.getEditorOutput('ResultCode', action);
								var resultMessage = basicsWorkflowActionEditorService.getEditorOutput('ResultMessage', action);

								return {
									emailCount: getDataFromAction('Email Count'),
									subject: getDataFromAction('Subject'),
									body: getDataFromAction('Body'),
									sender: getDataFromAction('Sender'),
									password: getDataFromAction('Password'),
									resultCode: resultCode ? resultCode.value : '',
									resultMessage: resultMessage ? resultMessage.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.emailCount = ngModelCtrl.$viewValue.emailCount;
								scope.input.subject = ngModelCtrl.$viewValue.subject;
								scope.input.body = ngModelCtrl.$viewValue.body;
								scope.input.sender = ngModelCtrl.$viewValue.sender;
								scope.input.password = ngModelCtrl.$viewValue.password;
								scope.output.resultCode = ngModelCtrl.$viewValue.resultCode;
								scope.output.resultMessage = ngModelCtrl.$viewValue.resultMessage;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.emailCount, 'Email Count', action);
							basicsWorkflowActionEditorService.setEditorInput(value.subject, 'Subject', action);
							basicsWorkflowActionEditorService.setEditorInput(value.body, 'Body', action);
							basicsWorkflowActionEditorService.setEditorInput(value.sender, 'Sender', action);
							basicsWorkflowActionEditorService.setEditorInput(value.password, 'Password', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultCode, 'ResultCode', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultMessage, 'ResultMessage', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								emailCount: scope.input.emailCount,
								subject: scope.input.subject,
								body: scope.input.body,
								sender: scope.input.sender,
								password: scope.input.password,
								resultCode: scope.output.resultCode,
								resultMessage: scope.output.resultMessage
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.emailCount', watchfn);
						scope.$watch('input.subject', watchfn);
						scope.$watch('input.body', watchfn);
						scope.$watch('input.sender', watchfn);
						scope.$watch('input.password', watchfn);
						scope.$watch('output.resultCode', watchfn);
						scope.$watch('output.resultMessage', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowMaterialForecastEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowMaterialForecastEditorDirective', basicsWorkflowMaterialForecastEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '99FA8660D2334D6591B78244FE4AAB19',
					directive: 'basicsWorkflowMaterialForecastEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
