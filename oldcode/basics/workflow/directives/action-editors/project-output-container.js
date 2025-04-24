/**
 * Created by uestuenel on 12.07.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowProjectOutputContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/project-output.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						scope.output = {};
						var action = {};

						//3. output parameter
						scope.thirdParam = '';
						if (attr.outputConfig) {
							scope.thirdParam = attr.outputConfig;
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var success = basicsWorkflowActionEditorService.getEditorOutput('Succeeded', action);
								var error = basicsWorkflowActionEditorService.getEditorOutput('ErrorMessage', action);
								var depend = basicsWorkflowActionEditorService.getEditorOutput(scope.thirdParam, action);

								return {
									succeeded: success ? success.value : '',
									errorMessage: error ? error.value : '',
									depend: depend ? depend.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							scope.output.succeeded = ngModelCtrl.$viewValue.succeeded;
							scope.output.errorMessage = ngModelCtrl.$viewValue.errorMessage;
							scope.output.depend = ngModelCtrl.$viewValue.depend;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorOutput(value.succeeded, 'Succeeded', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.errorMessage, 'ErrorMessage', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.depend, scope.thirdParam, action);

							return action;
						});

						scope.saveOutputParams = function () {
							ngModelCtrl.$setViewValue({
								succeeded: scope.output.succeeded,
								errorMessage: scope.output.errorMessage,
								depend: scope.output.depend
							});
						};
					}
				};
			}
		};
	}

	basicsWorkflowProjectOutputContainer.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowProjectOutputContainer', basicsWorkflowProjectOutputContainer);
})(angular);
