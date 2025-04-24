(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	/* jshint -W072 */ // this function has too much parameters.
	angular.module(moduleName).controller('basicsCommonChangeStatusMultipleDialogController',
		['$scope', 'cloudDesktopSidebarService', '$http', '$injector', '$translate', 'basicsCommonChangeStatusService', 'basicsWorkflowInstanceStatus', 'globals',
			function ($scope, cloudDesktopSidebarService, $http, $injector, $translate, basicsCommonChangeStatusService, wfStatus, globals) {

				$scope.options = $scope.$parent.modalOptions;
				let imageSelector = $scope.options.imageSelector;
				if (angular.isUndefined($scope.options.showIcon)) {
					$scope.showIcon = true;
				} else {
					$scope.showIcon = $scope.options.showIcon;
				}

				//$scope.isSimpleStatus = $scope.options.isSimpleStatus;
				$scope.isMultipleSelected = $scope.options.isMultipleSelected;
				$scope.result = {yes: false};
				$scope.data = {
					remark: ''
				};
				$scope.showHistory = false;

				if (angular.isString(imageSelector)) {
					imageSelector = $injector.get(imageSelector);
				}

				$scope.imageSelector = {
					select: function (dataItem) {
						const url = imageSelector.select(dataItem);
						return url ? url : 'control-icons ico-blank';
					}
				};
				$scope.modalOptions = {
					closeButtonText: $translate.instant('basics.common.button.close'),
					actionButtonText: $translate.instant('basics.common.button.nextStep'),
					headerText: $scope.options.headerText
				};

				const projectInfo = $translate.instant('basics.common.changeStatus.project');
				const statusInfo = $translate.instant('basics.common.changeStatus.status');
				const groupInfo = $translate.instant('basics.common.changeStatus.statusgrouping');
				if ($scope.options.projectId) {
					getProject($scope.options.projectId).then(function (result) {
						if (result) {
							$scope.modalOptions.groupInfo = groupInfo + '(' + projectInfo + result.ProjectNo + ';' + statusInfo + $scope.options.fromStatusName + ')';
						}
					});
				} else {
					if ($scope.options.projectField)
					{
						$scope.modalOptions.groupInfo = groupInfo + '(' + projectInfo + ';' + statusInfo + $scope.options.fromStatusName + ')';
					}
					else
					{
						$scope.modalOptions.groupInfo = groupInfo + '(' + statusInfo + $scope.options.fromStatusName + ')';
					}
				}

				$scope.wfStatus = [
					'None',
					$translate.instant('basics.common.changeStatus.Running'),
					$translate.instant('basics.common.changeStatus.Finished'),
					$translate.instant('basics.common.changeStatus.Escalate'),
					$translate.instant('basics.common.changeStatus.Waiting'),
					$translate.instant('basics.common.changeStatus.Failed')
				];
				$scope.getStatusIcon = function getWorkflowStatus(statusId) {
					switch (statusId) {
						case wfStatus.running:
						case wfStatus.finished:
						case wfStatus.waiting:
							return 'ico-info';
						case wfStatus.escalate:
						case wfStatus.failed:
							return 'ico-error';
					}

					return 'ico-info';
				};

				let nextStepCallBack;

				$scope.modalOptions.ok = function onOK() {
					nextStepCallBack = null;
					const results = [];
					const changeStatusOnce = function () {
						angular.forEach($scope.options.entities, function (item) {
							const option = {
								EntityId: item.Id,
								StatusField: $scope.options.statusField,
								EntityTypeName: $scope.options.statusName.toLowerCase(),
								FromStatusId: $scope.options.fromStatusId,
								ToStatusId: $scope.options.toStatusId,
								projectId: item.ProjectFk,
								EntityPKey1: $scope.options.pKey1Field ? item[$scope.options.pKey1Field] : null,
								EntityPKey2: $scope.options.pKey2Field ? item[$scope.options.pKey2Field] : null,
								Remark: $scope.data.remark
							};
							if (option.FromStatusId !== option.ToStatusId) {
								results.push(option);
							}
						});
						$scope.$close({results: results});

					};
					changeStatusOnce();
				};

				$scope.modalOptions.close = function onCancel() {
					if (nextStepCallBack) {
						nextStepCallBack();
					} else {
						$scope.$close(false);
					}
				};

				$scope.modalOptions.cancel = function () {
					$scope.$parent.$close(false);
				};

				function getProject(id) {
					const url = globals.webApiBaseUrl + 'project/main/byid?id=' + id;
					return $http(
						{
							method: 'GET',
							url: url
						}
					).then(function (response) {

						return response.data;
					});
				}
			}]);
})(angular);