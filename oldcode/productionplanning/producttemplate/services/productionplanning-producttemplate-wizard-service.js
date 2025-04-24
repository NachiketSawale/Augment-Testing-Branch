/**
 * Created by lav on 18/03/2021.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.producttemplate';
	angular.module(moduleName).factory('productionplanningProductTemplateWizardService', [
		'basicsCommonChangeStatusService',
		'platformSidebarWizardCommonTasksService',
		'productionplanningProducttemplateMainService',
		function (basicsCommonChangeStatusService,
				  platformSidebarWizardCommonTasksService,
				  mainService) {
			var service = {};

			service.enableProductTemplate = platformSidebarWizardCommonTasksService.provideEnableInstance(mainService, 'Enable Product Template',
				'productionplanning.producttemplate.wizard.enableProductDesc',
				'Code',
				'productionplanning.producttemplate.wizard.enableDisableProductDescDone',
				'productionplanning.producttemplate.wizard.productDescAlreadyEnabled',
				'code', 1).fn;

			service.disableProductTemplate = platformSidebarWizardCommonTasksService.provideDisableInstance(mainService, 'Disable Product Template',
				'productionplanning.producttemplate.wizard.disableProductDesc',
				'Code',
				'productionplanning.producttemplate.wizard.enableDisableProductDescDone',
				'productionplanning.producttemplate.wizard.productDescAlreadyDisabled',
				'code', 2).fn;

			return service;
		}
	]);
})();