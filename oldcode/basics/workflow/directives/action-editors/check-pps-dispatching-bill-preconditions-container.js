(function (angular) {
	'use strict';

	function editorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/check-pps-disp-bill-preconditions-editor.html',
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
								DispatchingRecordIds: $scope.model.DispatchingRecordIds,
								Result: $scope.output.Result
							});
						}

						ngModelCtrl.$render = function () {
							//input
							$scope.model.DispatchingRecordIds = ngModelCtrl.$viewValue.DispatchingRecordIds;
							//output
							$scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									DispatchingRecordIds: getDataFromAction('DispatchingRecordIds'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						//parsers needs to update the values!
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.DispatchingRecordIds, 'DispatchingRecordIds', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);
							return action;
						});

						$scope.$watch('model.DispatchingRecordIds', watchfn);
						$scope.$watch('output.Result', watchfn);

					}
				};
			}
		};
	}

	editorContainer.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowChkPpsDispBillPrecondEditorContainer', editorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'a0586db3fea14bd096fc3839c831cb33',
					directive: 'basicsWorkflowChkPpsDispBillPrecondEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
