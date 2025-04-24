

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformWizardDialogBody
	 * @element div
	 * @restrict A
	 * @description Displays the body of a wizard dialog.
	 */
	angular.module('productionplanning.item').directive('ppsItemMultiShiftWizardDialogBody',
		platformWizardDialogBody);

	platformWizardDialogBody.$inject = ['$compile', '$timeout', 'WizardHandler',
		'platformWatchListService'];

	function platformWizardDialogBody($compile, $timeout, WizardHandler,
		platformWatchListService) {

		return {
			restrict: 'A',
			scope: false,
			link: function ($scope, elem) {
				function processNewWizardStep() {
					if ($scope.stepWatchFinalizer) {
						$scope.stepWatchFinalizer();
						$scope.stepWatchFinalizer = null;
					}
					$scope.currentStep = $scope.getEnabledSteps()[$scope.getCurrentStepNumber() - 1].stepDefinition;
					$scope.wizard.steps.forEach(function (step) {
						step.isActiveStep = step === $scope.currentStep;
					});
					$scope.stepWatchFinalizer = platformWatchListService.createWatches($scope.currentStep.watches, $scope, 'entity.', function (infoObj) {
						infoObj.wizard = infoObj.scope.wizard;
						infoObj.commands = infoObj.scope.wizardCommands;
						infoObj.model = infoObj.scope.entity;
					});

					const eventArgs = {
						step: $scope.currentStep,
						stepIndex: $scope.getCurrentStepNumber() - 1,
						scope: $scope,
						wizard: $scope.wizard,
						commands: $scope.wizardCommands,
						previousStepIndex: $scope.previousStepIndex,
						previousStep: $scope.previousStepIndex >= 0 ? $scope.getEnabledSteps()[$scope.previousStepIndex].stepDefinition : null,
						model: $scope.entity
					};

					if ($scope.wizard.onChangeStep) {
						if (angular.isFunction($scope.wizard.onChangeStep)) {
							$scope.wizard.onChangeStep(eventArgs);
						} else if (angular.isArray($scope.wizard.onChangeStep)) {
							$scope.wizard.onChangeStep.forEach(function (ocs) {
								if (angular.isFunction(ocs)) {
									ocs(eventArgs);
								}
							});
						}
					}

					if (angular.isFunction($scope.currentStep.prepareStep)) {
						$scope.currentStep.prepareStep(eventArgs);
					} else if ($scope.currentStep.form && angular.isFunction($scope.currentStep.form.prepareWizardForm)) {
						$scope.currentStep.form.prepareWizardForm(eventArgs);
					}

					$scope.$broadcast('wzdlgStepChanged');
				}

				$scope.delayedProcessNewWizardStep = function () {
					$scope.previousStepIndex = -1;
					$timeout(processNewWizardStep);
				};

				$scope.canEnterWizardStep = function () {
					$scope.previousStepIndex = $scope.getCurrentStepNumber() - 1;
					$timeout(processNewWizardStep);
					return true;
				};

				$scope.getCssClass = function (step) {
					return step.cssClass || '';
				};

				elem.append($compile('<wizard on-finish="$close(true)" on-wizard-ready="delayedProcessNewWizardStep()" template="' + globals.appBaseUrl + 'productionplanning.item/partials/pps-multishif-wizard-template.html" name="' + $scope.wizardName + '" data-wz-data="wizard">' +
					'<div class="stepContainer modal-wrapper">' +
					'<wz-step data-ng-repeat="step in wizard.steps" data-wz-title="{{step.title}}" data-canenter="canEnterWizardStep" data-step-definition="step" class="modal-wrapper overflow {{getCssClass(step)}}">' +
					'<div data-ng-if="step.message && !step.loadingMessage" class="box" style="min-height: 150px"><div class="margin-top-ld" data-ng-bind="step.message"></div></div>' +
					'<div data-ng-if="step.form && !step.loadingMessage" class="modal-wrapper">' +
					'<div data-ng-if="step.topDescription" class="top-description" data-ng-bind="step.topDescription"></div>' +
					'<div data-ng-if="step.topButtons" class="top-description modal-footer"><button class="btn btn-default ellipsis" title="{{btn.text}}" data-ng-repeat="btn in step.topButtons" data-ng-click="btn.fn(step, this)">{{btn.text}}</button></div>' +
					'<div data-ng-if="step.isActiveStep" data-platform-form data-form-options="{ configure: (step.form || { groups: [], rows: [] }) }" data-entity="entity" class="fullheight margin-top-ld"></div>' +
					'<div data-ng-if="step.bottomDescription" class="bottom-description" data-ng-bind="step.bottomDescription"></div>' +
					'</div>' +
					'<div data-ng-if="step.loadingMessage" class="box text-center" style="min-height: 150px;"><div class="margin-full-lg" data-ng-bind="step.loadingMessage"></div><div class="spinner-lg margin-full-lg"></div></div>' +
					'</wz-step>' +
					'</div>' +
					'</wizard>')($scope));
			}
		};
	}
})(angular);
