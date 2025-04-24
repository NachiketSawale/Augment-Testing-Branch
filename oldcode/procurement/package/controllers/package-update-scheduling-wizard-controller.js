/**
 * Created by wwa on 10/8/2015.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').controller('procurementPackageUpdateSchedulingWizardController',
		['$scope', '$http', '$translate', 'platformModuleNavigationService', 'procurementPackageWizardUpdateSchedulingService',
			function ($scope, $http, $translate, naviService, updateSchedulingService) {

				$scope.options = $scope.$parent.modalOptions;
				var projectInfo = updateSchedulingService.getProjectInfo($scope.options.ProjectFk);
				var executingMessage = $scope.options.scheduleInfo ? 'procurement.package.wizard.updateScheduling.updatingMessage' : 'procurement.package.wizard.updateScheduling.creatingMessage';
				var successMessage = $scope.options.scheduleInfo ? 'procurement.package.wizard.updateScheduling.updatedSucceedMessage' : 'procurement.package.wizard.updateScheduling.createdSucceedMessage';
				var executeFailedMessage = 'procurement.package.wizard.updateScheduling.executeFailedMessage';
				var disabledMsg = 'procurement.package.wizard.updateScheduling.disabledMsg';

				angular.extend($scope.options, {
					title: 'Go to Schedule',
					executingMessage: $translate.instant(executingMessage, {
						'code': $scope.options.scheduleInfo
					}),
					executeFailedMessage: $translate.instant(executeFailedMessage, {
						'code': $scope.options.scheduleInfo
					}),
					entity: {ScheduleFk: -1},
					config: {model: 'ScheduleFk'},
					hasActivity: $scope.options.ActivityFk !== null && $scope.options.ScheduleFk !== null,
					disabledMsg: ($scope.options.ActivityFk !== null && $scope.options.ScheduleFk !== null) ? '' : $translate.instant(disabledMsg),
					body: {
						bodyTitle: $translate.instant('procurement.package.wizard.updateScheduling.bodyOptions'),
						bodyToScheduling: $translate.instant('procurement.package.wizard.updateScheduling.bodyToScheduling'),
						bodyFromScheduling: $translate.instant('procurement.package.wizard.updateScheduling.bodyFromScheduling'),
						currentPackage: $translate.instant('procurement.package.wizard.updateScheduling.currentPackage'),
						currentProject: $translate.instant('procurement.package.wizard.updateScheduling.currentProject', {'code': projectInfo}),
						currentScheduling: $translate.instant('procurement.package.wizard.updateScheduling.currentScheduling'),
						radioSelect: 'CurrentProject'
					}
				});

				setStatus(true);

				$scope.navigate = function () {
					$scope.$close(false);
					naviService.navigate({
						moduleName: 'scheduling.main',
						registerService: 'schedulingMainService'
					}, $scope.options.entity, $scope.options.config.model);

				};

				$scope.options.ok = function () {

					if($scope.isSucceed){
						$scope.$close(-1);
						return;
					}
					setStatus(false, true, false, false);
					var executeParams = {
						MainItemId: $scope.options.PackageFk,
						ProjectId: $scope.options.ProjectFk,
						IsUpdateAll : true
					};

					if ($scope.options.body.radioSelect === 'CurrentScheduling') {
						updateEventsFormScheduling(executeParams);
						return;
					}
					$scope.options.executingMessage = $translate.instant(executingMessage, {
						'code': $scope.options.scheduleInfo
					});

					if ($scope.options.body.radioSelect === 'CurrentPackage') {
						executeParams.IsUpdateAll = false;
					}

					updateSchedulingService.updateSchedule(executeParams).then(
						function (res) {
							$scope.options.entity.ScheduleFk = res.data.Id;

							var info = {
								'code': updateSchedulingService.updateScheduleInfo(res.data),
								'code1': projectInfo
							};
							$scope.options.executeSuccessedMessage = $translate.instant(successMessage, info);
							setStatus(false, false, true, false);
						},
						function (error) {
							window.console.error(error);
							$scope.wizardError = error;
							setStatus(false, false, false, true);
							$scope.$close(false);
						}
					);
				};

				function updateEventsFormScheduling(params){
					$scope.options.executingMessage = $translate.instant('procurement.package.wizard.updateScheduling.updatingPackageEvent');
					$scope.options.entity.ScheduleFk = $scope.options.ScheduleFk;
					updateSchedulingService.updateEventsFormScheduling(params).then(
						function (res) {
							var resMsg = 'procurement.package.wizard.updateScheduling.noEventsUpdate';
							if (res && res.data) {
								resMsg = 'procurement.package.wizard.updateScheduling.okEventsUpdate';
							}
							$scope.options.executeSuccessedMessage = $translate.instant(resMsg);
							setStatus(false, false, true, false);
						},
						function (error) {
							window.console.error(error);
							$scope.wizardError = error;
							setStatus(false, false, false, true);
							$scope.$close(false);
						}
					);
				}

				$scope.options.cancel = function () {
					$scope.$close($scope.options.entity.ScheduleFk);
				};

				function setStatus(isInit, isExecuting, isSucceed, isFailed) {
					$scope.isInit = isInit || false;
					$scope.isExecuting = isExecuting || false;
					$scope.isFailed = isFailed || false;
					$scope.isSucceed = isSucceed || false;
				}
			}
		]);
})(angular);
