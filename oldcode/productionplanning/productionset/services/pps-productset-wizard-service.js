/**
 * Created by las on 3/726/2022.
 */
(function () {
	'use strict';

	var moduleName = 'productionplanning.productionset';
	angular.module(moduleName).factory('productionplanningProductionsetWizardService', PPSProductionsetWizardService);
	PPSProductionsetWizardService.$inject = ['basicsCommonChangeStatusService',
		'productionplanningProductionsetMainService',
		'platformSidebarWizardCommonTasksService',
		'platformSidebarWizardConfigService',
	'$injector'];

	function PPSProductionsetWizardService(basicsCommonChangeStatusService,
		productionplanningProductionsetMainService,
		platformSidebarWizardCommonTasksService,
		platformSidebarWizardConfigService,
		$injector) {
		var service = {};
		var wizardID = 'productionplanningProductsetSidebarWizards';
		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard'
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.changeProductionsetStatus = basicsCommonChangeStatusService.provideStatusChangeInstance(
			{
				statusName: 'ppsproductionset',
				mainService: productionplanningProductionsetMainService,
				statusField: 'PpsProdSetStatusFk',
				statusDisplayField: 'DescriptionInfo.Translated',
				title: 'productionplanning.productionset.changeProductionsetStatusTitle',
				supportMultiChange: true,
				HookExtensionOperation: function (options, dataItems) {
					var schemaOption = {
						typeName: 'ProductionsetDto',
						moduleSubModule: 'ProductionPlanning.ProductionSet'
					};
					var translationSrv = $injector.get('productionplanningProductionsetTranslationService');
					return $injector.get('ppsCommonLoggingStatusChangeReasonsDialogService').showDialog(options, dataItems, schemaOption, translationSrv);
				}
			}
		).fn;
		return service;
	}

})();