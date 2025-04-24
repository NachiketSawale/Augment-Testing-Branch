/**
 * Created by chi on 3/17/2020.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonWizardStepService', basicsCommonWizardStepService);

	basicsCommonWizardStepService.$inject = ['_', '$translate', 'platformModalService'];

	function basicsCommonWizardStepService(_, $translate, platformModalService) {
		const service = {};
		let stepsNotProcess = [];
		let stepsProcessed = [];
		let currentStep = null;
		let title = '';
		const defaultModalOptions = {
			headerTextKey: null,
			bodyTextKey: null,
			templateUrl: null,
			backDrop: false,
			windowClass: 'form-modal-dialog',
			resizeable: true,
			previous: previous,
			next: next
		};

		service.start = start;
		// service.previous = previous;
		// service.next = next;

		return service;

		// //////////////////////////

		function stepChanged() {
			if (!currentStep) {
				return;
			}
			let modalOptions = angular.copy(defaultModalOptions);
			modalOptions = angular.extend(modalOptions, currentStep.override);
			modalOptions = angular.extend(modalOptions, currentStep.customOptions);
			modalOptions.headerText = title;
			if (modalOptions.headerText && modalOptions.headerTextKey) {
				modalOptions.headerText += ' - ' + $translate.instant(modalOptions.headerTextKey);
				modalOptions.headerTextKey = null;
			}
			showDialog(modalOptions);
		}

		function reset() {
			stepsNotProcess = [];
			stepsProcessed = [];
			currentStep = null;
			title = '';
		}

		function showDialog(modalOptions) {
			if (!modalOptions) {
				return;
			}

			const callback = currentStep.callback;

			platformModalService.showDialog(modalOptions)
				.then(function (response) {
					if (angular.isFunction(callback) && response) {
						callback(response.result);
					}
				});
		}

		// function close() {
		// reset();
		// }
		//
		// function cancel() {
		// reset();
		// }

		function start(config) {
			reset();
			if (!config || !angular.isArray(config.steps)) {
				return;
			}

			if (config.titleKey) {
				title = $translate.instant(config.titleKey);
			}
			stepsNotProcess = angular.copy(config.steps);
			currentStep = stepsNotProcess.shift();
			stepChanged();
		}

		function previous() {
			if (!currentStep) {
				return;
			}
			stepsNotProcess.unshift(currentStep);
			currentStep = stepsProcessed.pop();
			stepChanged();
		}

		function next() {
			if (!currentStep) {
				return;
			}
			stepsProcessed.push(currentStep);
			currentStep = stepsNotProcess.shift();
			stepChanged();
		}
	}

})(angular);