(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName, ['ui.router', 'platform', 'estimate.common']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			let options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						platformSchemaService.initialize();
						return platformSchemaService.getSchemas([
							{typeName: 'CostControlDto', moduleSubModule: 'Controlling.GeneralContractor'},
							{typeName: 'GccCostControlGetProcDto', moduleSubModule: 'Controlling.GeneralContractor'},
							{typeName: 'OrdHeaderDto', moduleSubModule: 'Sales.Contract'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'GccBudgetShiftDto', moduleSubModule: 'Controlling.GeneralContractor'},
							{typeName: 'GccAddExpenseDto', moduleSubModule: 'Controlling.GeneralContractor'},
							{typeName: 'GccPackagesDto', moduleSubModule: 'Controlling.GeneralContractor'},
							{typeName: 'InvHeaderCompeleteDto', moduleSubModule: 'Controlling.GeneralContractor'},
							{typeName: 'PrcContractsDto', moduleSubModule: 'Controlling.GeneralContractor'},
							{typeName: 'PesHeaderCompeleteDto', moduleSubModule: 'Controlling.GeneralContractor'},
							{typeName: 'GccActualVDto', moduleSubModule: 'Controlling.GeneralContractor'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'GccEstimateCompleteDto', moduleSubModule: 'Controlling.GeneralContractor'}
						]);
					}],
					'initLoad': ['controllingGeneralcontractorCostControlDataService',
						function (controllingGeneralcontractorCostControlDataService) {
							 controllingGeneralcontractorCostControlDataService.setIsNeedReLoad(true);
						}
					]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService',
		function ($injector, platformModuleNavigationService, wizardService) {

			let CreateWD = wizardService.WizardData;
			let wizardData = [
				new CreateWD('controllingGeneralContractorSidebarWizardService', '172EF89E4FC145089310140BF7DB09FD', 'CreateUpdateCostControlStructure'),
				new CreateWD('controllingGeneralContractorSidebarWizardService', '4A8387F04E754963B2ED7BE80D336EEB', 'CreatePackagesWizard'),
				new CreateWD('controllingGeneralContractorSidebarWizardService', '19722dd73f3d45398a1a46ca1f4da8c8', 'CreateAdditionalExpenseStructure'),
				new CreateWD('controllingGeneralContractorSidebarWizardService', 'E0BABE2697284B78AF106FFCCE10FC5F', 'GenerateBudgetShift'),
				new CreateWD('controllingGeneralContractorSidebarWizardService', '10DCA824DC734834B0F129CFED599E58', 'CreateUpdateCostControlStructureFrmEst'),

			];
			wizardService.registerWizard(wizardData);

		}]);

})(angular);
