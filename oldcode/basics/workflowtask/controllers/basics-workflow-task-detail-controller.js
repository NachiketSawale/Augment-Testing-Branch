/* global angular */

(function (angular) {
	'use strict';

	var moduleName = 'basics.workflowTask';

	function taskDetailCtrl($scope, platformModuleStateService, basicsWorkflowInstanceService, basicsWorkflowUIService, basicsWorkflowTaskPopUpService) {

		var state = platformModuleStateService.state(moduleName);
		$scope.task = {};
		basicsWorkflowTaskPopUpService.stop();

		$scope.onOk = function (task) {
			basicsWorkflowInstanceService.continueWorkflow(task);
			basicsWorkflowUIService.removeItemAndRefreshList('basics.workflowTask');
			basicsWorkflowInstanceService.changeSelectedTask(null);
		};

		$scope.disableEscalteButton = function (task) {
			var actionInput = [];
			if (typeof task.input !== 'undefined') {
				actionInput = angular.isArray(task.Input) ? task.Input : JSON.parse(task.Input);
			}

			var EscalationDisabledValue = _.find(actionInput, {key: 'EscalationDisabled'});
			if (typeof EscalationDisabledValue !== 'undefined') {
				if (EscalationDisabledValue.value) {
					return true;
				}
			}
		};

		$scope.onBreak = function (task) {
			const currentTaskId = task && task.id ? task.id: $scope.currentTask.id;
			basicsWorkflowInstanceService.escalateTask(currentTaskId);
			basicsWorkflowUIService.removeItemAndRefreshList('basics.workflowTask');
			basicsWorkflowInstanceService.changeSelectedTask(null);
		};

		$scope.$watch(function () {
			return state.selectedMainEntity;
		}, function () {
			if (!_.isEmpty(state.selectedMainEntity)) {
				$scope.currentTask = basicsWorkflowInstanceService.prepareTask(state.selectedMainEntity);
			} else {
				$scope.currentTask = null;
			}
		});

		$scope.$on('$destroy', function () {
			basicsWorkflowTaskPopUpService.start();
		});

	}

	angular.module(moduleName)
		.controller('basicsWorkflowTaskDetailController', ['$scope', 'platformModuleStateService', 'basicsWorkflowInstanceService', 'basicsWorkflowUIService', 'basicsWorkflowTaskPopUpService', taskDetailCtrl]);

})(angular);
