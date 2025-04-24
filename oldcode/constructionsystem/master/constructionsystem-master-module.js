/**
 * Created by Jeffrey on 12.14.2015.
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular, globals */

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				mainViewServiceProvider.registerModule({
					'moduleName': moduleName,
					'controller': 'constructionSystemMasterController',
					'resolve': {
						'loadDomains': ['$q', 'platformSchemaService','basicsCommonCodeDescriptionSettingsService', function ($q, platformSchemaService,basicsCommonCodeDescriptionSettingsService) {

							var schemasDefer = platformSchemaService.getSchemas([
								{typeName: 'CosHeaderDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosControllingGroupDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosActivityTemplateDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosAssemblyDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosParameterDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosParameterGroupDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosParameterValueDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosWicDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosTestInputDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosGroupDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'Instance2ObjectParamDto', moduleSubModule: 'ConstructionSystem.Main'},
								{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
								{typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'},
								{typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'},
								{typeName: 'WicGroupDto', moduleSubModule: 'Boq.Wic'},
								// { typeName: 'ModelObjectDto', moduleSubModule: 'ConstructionSystem.Master'},//todo:latter use model.main replace
								// { typeName: 'ModelPropertyDto', moduleSubModule: 'ConstructionSystem.Master'},//todo:latter use model.main replace
								{typeName: 'CosTemplateDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosParameter2TemplateDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main'},
								{typeName: 'PropertyDto', moduleSubModule: 'Model.Main'},
								{typeName: 'CosGlobalParamDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosGlobalParamValueDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosObjectTemplateDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosObjectTemplatePropertyDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosObjectTemplate2TemplateDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosObjectTemplateProperty2TemplateDto', moduleSubModule: 'ConstructionSystem.Master'},
								{typeName: 'CosChgOption2HeaderDto', moduleSubModule: 'ConstructionSystem.Master'},

								{ typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower' },
								{ typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower' },
								{ typeName: 'CosGlobalParamGroupDto', moduleSubModule: 'ConstructionSystem.Master'}

							]);

							var settingDefer = basicsCommonCodeDescriptionSettingsService.loadSettings([
								{typeName: 'CosHeaderEntity', modul: 'ConstructionSystem.Master'}
							]);

							return $q.all([schemasDefer,settingDefer]);
						}],
						'loadLookup': ['$q', 'basicsLookupdataLookupDefinitionService',
							function ($q, basicsLookupdataLookupDefinitionService) {
								return basicsLookupdataLookupDefinitionService.load([
									'constructionSystemMasterTestInputParameterValueCombobox',
									'constructionSystemCommonModelObjectPropertyCombobox',
									'propertyFilterOperationCombobox',
									'modelAdministrationPropertyKeyLookupEditDirective'
								]);
							}]
					}
				});
			}
		]).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
			function ($injector, naviService, layoutService, wizardService) {

				naviService.registerNavigationEndpoint(
					{
						moduleName: 'constructionsystem.master',

						navFunc: function (item, triggerField) {
							$injector.get('constructionSystemMasterHeaderService').navigateTo(item, triggerField);
							naviService.getNavFunctionByModule(moduleName)(item, triggerField);

						}

					}
				);

				var wizardData = [{
					serviceName: 'constructionSystemMasterWizardService',
					wizardGuid: '2F231506DE8245D2BFB06B0EE21F01AC',
					methodName: 'disableRecord',
					canActivate: true
				}, {
					serviceName: 'constructionSystemMasterWizardService',
					wizardGuid: '4D7D8C9BB9C24BF8A84CAF36B4F8FFC6',
					methodName: 'enableRecord',
					canActivate: true
				}, {
					serviceName: 'constructionSystemMasterWizardService',
					wizardGuid: '306b25bee00944658582732cb5498bc4',
					methodName: 'updateParameterTemplates',
					canActivate: true
				}, {
					serviceName: 'constructionSystemMasterWizardService',
					wizardGuid: '72468C3A6BA34C59B036F51FC2BFC46C',
					methodName: 'Import5DContent',
					canActivate: true
				}];
				wizardService.registerWizard(wizardData);
			}]);
})();
