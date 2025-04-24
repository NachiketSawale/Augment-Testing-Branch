/*globals angular*/

(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';
	var runWorkflowWizardConfig = {
		serviceName: 'basicsWorkflowApprovementWizardService',
		wizardGuid: '12979c6069664f94b0659eaee3154aeb',
		methodName: 'runWizard',
		canActivate: true
	};

	function approvementWizardService(platformDialogService) {
		var service = {};

		service.runWizard = function () {
			var modalOptions = {
				headerTextKey: 'basics.workflow.approvementProcessWizard.wizardHeader',
				bodyTemplateUrl: globals.appBaseUrl + 'basics.workflow/templates/dialogs/approvement-wizard-body-template.html',
				backdrop: false,
				resizeable: true,
				width: '80%',
				height: '75%',
				buttons: [{
					id: 'create',
					caption$tr$: 'basics.workflow.approvementProcessWizard.CreateBtn',
					fn: angular.noop
				}, {
					id: 'ok'
				}]
			};

			platformDialogService.showDialog(modalOptions);
		};

		return service;
	}

	function configWizard(basicsConfigWizardSidebarService) {
		basicsConfigWizardSidebarService.registerWizard([
			runWorkflowWizardConfig
		]);
	}

	approvementWizardService.$inject = ['platformDialogService'];
	configWizard.$inject = ['basicsConfigWizardSidebarService'];

	angular.module(moduleName)
		.factory('basicsWorkflowApprovementWizardService', approvementWizardService)
		.run(configWizard);

})(angular);
