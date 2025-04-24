/**
 * Created by zwz on 7/7/2022.
 */

(function (angular) {
	'use strict';
	/* global _ */

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningProductReuseFromStockWizardStepsService', Service);

	Service.$inject = ['$injector'];

	function Service($injector) {

		var service = {};

		service.initialize = function (options, finishFunc) {

			if (!options.steps) {
				return;
			}
			options.currentStep = 1;
			options.totalStep = options.steps.length;
			options.modalOptions = {
				isNextDisabled: function () {
					return options.isBusy || !getCurrentService().isValid();
				},
				isPreviousDisabled: function () {
					return options.isBusy || options.currentStep <= 1;
				},
				handleNext: function () {
					var currentService = getCurrentService();
					if (!currentService.isValid()) {
						return;
					}
					if (options.currentStep === options.totalStep)
					{
						if (finishFunc) {
							finishFunc(currentService);
						}
					}else {
						currentService.unActive().then(function () {
							goNext(currentService);
						});
					}
				},
				handlePrevious: function () {
					options.currentStep -= 1;
					updateUI();
				}
			};
			updateUI();

			function goNext() {
				options.currentStep += 1;
				updateUI();
				var currentStep = getCurrentStep();
				if (!currentStep.isInitialized) {
					currentStep.isInitialized = true;
				} else {
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