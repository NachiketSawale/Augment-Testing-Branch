/**
 * Created by zwz on 01/06/2023.
 */

(function (angular) {
	'use strict';
	/* global _ */

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningActualTimeRecordingWizardStepsService', Service);

	Service.$inject = ['$injector'];

	function Service($injector) {

		let service = {};

		service.initialize = function (options, finishFunc) {

			if (!options.steps) {
				return;
			}
			options.currentStep = 1;
			options.totalStep = options.steps.length;
			options.modalOptions = {
				isNextDisabled: function () {
					return options.isBusy || !getCurrentService().isValid()
						|| (_.isFunction(getCurrentService().isDisabled) && getCurrentService().isDisabled());
				},
				isPreviousDisabled: function () {
					return options.isBusy || !getCurrentService().isValid() || options.currentStep <= 1;
				},
				handleNext: function () {
					let currentService = getCurrentService();
					if (!currentService.isValid()) {
						return;
					}
					if (options.currentStep === options.totalStep)
					{
						if (currentService.isDisabled()) {
							return;
						}
						if (finishFunc) {
							finishFunc(currentService);
						}
					}else {
						currentService.unActive().then(function () {
							getCurrentStep().isInitialized = false; // destroy controllers of previous step
							goNext(currentService);
						});
					}
				},
				handlePrevious: function () {
					getCurrentService().unActive().then(() => {
						goPrevious();
					});
				},
				apply: function () {
					const currentService = getCurrentService();
					if (currentService.canApply()) {
						currentService.apply();
					}
				},
				canApply: function () {
					return getCurrentService().canApply();
				},
			};
			updateUI();

			function goNext() {
				options.currentStep += 1;
				updateUI();
				let currentStep = getCurrentStep();
				if (!currentStep.isInitialized) {
					currentStep.isInitialized = true;
				} else {
					getCurrentService().active();
				}
			}

			function goPrevious() {
				options.currentStep -= 1;
				updateUI();
				let currentStep = getCurrentStep();
				if (!currentStep.isInitialized) {
					currentStep.isInitialized = true;
				}else {
					getCurrentService().active();
				}
			}

			function updateUI() {
				options.modalOptions.headerText = options.title +
					' - ' +
					options.currentStep + ' / ' + options.totalStep +
					' ' +
					getCurrentStep().title;
			}

			function getCurrentStep() {
				return options.steps[options.currentStep - 1];
			}

			function getCurrentService() {
				return getService(getCurrentStep().service);
			}

			function getService(service) {
				return _.isString(service) ? $injector.get(service) : service;
			}

			service.getService = getService;
		};

		return service;
	}
})(angular);