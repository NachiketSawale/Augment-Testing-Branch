/**
 * Created by xai on 1/9/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.materialcatalog';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsMaterialcatalogSyncCatalogFromYtwoController',
		['$scope', '$translate', 'platformTranslateService','platformGridAPI','platformModalService','cloudCommonLanguageService','platformContextService','$http','globals','WizardHandler','materialcatalogSyncFromYtwoService','$q',
			'$templateCache', function ($scope, $translate, platformTranslateService,platformGridAPI,platformModalService,cloudCommonLanguageService,platformContextService,$http,globals,WizardHandler,materialcatalogSyncFromYtwoService,$q,$templateCache) {
				$scope.options = $scope.$parent.modalOptions;
				$scope.headerText=  $translate.instant('basics.materialcatalog.syncCatalogTitle');
				$scope.steps = [
					{
						number: 0,
						identifier: 'basic',
						name: 'basicSettings',
						skip: false,
						disallowBack: true,
						disallowNext: false,
						canFinish: false,
						disallowCancel: false,
						disallowClose: true
					},
					{
						number: 1,
						identifier: 'update',
						name: 'updateSettings',
						skip: false,
						disallowBack: false,
						disallowNext: true,
						canFinish: true,
						disallowCancel: false,
						disallowClose: true

					}
				];
				$scope.isFinish=true;
				$scope.$on('canFinish', function (e,info) {
					$scope.isFinish=canFinish(info);
					$templateCache.loadTemplateFile('basics.materialcatalog/templates/wizards/sync-material-catalog-from-ytwo.html');
				});
				$scope.isReadying = false;
				$scope.wizardTemplateUrl = globals.appBaseUrl + 'app/components/wizard/partials/wizard-template.html';
				$scope.wizardName = $scope.options.value.wizardName;
				$scope.wizard = $scope.options.value.wizard;
				$scope.entity = $scope.options.value.entity;
				$scope.selectStep = angular.copy($scope.steps[0]);
                
				$scope.wizardCommands = {
					goToNext: function () {
						var wz = WizardHandler.wizard($scope.wizardName);
						$scope.isFinish=true;
						$scope.isReadying = true;
						onStep($scope.selectStep.number, true).then(function (response) {
							$scope.isReadying = false;
							if (response.result === true) {
								wz.next();
								setCurrentStep($scope.selectStep.number + 1);
							}
						});
					},
					goToPrevious: function () {
						$scope.isReadying = true;
						var wz = WizardHandler.wizard($scope.wizardName);
						onStep($scope.selectStep.number, false).then(function (response) {
							$scope.isReadying = false;
							if (response.result === true) {
								wz.previous();
								setCurrentStep($scope.selectStep.number - 1);
							}
						});
					},
					finish: function () {
						$scope.isReadying = true;
						var wz = WizardHandler.wizard($scope.wizardName);
						onStep($scope.selectStep.number, true).then(function (response) {
							$scope.isReadying = false;
							if (response.result === true) {
								wz.next();
								setCurrentStep($scope.selectStep.number + 1);
								var originalCodes=materialcatalogSyncFromYtwoService.getBasicSettings();
								if(angular.isDefined(originalCodes) && originalCodes){
									materialcatalogSyncFromYtwoService.setBasicSettings(null);
								}
								var searchResults=materialcatalogSyncFromYtwoService.getUpdateSettings();
								if(angular.isDefined(searchResults) && searchResults){
									materialcatalogSyncFromYtwoService.setUpdateSettings(null);
								}
								if(response.description!== '' && angular.isArray(response.description) && response.description.length!== 0){
									var modalOptions = {
										templateUrl: globals.appBaseUrl + 'basics.materialcatalog/partials/sync-catalog-result-view.html',
										resizeable: false,
										header:response.description,
										headerText:$translate.instant('basics.materialcatalog.syncCatalogResultText'),
										iconClass: 'ico-warning',
										bodyText:$translate.instant('basics.materialcatalog.syncCatalogResultList'),
										OkButton:$translate.instant('cloud.common.ok')
									};
									platformModalService.showDialog(modalOptions);
								}
								else{
									platformModalService.showMsgBox(response.description, 'Info', 'info');
								}
							}
						});
					},
					cancel: function () {
						var originalCodes=materialcatalogSyncFromYtwoService.getBasicSettings();
						if(angular.isDefined(originalCodes) && originalCodes){
							materialcatalogSyncFromYtwoService.setBasicSettings(null);
						}
						var searchResults=materialcatalogSyncFromYtwoService.getUpdateSettings();
						if(angular.isDefined(searchResults) && searchResults){
							materialcatalogSyncFromYtwoService.setUpdateSettings(null);
						}
						$scope.$close(false);
					}
				};
				function canFinish(info) {
					if(info.selectList.length !== 0 && info.selectList.length !== 0){
						return false;
					}
					else{
						return true;
					}
				}
				function setCurrentStep(step) {
					$scope.selectStep = angular.copy($scope.steps[step]);
				}

				function onStep(index,isNext) {
					switch (index) {
						case 0:
							materialcatalogSyncFromYtwoService.onBasicSettingsFinished();
							return materialcatalogSyncFromYtwoService.doBasicSettingReady();
						case 1:
							materialcatalogSyncFromYtwoService.onCatalogUpdateFinished();
							return materialcatalogSyncFromYtwoService.doUpdateSettingReady(isNext);
						default:
							var defered = $q.defer();
							defered.resolve(true);
							return defered.promise;
					}
				}
				$scope.getEnabledSteps = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.getEnabledSteps();
					} else {
						return [];
					}
				};

				$scope.getCurrentStepNumber = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.currentStepNumber();
					} else {
						return '';
					}
				};

				$scope.getTotalStepCount = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.totalStepCount();
					} else {
						return '';
					}
				};

				$scope.getCurrentStepTitle = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz && wz.currentStepNumber()) {
						return wz.currentStepTitle();
					} else {
						return '';
					}
				};

				$scope.getNextStep = function getNextStep(titleOnly) {
					var wz = WizardHandler.wizard($scope.wizardName);
					var nextStep = wz.getEnabledSteps()[wz.currentStepNumber()];
					if (titleOnly) {
						return nextStep ? nextStep.title : $scope.wzStrings.stepFinish;
					} else {
						return nextStep;
					}
				};
				$scope.wzStrings = {
					stepFinish: $translate.instant('platform.wizard.stepFinish'),
					back: $translate.instant('platform.wizard.back'),
					next: $translate.instant('platform.wizard.next'),
					cancel: $translate.instant('cloud.common.cancel'),
					finish: $translate.instant('cloud.common.ok'),
					nextStep: $translate.instant('platform.wizard.nextStep'),
					close: $translate.instant('cloud.common.close')
				};
			}]);
})(angular);