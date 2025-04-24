/*globals angular */
(function (angular) {
	'use strict';

	function basicsWorkflowWorkflowButtonDirective(basicsWorkflowInstanceService) {
		return {
			restrict: 'A',
			scope: {
				options: '='
			},
			replace: true,
			template: '<button class="btn btn-default fullwidth" type="button" data-ng-click="startWorkflow()">{{options.displayText}}</button>',
			link: function (scope) {
				scope.startWorkflow = function openWorkflow() {
					if (scope.options.templateId) {
						basicsWorkflowInstanceService.startWorkflow(scope.options.templateId, scope.options.entityId,
							angular.toJson(scope.options.startContext));
					}
				};
			}
		};
	}

	basicsWorkflowWorkflowButtonDirective.$inject = ['basicsWorkflowInstanceService'];

	angular.module('basics.workflow').directive('basicsWorkflowWorkflowButtonDirective',
		basicsWorkflowWorkflowButtonDirective);
})(angular);