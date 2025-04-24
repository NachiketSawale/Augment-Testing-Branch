/**
 * Created by wuky on 03.25.2022.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	function basicsWorkflowSendTeamsMessageEditorDirective(basicsWorkflowActionEditorService, platformGridAPI, basicsWorkflowEditModes,
		platformCreateUuid, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/teams-send-message-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						let action = {};

						// accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.model = {};
						scope.input = {};
						scope.output = {};

						// Mode radio-buttons
						scope.input.toRadioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							items: [
								{
									value: 1,
									description: $translate.instant('basics.workflow.action.customEditor.teams.sendToAUser'),
									cssClass: 'spaceToUp pull-left'
								},
								{
									value: 2,
									description: $translate.instant('basics.workflow.action.customEditor.teams.sendToAChannel'),
									cssClass: 'spaceToUp pull-left margin-left-ld'
								}
							]
						};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.messageOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						scope.isHtmlOptions = {
							ctrlId: 'isHtmlOptions',
							labelText: $translate.instant('basics.workflow.action.customEditor.teams.html')
						};

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model) {
							scope.input[model] = parseInt(radioValue);
						};

						function getDataFromAction(key) {
							let param = _.find(action.input, {key: key});

							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								let resultCode = basicsWorkflowActionEditorService.getEditorOutput('ResultCode', action);
								let resultMessage = basicsWorkflowActionEditorService.getEditorOutput('ResultMessage', action);

								return {
									to: getDataFromAction('To') || '1',
									userId: getDataFromAction('UserId'),
									userPrincipalName: getDataFromAction('UserPrincipalName'),
									teamsId: getDataFromAction('TeamsId'),
									teamsName: getDataFromAction('TeamsName'),
									channelId: getDataFromAction('ChannelId'),
									channelName: getDataFromAction('ChannelName'),
									message: getDataFromAction('Message'),
									fileArchiveId: getDataFromAction('FileArchiveId'),
									isHTML: getDataFromAction('Html'),
									resultCode: resultCode ? resultCode.value : '',
									resultMessage:resultMessage ? resultMessage.value:''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.to = ngModelCtrl.$viewValue.to;
								scope.input.userId=ngModelCtrl.$viewValue.userId;
								scope.input.userPrincipalName = ngModelCtrl.$viewValue.userPrincipalName;
								scope.input.teamsId = ngModelCtrl.$viewValue.teamsId;
								scope.input.teamsName = ngModelCtrl.$viewValue.teamsName;
								scope.input.channelId = ngModelCtrl.$viewValue.channelId;
								scope.input.channelName = ngModelCtrl.$viewValue.channelName;
								scope.input.message = ngModelCtrl.$viewValue.message;
								scope.input.fileArchiveId = ngModelCtrl.$viewValue.fileArchiveId;
								scope.model.isHtml = ngModelCtrl.$viewValue.isHTML;
								scope.output.resultCode = ngModelCtrl.$viewValue.resultCode;
								scope.output.resultMessage = ngModelCtrl.$viewValue.resultMessage;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.to, 'To', action);
							basicsWorkflowActionEditorService.setEditorInput(value.userId, 'UserId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.userPrincipalName, 'UserPrincipalName', action);
							basicsWorkflowActionEditorService.setEditorInput(value.teamsId, 'TeamsId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.teamsName, 'TeamsName', action);
							basicsWorkflowActionEditorService.setEditorInput(value.channelId, 'ChannelId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.channelName, 'ChannelName', action);
							basicsWorkflowActionEditorService.setEditorInput(value.message, 'Message', action);
							basicsWorkflowActionEditorService.setEditorInput(value.fileArchiveId, 'FileArchiveId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.isHtml, 'Html', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultCode, 'ResultCode', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultMessage, 'ResultMessage', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								to: scope.input.to,
								userId: scope.input.userId,
								userPrincipalName: scope.input.userPrincipalName,
								teamsId: scope.input.teamsId,
								teamsName: scope.input.teamsName,
								channelId: scope.input.channelId,
								channelName: scope.input.channelName,
								message: scope.input.message,
								fileArchiveId: scope.input.fileArchiveId,
								isHtml: scope.model.isHtml,
								resultCode: scope.output.resultCode,
								resultMessage: scope.output.resultMessage
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

						scope.$watch('input.to', watchfn);
						scope.$watch('input.userId', watchfn);
						scope.$watch('input.userPrincipalName', watchfn);
						scope.$watch('input.teamsId', watchfn);
						scope.$watch('input.teamsName', watchfn);
						scope.$watch('input.channelId', watchfn);
						scope.$watch('input.channelName', watchfn);
						scope.$watch('input.message', watchfn);
						scope.$watch('input.fileArchiveId', watchfn);
						scope.$watch('model.isHtml', watchfn);
						scope.$watch('output.resultCode', watchfn);
						scope.$watch('output.resultMessage', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowSendTeamsMessageEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI', 'basicsWorkflowEditModes',
		'platformCreateUuid', '$translate', 'basicsWorkflowGlobalContextUtil'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowSendTeamsMessageEditorDirective', basicsWorkflowSendTeamsMessageEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'ffbafa91d4fe41d4b14458464fbbe50',
					directive: 'basicsWorkflowSendTeamsMessageEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
