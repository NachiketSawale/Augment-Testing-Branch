/**
 * Created by uestuenel on 08.06.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowSaveCharacteristicEditorDirective(_, basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/save-characteristic-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.input = {};
						$scope.output = {};
						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Characteristic', action);
								var paramUrl = _.find(value.input, {key: 'Characteristic'});

								return {
									inputParam: paramUrl ? paramUrl.value : '',
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							$scope.input.script = ngModelCtrl.$viewValue.inputParam;
							$scope.output.characteristic = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.script, 'Characteristic', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'Characteristic', action);
							return action;
						});

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								ngModelCtrl.$setViewValue({
									script: $scope.input.script,
									scriptOutput: $scope.output.characteristic
								});
							}
						}

						$scope.$watch('input.script', watchfn);
						$scope.$watch('output.characteristic', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowSaveCharacteristicEditorDirective.$inject = ['_', 'basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowSaveCharacteristicEditorDirective', basicsWorkflowSaveCharacteristicEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: 'b52947867ccb45249c019d568ff28d9b',
				directive: 'basicsWorkflowSaveCharacteristicEditorDirective',
				prio: null,
				tools: []
			});
		}]);
})(angular);
