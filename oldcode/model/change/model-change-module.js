/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.change';

	angular.module(moduleName, ['ui.router', 'model.project', 'model.main', 'project.location', 'basics.common',
		'basics.lookupdata', 'platform', 'estimate.main', 'project.inforequest', 'model.evaluation']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider', '_', 'platformSidebarWizardDefinitions',
		function (mainViewServiceProvider, _, platformSidebarWizardDefinitions) {

			const wizardData = _.concat([{
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
							{typeName: 'ChangeDto', moduleSubModule: 'Model.Change'},
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
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('modelChangeDataService').selectAfterNavigation(item, triggerField);
					}
				}
			);
		}]);

})(angular);

