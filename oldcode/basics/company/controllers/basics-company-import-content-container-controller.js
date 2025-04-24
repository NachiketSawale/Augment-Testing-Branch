/**
 * Created by ysl on 12/7/2017.
 */
(function (angular) {
	'use strict';
	angular.module('basics.company').controller('basicsCompanyImportContentContainerController', [
		'$translate',
		'$scope',
		'$http',
		'$q',
		'$log',
		'platformGridAPI',
		'platformTranslateService',
		'basicsCompanyImportContentService',
		'platformModalService',
		'basicsCompanyImportContentJobStatus',
		function ($translate,
				  $scope,
				  $http,
				  $q,
				  $log,
				  platformGridAPI,
				  platformTranslateService,
				  basicsCompanyImportContentService,
				  platformModalService,
				  basicsCompanyImportContentJobStatus) {

			$scope.title = $translate.instant('basics.company.importContent.title');
			$scope.steps = [
				{
					number: 0,
					identifier: 'basic',
					name: 'basicSettings',
					title: $translate.instant('basics.company.importContent.importBasicSettings'),
					skip: true,
					disallowBack: true,
					disallowNext: false,
					canFinish: false,
					disallowCancel: false,
					disallowClose: true,
					showAbort: false,
					enableAbort: false,
					showRestart: false,
					enableRestart: false
				},
				{
					number: 1,
					identifier: 'selection',
					name: 'selectionSettings',
					title: $translate.instant('basics.company.importContent.importSelectionSettings'),
					skip: true,
					disallowBack: false,
					disallowNext: true,
					canFinish: true,
					disallowCancel: false,
					disallowClose: true,
					showAbort: false,
					enableAbort: false,
					showRestart: false,
					enableRestart: false
				},
				{
					number: 2,
					identifier: 'result',
					name: 'result',
					title: $translate.instant('basics.company.importContent.importStatus'),
					skip: true,
					disallowBack: false,
					disallowNext: true,
					canFinish: false,
					disallowCancel: true,
					disallowClose: false,
					showAbort: true,
					enableAbort: true,
					showRestart: true,
					enableRestart: false
				}
			];

			$scope.isReadying = false;
			$scope.selectStep = angular.copy($scope.steps[0]);

			$scope.importJob = null;
			$scope.setImportJob = function (importJob) {
				if (importJob) {
					$scope.importJob = importJob;
				}
			};

			$scope.wizardCommands = {
				goToNext: function () {
					$scope.isReadying = true;
					onStep($scope.selectStep.number, true).then(function (response) {
						$scope.isReadying = false;
						if (response.result === true) {
							setCurrentStep($scope.selectStep.number + 1);
						} else {
							platformModalService.showMsgBox(response.description, $translate.instant('basics.company.importContent.title'), 'error');
						}
					});
				},
				goToPrevious: function () {
					$scope.isReadying = true;
					onStep($scope.selectStep.number, false).then(function (response) {
						$scope.isReadying = false;
						if (response.result === true) {
							var gotoStep = $scope.selectStep.number - 1;
							if ($scope.selectStep.number === 2) {
								var needGoToSetp1 = basicsCompanyImportContentService.allSettings.basicSettings ? false : true;
								if (needGoToSetp1) {
									gotoStep = 0;
								}
							}
							setCurrentStep(gotoStep);
						} else {
							platformModalService.showMsgBox(response.description, $translate.instant('basics.company.importContent.title'), 'error');
						}
					});
				},
				finish: function () {
					$scope.isReadying = true;
					onStep($scope.selectStep.number, true).then(function (response) {
						$scope.isReadying = false;
						if (response.result === true) {
							basicsCompanyImportContentService.startTasks().then(function (response) {
								if (response && response.data) {
									$scope.setImportJob(response.data);
									setCurrentStep($scope.selectStep.number + 1);
								}
							});
						} else {
							platformModalService.showMsgBox(response.description, $translate.instant('basics.company.importContent.title'), 'error');
						}
					});
				},
				abort: function () {
					basicsCompanyImportContentService.abort($scope.importJob.Id).then(function (response) {
						if (response.data === true) {
							$scope.importJob.Status = basicsCompanyImportContentJobStatus.Aborting;
						}
					});
				},
				restart:function () {
					$scope.$broadcast('import:beforeRestart');
					basicsCompanyImportContentService.startTasks().then(function (response) {
						if (response && response.data) {
							$scope.setImportJob(response.data);
							$scope.$broadcast('import:restarted');
						}
					});
				}
			};

			function setCurrentStep(step) {
				$scope.selectStep = angular.copy($scope.steps[step]);
			}

			function onStep(index, isNext) {
				switch (index) {
					case 0:
						basicsCompanyImportContentService.onBasicSettingsFinished();
						return basicsCompanyImportContentService.doBasicSettingReady();
					case 1:
						basicsCompanyImportContentService.onContentSelectionFinished();
						return basicsCompanyImportContentService.doContentSettingReady(isNext);
					default:
						var defered = $q.defer();
						defered.resolve({result: true, description: ''});
						return defered.promise;
				}

			}

			$scope.wzStrings = {
				stepFinish: $translate.instant('platform.wizard.stepFinish'),
				back: function () {
					if ($scope.selectStep.number === 0) {
						$scope.selectStep.disallowBack = true;
					} else if ($scope.selectStep.number === 1) {
						$scope.selectStep.disallowBack = false;
					} else {
						if ($scope.importJob) {
							$scope.selectStep.disallowBack = !($scope.importJob.Status === basicsCompanyImportContentJobStatus.Aborted || $scope.importJob.Status === basicsCompanyImportContentJobStatus.Finish);
						} else {
							$scope.selectStep.disallowBack = true;
						}
					}
					return $translate.instant('platform.wizard.back');
				},
				restart: function () {
					if ($scope.selectStep.number === 0) {
						$scope.selectStep.enableRestart = false;
					} else if ($scope.selectStep.number === 1) {
						$scope.selectStep.enableRestart = false;
					} else {
						if ($scope.importJob) {
							$scope.selectStep.enableRestart = ($scope.importJob.Status === basicsCompanyImportContentJobStatus.Aborted || $scope.importJob.Status === basicsCompanyImportContentJobStatus.Finish);
						} else {
							$scope.selectStep.enableRestart = false;
						}
					}
					return $translate.instant('basics.company.importContent.buttons.restart');
				},
				next: $translate.instant('platform.wizard.next'),
				cancel: $translate.instant('cloud.common.cancel'),
				finish: $translate.instant('cloud.common.ok'),
				nextStep: $translate.instant('platform.wizard.nextStep'),
				close: $translate.instant('cloud.common.close'),
				abort: function () {
					if ($scope.importJob) {
						if ($scope.importJob.Status === basicsCompanyImportContentJobStatus.Aborting) {
							$scope.selectStep.enableAbort = false;
							return $translate.instant('basics.company.importContent.buttons.aborting');
						} else if ($scope.importJob.Status === basicsCompanyImportContentJobStatus.Aborted) {
							$scope.selectStep.enableAbort = false;
							return $translate.instant('basics.company.importContent.buttons.aborted');
						} else if ($scope.importJob.Status === basicsCompanyImportContentJobStatus.Finish) {
							$scope.selectStep.enableAbort = false;
							return $translate.instant('basics.company.importContent.buttons.abort');
						} else {
							$scope.selectStep.enableAbort = true;
							return $translate.instant('basics.company.importContent.buttons.abort');
						}
					} else {
						$scope.selectStep.enableAbort = false;
						return $translate.instant('basics.company.importContent.buttons.abort');
					}
				}
			};

			function init() {
				basicsCompanyImportContentService.getWaitingOrInProgressJob().then(function (response) {
					if (response && response.data) {
						$scope.setImportJob(response.data);
						setCurrentStep(2);
					}
				});
			}

			init();
		}
	]);
})(angular);
