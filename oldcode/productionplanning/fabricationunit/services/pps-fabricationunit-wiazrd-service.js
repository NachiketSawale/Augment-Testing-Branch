(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).factory('ppsFabricationunitWizardService', [
		'platformSidebarWizardCommonTasksService', 'ppsFabricationunitDataService',
		function (platformSidebarWizardCommonTasksService, mainService) {
			var service = {};

			service.enableFabricationUnit = platformSidebarWizardCommonTasksService.provideEnableInstance(mainService, 'Enable Fabrication Unit',
				'productionplanning.fabricationunit.wizard.enableFabricationUnitCaption', 'Code',
				'productionplanning.fabricationunit.wizard.enableDisableFabricationUnitDone', 'productionplanning.fabricationunit.wizard.fabricationUnitAlreadyEnabled',
				'fabi', 2).fn;

			service.disableFabricationUnit = platformSidebarWizardCommonTasksService.provideDisableInstance(mainService, 'Disable Fabrication Unit',
				'productionplanning.fabricationunit.wizard.disableFabricationUnitCaption', 'Code',
				'productionplanning.fabricationunit.wizard.enableDisableFabricationUnitDone', 'productionplanning.fabricationunit.wizard.fabricationUnitAlreadyDisabled',
				'fabi', 2).fn;

			return service;
		}
	]);
})();