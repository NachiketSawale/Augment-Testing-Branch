/**
 * Created by lav on 12/18/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportStepsService', Service);

	Service.$inject = ['$injector'];

	function Service($injector) {

		var service = {};

		service.initialize = function (options) {

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
					currentService.unActive();
					if (!currentService.isValid()) {
						return;
					}
					if (options.currentStep === options.totalStep) {
						if (_.isFunction(options.finish)) {
							options.finish();
						}
					} else {
						options.currentStep += 1;
						updateUI();
						var currentStep = getCurrentStep();
						if (!currentStep.isInitialized) {
							currentStep.isInitialized = true;
						} else {
							getCurrentService().active();
						}
					}
				},
				handlePrevious: function () {
					options.currentStep -= 1;
					updateUI();
				}
			};
			updateUI();

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