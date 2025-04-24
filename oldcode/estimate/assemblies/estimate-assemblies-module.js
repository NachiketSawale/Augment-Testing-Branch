/**
 * $Id: $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName, ['ui.router', 'platform', 'estimate.rule']);
	globals.modules.push(moduleName);

	/**
     * @ngdoc module
     * @name estimate.assemblies
     * @description
     * Module definition of the (estimate) assemblies module
     **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			// $logProvider.debugEnabled(false); // TODO: removed because it is global: check first if debugging on module context possible

			mainViewServiceProvider.registerModule({
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						return platformSchemaService.getSchemas([
							{typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'},
							{typeName: 'EstAssemblyCatDto', moduleSubModule: 'Estimate.Assemblies'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Assemblies'},
							{typeName: 'EstLineitem2CtrlGrpDto', moduleSubModule: 'Estimate.Assemblies'},
							{typeName: 'EstAssembly2WicItemDto', moduleSubModule: 'Estimate.Assemblies'},
							{typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'WicGroupDto', moduleSubModule: 'Boq.Wic'},
							{typeName: 'WicBoqDto', moduleSubModule: 'Boq.Wic'},
							{typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'EstRuleDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'EstRuleParamValueDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'AssemblyReferencesDto', moduleSubModule: 'Estimate.Assemblies'}
						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load(['estimateRuleSequenceLookup']);
					}],
					'initAssemblyLookupDataService': ['estimateMainAssemblycatTemplateService', function (estimateMainAssemblycatTemplateService) {
						estimateMainAssemblycatTemplateService.clearCategoriesCache();
					}]
				}
			});
		}
	]).run(['_', '$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService',
		function (_, $injector, platformModuleNavigationService, basicsConfigWizardSidebarService) {

			let CreateWD = basicsConfigWizardSidebarService.WizardData;
			let wizardList = [
				new CreateWD('estimateAssembliesWizardService', 'EA99E8240A414FAFB5DB8797364B5F43', 'updateAssemblies'),
				new CreateWD('estimateMainSidebarWizardService', 'fbe06852d2954c82ba4bd996ef117c8d', 'replaceResource'),
				new CreateWD('estimateMainSidebarWizardService', '283e5125288d40538c37b93a1194eb1e', 'modifyResource'),
				new CreateWD('estimateAssembliesWizardService', '5DF2CFED7B674ABF8165B10C9B741F54', 'importAssemblies'),
				new CreateWD('estimateAssembliesWizardService', '72F380C797534CD7AA566EF2E32EC757', 'enableAssemblyCategory'),
				new CreateWD('estimateAssembliesWizardService', '7F335CBB210B4CF4AAF03AF1886A3BC8', 'disableAssemblyCategory'),
				new CreateWD('estimateAssembliesWizardService', '5f254cbc214b4ch4aar03af1886a3df8', 'transferCostCodeOrMaterial'),
				// new CreateWD('estimateAssembliesWizardService', '46400c3aaf3b441eacbbbcea3da5c21a', 'updateResourcePricesFromMaterial'),
			];

			basicsConfigWizardSidebarService.registerWizard(wizardList);

			platformModuleNavigationService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						if(triggerField && triggerField === 'AssemblyCategoryId') {
							$injector.get('estimateCommonNavigationService').navigateToAssemblyCategory(item, triggerField);
						}
						else {
							$injector.get('estimateAssembliesService').navigateToAssembly(item, triggerField);
						}
					}
				}
			);

			platformModuleNavigationService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-internal',
					navFunc: function (item, triggerField) {
						$injector.get('estimateAssembliesService').internalNavigateToAssembly(item, triggerField);
					}
				}
			);
		}]);
})();
