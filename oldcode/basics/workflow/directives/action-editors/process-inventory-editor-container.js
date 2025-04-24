/**
 * Created by lcn on 01/22/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowProcessInventoryEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/process-inventory-editor.html',
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
									InventoryHeaderIds: getDataFromAction('InventoryHeaderIds'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.InventoryHeaderIds = ngModelCtrl.$viewValue.InventoryHeaderIds;

							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.InventoryHeaderIds, 'InventoryHeaderIds', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								InventoryHeaderIds: scope.model.InventoryHeaderIds,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.InventoryHeaderIds', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowProcessInventoryEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowProcessInventoryEditorContainer', basicsWorkflowProcessInventoryEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '16ACC6190D504F0A9C4E018A95025E93',
					directive: 'basicsWorkflowProcessInventoryEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
