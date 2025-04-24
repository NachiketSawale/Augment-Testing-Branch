/**
 * Created by pel on 4/23/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	/* jshint -W072 */ // this function has too much parameters.
	angular.module(moduleName).controller('basicsCommonChangeStatusReportController',
		['$scope', 'cloudDesktopSidebarService', '$http', '$injector', '$translate', 'basicsCommonChangeStatusService', 'basicsWorkflowInstanceStatus', 'platformGridAPI',
			'platformTranslateService', '_', '$',
			function ($scope, cloudDesktopSidebarService, $http, $injector, $translate, basicsCommonChangeStatusService, wfStatus, platformGridAPI, platformTranslateService, _, $) {

				$scope.isChangingStatus = true;
				$scope.isRunningWorkflow = true;
				$scope.changeStatusResults = [];
				$scope.options = $scope.$parent.modalOptions;
				$scope.finishedCount = 0;
				$scope.failedCount = 0;
				var imageSelector = $scope.options.imageSelector;
				if (angular.isUndefined($scope.options.showIcon)) {
					$scope.showIcon = true;
				} else {
					$scope.showIcon = $scope.options.showIcon;
				}

				$scope.gridId = '35226c1497f94729af257cdb8979eb0a';
				$scope.gridData = {
					state: $scope.gridId
				};

				if (angular.isString(imageSelector)) {
					imageSelector = $injector.get(imageSelector);
				}

				$scope.imageSelector = {
					select: function (dataItem) {
						var url = imageSelector.select(dataItem);
						return url ? url : 'control-icons ico-blank';
					}
				};

				$scope.modalOptions = {

					closeButtonText: $translate.instant('basics.common.button.close'),
					actionButtonText: 'Next',
					headerText: $scope.options.headerText,
					runningMessage: $translate.instant('basics.common.changeStatus.workflowRunning')
				};

				$scope.wfStatus = [
					'None',
					$translate.instant('basics.common.changeStatus.Running'),
					$translate.instant('basics.common.changeStatus.Finished'),
					$translate.instant('basics.common.changeStatus.Escalate'),
					$translate.instant('basics.common.changeStatus.Waiting'),
					$translate.instant('basics.common.changeStatus.Failed')
				];

				$scope.modalOptions.btnMouseMoveHandler = function btnMouseMoveHandler() {
					event.stopPropagation();
					event.preventDefault();
					event.currentTarget.disabled = !!$scope.isRunningWorkflow;
				};

				$scope.getChangeStatusResults = function getChangeStatusResults() {
					return basicsCommonChangeStatusService.getChangeStatusResults();
				};

				function getResultStatus(changed) {
					if (changed) {
						return $translate.instant('basics.common.changeStatus.Finished');
						// return 'Finished';
					} else {
						return  $translate.instant('basics.common.changeStatus.Finished');
						// return 'Failed';
					}
				}

				$scope.getWorkflowStatus = function getWorkflowStatus(statusId) {
					return $scope.wfStatus[statusId];
				};

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

				function updateGridData(dataList) {
					platformGridAPI.items.data($scope.gridId, dataList);
					platformGridAPI.grids.invalidate($scope.gridId);
				}

				function setupGrid() {

					if (!platformGridAPI.grids.exist($scope.gridId)) {
						var tempColumns = [
							{
								id: 'IsCode',
								field: 'Code',
								name: 'Code',
								name$tr$: 'basics.common.changeStatusResult.code',
								formatter: 'code',
								width: 60
							},
							{
								id: 'IsDescription',
								field: 'Description',
								name: 'Description',
								name$tr$: 'basics.common.changeStatusResult.description',
								formatter: 'code',
								width: 120
							},
							{
								id: 'IsStatus',
								field: 'Status',
								name: 'Status',
								name$tr$: 'basics.common.changeStatusResult.status',
								formatter: 'code',
								width: 60
							},
							{
								id: 'IsMessage',
								field: 'Message',
								name: 'Message',
								name$tr$: 'basics.common.changeStatusResult.message',
								formatter: 'code',
								width: 120
							}
						];

						platformTranslateService.translateGridConfig(tempColumns);
						var grid = {
							columns: tempColumns,
							data: [],
							id: $scope.gridId,
							lazyInit: true,
							options: {
								editable: false,
								idProperty: 'Id'

							}
						};

						platformGridAPI.grids.config(grid);
					}

				}

				// init
				var init = function () {
					setupGrid();
				};

				init();

				basicsCommonChangeStatusService.changeMultipleStatus($scope.options.config, $scope.options.items).then(function (results) {
					var hasChanged = false;
					var displayDatas = [];
					var hasFinishFn = !!$scope.options.config.hasFinishFn;
					results.forEach(function (result, index) {
						// basicsCommonChangeStatusService.setChangeStatusResults(result);

						if (result.changed) {
							if (!hasFinishFn && angular.isFunction($scope.options.config.handleSuccess)) {
								$scope.options.config.handleSuccess(result);
							}
							hasChanged = true;
						}

						var code = (result.entity && result.entity.Code) ||
							(result.entity && $scope.options.config.codeField && result.entity[$scope.options.config.codeField]);

						if (!code) {
							let entity = _.find($scope.options.allEntities, { Id: result.entityId });
							code = (entity && entity.Code) ||
								(entity && $scope.options.config.codeField && entity[$scope.options.config.codeField]);
						}

						let description = getDescription(result.entity);

						if (!description) {
							const desEntity = _.find($scope.options.allEntities, { Id: result.entityId });
							description = getDescription(desEntity);
						}

						var item = {
							Id: index,
							Code: code,
							Description: description,
							Status: getResultStatus(result.changed),
							Message: result.ErrorMsg
						};
						displayDatas.push(item);

					});
					if (hasChanged) {
						basicsCommonChangeStatusService.onStatusChanged.fire();
						if (hasFinishFn && angular.isFunction($scope.options.config.finishHandleSuccess)) {
							$scope.options.config.finishHandleSuccess(hasChanged);
						}
					}
					var finishedItems = _.filter(results, function (item) {
						return item.changed === true;
					});
					$scope.finishedCount = finishedItems.length;
					$scope.failedCount = results.length - $scope.finishedCount;
					$scope.changeStatusResults = results;
					$scope.isChangingStatus = false;
					$scope.isRunningWorkflow = false;
					enableCloseButton();

					updateGridData(displayDatas);
				}).finally(function () {
					$scope.isChangingStatus = false;
					$scope.isRunningWorkflow = false;
					enableCloseButton();
				});

				//$scope.isSimpleStatus = $scope.options.isSimpleStatus;
				$scope.isMultipleSelected = $scope.options.isMultipleSelected;
				$scope.result = {yes: false};
				$scope.data = {
					remark: ''
				};

				$scope.modalOptions.ok = function onOK() {

				};

				$scope.modalOptions.disableOk = function () {
					return $scope.options.toStatusId === $scope.options.entity[$scope.options.statusField];
				};

				$scope.modalOptions.close = function onCancel() {
					$scope.$close($scope.changeStatusResults);
				};

				$scope.modalOptions.cancel = $scope.modalOptions.close;

				function enableCloseButton() {
					var closeBtn = angular.element(document).find($($('button[class^="db close"]')));
					if (closeBtn !== null && closeBtn !== undefined) {
						closeBtn[0].disabled = false;
					}
				}

				function getDescription(entity) {
					if (!entity) return null;

					return (
						(entity.DescriptionInfo && entity.DescriptionInfo.Translated) ||
						($scope.options.config.descField && entity[$scope.options.config.descField]) ||
						entity.Description
					);
				}
			}]);
})(angular);