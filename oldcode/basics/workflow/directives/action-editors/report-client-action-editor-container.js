/**
 * Created by saa.hof on 04.01.2018.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowReportClientActionEditorContainer(basicsWorkflowActionEditorService, platformGridAPI,
		platformCreateUuid, _, basicsWorkflowReportUtilsService,
		basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/report-client-action-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.input = {};

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

						//section: preview modes
						scope.input.previewEditorMode = basicsWorkflowEditModes.default;

						scope.input.previewRadioGroupOpt = _.cloneDeep(scope.input.radioGroupOpt);
						scope.input.previewRadioGroupOpt.id = 'previewInputMode';

						scope.previewSelectOptions = {
							items: [
								{
									value: 'pdf',
									description: $translate.instant('basics.reporting.sidebar.submenuItemList.pdfPrint')
								},
								{
									value: 'preview',
									description: $translate.instant('basics.reporting.sidebar.submenuItemList.preview')
								}
							],
							valueMember: 'value',
							displayMember: 'description'
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var previewMode = getContentFromModel('PreviewMode', value);

								//one output parameter 'DocId'
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('ReportId', action);

								return {
									//popUp: popUp,
									previewMode: previewMode,
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						//get datas from ngModel
						function getContentFromModel(key, value) {
							var param = _.find(value.input, {key: key});

							return param ? param.value : '';
						}

						ngModelCtrl.$render = function () {
							//scope.input.popUp = ngModelCtrl.$viewValue.popUp;
							scope.input.previewMode = ngModelCtrl.$viewValue.previewMode;

							//render output parameters
							scope.output.report = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							//basicsWorkflowActionEditorService.setEditorInput(value.popUp, 'IsPopUp', action);
							basicsWorkflowActionEditorService.setEditorInput(value.previewMode, 'PreviewMode', action);

							//save output parameter
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'ReportId', action);

							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								//popUp: scope.input.popUp,
								previewMode: scope.input.previewMode,
								scriptOutput: scope.output.report
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						//scope.$watch('input.popUp', watchfn);
						scope.$watch('input.previewMode', watchfn);
						scope.$watch('output.report', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowReportClientActionEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', '_', 'basicsWorkflowReportUtilsService', 'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowReportClientActionEditorContainer', basicsWorkflowReportClientActionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '0000d20625b5c1a74a869be4fb7ac4e2',
					directive: 'basicsWorkflowReportClientActionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
