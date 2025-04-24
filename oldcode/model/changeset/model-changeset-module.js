/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.changeset';

	angular.module(moduleName, ['ui.router', 'model.project', 'model.main', 'project.location', 'basics.common', 'basics.lookupdata', 'platform', 'estimate.main', 'project.inforequest', 'model.evaluation']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(configModelChangeSet).run(runModelChangeSet);

	configModelChangeSet.$inject = ['mainViewServiceProvider', '_', 'platformSidebarWizardDefinitions'];

	function configModelChangeSet(mainViewServiceProvider, _, platformSidebarWizardDefinitions) {
		const wizardData = _.concat([{
			serviceName: 'modelChangeSetWizardService',
			wizardGuid: 'e702b7eaf43f44468227cd324b7a7202',
			methodName: 'compareModels',
			canActivate: true
		}, {
			serviceName: 'modelChangeSetWizardService',
			wizardGuid: 'a5055dd5bfbe4e05ad7891cdc17f6b39',
			methodName: 'recompareModels',
			canActivate: true
		}, {
			serviceName: 'modelChangeGenerateDefectsWizardService',
			wizardGuid: '877d3fa3e2124d1199ebebfa6510a59e',
			methodName: 'runWizard',
			canActivate: true
		}], platformSidebarWizardDefinitions.model.sets.default);

		const options = {
			moduleName: moduleName,
			resolve: {
				loadDomains: ['platformSchemaService', function (platformSchemaService) {
					return platformSchemaService.getSchemas([
						{typeName: 'ChangeSetDto', moduleSubModule: 'Model.ChangeSet'},
						{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
						{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
						{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
						{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
						{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
						{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'}
					]);
				}],
				loadServiceFunc: ['basicsConfigWizardSidebarService', function (basicsConfigWizardSidebarService) {
					basicsConfigWizardSidebarService.registerWizard(wizardData);
				}],
				loadContributionTypes: ['basicsLookupdataSimpleLookupService', function (simpleLookupService) {
					return simpleLookupService.getList({
						lookupModuleQualifier: 'basics.customize.rficontributiontype',
						displayMember: 'Description',
						valueMember: 'Id'
					});
				}],
				loadTranslation: ['platformTranslateService', function (platformTranslateService) {
					return platformTranslateService.registerModule([moduleName], true);
				}]
			}
		};

		mainViewServiceProvider.registerModule(options);
	}

	runModelChangeSet.$inject = ['$injector', 'platformModuleNavigationService'];

	function runModelChangeSet($injector, naviService) {
		naviService.registerNavigationEndpoint(
			{
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('modelChangeSetDataService').selectAfterNavigation(item, triggerField);
				}
			}
		);
	}

})(angular);
