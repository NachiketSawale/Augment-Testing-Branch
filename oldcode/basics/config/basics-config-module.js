/**
 * Created by sandu on 30.03.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.config';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName)
		.config(['mainViewServiceProvider', (mainViewServiceProvider) => {
			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', (platformSchemaService) => {
						return platformSchemaService.getSchemas([
							{typeName: 'ModuleDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'ModuleTabDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'Report2GroupDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'ReportGroupDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'WizardGroupDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'Wizard2GroupDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'Wizard2GroupPValueDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'GenericWizardContainerDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'GenericWizardContainerPropertiesDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'GenericWizardInstanceDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'GenericWizardInstanceParameterDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'GenericWizardStepDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'GenericWizardStepScriptDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'GenericWizardNamingParameterDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'AudContainerDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'AudColumnDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'ModuleViewsDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'McTwoQnADto', moduleSubModule: 'Basics.Config'},
							{typeName: 'ModuleTableInfoDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'ModuleColumnInfoDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'Dashboard2moduleDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'CommandbarConfigDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'NavbarConfigDto', moduleSubModule: 'Basics.Config'},
							{typeName: 'BarItemDto', moduleSubModule: 'Basics.Config'}
						]);
					}],
					preLoadParameter: ['basicsConfigWizardXGroupPValueService',
						function (basicsConfigWizardXGroupPValueService) {
							basicsConfigWizardXGroupPValueService.loadWizardParameterTypeG();
						}],
					loadTranslation: ['platformTranslateService', 'basicsConfigVisibilityValues', function (platformTranslateService, basicsConfigVisibilityValues) {
						return platformTranslateService.registerModule(moduleName, true).then(function () {
							platformTranslateService.translateObject(basicsConfigVisibilityValues, ['description']);
							return true;
						});
					}],
					registerWizards: ['basicsConfigWizardSidebarService', function (wizardService) {
						// register wizards
						var CreateWD = wizardService.WizardData;
						var wizardData = [
							new CreateWD('basicsConfigWizardService', '435a5dcefe20432b9477ef636a26e5ff', 'auditTrail')

						];
						wizardService.registerWizard(wizardData);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
		]);
})(angular);
