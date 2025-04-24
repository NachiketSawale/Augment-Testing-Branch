/**
 * Created by lav on 1/22/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowShiftTransportTimeEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/shift-transport-time-editor.html',
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
									ShiftTime: getDataFromAction('ShiftTime'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.TrsRouteId = ngModelCtrl.$viewValue.TrsRouteId;
							scope.model.ShiftTime = ngModelCtrl.$viewValue.ShiftTime;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.TrsRouteId, 'TrsRouteId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ShiftTime, 'ShiftTime', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								TrsRouteId: scope.model.TrsRouteId,
								ShiftTime: scope.model.ShiftTime,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.TrsRouteId', watchfn);
						scope.$watch('model.ShiftTime', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowShiftTransportTimeEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowShiftTransportTimeEditorDirective', basicsWorkflowShiftTransportTimeEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '56b82s44956ghbm891f11ey11c16yhrb',
					directive: 'basicsWorkflowShiftTransportTimeEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
