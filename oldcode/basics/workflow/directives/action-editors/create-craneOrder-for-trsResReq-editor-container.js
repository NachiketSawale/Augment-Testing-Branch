/**
 * Created by zov on 22/02/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowCreateCraneOrderForTrsResReqEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-craneOrder-for-trsResReq-editor.html',
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
									TrsRouteId: getDataFromAction('TrsRouteId'),
									ResRequisitionId: getDataFromAction('ResRequisitionId'),
									CharacteristicValues: getDataFromAction('CharacteristicValues'),
									ReceivingJobId: getDataFromAction('ReceivingJobId'),
									WizardParas: getDataFromAction('WizardParas'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.TrsRouteId = ngModelCtrl.$viewValue.TrsRouteId;
							scope.model.ResRequisitionId = ngModelCtrl.$viewValue.ResRequisitionId;
							scope.model.CharacteristicValues = ngModelCtrl.$viewValue.CharacteristicValues;
							scope.model.ReceivingJobId = ngModelCtrl.$viewValue.ReceivingJobId;
							scope.model.WizardParas = ngModelCtrl.$viewValue.WizardParas;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.TrsRouteId, 'TrsRouteId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ResRequisitionId, 'ResRequisitionId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.CharacteristicValues, 'CharacteristicValues', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ReceivingJobId, 'ReceivingJobId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.WizardParas, 'WizardParas', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								TrsRouteId: scope.model.TrsRouteId,
								ResRequisitionId: scope.model.ResRequisitionId,
								CharacteristicValues: scope.model.CharacteristicValues,
								ReceivingJobId: scope.model.ReceivingJobId,
								WizardParas: scope.model.WizardParas,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.TrsRouteId', watchfn);
						scope.$watch('model.ResRequisitionId', watchfn);
						scope.$watch('model.CharacteristicValues', watchfn);
						scope.$watch('model.ReceivingJobId', watchfn);
						scope.$watch('model.WizardParas', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateCraneOrderForTrsResReqEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowCreateCraneOrderForTrsResReqEditorDirective', basicsWorkflowCreateCraneOrderForTrsResReqEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'E145F3A4712647ED825B75600FF9D804',
					directive: 'basicsWorkflowCreateCraneOrderForTrsResReqEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
