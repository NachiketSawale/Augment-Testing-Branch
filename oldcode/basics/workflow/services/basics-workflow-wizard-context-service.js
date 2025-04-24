(function (angular) {
	'use strict';

	function basicsWorkflowWizardContextService(_) {

		var reset = {
			moduleWizardId: null, moduleId: null, entity: null, wizardGuid: null, moduleInternalName: null, result: null
		};

		let currentWizardContext = _.cloneDeep(reset);
		var service = {};

		service.addContext = function (wizardContext) {
			currentWizardContext = wizardContext;
		};

		service.setResult = function (result) {
			currentWizardContext.result = result;
		};

		service.getResultAndReset = function () {
			let result = _.cloneDeep(currentWizardContext.result);
			service.resetContext();
			return result;
		};

		service.getContext = function () {
			return currentWizardContext;
		};

		service.resetContext = function () {
			currentWizardContext = _.cloneDeep(reset);
		};

		return service;
	}

	basicsWorkflowWizardContextService.$inject = ['_'];

	angular.module('basics.workflow')
		.service('basicsWorkflowWizardContextService', basicsWorkflowWizardContextService);

})(angular);
