/**
 * Created by baitule on 02.04.2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';

	angular.module(moduleName)
		.directive('basicsWorkflowCheckVatActionEditorDirective', basicsWorkflowCheckVatActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '4c85f957772d481aa1f05d1983682e3a',
					directive: 'basicsWorkflowCheckVatActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

	basicsWorkflowCheckVatActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_', 'globals'];

	function basicsWorkflowCheckVatActionEditorDirective(basicsWorkflowActionEditorService, _, globals) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/check-vat-action-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) { // what is the purpose of pre
						var action = {};
						$scope.input = {};
						$scope.output = {};

						//Opening and Closing of accordion in the container
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						//code Mirror Options for single line text and multiLine text.
						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);                //Single-Line Code-Mirror for Url and Action input parameter
						$scope.codeMirrorOptionsContent = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						// Formatter Model Control (get value from model)
						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								//get output item
								var outputResponse = basicsWorkflowActionEditorService.getEditorOutput('Response', action);
								var outputValid = basicsWorkflowActionEditorService.getEditorOutput('Valid', action);

								//Single-Line Code Mirror for Vat number
								var paramVatNo = basicsWorkflowActionEditorService.getEditorInput('VatNo', action);

								return {
									dataVatNo: paramVatNo ? paramVatNo.value : '',
									outputResponseValue: outputResponse ? outputResponse.value : '', // outputResponseValue is different from outputResponse
									outputValidValue: outputValid ? outputValid.value : false
								};
							}
							return '';
						});

						//Renderer Model Control (update model value from view)
						ngModelCtrl.$render = function () {
							$scope.input.vatNo = ngModelCtrl.$viewValue.dataVatNo;
							$scope.output.response = ngModelCtrl.$viewValue.outputResponseValue;
							$scope.output.valid = ngModelCtrl.$viewValue.outputValidValue;
						};

						//Parsers for Model Control to Push objects (parser view value to model)
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.dataVatNo, 'VatNo', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.dataResponse, 'Response', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.dataValid, 'Valid', action);
							return action;
						});

						//Saving the angular Model
						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								dataVatNo: $scope.input.vatNo,
								dataResponse: $scope.output.response,
								dataValid: $scope.output.valid
							});
						}

						function watchfn(newValue, oldValue) {
							if (!_.isUndefined(newValue) && newValue !== oldValue) {
								saveNgModel();
							}
						}

						$scope.$watch('input.vatNo', watchfn);
						$scope.$watch('output.response', watchfn);
						$scope.$watch('output.valid', watchfn);
					}
				};
			}
		};
	}

})(angular);