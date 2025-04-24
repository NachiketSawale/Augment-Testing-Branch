/**
 * Created by chi on 6/7/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';
	angular.module(moduleName)
		.directive('basicsWorkflowSendCalendarEventEditorContainer', basicsWorkflowSendCalendarEventEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: '55E8E41A9C5141C59B2575BFBFF8A5E1',
				directive: 'basicsWorkflowSendCalendarEventEditorContainer',
				prio: null,
				tools: []
			});
		}]);

	basicsWorkflowSendCalendarEventEditorContainer.$inject = ['basicsWorkflowActionEditorService', '$translate', '_', 'globals'];

	function basicsWorkflowSendCalendarEventEditorContainer(basicsWorkflowActionEditorService, $translate, _, globals) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/office-send-calendar-event-editor-container.html',
			compile: function () {
				return {
					pre: function (scope, elem, attr, ngModelCtrl) {
						var action = {};

						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.bodyOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						function getDataFromAction(key) {
							var param = _.find(action.input, {key: key});

							return param ? param.value : '';
						}

						scope.importanceSelectOptions = {
							displayMember: 'description',
							valueMember: 'id',
							items: [
								{
									id: 0,
									description: 'Low'
								},
								{
									id: 1,
									description: 'Normal'
								},
								{
									id: 2,
									description: 'High'
								}
							]
						};

						scope.sensitivitySelectOptions = {
							displayMember: 'description',
							valueMember: 'id',
							items: [
								{
									id: 0,
									description: 'Normal'
								},
								{
									id: 1,
									description: 'Personal'
								},
								{
									id: 2,
									description: 'Private'
								},
								{
									id: 3,
									description: 'Confidentials'
								}
							]
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var isHTML = getDataFromAction('IsHTML') && getDataFromAction('IsHTML').toString().toLowerCase();
								var result = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									receiverId: getDataFromAction('ReceiverId'),
									subject: getDataFromAction('Subject'),
									body: getDataFromAction('Body'),
									isHTML: isHTML,
									start: getDataFromAction('Start'),
									end: getDataFromAction('End'),
									importance: getDataFromAction('Importance'),
									sensitivity: getDataFromAction('Sensitivity'),
									isReminderOn: getDataFromAction('IsReminderOn'),
									reminderMinutes: getDataFromAction('ReminderMinutesBeforeStart'),
									result: result
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.receiverId = ngModelCtrl.$viewValue.receiverId;
								scope.input.subject = ngModelCtrl.$viewValue.subject;
								scope.input.body = ngModelCtrl.$viewValue.body;
								scope.input.isHTML = ngModelCtrl.$viewValue.isHTML;
								scope.input.start = ngModelCtrl.$viewValue.start;
								scope.input.end = ngModelCtrl.$viewValue.end;
								scope.input.importance = ngModelCtrl.$viewValue.importance;
								scope.input.sensitivity = ngModelCtrl.$viewValue.sensitivity;
								scope.input.isReminderOn = ngModelCtrl.$viewValue.isReminderOn;
								scope.input.reminderMinutes = ngModelCtrl.$viewValue.reminderMinutes;

								scope.output.result = ngModelCtrl.$viewValue.result;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.receiverId, 'ReceiverId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.subject, 'Subject', action);
							basicsWorkflowActionEditorService.setEditorInput(value.body, 'Body', action);
							basicsWorkflowActionEditorService.setEditorInput(value.isHTML, 'IsHTML', action);
							basicsWorkflowActionEditorService.setEditorInput(value.start, 'Start', action);
							basicsWorkflowActionEditorService.setEditorInput(value.end, 'End', action);
							basicsWorkflowActionEditorService.setEditorInput(value.importance, 'Importance', action);
							basicsWorkflowActionEditorService.setEditorInput(value.sensitivity, 'Sensitivity', action);
							basicsWorkflowActionEditorService.setEditorInput(value.isReminderOn, 'IsReminderOn', action);
							basicsWorkflowActionEditorService.setEditorInput(value.reminderMinutes, 'ReminderMinutesBeforeStart', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.result, 'Result', action);
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								receiverId: scope.input.receiverId,
								subject: scope.input.subject,
								body: scope.input.body,
								isHTML: scope.input.isHTML,
								start: scope.input.start,
								end: scope.input.end,
								importance: scope.input.importance,
								sensitivity: scope.input.sensitivity,
								isReminderOn: scope.input.isReminderOn,
								reminderMinutes: scope.input.reminderMinutes,
								result: scope.output.result
							});
						}

						scope.changeHtml = function () {
							saveNgModel();
						};

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.receiverId', watchfn);
						scope.$watch('input.subject', watchfn);
						scope.$watch('input.body', watchfn);
						scope.$watch('input.start', watchfn);
						scope.$watch('input.end', watchfn);
						scope.$watch('input.importance', watchfn);
						scope.$watch('input.sensitivity', watchfn);
						scope.$watch('input.isReminderOn', watchfn);
						scope.$watch('input.reminderMinutes', watchfn);
						scope.$watch('output.result', watchfn);
					}
				};
			}
		};
	}
})(angular);
