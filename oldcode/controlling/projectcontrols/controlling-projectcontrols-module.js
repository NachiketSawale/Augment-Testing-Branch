(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName, ['ui.router', 'platform', 'cloud.common', 'controlling.structure']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			let options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'ProjectDto', moduleSubModule: 'Project.Main'},
							{typeName: 'BisPrjHistoryDto', moduleSubModule: 'Controlling.Structure'},
							{typeName: 'ConControllingTotalDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'PrcPackageDto', moduleSubModule: 'Procurement.Package'},
							{typeName: 'PesControllingTotalDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'ControllingActualsSubTotalDto', moduleSubModule: 'Controlling.Actuals'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'ContrCostCodeDto',moduleSubModule: 'Basics.ControllingCostCodes'},
							{typeName: 'ProjectControlsPrcPackageDto',moduleSubModule: 'Controlling.ProjectControls'}
						]);
					}],
					'initDashboardStructure': ['controllingProjectControlsConfigService',
						function (controllingProjectControlsConfigService) {
							return controllingProjectControlsConfigService.loadControllingConfiguration();
						}
					],
					'initVersionComparison': ['mainViewService', 'controllingProjectControlsVersionComparisonConfigService',
						function (mainViewService, controllingProjectControlsVersionComparisonConfigService) {
							const comparisonHeaderInfo = mainViewService.customData('1861db1513a2494f8af91b462e4c8847', 'comparisonHeaderInfo');
							const mdcContrCompareConfigFk = comparisonHeaderInfo ? comparisonHeaderInfo.Id : null;
							return controllingProjectControlsVersionComparisonConfigService.loadConfiguration(mdcContrCompareConfigFk);
						}
					],
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$templateCache', 'basicsConfigWizardSidebarService',
		function ($templateCache, basicsConfigWizardSidebarService) {
			$templateCache.loadTemplateFile('controlling.projectcontrols/templates/dashboard/controlling-projectcontrols-dashboard-structure-component.html');

			// register wizards
			var CreateWD = basicsConfigWizardSidebarService.WizardData;
			var wizardData = [
				new CreateWD('controllingProjectcontrolsSidebarWizardService', 'e59e565c87c04d7b85f8639308afc702', 'controllingDataTrans'),
				new CreateWD('controllingProjectcontrolsSidebarWizardService', '0676CD9E40734BDB87159B03B7771D1A', 'resetData')
			];
			basicsConfigWizardSidebarService.registerWizard(wizardData);
		}]
	);

})(angular);
