/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'defect.main';

	// angular.module(moduleName, ['ui.router', 'platform']);
	angular.module(moduleName, ['platform','model.main', 'model.simulation', 'model.viewer', 'model.evaluation',
		'model.annotation']);
	globals.modules.push(moduleName);
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['$q', 'platformSchemaService', 'basicsCommonCodeDescriptionSettingsService',
						function($q, platformSchemaService, basicsCommonCodeDescriptionSettingsService){
							return $q.all([platformSchemaService.getSchemas([
								{typeName: 'DfmDefectDto', moduleSubModule: 'Defect.Main'},
								{typeName: 'DfmDocumentDto', moduleSubModule: 'Defect.Main'},
								// {typeName: 'ObjectSetDto', moduleSubModule: 'Model.Main'},
								{typeName: 'DfmChecklistDto', moduleSubModule: 'Defect.Main'},
								{typeName: 'DfmSectionDto', moduleSubModule: 'Defect.Main'},
								{typeName: 'DfmQuestionDto', moduleSubModule: 'Defect.Main'},
								{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
								{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
								{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
								{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
								{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
								{typeName: 'DfmDefectEstimationDto', moduleSubModule: 'Defect.Main'},
								{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common' },
								{ typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower' },
								{ typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower' },
								{ typeName: 'HsqCheckList2FormDto', moduleSubModule: 'Hsqe.CheckList' },
								{typeName: 'ModelAnnotationObjectLinkDto', moduleSubModule: 'Model.Annotation'},
								{typeName: 'ModelAnnotationCameraDto', moduleSubModule: 'Model.Annotation'},
								{typeName: 'ModelAnnotationMarkerDto', moduleSubModule: 'Model.Annotation'},
								{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
								{typeName: 'MtgHeaderDto', moduleSubModule: 'Basics.Meeting'},
								{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
								{typeName: 'ActivityDto', moduleSubModule: 'BusinessPartner.Main'}
							]),
							basicsCommonCodeDescriptionSettingsService.loadSettings([
								{typeName: 'DfmDefectEntity', modul: 'Defect.Main'}
							])
							]);
						}],
					loadLookup: ['basicsLookupdataLookupDefinitionService','platformSchemaService', function (basicsLookupdataLookupDefinitionService,platformSchemaService) {
						platformSchemaService.getSchemas([
							{typeName: 'ObjectSetDto', moduleSubModule: 'Model.Main'}
						]).then(function () {
							basicsLookupdataLookupDefinitionService.load(['defectMainObjectSetLookup', 'defectQuestionStatusCombobox']);
						});
					}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService','genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
		'platformTranslateService','basicsWorkflowEventService', '_', 'platformSidebarWizardDefinitions',
		function ($injector, naviService, layoutService, wizardService, platformTranslateService,basicsWorkflowEventService,
			_, platformSidebarWizardDefinitions) {

			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('defectMainHeaderDataService').navigation(item, triggerField);
					}
				}
			);

			var wizardData = _.concat([{
				serviceName: 'defectMainWizardService',
				wizardGuid: '2E593341E96C41079F9A8EC357B0F04E',
				methodName: 'changeDefectStatus',
				canActivate: true
			}, {
				serviceName: 'defectMainAiWizardService',
				wizardGuid: 'C2C170A8C20D411B8B3F7AD1C3214091',
				methodName: 'defectDurationPredict',
				canActivate: true
			}, {
				serviceName: 'defectMainAiWizardService',
				wizardGuid: 'E2C170A8D20D412B9B3F7AD1C3214092',
				methodName: 'defectCostPredict',
				canActivate: true
			}, {
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			},{
				serviceName: 'defectMainWizardService',
				wizardGuid: 'dbcb28d7b4f14f1ebf26577caddcddab',
				methodName: 'syncAutodesk360BimIssue2Defect',
				canActivate: true
			}, {
				serviceName: 'defectMainWizardService',
				wizardGuid: 'e9084056c1a6410fba1d8dca3961b4d6',
				methodName: 'createNewChangeFromDefect',
				canActivate: true
			}
			], platformSidebarWizardDefinitions.model.sets.default);
			wizardService.registerWizard(wizardData);

			platformTranslateService.registerModule(moduleName);
			basicsWorkflowEventService.registerEvent('aec762f727b94678b0f976ad27807aca', 'New Defect Created');
			basicsWorkflowEventService.registerEvent('b0e8bb31f6854a0bb24e8f741815eff9', 'Upload Defect Document');

		}]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: 'defect.main',
					navFunc: function (item, triggerField) {
						$injector.get('defectMainHeaderDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);
})(angular);
