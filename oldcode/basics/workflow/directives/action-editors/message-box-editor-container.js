/**
 * Created by uestuenel on 13.06.2016.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowMessageBoxEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/message-box-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var param = basicsWorkflowActionEditorService.getEditorInput('Message', action);

								return param ? param.value : '';
							}

							return '';
						});

						ngModelCtrl.$render = function () {
							$scope.script = ngModelCtrl.$viewValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value, 'Message', action);
							return action;
						});

						$scope.$watch(function () {
							return $scope.script;
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

	basicsWorkflowMessageBoxEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowMessageBoxEditorContainer', basicsWorkflowMessageBoxEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '00000000000000000000000000000003',
					directive: 'basicsWorkflowMessageBoxEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
