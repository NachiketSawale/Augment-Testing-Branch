/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */
(function () {
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainGeneratePrjBoqController',['_', '$http','$scope', '$injector', '$translate', 'platformGridAPI', 'platformModalService', 'estimateMainGeneratePrjBoqUiService','estimateMainGeneratePrjBoqValidationService','WizardHandler',
		function (_, $http,$scope, $injector,  $translate, platformGridAPI, platformModalService, estimateMainGeneratePrjBoqUiService, estimateMainGeneratePrjBoqValidationService,WizardHandler) {

			$scope.path = globals.appBaseUrl;

			$scope.entity = estimateMainGeneratePrjBoqUiService.getEntity();

			$scope.configTitle = $translate.instant('estimate.main.generateProjectBoQsWizard.headerTitle');

			$scope.formOptionsGenerateOptionSettings = {
				configure: getFormConfig(false)
			};

			$scope.formOptionsCompareOptionSettings = {
				configure: getFormConfig(true)
			};

			// region wizard navigation
			$scope.steps = [
				{number: 0, identifier: 'compareCondition', name: $translate.instant('estimate.main.generateProjectBoQsWizard.groupTitle3'),skip: false},
				{number: 1, identifier: 'compareResult', name: $translate.instant('estimate.main.generateProjectBoQsWizard.groupTitle4'),skip: false}
			];

			$scope.wizardTemplateUrl = globals.appBaseUrl + 'app/components/wizard/partials/wizard-template.html';
			$scope.wizardName = $scope.modalOptions.value.wizardName;
			$scope.wizard = $scope.modalOptions.value.wizard;
			// $scope.entity = $scope.modalOptions.value.entity;

			$scope.getEnabledSteps = function getEnabledSteps() {
				let wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.getEnabledSteps();
				} else {
					return [];
				}
			};

			$scope.getCurrentStepNumber = function getCurrentStepNumber() {
				let wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.currentStepNumber();
				} else {
					return '';
				}
			};
			$scope.getTotalStepCount = function getTotalStepCount() {
				let wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.totalStepCount();
				} else {
					return '';
				}
			};

			$scope.getNextStep = function getNextStep(titleOnly) {
				let wz = WizardHandler.wizard($scope.wizardName);
				let nextStep = wz.getEnabledSteps()[wz.currentStepNumber()];
				if (titleOnly) {
					return nextStep ? nextStep.title : $scope.wzStrings.stepFinish;
				} else {
					return nextStep;
				}
			};

			$scope.wzStrings = {
				cancel: $translate.instant('platform.cancelBtn'),
				finish: $translate.instant('estimate.main.createMaterialPackageWizard.resetBtn'),
				nextStep: $translate.instant('platform.wizard.nextStep')
			};

			// region wizard navigation
			$scope.selectStep = angular.copy($scope.steps[0]);

			$scope.isLastStep = function () {
				if($scope.selectStep){
					return $scope.selectStep.number === $scope.steps.length - 1;
				}else{
					return true;
				}
			};

			$scope.isFirstStep = function () {
				return $scope.selectStep.number === 0;
			};

			$scope.previousStep = function () {
				let wz = WizardHandler.wizard($scope.wizardName);
				wz.previous();
				$scope.$parent.$parent.$parent.options.width = '800px';
				$scope.$parent.$parent.$parent.options.height = '750px';
				setCurrentStep($scope.selectStep.number - 1);
				updateHeaderInfo($scope.selectStep.number);
			};

			function setCurrentStep(step) {
				$scope.selectStep = angular.copy($scope.steps[step]);
			}

			// endregion

			function getFormConfig(forCompare){
				let formConfig = estimateMainGeneratePrjBoqUiService.getFormConfig(forCompare);
				_.forEach(formConfig.rows, function (row) {
					let rowModel = row.model.replace(/\./g, '$');

					let syncName = 'validate' + rowModel;
					let asyncName = 'asyncValidate' + rowModel;

					if (estimateMainGeneratePrjBoqValidationService[syncName]) {
						row.validator = estimateMainGeneratePrjBoqValidationService[syncName];
					}

					if (estimateMainGeneratePrjBoqValidationService[asyncName]) {
						row.asyncValidator = estimateMainGeneratePrjBoqValidationService[asyncName];
					}
				});

				return formConfig;
			}


			$scope.nextStep = function(){
				if($scope.entity.GrpStructureType === 16){
					let groupingColumns = $injector.get('estimateMainBidCreationService').handleGroupColumns();
					if(!groupingColumns || groupingColumns.length <= 0){
						platformModalService.showMsgBox($translate.instant('estimate.main.bidCreationWizard.noLineItemStructureData'), 'Warning','warning');
						return;
					}
				}

				let wz = WizardHandler.wizard($scope.wizardName);
				wz.next();
				$scope.$parent.$parent.$parent.options.width = '80%';
				$scope.$parent.$parent.$parent.options.height = '80%';
				setCurrentStep($scope.selectStep.number + 1);
				updateHeaderInfo($scope.selectStep.number + 1);
			};


			// region loading status
			$scope.isLoading = false;
			$scope.loadingInfo = '';

			function loadingStatusChanged(newStatus /* Boolean: true or false */) {// jshint ignore:line
				$scope.isLoading = newStatus;
			}

			$scope.canExecute = function () {
				let wicBoqs = $injector.get('estimateMainWicboqToPrjboqCompareDataForWicService').getList();
				if(!wicBoqs || wicBoqs.length === 0){
					return false;
				}

				let errors = _.find(wicBoqs, function(item){
					if(item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.Reference){
						return item;
					}
				});
				return !errors;


			};

			$scope.execute = function () {
				let dataForWic = $injector.get('estimateMainWicboqToPrjboqCompareDataForWicService');
				loadingStatusChanged(true);
				let wicBoqs = dataForWic.getList();
				if(wicBoqs && wicBoqs.length > 0){
					let boqMainCommonService = $injector.get('boqMainCommonService');
					let rootItems = _.filter(wicBoqs, function (item) {
						return boqMainCommonService.isRoot(item);
					});

					let criteria = _.map($scope.entity.GroupCriteria, function (item) {
						return item.Code + '|' + item.Description;
					}).join(', ');

					$http.post(globals.webApiBaseUrl + 'boq/main/createprjboqsfromlineitem', {BoqItemDtos:rootItems, ProjectId:$scope.entity.ProjectId, GroupCriteriaStr: criteria, EstHeaderFk:$scope.entity.EstHeaderId, UpEstLineItemPrjBoq:$scope.entity.GrpStructureType === 1}).then(function (response) {
						loadingStatusChanged(false);
						$scope.close();
						if (response.data) {
							platformModalService.showMsgBox($translate.instant('estimate.main.generateProjectBoQsWizard.generatingSuccessCont'), $translate.instant('estimate.main.generateProjectBoQsWizard.generatingSuccessTitle'), 'info');
							$injector.get('estimateMainBoqLookupService').appendCacheData(response.data);
							$injector.get('estimateMainService').load();
							$injector.get('estimateMainBoqService').load();
						}
					});
				}else{
					platformModalService.showMsgBox($translate.instant('estimate.main.generateProjectBoQsWizard.noDataToGenerate'), $translate.instant('estimate.main.generateProjectBoQsWizard.noData'), 'warning');
				}
			};
			// endregion

			updateHeaderInfo(1);
			function updateHeaderInfo(/* index */){
				// $scope.modalOptions.headerText = $scope.configTitle + ' - ' + index + ' / ' + $scope.steps.length;
			}

			$scope.modalOptions.headerText = $scope.configTitle;

			$scope.close = function () {
				$scope.$close(false);
			};


			// un-register on destroy
			$scope.$on('$destroy', function () {

			});
		}]);
})();
