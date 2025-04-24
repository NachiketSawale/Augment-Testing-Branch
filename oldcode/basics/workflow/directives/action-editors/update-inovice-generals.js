/**
 * Created by lvy on 3/20/2019.
 */
(function (angular) {
	'use strict';

	function updateInvoiceGeneralsEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/update-inovice-generals.html',
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
									invId: getDataFromAction('InvId'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.invId = ngModelCtrl.$viewValue.invId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.invId, 'InvId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								invId: scope.model.invId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.invId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	updateInvoiceGeneralsEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowUpdateInvoiceGeneralsEditorDirective', updateInvoiceGeneralsEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'cec61873cc424cc6aa644ce36ecbeb1f',
					directive: 'basicsWorkflowUpdateInvoiceGeneralsEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
