/**
 * Created by anl on 02.02.2021.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowCreateBillHeaderEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-billheader-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.output = {};
						$scope.model = {};
						$scope.input = {};
						$scope.inputOpen = true;
						$scope.outputOpen = true;
						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						$scope.getEditorInput = basicsWorkflowActionEditorService.getEditorInput;

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								DispatchingRecords: $scope.model.DispatchingRecords,
								Mode: $scope.model.Mode,
								IsCreateWIP: $scope.model.IsCreateWIP,
								Result: $scope.output.Result
							});
						}

						ngModelCtrl.$render = function () {
							//input
							$scope.model.DispatchingRecords = ngModelCtrl.$viewValue.DispatchingRecords;
							$scope.model.Mode = ngModelCtrl.$viewValue.Mode;
							$scope.model.IsCreateWIP = ngModelCtrl.$viewValue.IsCreateWIP;
							//output
							$scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									DispatchingRecords: getDataFromAction('DispatchingRecords'),
									Mode: getDataFromAction('Mode'),
									IsCreateWIP: getDataFromAction('IsCreateWIP'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						//parsers needs to update the values!
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.DispatchingRecords, 'DispatchingRecords', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Mode, 'Mode', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsCreateWIP, 'IsCreateWIP', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);
							return action;
						});

						$scope.$watch('model.DispatchingRecords', watchfn);
						$scope.$watch('model.Mode', watchfn);
						$scope.$watch('model.IsCreateWIP', watchfn);
						$scope.$watch('output.Result', watchfn);

						$scope.selectOptions = {
							displayMember: 'description',
							valueMember: 'value',
							items: [{
								value: '1',
								description: 'All Components',
							}, {
								value: '2',
								description: 'Products Only',
							}]
						};
					}
				};
			}
		};
	}

	basicsWorkflowCreateBillHeaderEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowCreateBillHeaderEditorContainer', basicsWorkflowCreateBillHeaderEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'f934c2a2c14a4bb086f9e2ff58a91b3c',
					directive: 'basicsWorkflowCreateBillHeaderEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
