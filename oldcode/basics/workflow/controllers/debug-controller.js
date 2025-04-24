(function (angular) {
	'use strict';

	function debugCtrl($scope, basicsWorkflowDebugService, basicsWorkflowTemplateService, platformModuleStateService, $timeout) {

		var state = platformModuleStateService.state('basics.workflow');
		var debugBtn, nextBtn, cancelBtn;

		var disabledIfMultiSelect = function (newVal) {
			debugBtn.disabled = newVal === undefined || angular.isArray(newVal);
			$scope.tools.update();
		};

		let templateVersionWatch = $scope.$watch(function () {
				return state.selectedTemplateVersion;
			},
			disabledIfMultiSelect);

		debugBtn = {
			id: 'debug',
			caption: 'Debug',
			type: 'item',
			iconClass: 'tlb-icons ico-workflow-run',
			disabled: true,
			fn: function () {
				state.debugCanceled = false;
				debugBtn.disabled = true;
				nextBtn.disabled = false;
				cancelBtn.disabled = false;
				$scope.tools.update();
				basicsWorkflowDebugService.startDebugCurrent().then(responseFunction);
			}
		};

		nextBtn = {
			id: 'next',
			caption: 'Next',
			type: 'item',
			iconClass: 'tlb-icons ico-workflow-next',
			disabled: true,
			fn: function () {
				debugBtn.disabled = true;
				nextBtn.disabled = false;
				cancelBtn.disabled = false;
				$scope.tools.update();
				basicsWorkflowDebugService.nextActionFromCurrent().then(responseFunction);
			}
		};

		cancelBtn = {
			id: 'cancel',
			caption: 'Cancel',
			type: 'item',
			iconClass: 'tlb-icons ico-workflow-cancel',
			disabled: true,
			fn: cancelDebug
		};

		responseFunction({context: state.debugContext, action: state.currentWorkflowAction});

		function checkNextButton() {
			nextBtn.disabled = state.debugContext === null || !state.currentWorkflowAction || !state.currentWorkflowAction.transitions || state.currentWorkflowAction.transitions.length <= 0;
			if ($scope.tools) {
				$timeout($scope.tools.update);
			}
		}

		function responseFunction(response) {
			if (!response) {
				return;
			}

			state.currentWorkflowAction = response.action;
			checkNextButton();
			state.debugContext = response.context;

			if (response.context && response.context.Truncated === true) {
				$scope.truncated = response.context.Truncated;
			} else {
				$scope.truncated = false;
			}
			$scope.formatedContext = JSON.stringify(response.context, null, 2);
			checkNextButton();
		}

		function cancelDebug() {
			debugBtn.disabled = angular.isArray(state.selectedTemplateVersion);
			nextBtn.disabled = true;
			cancelBtn.disabled = true;
			$scope.tools.update();
			state.currentWorkflowAction = null;
			state.debugContext = '';
			$scope.formatedContext = '';
		}

		state.clearContext = function () {
			cancelDebug();
		};

		var tools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [debugBtn, nextBtn, cancelBtn]
		};

		$scope.setTools(tools);

		$scope.$watch(function () {
				return state.currentWorkflowAction;
			},
			function (newVal, oldVal) {
				if (newVal !== oldVal && newVal) {
					checkNextButton();
				}
			});

		$scope.$watch(function () {
				return state.selectedMainEntity;
			},
			function (newVal, oldVal) {
				if (newVal) {
					if (!newVal.Id) {
						debugBtn.disabled = true;
						$scope.tools.update();
					} else {
						if (oldVal && newVal.Id !== oldVal.Id) {
							cancelDebug();
						}
					}
				}
			});

		$scope.$watch(function () {
				return state.debugCanceled;
			},
			function (newVal) {
				if (newVal === true) {
					cancelDebug();
				}
			});

		$scope.$on('$destroy', function () {
			templateVersionWatch();
		});
	}

	debugCtrl.$inject = ['$scope', 'basicsWorkflowDebugService', 'basicsWorkflowTemplateService', 'platformModuleStateService', '$timeout'];

	angular.module('basics.workflow').controller('basicsWorkflowDebugController', debugCtrl);
})(angular);
