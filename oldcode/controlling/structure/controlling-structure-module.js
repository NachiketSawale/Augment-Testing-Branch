/**
 * Created by janas on 11.11.2014.
 */


(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'controlling.structure';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName)
		.config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				mainViewServiceProvider.registerModule({
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {

							return platformSchemaService.getSchemas([
								{typeName: 'ProjectDto', moduleSubModule: 'Project.Main'},
								{typeName: 'ControllingUnitDto', moduleSubModule: 'Controlling.Structure'},
								{typeName: 'ControllingUnitGroupDto', moduleSubModule: 'Controlling.Structure'},
								{typeName: 'ControllingGrpSetDTLDto', moduleSubModule: 'Controlling.Structure'},
								{typeName: 'BisPrjHistoryDto', moduleSubModule: 'Controlling.Structure'},
								{typeName: 'ConControllingTotalDto', moduleSubModule: 'Procurement.Contract'},
								{typeName: 'PesControllingTotalDto', moduleSubModule: 'Procurement.Pes'},
								{typeName: 'ControllingActualsSubTotalDto', moduleSubModule: 'Controlling.Actuals'},
								{typeName: 'ControltemplateUnitDto', moduleSubModule: 'Controlling.ControllingUnitTemplate'},
								{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'}
							]);
						}],
						'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'controllingStructureDetailLookup',
								'controllingStructureGroupLookup'
							]);
						}],
						'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
							return platformTranslateService.registerModule([moduleName], true);
						}],
						'loadContextData': ['controllingStructureContextService', function (controllingStructureContextService) {
							// init context information like current company, master data context, etc.
							controllingStructureContextService.initCollaborationContext();
							return controllingStructureContextService.init();
						}],
						'loadAssignmentData': ['controllingStructureLookupService', function (controllingStructureLookupService) {
							return controllingStructureLookupService.loadAssignmentData();
						}],
						// needed to install listener for parent-service create event (even when characteristic container ist not activated)
						'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'controllingStructureMainService',
							function (basicsCharacteristicDataServiceFactory, controllingStructureMainService) {
								basicsCharacteristicDataServiceFactory.getService(controllingStructureMainService, 11);
							}
						]
					}
				});
			}
		]).run(['$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService',
			function ($injector, platformModuleNavigationService, wizardService) {

				platformModuleNavigationService.registerNavigationEndpoint({
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('controllingStructureMainService').navigateTo(item, triggerField);
					}
				});

				platformModuleNavigationService.registerNavigationEndpoint({
					moduleName: 'iTWO 5D Controlling',
					externalEntityParam: 'ProjectNo',
					interfaceId: 'controlling.structure.controlling',
					hide: function (entity) {
					// show only 'iTWO 5D Project' (=4) project types, hide all others
						return entity.TypeFk !== 4;
					}
				});

				// register wizards
				var CreateWD = wizardService.WizardData;
				var wizardData = [
					new CreateWD('controllingStructureSidebarWizardService', '891C076E2FA447A99FD3AE856300632B', 'createActivities'),
					new CreateWD('controllingStructureSidebarWizardService', 'D876F8BAA9DC4D5BB17EC3B581C917C1', 'generateControllingUnits'),
					new CreateWD('controllingStructureSidebarWizardService', '23C8C9E88945448F9FC660683C34019A', 'changeControllingUnitStatus'),
					new CreateWD('controllingStructureSidebarWizardService', 'bff8ce97887a467eae1e5a3e01e0c62e', 'updateEstimate'),
					new CreateWD('controllingStructureSidebarWizardService', 'ebc786c7f90e4ff582be8a18feea2177', 'changeCompany'),
					new CreateWD('controllingStructureSidebarWizardService', '03ff3a0ad9aa4f23aade3efe2f0bcd8d', 'controllingDataTrans'),
					new CreateWD('controllingStructureSidebarWizardService', '258cc5e0ebd44ffcb8171f1f52c916f0', 'generateControllingUnitsFromTemplate'),
					new CreateWD('controllingStructureSidebarWizardService', '306056b758bf47f18bfb38005651ca4b', 'createControllingUnitTemplate'),
					new CreateWD('controllingStructureSidebarWizardService', '5f0ee5bce5314ac88355b5db3403a6fa', 'createControllingExportSchedulerTask')
				];
				wizardService.registerWizard(wizardData);

			}]);
})(angular);
