(function (angular) {
	'use strict';

	function BasicsWorkflowClientActionUtilService(_, basicsWorkflowUtilityService, basicsWorkflowInstanceService) {
		var self = this;

		self.initScope = async function (scope, ngModelCtrl) {
			scope.task = ngModelCtrl.$viewValue.task;

			if (scope.task && !scope.task.IsContextLoaded) {
				await basicsWorkflowUtilityService.loadContext(scope.task);
				scope.task = basicsWorkflowInstanceService.prepareTask(scope.task);
				scope.Context = scope.task.Context;
			} else if (angular.isString(ngModelCtrl.$viewValue.task.Context) && ngModelCtrl.$viewValue.task.Context.length > 0) {
				scope.Context = angular.fromJson(ngModelCtrl.$viewValue.task.Context);

			} else {
				scope.Context = ngModelCtrl.$viewValue.task.Context;
			}

			var okFn = scope.onOk;
			scope.onOk = function () {
				scope.task.context = scope.Context;
				ngModelCtrl.$setViewValue(
					{
						task: scope.task,
						context: scope.Context,
						result: scope.task.Result
					});
				okFn(scope.task);
			};

			checkIfReassignAllowed(scope.task);
			checkIfEscalationDisabled(scope.task);
		};

		function checkIfReassignAllowed(task) {
			if(!task) {
				return;
			}

			let isAllowReassign = task.input && task.input.filter(t => t.key.toLowerCase() === 'allowreassign')[0];
			isAllowReassign = isAllowReassign === undefined || isAllowReassign === '' ? false : isAllowReassign.value;

			if (angular.isDefined(isAllowReassign)) {
				task.reassignTaskOwner = basicsWorkflowInstanceService.reassignTaskOwner;
				task.clerkLookUpConfig = {
					lookupOptions: {
						showClearButton: true,
						removeSelfFromClerk: true
					}
				};
				task.allowReassign = isAllowReassign;
				task.selectedClerkId = 0;
				task.selectedReassignClerkId = 0;
				task.isPopup = false;
			}
		}

		function checkIfEscalationDisabled(task) {
			task.EscalationDisabled = task?.input?.filter(item => item.key.toLowerCase() === 'escalationdisabled')[0]?.value === 'true';
		}

		self.getFromInputParam = function (key, ngModelCtrl) {
			var input;
			if (!angular.isArray(ngModelCtrl.$viewValue.task)) {
				input = ngModelCtrl.$viewValue.task.Input;
				input = typeof input === 'string' ? JSON.parse(input) : input;
				return _.find(input, { key: key }).value;
			} else {
				//selecting last element in the selected array list to display in detials container.
				input = _.last(ngModelCtrl.$viewValue.task).Input;
				return _.find(input, { key: key }).value;
			}
		};

	}

	angular.module('basics.workflow').service('basicsWorkflowClientActionUtilService', ['_', 'basicsWorkflowUtilityService', 'basicsWorkflowInstanceService', BasicsWorkflowClientActionUtilService]);
})(angular);
