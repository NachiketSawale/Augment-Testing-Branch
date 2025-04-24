(function (angular) {
	'use strict';

	function basicsWorkflowExtendedUserTaskActionDirective($compile, $injector, basicsWorkflowClientActionUtilService,$templateCache,basicsWorkflowInstanceService, basicsWorkflowUIService, _) {

		return {
			restrict: 'A',
			require: 'ngModel',
			compile: function compile() {
				return function postLink(scope, iElement, attrs, ngModelCtrl) {
					ngModelCtrl.$render = async function () {
						await basicsWorkflowClientActionUtilService.initScope(scope, ngModelCtrl);

						var html = basicsWorkflowClientActionUtilService.getFromInputParam('HTML', ngModelCtrl);
						var script = basicsWorkflowClientActionUtilService.getFromInputParam('Script', ngModelCtrl);
						var fn = new Function('$scope', '$injector', script); // jshint ignore:line
						fn(scope, $injector);

						// Adding html template for reassigning task
						let reassignTaskHtml = $templateCache.get('basics.workflow/reassign-task.html');
						html += reassignTaskHtml;

						iElement.html($compile(html)(scope));

						scope.onBreak = function (task) {
							if (_.isFunction(scope.onCancel)){
								scope.onCancel();
							}
							const currentTaskId = task && task.id ? task.id: scope.task.id;
							basicsWorkflowInstanceService.escalateTask(currentTaskId);
							basicsWorkflowUIService.removeItemAndRefreshList('basics.workflowTask');

						};
					};

				};
			}
		};
	}

	basicsWorkflowExtendedUserTaskActionDirective.$inject = ['$compile', '$injector', 'basicsWorkflowClientActionUtilService','$templateCache', 'basicsWorkflowInstanceService', 'basicsWorkflowUIService', '_'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowExtendedUserTaskActionDirective', basicsWorkflowExtendedUserTaskActionDirective);

})(angular);
