/**
 * Created by uestuenel on 09.06.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowMailActionEditorDirective(basicsWorkflowActionEditorService, platformGridAPI,
		$translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/mail-action-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};
						scope.input.editorModeHtml = '1';
						scope.input.radioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							items: [
								{
									value: 1,
									description: $translate.instant('basics.workflow.modalDialogs.defaultRadio'),
									cssClass: 'pull-left spaceToUp'
								},
								{
									value: 2,
									description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
									cssClass: 'pull-left margin-left-ld'
								}
							]
						};

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model, event) {
							scope.input[model] = radioValue;

							if (event && radioValue === '1') {
								var gridElement = angular.element(event.target).parents('.radiolist-container').parent().find('.platformgrid');
								setTimeout(function () {
									platformGridAPI.grids.resize(gridElement.attr('id'));
								}, 0);
							}
						};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.bodyOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						function getDataFromAction(key) {
							var param = _.find(action.input, {key: key});

							return param ? param.value : '';
						}

						//isHtml checkbox
						scope.isHtmlOptions = {
							ctrlId: 'isHtmlCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.mail.isHtml')
						};

						scope.saveMailOptions = {
							ctrlId: 'saveMailCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.mail.saveMail')
						};

						scope.credentialsOptions = {
							ctrlId: 'credentialsOptions',
							labelText: $translate.instant('basics.workflow.action.customEditor.mail.useDefaultCredentials')
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var isHTML;

								isHTML = getDataFromAction('HTML');

								var useDefaultCredentials = getDataFromAction('UseDefaultCredentials');

								var docId = basicsWorkflowActionEditorService.getEditorOutput('DocId', action);

								return {
									contentFrom: getDataFromAction('From'),
									contentSubj: getDataFromAction('Subject'),
									contentBody: getDataFromAction('Body'),
									saveMail: getDataFromAction('SaveMail'),
									isHTML: isHTML,
									isHTMLScript_: isHTML.toString().toLowerCase(),
									docId: docId ? docId.value : '',
									useDefaultCredentials: useDefaultCredentials
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.from = ngModelCtrl.$viewValue.contentFrom;
								scope.input.sub = ngModelCtrl.$viewValue.contentSubj;
								scope.input.body = ngModelCtrl.$viewValue.contentBody;

								scope.input.isHtml = ngModelCtrl.$viewValue.isHTML;
								scope.input.saveMail = ngModelCtrl.$viewValue.saveMail;
								//codemiiror for html
								scope.input.isHTMLScript = ngModelCtrl.$viewValue.isHTML.toString();

								scope.input.useDefaultCredentials = ngModelCtrl.$viewValue.useDefaultCredentials;

								scope.output.docId = ngModelCtrl.$viewValue.docId;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.from, 'From', action);
							basicsWorkflowActionEditorService.setEditorInput(value.sub, 'Subject', action);
							basicsWorkflowActionEditorService.setEditorInput(value.body, 'Body', action);
							basicsWorkflowActionEditorService.setEditorInput(value.isHtml, 'HTML', action);
							basicsWorkflowActionEditorService.setEditorInput(value.saveMail, 'SaveMail', action);
							basicsWorkflowActionEditorService.setEditorInput(value.useDefaultCredentials, 'UseDefaultCredentials', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.docId, 'DocId', action);
							return action;
						});

						function saveNgModel() {
							var html = scope.input.editorModeHtml === '2' ? scope.input.isHTMLScript : scope.input.isHtml;

							ngModelCtrl.$setViewValue({
								from: scope.input.from,
								sub: scope.input.sub,
								body: scope.input.body,
								isHtml: html,
								saveMail: scope.input.saveMail,
								useDefaultCredentials: scope.input.useDefaultCredentials,
								docId: scope.output.docId
							});
						}

						scope.changeCheckbox = function () {
							saveNgModel();
						};

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.from', watchfn);
						scope.$watch('input.sub', watchfn);
						scope.$watch('input.body', watchfn);
						scope.$watch('input.isHTMLScript', watchfn);
						scope.$watch('input.useDefaultCredentials', watchfn);
						scope.$watch('output.docId', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowMailActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowMailActionEditorDirective', basicsWorkflowMailActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'a4efd9866b2b424b9e37f5f681d58bd8',
					directive: 'basicsWorkflowMailActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
