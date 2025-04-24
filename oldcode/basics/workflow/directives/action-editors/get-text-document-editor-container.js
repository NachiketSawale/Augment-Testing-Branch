/**
 * Created by uestuenel on 30.06.2016.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowGetTextDocumentEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-text-document-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.output = {};
						$scope.input = {};
						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Text', action);
								var paramUrl = _.find(value.input, {key: 'DocRef'});

								return {
									inputParam: paramUrl ? paramUrl.value : '',
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							$scope.input.script = ngModelCtrl.$viewValue.inputParam;
							$scope.outputKey = ngModelCtrl.$viewValue.outputKey;
							$scope.output.text = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.script, 'DocRef', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'Text', action);
							return action;
						});

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								ngModelCtrl.$setViewValue({
									script: $scope.input.script,
									scriptOutput: $scope.output.text
								});
							}
						}

						$scope.$watch('input.script', watchfn);
						$scope.$watch('output.text', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowGetTextDocumentEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGetTextDocumentEditorDirective', basicsWorkflowGetTextDocumentEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '9be217e409c045fcaeddbcba84e6a98b',
					directive: 'basicsWorkflowGetTextDocumentEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
