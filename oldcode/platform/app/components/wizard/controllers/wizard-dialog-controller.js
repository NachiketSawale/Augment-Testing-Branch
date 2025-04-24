/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc controller
	 * @name platform.controller:platformWizardDialogController
	 * @description Controller for the wizard dialog box.
	 */
	angular.module('platform').controller('platformWizardDialogController',
		platformWizardDialogController);

	platformWizardDialogController.$inject = ['$scope', 'WizardHandler', '$translate',
		'platformWatchListService'];

	function platformWizardDialogController($scope, WizardHandler, $translate,
		platformWatchListService) {

		function fireOnStepChanging() {
			const eventArgs = {
				step: $scope.currentStep,
				stepIndex: $scope.getCurrentStepNumber() - 1,
				scope: $scope,
				wizard: $scope.wizard,
				commands: $scope.wizardCommands,
				model: $scope.entity
			};

			if ($scope.wizard.onStepChanging) {
				if (angular.isFunction($scope.wizard.onStepChanging)) {
					$scope.wizard.onStepChanging(eventArgs);
				} else if (angular.isArray($scope.wizard.onStepChanging)) {
					$scope.wizard.onStepChanging.forEach(function (osc) {
						if (angular.isFunction(osc)) {
							osc(eventArgs);
						}
					});
				}
			}
		}

		$scope.wizardTemplateUrl = globals.appBaseUrl + 'app/components/wizard/partials/wizard-template.html';

		$scope.wizardName = $scope.dialog.modalOptions.value.wizardName;
		$scope.wizard = $scope.dialog.modalOptions.value.wizard;
		$scope.entity = $scope.dialog.modalOptions.value.entity;
		$scope.wizardCommands = {
			goToNext: function () {
				fireOnStepChanging();
				const wz = WizardHandler.wizard($scope.wizardName);
				wz.next();
			},
			goToPrevious: function () {
				fireOnStepChanging();
				const wz = WizardHandler.wizard($scope.wizardName);
				wz.previous();
			},
			finish: function () {
				fireOnStepChanging();
				const wz = WizardHandler.wizard($scope.wizardName);
				wz.finish();
			}
		};

		platformWatchListService.createWatches($scope.wizard.watches, $scope, 'entity.', function (infoObj) {
			infoObj.wizard = infoObj.scope.wizard;
			infoObj.commands = infoObj.scope.wizardCommands;
			infoObj.model = infoObj.scope.entity;
		});

		$scope.getEnabledSteps = function () {
			const wz = WizardHandler.wizard($scope.wizardName);
			if (wz) {
				return wz.getEnabledSteps();
			} else {
				return [];
			}
		};

		$scope.getCurrentStepNumber = function () {
			const wz = WizardHandler.wizard($scope.wizardName);
			if (wz) {
				return wz.currentStepNumber();
			} else {
				return '';
			}
		};
		$scope.getTotalStepCount = function () {
			const wz = WizardHandler.wizard($scope.wizardName);
			if (wz) {
				return wz.totalStepCount();
			} else {
				return '';
			}
		};
		$scope.getCurrentStepTitle = function () {
			const wz = WizardHandler.wizard($scope.wizardName);
			if (wz && wz.currentStepNumber()) {
				return wz.currentStepTitle();
			} else {
				return '';
			}
		};

		$scope.getNextStep = function getNextStep(titleOnly) {
			const wz = WizardHandler.wizard($scope.wizardName);
			const nextStep = wz.getEnabledSteps()[wz.currentStepNumber()];
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
			cancel: $translate.instant('platform.cancelBtn'),
			finish: $translate.instant('platform.wizard.finish'),
			nextStep: $translate.instant('platform.wizard.nextStep')
		};
	}
})(angular);
