(function () {
	'use strict';

	var moduleName = 'basics.workflow';
	var exportWorkflowWizard = {
		serviceName: 'basicsWorkflowExportWizardService',
		wizardGuid: 'c7d7a6969d8611e9a2a32a2ae2dbcce4',
		methodName: 'runWizard',
		canActivate: true
	};

	function basicsWorkflowExportWizard(platformDialogService) {
		var service = {};
		service.runWizard = function () {
			var modalOptions = {
				headerTextKey: 'basics.workflow.exportZipWizard.wizardHeader',
				bodyTemplateUrl: globals.appBaseUrl + 'basics.workflow/templates/dialogs/export-templates/workflow-export-templates.html',
				backdrop: false,
				resizeable: true,
				width: '1000px',
				height: '600px',
				buttons: [
					{
						id: 'Download',
						caption: 'Download'
					}]
			};
			platformDialogService.showDialog(modalOptions);
		};
		return service;
	}

	function configWizard(basicsConfigWizardSidebarService) {
		basicsConfigWizardSidebarService.registerWizard([
			exportWorkflowWizard
		]);
	}

	basicsWorkflowExportWizard.$inject = ['platformDialogService'];
	configWizard.$inject = ['basicsConfigWizardSidebarService'];

	angular.module(moduleName).factory(exportWorkflowWizard.serviceName, basicsWorkflowExportWizard)
		.run(configWizard);
})();
