(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonChangeStatusDialogController',
		['$scope', '$http', '$injector', '$translate', 'basicsCommonChangeStatusService', 'basicsWorkflowInstanceStatus', '_', 'platformGridAPI',
			function ($scope, $http, $injector, $translate, basicsCommonChangeStatusService, wfStatus, _, platformGridAPI) {

				$scope.options = $scope.$parent.modalOptions;
				let imageSelector = $scope.options.imageSelector;
				if (angular.isUndefined($scope.options.showIcon)) {
					$scope.showIcon = true;
				} else {
					$scope.showIcon = $scope.options.showIcon;
				}

				$scope.isSimpleStatus = $scope.options.isSimpleStatus;
				$scope.isMultipleSelected = $scope.options.isMultipleSelected;
				$scope.result = { yes: false };
				$scope.data = {
					remark: ''
				};

				$scope.showNext = false;
				if (angular.isString(imageSelector)) {
					imageSelector = $injector.get(imageSelector);
				}

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

                // new buttons logic

                $scope.showButton = true;
                $scope.showBackButton = false;

                $scope.showNextButtom = function () {
                    $scope.showButton = false;
                    $scope.showNext = true;
                    $scope.showBackButton = true;
                };

                $scope.showReadOnlyButton = function () {
                    return $scope.showNext; 
                };

                $scope.goToDefaultPage = function() {
                    $scope.showHistory = false;
                    $scope.showNext = false;
                    $scope.showButton = true;
                    $scope.showBackButton = false;
                };

				// Load available status flag
				let key = 'basic.common.status';
				const mainService = $scope.options.mainService;
				if (!_.isNil(mainService)) {
					if (!_.isNil(mainService.getModule().name) && !_.isNil($scope.options.statusName)) {
						key = (mainService.getModule().name + '.' + $scope.options.statusName).toLowerCase();
						if (!_.isNil(mainService.documentParentService)) {
							key = mainService.documentParentService.getModule().name + '.' + key;
						}
					}
				}

				$scope.options.showAvailableStatusFlg = false;
				basicsCommonChangeStatusService.loadSettingData(key).then(function (response) {
					if (!_.isNil(response.data)) {
						const settingData = response.data;
						if (settingData.hasSavedSetting) {
							$scope.options.showAvailableStatusFlg = settingData.status;
						} else {
							$scope.options.showAvailableStatusFlg = settingData.isPortalUser;
						}
					}
				});

				$scope.showAvailStatus = function showAvailableStatus() {
					basicsCommonChangeStatusService.saveSettingData(key, $scope.options.showAvailableStatusFlg);
				};

				$scope.modalOptions = {
					closeButtonText: $translate.instant('basics.common.button.close'),
					actionButtonText: $translate.instant('basics.common.button.ok'),
					historyButtonText: $translate.instant('basics.common.button.history'),
					backButtonText: $translate.instant('basics.common.button.back'),
					headerText: $scope.options.headerText,
					runningMessage: $translate.instant('basics.common.changeStatus.workflowRunning'),
					makeReadonly: makeReadonly,
				};

				$scope.wfStatus = [
					'None',
					$translate.instant('basics.common.changeStatus.Running'),
					$translate.instant('basics.common.changeStatus.Finished'),
					$translate.instant('basics.common.changeStatus.Escalate'),
					$translate.instant('basics.common.changeStatus.Waiting'),
					$translate.instant('basics.common.changeStatus.Failed')
				];

				$scope.getChangeStatusResults = function getChangeStatusResults() {
					return basicsCommonChangeStatusService.getChangeStatusResults();
				};

				$scope.modalOptions.btnMouseMoveHandler = function btnMouseMoveHandler() {
					event.stopPropagation();
					event.preventDefault();
					event.currentTarget.disabled = !!$scope.isRunningWorkflow;
				};

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



				let nextStepCallBack;

				$scope.modalOptions.ok = function onOK() {

                    // disable Next button logic 
                    $scope.ifReadOnlyTrue = false;
                    $scope.showButton = false;


					nextStepCallBack = null;
					$scope.isChangingStatus = true;
					$scope.isRunningWorkflow = true;
					let index = 0;
					const results = [];
					const changeStatusOnce = function () {
						if ($scope.options.entities.length > index) {
							$scope.options.entity = $scope.options.entities[index];
							index++;
							basicsCommonChangeStatusService.changeStatus($scope.options, $scope.data.remark)
								.then(function (result) {
									results.push(result);
									if (result.changed) {
										basicsCommonChangeStatusService.onStatusChanged.fire(null, result.hasConfiguredWorkflows);
										changeStatusOnce();
										if ($scope.options.dataService && _.isFunction($scope.options.dataService.evaluationStatusChanged)) {
											$scope.options.dataService.evaluationStatusChanged();
										}
									} else {
										basicsCommonChangeStatusService.setChangeStatusResults(result);
										nextStepCallBack = changeStatusOnce;
									}
									$scope.isRunningWorkflow = false;
									enableCloseButton();
								});
						} else {// finished all
							$scope.$close({ results: results, currentStatusId: $scope.options.toStatusId });
							$scope.isRunningWorkflow = false;
							enableCloseButton();
						}
					};
					changeStatusOnce();
				};

				$scope.modalOptions.disableOk = function () {
					return $scope.options.toStatusId === $scope.options.entity[$scope.options.statusField];
				};

				$scope.modalOptions.close = function onCancel() {
					if (nextStepCallBack) {
						nextStepCallBack();
					} else {
						$scope.$close(false);
					}
				};

				$scope.modalOptions.cancel = $scope.modalOptions.close;

				function enableCloseButton() {
					const closeBtn = angular.element(document).find($($('button[class^="db close"]')));
					if (closeBtn !== null && closeBtn !== undefined) {
						closeBtn[0].disabled = false;
					}
				}

				function makeReadonly() {
                    return new Promise((resolve, reject) => {
                        try {
                            $scope.ifReadOnlyTrue = false;
                            $scope.showButton = false;
                            $scope.showNext = false;
                            $scope.showBackButton = false;
                
                            const gridData = platformGridAPI.rows.getRows('302777ae5d5a4ae398fd8c7db3003a17');
                            if (!gridData) {
                                console.error('Grid data is not available in the controller scope');
                                reject('Grid data is not available');
                                return;
                            }
                
                            gridData.reduce((promise, record) => {
                                return promise.then(() => {
                                    if (!record.Selected) {
                                        const optionsCopy = Object.assign({}, $scope.options);
                                        optionsCopy.entities.Id = record.Id;
                                        optionsCopy.entity.Id = record.Id;
                                        return basicsCommonChangeStatusService.changeStatus(optionsCopy, $scope.data.remark)
                                            .then(() => enableCloseButton())
                                            .catch(error => {
                                                console.error('Error occurred while changing status:', error);
                                                throw error;
                                            });
                                    }
                                });
                            }, Promise.resolve()).then(() => {
                                resolve();
                            }).catch(error => {
                                reject(error);
                            });
                        } catch (error) {
                            console.error('Unexpected error:', error);
                            reject(error);
                        }
                    });
                }
                



			}]);
})(angular);
