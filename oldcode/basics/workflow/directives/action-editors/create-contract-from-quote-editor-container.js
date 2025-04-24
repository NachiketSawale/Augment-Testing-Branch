(function (angular) {
	/* global globals */
	'use strict';

	function createContractFromQuoteEditorDirective(_, basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-contract-from-quote-editor.html',
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
									QtnId: getDataFromAction('QtnId'),
									CreateContractOption: getDataFromAction('CreateContractOption') || 'multip',
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.QtnId = ngModelCtrl.$viewValue.QtnId;
							scope.model.CreateContractOption = ngModelCtrl.$viewValue.CreateContractOption;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.QtnId, 'QtnId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.CreateContractOption, 'CreateContractOption', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								QtnId: scope.model.QtnId,
								CreateContractOption: scope.model.CreateContractOption,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.QtnId', watchfn);
						scope.$watch('model.CreateContractOption', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	createContractFromQuoteEditorDirective.$inject = ['_', 'basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowCreateContractFromQuoteEditorDirective', createContractFromQuoteEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'a4e4d462b90046889400229cdad90625',
					directive: 'basicsWorkflowCreateContractFromQuoteEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
