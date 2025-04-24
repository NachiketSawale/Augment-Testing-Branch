/* globals angular*/

(function (angular) {
	'use strict';

	function basicsWorkflowExceptionEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/exception-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var paramUrl = _.find(value.input, {key: 'Message'});

								return paramUrl ? paramUrl.value : '';
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							$scope.exception = ngModelCtrl.$viewValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value, 'Message', action);
							return action;
						});

						$scope.$watch(function () {
							return $scope.exception;
						}, function (newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								ngModelCtrl.$setViewValue(newVal);
							}
						});
					}
				};
			}
		};
	}

	basicsWorkflowExceptionEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowExceptionEditorDirective', basicsWorkflowExceptionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '030152f052a04ca6add9028340aa9dc6',
					directive: 'basicsWorkflowExceptionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
