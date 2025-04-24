/**
 * Created by lvy on 3/19/2019.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function sendRfqWizardGetPossibleCoverLetterEditorDirective(basicsWorkflowActionEditorService, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/send-rfq-wizard-get-possible-cover-letter.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};
						scope.input = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						scope.reportTypeItems = {
							displayMember: 'description',
							valueMember: 'id',
							items: [
								{
									id: 1,
									description: $translate.instant('basics.workflow.modalDialogs.coverLetter')
								},
								{
									id: 2,
									description: $translate.instant('basics.workflow.modalDialogs.reports')
								}
							]
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);
								var reportTypeVal = getDataFromAction('ReportType');

								return {
									rfqId: getDataFromAction('RfqId'),
									reportType: reportTypeVal ? reportTypeVal : 1,
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.input.rfqId = ngModelCtrl.$viewValue.rfqId;
							scope.input.reportType = ngModelCtrl.$viewValue.reportType;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.rfqId, 'RfqId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.reportType, 'ReportType', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								rfqId: scope.input.rfqId,
								reportType: scope.input.reportType,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.rfqId', watchfn);
						scope.$watch('input.reportType', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	sendRfqWizardGetPossibleCoverLetterEditorDirective.$inject = ['basicsWorkflowActionEditorService', '$translate'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('sendRfqWizardGetPossibleCoverLetterEditorDirective', sendRfqWizardGetPossibleCoverLetterEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'ff18f97ae8a94d3cac141a74ea4b141b',
					directive: 'sendRfqWizardGetPossibleCoverLetterEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
