/*
 * $Id$
 * Copyright (c) RIB Software AG
 */

(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	var moduleName = 'project.inforequest';

	angular.module(moduleName, ['ui.router', 'model.viewer', 'model.project', 'model.main', 'model.simulation', 'model.evaluation', 'model.annotation']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			//var wizardData = [];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'InfoRequestDto', moduleSubModule: 'Project.InfoRequest'},
							{typeName: 'RequestContributionDto', moduleSubModule: 'Project.InfoRequest'},
							{typeName: 'RequestRelevantToDto', moduleSubModule: 'Project.InfoRequest'},
							{ typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower' },
							{typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower' },
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'InfoRequest2ExternalDto', moduleSubModule: 'Project.InfoRequest' },
							{typeName: 'ModelAnnotationObjectLinkDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ModelAnnotationCameraDto', moduleSubModule: 'Model.Annotation'},
							{ typeName: 'ModelAnnotationMarkerDto', moduleSubModule: 'Model.Annotation' },
							{ typeName: 'InfoRequestReferenceDto', moduleSubModule: 'Project.InfoRequest' },
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
							{typeName: 'DfmDefectDto', moduleSubModule: 'Defect.Main'}
						]);
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['project', 'defect', 'documents']);
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'projectInfoRequestConstantValues', function (basicsCompanyNumberGenerationInfoService, projectInfoRequestConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectInfoRequestNumberInfoService', projectInfoRequestConstantValues.rubricId).load();
					}],
					loadContributionTypes:['basicsLookupdataSimpleLookupService', function(simpleLookupService){
						return simpleLookupService.getList({
							lookupModuleQualifier: 'basics.customize.rficontributiontype',
							displayMember: 'Description',
							valueMember: 'Id'
						});
					}],
					'registerWizards': ['basicsConfigWizardSidebarService', function (wizardService) {
						var wizardData = [
							{
								serviceName: 'documentsCentralQueryWizardService',
								wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
								methodName: 'changeRubricCategory',
								canActivate: true,
								userParam: {
									'moduleName': moduleName
								}
							}
						];
						wizardService.registerWizard(wizardData);
					}]
				},
				permissions: [
					'9eab04c53d7f44939c69ad9dcc82a27a'
				]
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['basicsConfigWizardSidebarService','$injector', 'platformModuleNavigationService', '_',
		'platformSidebarWizardDefinitions',
		function (wizardService, $injector, naviService, _, platformSidebarWizardDefinitions) {
			wizardService.registerWizard(_.concat([{
				serviceName: 'projectInfoRequestWizardService',
				wizardGuid: '07c17f5ca90e4a04809ef1bccd3278b3',
				methodName: 'changeInfoRequestStatus',
				canActivate: true
			},{
				serviceName: 'projectInfoRequestWizardService',
				wizardGuid: '37124d24827e4fd68bbed592c24e6bf7',
				methodName: 'syncAutodesk360BimRFI2Defect',
				canActivate: true
			},	{serviceName: 'projectInfoRequestWizardService',
				wizardGuid: '00f0003098264d549b0a40e2be656886',
				methodName: 'createNewDefectsFromRFI',
				canActivate: true
			}, {
				serviceName: 'projectInfoRequestWizardService',
				wizardGuid: 'eddb7b00f80344208568ed11260f1697',
				methodName: 'createNewChangeFromRFI',
				canActivate: true

			}], platformSidebarWizardDefinitions.model.sets.default));


			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('projectInfoRequestDataService').navigation(item, triggerField);
					}
				}
			);
		}
	]);
})(angular);

