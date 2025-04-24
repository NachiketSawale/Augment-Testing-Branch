/**
 * Created by baitule on 17.10.2018.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowCreateScheduleBaselineEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-schedule-baseline-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.input = {};
						scope.output = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMirrorOptionsMulti = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var scheduleId = basicsWorkflowActionEditorService.getEditorInput('ScheduleId', action);
								var description = basicsWorkflowActionEditorService.getEditorInput('Description', action);
								var remark = basicsWorkflowActionEditorService.getEditorInput('Remark', action);
								var succeeded = basicsWorkflowActionEditorService.getEditorOutput('Succeeded', action);
								var errorMessage = basicsWorkflowActionEditorService.getEditorOutput('ErrorMessage', action);

								return {
									scheduleId: scheduleId ? scheduleId.value : '',
									description: description ? description.value : '',
									remark: remark ? remark.value : '',
									succeeded: succeeded ? succeeded.value : '',
									errorMessage: errorMessage ? errorMessage.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							scope.input.scheduleId = ngModelCtrl.$viewValue.scheduleId;
							scope.input.description = ngModelCtrl.$viewValue.description;
							scope.input.remark = ngModelCtrl.$viewValue.remark;
							scope.output.succeeded = ngModelCtrl.$viewValue.succeeded;
							scope.output.errorMessage = ngModelCtrl.$viewValue.errorMessage;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.scheduleId, 'ScheduleId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.description, 'Description', action);
							basicsWorkflowActionEditorService.setEditorInput(value.remark, 'Remark', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.succeeded, 'Succeeded', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.errorMessage, 'ErrorMessage', action);

							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								scheduleId: scope.input.scheduleId,
								description: scope.input.description,
								remark: scope.input.remark,
								succeeded: scope.output.succeeded,
								errorMessage: scope.output.errorMessage
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.scheduleId', watchfn);
						scope.$watch('input.description', watchfn);
						scope.$watch('input.remark', watchfn);
						scope.$watch('output.succeeded', watchfn);
						scope.$watch('output.errorMessage', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateScheduleBaselineEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowCreateScheduleBaselineEditorContainer', basicsWorkflowCreateScheduleBaselineEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '2cafb7ea4c8346fbb0159f004861bbf5',
					directive: 'basicsWorkflowCreateScheduleBaselineEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
