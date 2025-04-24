/**
 * Created by lav on 7/2/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowCreatePpsItemsFromSalesContractEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-pps-items-from-sales-contract-editor.html',
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
									OrderHeaderId: getDataFromAction('OrderHeaderId'),
									LgmJobId: getDataFromAction('LgmJobId'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.OrderHeaderId = ngModelCtrl.$viewValue.OrderHeaderId;
							scope.model.LgmJobId = ngModelCtrl.$viewValue.LgmJobId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.OrderHeaderId, 'OrderHeaderId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.LgmJobId, 'LgmJobId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								OrderHeaderId: scope.model.OrderHeaderId,
								LgmJobId: scope.model.LgmJobId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.OrderHeaderId', watchfn);
						scope.$watch('model.LgmJobId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreatePpsItemsFromSalesContractEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowCreatePpsItemsFromSalesContractEditorDirective', basicsWorkflowCreatePpsItemsFromSalesContractEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'aaecca444bc145448f5c0af88d9b1a98',
					directive: 'basicsWorkflowCreatePpsItemsFromSalesContractEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
