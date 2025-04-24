/**
 * Created by anl on 02.02.2021.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowInvoiceForDispatchingEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/invoice-for-dispatching-editor.html',
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
								Mode: $scope.model.Mode,
								IsCreateWIP: $scope.model.IsCreateWIP,
								Result: $scope.output.Result
							});
						}

						ngModelCtrl.$render = function () {
							//input
							$scope.model.DispatchingRecordIds = ngModelCtrl.$viewValue.DispatchingRecordIds;
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
									DispatchingRecordIds: getDataFromAction('DispatchingRecordIds'),
									Mode: getDataFromAction('Mode'),
									IsCreateWIP: getDataFromAction('IsCreateWIP'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						//parsers needs to update the values!
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.DispatchingRecordIds, 'DispatchingRecordIds', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Mode, 'Mode', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsCreateWIP, 'IsCreateWIP', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);
							return action;
						});

						$scope.$watch('model.DispatchingRecordIds', watchfn);
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

	basicsWorkflowInvoiceForDispatchingEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowInvoiceForDispatchingEditorContainer', basicsWorkflowInvoiceForDispatchingEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '7d3af852ecf74478af4016269c2d71ae',
					directive: 'basicsWorkflowInvoiceForDispatchingEditorContainer',
					prio: null,
					tools: []
				},
				{
					actionId: '05c9f8bede734bc1874379f725e42961',
					directive: 'basicsWorkflowInvoiceForDispatchingEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
