/**
 * Created by lav on 1/22/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowSyncTrsRouteFromTrsRequisitionEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/sync-transport-from-trsRequisition-editor.html',
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
									TrsRequisitionId: getDataFromAction('TrsRequisitionId'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.TrsRouteId = ngModelCtrl.$viewValue.TrsRouteId;
							scope.model.TrsRequisitionId = ngModelCtrl.$viewValue.TrsRequisitionId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.TrsRouteId, 'TrsRouteId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.TrsRequisitionId, 'TrsRequisitionId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								TrsRouteId: scope.model.TrsRouteId,
								TrsRequisitionId: scope.model.TrsRequisitionId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.TrsRouteId', watchfn);
						scope.$watch('model.TrsRequisitionId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowSyncTrsRouteFromTrsRequisitionEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowSyncTrsRouteFromTrsRequisitionEditorDirective', basicsWorkflowSyncTrsRouteFromTrsRequisitionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '77b82s34956145d891f11eg11c161h9b',
					directive: 'basicsWorkflowSyncTrsRouteFromTrsRequisitionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
