/* globals angular*/

(function (angular) {
	'use strict';

	function basicsWorkflowFormulaDecisionEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/formula-decision-editor.html',
			compile: function compile() {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var param = _.find(value.input, {key: 'Formula'});

								return param ? param.value : '';
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							$scope.formula = ngModelCtrl.$viewValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value, 'Formula', action);

							return action;
						});

						$scope.$watch(function () {
							return $scope.formula;
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

	basicsWorkflowFormulaDecisionEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowFormulaDecisionEditorDirective', basicsWorkflowFormulaDecisionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'd02b52ff5e0943d2936e1eb00d7ce2de',
					directive: 'basicsWorkflowFormulaDecisionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);