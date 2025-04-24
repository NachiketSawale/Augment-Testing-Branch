/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

// <reference path='_references.js'/>
(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName, ['ui.router', 'model.project', 'project.location', 'basics.common', 'basics.lookupdata', 'platform', 'estimate.main', 'project.inforequest', 'model.evaluation', 'basics.workflow']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const wizardData = [{
				serviceName: 'modelMainPropertyKeyWizardService',
				wizardGuid: '616888c0661f41b395d2d8522d642a2b',
				methodName: 'createPropertyKey',
				canActivate: true
			}, {
				serviceName: 'modelMainObjectAssignmentWizardService',
				wizardGuid: 'c9bb672edf6043d1b00f08eff5c76325',
				methodName: 'assignLocations',
				canActivate: true
			}, {
				serviceName: 'modelMainObjectAssignmentWizardService',
				wizardGuid: 'c8f912d03093471f868097b020af6eed',
				methodName: 'assignControllingUnits',
				canActivate: true
			}, {
				serviceName: 'modelMainObjectAssignmentWizardService',
				wizardGuid: 'fd0fce1b37c444ec995257e4f4c8de0f',
				methodName: 'assignCostGroups',
				canActivate: true
			}, {
				serviceName: 'modelMainObjectAssignmentWizardService',
				wizardGuid: 'c7495498aa4342f0a1816ac67bc270aa',
				methodName: 'unassignLinkedEntities',
				canActivate: true
			}, {
				serviceName: 'modelMainPropertyWizardService',
				wizardGuid: '7631ba1c04f540f48bb295c86a313720',
				methodName: 'assignPropertyUoMs',
				canActivate: true
			}, {
				serviceName: 'modelMainObjects2ObjectSetWizardService',
				wizardGuid: '6f4365fb8d2f42cb938db79d73d1fe89',
				methodName: 'assignObjects2ObjectSet',
				canActivate: true
			}, {
				serviceName: 'modelViewerSelectionWizardService',
				wizardGuid: '550bbf52325741c5901cbed2ba126934',
				methodName: 'showDialog',
				canActivate: true
			}, {
				serviceName: 'modelMainObjectSetStatusWizardService',
				wizardGuid: '40f018417d9f4d5eb65724f76b27ddac',
				methodName: 'showDialog',
				canActivate: true
			}, {
				serviceName: 'modelMainObjectSetStatusWizardService',
				wizardGuid: '8F2F6DD52C2841F7980B79487E80C485',
				methodName: 'changeStatusForProjectDocument',
				canActivate: true
			}, {
				serviceName: 'modelMainModelStructureRepairWizardService',
				wizardGuid: '46bb5255389f4bc597485b9eaa50b245',
				methodName: 'showDialog',
				canActivate: true
			}, {
				serviceName: 'modelMainLocationHierarchyWizardService',
				wizardGuid: '511a3c8d28014fd0a8932f7d265c8eae',
				methodName: 'runWizard',
				canActivate: true
			}, {
				serviceName: 'modelMainPropkeysBulkAssignmentWizardService',
				wizardGuid: '0232e6e17d9a447db41bd0d18eb91dbb',
				methodName: 'runWizard',
				canActivate: true
			}, {
				serviceName: 'modelMainUpdateMarkerWizardService',
				wizardGuid: '01fc4caf33b24356800be956a8a4875d',
				methodName: 'runWizard',
				canActivate: true
			}, {
				serviceName: 'modelMainRunPropertyProcessorWizardService',
				wizardGuid: 'c0d095260cc24d62a1eb542dcc2e8c67',
				methodName: 'runWizard',
				canActivate: true
			},
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

			const options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelObject3DDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PropertyDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ObjectSetDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ObjectSet2ObjectDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelDto', moduleSubModule: 'Model.Project'},
							{typeName: 'EstLineItem2MdlObjectDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'InfoRequestDto', moduleSubModule: 'Project.InfoRequest'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'RequestContributionDto', moduleSubModule: 'Project.InfoRequest'},
							{typeName: 'RequestRelevantToDto', moduleSubModule: 'Project.InfoRequest'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{ typeName: 'ModelObject2LocationDto', moduleSubModule: 'Model.Main' },
							{ typeName: 'ModelFiltertreeNodeDto', moduleSubModule: 'Model.Filtertrees' }
						]);
					}],
					loadPermissions: ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'5e10c50f173549aa8530f68496ec621d'
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
					// added AZK
					initializeCostGroupCats: ['basicsCostGroupCatalogConfigDataService', 'estimateMainService', function (basicsCostGroupCatalogConfigDataService, estimateMainService) {
						return basicsCostGroupCatalogConfigDataService.getProjectCostGroupCatalogService().initialize(estimateMainService.getProjectId());
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsWorkflowEventService',
		function ($injector, naviService, basicsWorkflowEventService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('modelMainObjectDataService').selectAfterNavigation(item, triggerField);
					}
				}
			);
			basicsWorkflowEventService.registerEvent('061FCD44219940FA897F1409B41AC462', 'New Model Created');
		}]);

})(angular);

