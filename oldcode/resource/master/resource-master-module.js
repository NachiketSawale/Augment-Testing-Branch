(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	var moduleName = 'resource.master';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [{
				serviceName: 'resourceMasterSideBarWizardService',
				wizardGuid: '2fd243ad938b4135acaf4d2cda578b5d',
				methodName: 'disableResource',
				canActivate: true
			}, {
				serviceName: 'resourceMasterSideBarWizardService',
				wizardGuid: 'fb2304fa608146c8be7671d5a3ad93e3',
				methodName: 'enableResource',
				canActivate: true
			},
			{
				serviceName: 'resourceMasterCreateRequisitionSideBarWizardService',
				wizardGuid: '44aafa33c9964f7482657ee50be40346',
				methodName: 'createRequisition',
				canActivate: true
			},
			{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			}
			];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', 'resourceMasterConstantValues',
						function (platformSchemaService, basicsConfigWizardSidebarService, resourceMasterConstantValues) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							var schemes = resourceMasterConstantValues.schemes;
							return platformSchemaService.getSchemas([schemes.resource, schemes.photo, schemes.requiredSkill,
								schemes.providedSkill, schemes.resourcePart, schemes.providedSkillDocument,
								schemes.dataContext]);
						}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'cloud']);
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('resourceMasterMainService').loadAfterNavigation(item, triggerField);
					}
				}
			);
		}]);
})(angular);


