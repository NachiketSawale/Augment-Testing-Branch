/**
 * Created by lvy on 3/20/2019.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function sendRFQWizardGetReportsByRfqEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/send-rfq-wizard-get-bidders-by-rfq.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};
						scope.model = {};
						scope.input = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									rfqId: getDataFromAction('rfqId'),
									communicationChannelId: getDataFromAction('communicationChannelId'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.rfqId = ngModelCtrl.$viewValue.rfqId;
							scope.model.communicationChannelId = ngModelCtrl.$viewValue.communicationChannelId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.rfqId, 'rfqId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.communicationChannelId, 'communicationChannelId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								rfqId: scope.model.rfqId,
								communicationChannelId: scope.model.communicationChannelId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.rfqId', watchfn);
						scope.$watch('model.communicationChannelId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	sendRFQWizardGetReportsByRfqEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowSendRFQWizardGetReportsByRfqEditorDirective', sendRFQWizardGetReportsByRfqEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '879aaf497f1c4996b5c03307aab2595e',
					directive: 'basicsWorkflowSendRFQWizardGetReportsByRfqEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
