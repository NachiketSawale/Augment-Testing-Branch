/*globals angular*/

(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';
	var runWorkflowWizardConfig = {
		serviceName: 'basicsWorkflowImportWizardService',
		wizardGuid: '792b0a66a9124e63b34db507e7c3b87e',
		methodName: 'runWizard',
		canActivate: true
	};

	function importWizardService(platformDialogService) {
		var service = {};

		service.runWizard = function () {
			var modalOptions = {
				headerTextKey: 'basics.workflow.importWizard.wizardHeader',
				bodyTemplateUrl: globals.appBaseUrl + 'basics.workflow/templates/dialogs/import-wizard-body-template.html',
				backdrop: false,
				resizeable: true,
				width: '1000px',
				height: '600px',
				buttons: [{
					id: 'create',
					caption$tr$: 'basics.workflow.importWizard.importBtn',
					fn: angular.noop
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

	importWizardService.$inject = ['platformDialogService'];
	configWizard.$inject = ['basicsConfigWizardSidebarService'];

	angular.module(moduleName)
		.factory('basicsWorkflowImportWizardService', importWizardService)
		.run(configWizard);

})(angular);
