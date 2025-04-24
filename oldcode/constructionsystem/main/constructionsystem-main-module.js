/*
 * $Id: constructionsystem-main-module.js 591087 2020-06-17 06:07:14Z lst $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global globals */
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName, ['ui.router', 'platform', 'model.evaluation']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider', '_', 'platformSidebarWizardDefinitions',
		function (mainViewServiceProvider, _, platformSidebarWizardDefinitions) {

			var wizardData = _.concat([
				{
					serviceName: 'constructionSystemMainApplyLineItemToEstimateWizardService',
					wizardGuid: '618e6d06c52144969491db27eff0f9ba',
					methodName: 'apply',
					canActivate: true
				}, {
					serviceName: 'modelViewerSelectionWizardService',
					wizardGuid: '550bbf52325741c5901cbed2ba126934',
					methodName: 'showDialog',
					canActivate: true
				},{
					serviceName: 'constructionSystemMainCreateInstanceWizardService',
					wizardGuid: '6655cf34a50c4b6dbddb112310fdf820',
					methodName: 'createInstance',
					canActivate: true
				},{
					serviceName: 'constructionSystemMainResetInstanceParametersWizardService',
					wizardGuid: '1fadc9e557a84668bdd36ac3362e8fb5',
					methodName: 'resetInstanceParameters',
					canActivate: true
				},{
					serviceName: 'constructionSystemMainWizardService',
					wizardGuid: '6681b0c639b24afb890e8f69636906df',
					methodName: 'assignObjectsBySelectionStatement',
					canActivate: true
				},{
					serviceName: 'constructionSystemMainWizardService',
					wizardGuid: '28b1132f7bea44f48da1cd82825cbe36',
					methodName: 'saveAsTemplate',
					canActivate: true
				},{
					serviceName: 'constructionSystemMainCreateInstanceAiWizardService',
					wizardGuid: '559378B76AC848C680548EB5E84A74BA',
					methodName: 'createInstance',
					canActivate: true
				}, {
					serviceName: 'modelMainPropkeysBulkAssignmentWizardService',
					wizardGuid: '0232e6e17d9a447db41bd0d18eb91dbb',
					methodName: 'runWizard',
					canActivate: true
				}, {
					serviceName: 'constructionSystemMainWizardService',
					wizardGuid: '88ab6bd9b2e5d20b1a0a591d05541439',
					methodName: 'inheritCosInstance',
					canActivate: true
				}
			], platformSidebarWizardDefinitions.model.sets.default);

			mainViewServiceProvider.registerModule({
				moduleName: moduleName,
				controller: 'constructionSystemMainController',
				resolve: {
					loadDomains: ['$q', 'platformSchemaService', 'basicsConfigWizardSidebarService', 'basicsCommonCodeDescriptionSettingsService', function ($q, platformSchemaService, basicsConfigWizardSidebarService, basicsCommonCodeDescriptionSettingsService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						var schemasDefer = platformSchemaService.getSchemas([
							{typeName: 'InstanceDto', moduleSubModule: 'ConstructionSystem.Main'},
							{typeName: 'InstanceHeaderParameterDto', moduleSubModule: 'ConstructionSystem.Main'},
							{typeName: 'InstanceParameterDto', moduleSubModule: 'ConstructionSystem.Main'},
							{typeName: 'Instance2ObjectDto', moduleSubModule: 'ConstructionSystem.Main'},
							{typeName: 'Instance2ObjectParamDto', moduleSubModule: 'ConstructionSystem.Main'},
							{typeName: 'CosJobDto', moduleSubModule: 'ConstructionSystem.Main'},
							{typeName: 'CosInsObjectTemplateDto', moduleSubModule: 'ConstructionSystem.Main'},
							{typeName: 'CosInsObjectTemplatePropertyDto', moduleSubModule: 'ConstructionSystem.Main'},

							{typeName: 'CosParameterDto', moduleSubModule: 'ConstructionSystem.Master'},
							{typeName: 'CosParameterGroupDto', moduleSubModule: 'ConstructionSystem.Master'},
							{typeName: 'CosParameterValueDto', moduleSubModule: 'ConstructionSystem.Master'},
							{typeName: 'CosHeaderDto', moduleSubModule: 'ConstructionSystem.Master'},
							{typeName: 'CosChgOption2HeaderDto', moduleSubModule: 'ConstructionSystem.Master'},

							{typeName: 'ModelDto', moduleSubModule: 'Model.Project'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},

							{typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ObjectSetDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ObjectSet2ObjectDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PropertyDto', moduleSubModule: 'Model.Main'},

							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstLineItem2MdlObjectDto', moduleSubModule: 'Estimate.Main'},

							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},

							{ typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower' },
							{ typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower' },

							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelObject2LocationDto', moduleSubModule: 'Model.Main'}
						]);
						var settingDefer = basicsCommonCodeDescriptionSettingsService.loadSettings([
							{typeName: 'CosHeaderEntity', modul: 'ConstructionSystem.Master'}
						]);
						return $q.all([schemasDefer,settingDefer]);
					}],
					'loadLookup': ['$q', 'basicsLookupdataLookupDefinitionService',
						function ($q, basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'constructionSystemCommonModelObjectPropertyCombobox',
								'propertyFilterOperationCombobox',
								'modelAdministrationPropertyKeyLookupEditDirective'
							]);
						}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'c17ce6c31f454e18a2bc84de91f72f48', // cos instance.
							'64a9c61d23064f13bb51fcad27932e2b',
							'8ad6088d3d56499c8459ef44e6d9d4d8'
						]);
					}],
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'constructionsystemMainLineItemService',
						function (basicsCharacteristicDataServiceFactory, constructionsystemMainLineItemService) {
							basicsCharacteristicDataServiceFactory.getService(constructionsystemMainLineItemService, 27, null, 'EstHeaderFk');
						}
					]
				}
			});
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('constructionSystemMainInstanceService').navigateTo(item, triggerField);
				},
				hide: function (item) {
					return !item || !item.Version || item.Version === 0;
				}
			});
		}]);
})(angular);
