/**
 * Created by lcn on 3/19/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowSendRfqWizardGetConfigurationTypesEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/send-rfq-wizard-get-configuration-types-editor.html',
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
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.rfqId = ngModelCtrl.$viewValue.rfqId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.rfqId, 'rfqId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								rfqId: scope.model.rfqId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.rfqId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowSendRfqWizardGetConfigurationTypesEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowSendRfqWizardGetConfigurationTypesEditorDirective', basicsWorkflowSendRfqWizardGetConfigurationTypesEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '326ecd86946e455691ea7bc2415c59a7',
					directive: 'basicsWorkflowSendRfqWizardGetConfigurationTypesEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
