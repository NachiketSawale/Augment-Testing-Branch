(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.main';

	angular.module(moduleName, ['ui.router', 'scheduling.schedule', 'project.location', 'basics.common', 'basics.clerk', 'basics.lookupdata', 'basics.currency', 'platform', 'basics.common', 'scheduling.extsys', 'model.evaluation']);
	globals.modules.push(moduleName);
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformModuleInitialConfigurationService', 'platformSchemaService', 'schedulingMainConstantValues', function (platformModuleInitialConfigurationService, platformSchemaService, schedulingMainConstantValues) {
						return platformModuleInitialConfigurationService.load('Scheduling.Main').then(function (modData) {
							var schemes = modData.schemes;
							schemes.push({typeName: 'ScheduleDto', moduleSubModule: 'Scheduling.Schedule'});
							schemes.push({typeName: 'ActivityClerkDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push({typeName: 'ActivityDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push({typeName: 'ActivityProgressReportDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push({typeName: 'ActivityRelationshipDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push({typeName: 'EventDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push({typeName: 'LocationDto', moduleSubModule: 'Project.Location'});
							schemes.push({typeName: 'ProjectDto', moduleSubModule: 'Project.Main'});
							schemes.push({typeName: 'BaselineDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push({typeName: 'ActivityBaselineCmpVDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push({typeName: 'LineItemProgressDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push({typeName: 'TimelineDto', moduleSubModule: 'Scheduling.Schedule'});
							schemes.push({typeName: 'HammockActivityDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push({typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'});
							schemes.push({typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'});
							schemes.push({typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'});
							schemes.push({typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'});
							schemes.push({typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'});
							schemes.push({typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'});
							schemes.push({typeName: 'ActivityTemplateDto', moduleSubModule: 'Scheduling.Template'});
							schemes.push({typeName: 'MatrixBackgroundDto', moduleSubModule: 'Basics.Common'});
							schemes.push({typeName: 'MatrixFontDto', moduleSubModule: 'Basics.Common'});
							schemes.push({typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'});
							schemes.push({typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'});
							schemes.push({typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'});
							schemes.push({typeName: 'RequisitionDto', moduleSubModule: 'Scheduling.Main'});
							schemes.push(schedulingMainConstantValues.schemes.observation);
							schemes.push({ typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower' });
							schemes.push({ typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower' });
							schemes.push({ typeName: 'Activity2ModelObjectDto', moduleSubModule: 'Scheduling.Main' });


							return platformSchemaService.getSchemas(schemes);
						});
					}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'6669ec89b72448eab7b4888452365374',
							'7b055f899e2642d193b0f75e603b18ee',
							'7b336a9930a042b2b2261061bb684561',
							'fb9a635fb69e4867aad35776725fb24d'
						]);
					}],
					'loadTranslation': ['schedulingMainTranslationService', function (translationService) {
						return translationService.loadTranslations();
					}],

					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'schedulingMainService',
						function (basicsCharacteristicDataServiceFactory, schedulingMainService) {
							basicsCharacteristicDataServiceFactory.getService(schedulingMainService, 12);
						}
					] ,
					'loadNeededService': ['schedulingMainActivityBelongsToDataServiceFactory', function(schedulingMainActivityBelongsToDataServiceFactory) {
						schedulingMainActivityBelongsToDataServiceFactory.setMappingTable();
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
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService', '_', 'platformSidebarWizardDefinitions',
		function ($injector, naviService, wizardService, _, platformSidebarWizardDefinitions) {

			var wizardData = _.concat([{
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '132740d611d04ffbb08240db33fadd7a',
				methodName: 'createBaseline',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'b752383d74574ad0bd8b7624a82057fe',
				methodName: 'deleteBaseline',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'ebadaf24b7584cbfa70a12c77e5044d9',
				methodName: 'splitActivityByLocations',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'adcc6022ce2a4fa1a1bef5d720f800e7',
				methodName: 'basicsCommonChangeStatus',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '6402d82942f349ad8af3fb935772bd17',
				methodName: 'changeActivityStateOfAllActivities',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '4e5581e2b5e04f9bb057e78c46437186',
				methodName: 'exportToITWOBaseline',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'f369c3823eec42a7857fcc491705d092',
				methodName: 'exportToMSProject',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'f31d20df37b44601a4b89254f5544ee4',
				methodName: 'importMSProject',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '8066d42670734304b2dd0f3716fda9ae',
				methodName: 'addProgressToScheduledActivities',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '01d146a3b16343fa8232dc70c5936df6',
				methodName: 'criticalPath',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'caa5566cd7ea4b9bb8bdd4d9f480ab9f',
				methodName: 'assignAllCUs',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'a9076c01f8824bcba5130d1688161d3b',
				methodName: 'rescheduleActivities',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '1b6a5851e18e41cbb8f318b551ba0580',
				methodName: 'documentProjectDocumentsStatusChange',
				canActivate: true
			},	{
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '5da926befaa24078b86bbcdd28a204b6',
				methodName: 'updatePlannedLineItemQuantity',
				canActivate: true
			},	{
				serviceName: 'documentsProjectWizardService',
				wizardGuid: '906F29A4FFCD4856B97CC8395EE39B21',
				methodName: 'linkCx',
				canActivate: true
			}, {
				serviceName: 'documentsProjectWizardService',
				wizardGuid: '17F3EDBD264C47D78312B5DE24EDF37A',
				methodName: 'uploadCx',
				canActivate: true
			}, {
				serviceName: 'schedulingMainRenumberWizardService',
				wizardGuid: 'ae78379a694343ec8f18a9a56bd8c4a3',
				methodName: 'renumberActivities',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'e06913e71fcd4c09927514d1c04fa646',
				methodName: 'createProcurementPackage',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'aac9aca52b434e9abe7e6ef30c9e609a',
				methodName: 'createResourceRequisitions',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '359625d03d7847deaa55a336d8ee05ef',
				methodName: 'exportToPrimavera',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'f606b1c05aad4c3abd0437502e4997ad',
				methodName: 'importPrimavera',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '8ed8d6eb5018451b9e8bb1ff87b6a51f',
				methodName: 'importFromBaseline',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'e3d18848e8dd4cba8bb37d77e822c26d',
				methodName: 'createMountingActivity',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'd99b175ef0d94b0791d2cfedc35587ab',
				methodName: 'synchronizeScheduleActivity',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '7755581bd4934adc884a6e18cd6664e8',
				methodName: 'updateActivityQuantity',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'b62429dd3e994c18a752ae5c3c0e3697',
				methodName: 'performanceSheet',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '9e2caf8883e54952a89020ba69c9707e',
				methodName: 'createResourceRequisitionForMaterial',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '600e3bb876604a069c8364aac160986f',
				methodName: 'createResourceRequisitionForResResource',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '26e4244ffd3744ed84e1c5d9077db903',
				methodName: 'updateResourceRequisition',
				canActivate: true
			},  {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '09a93e0a56f64d8fb35b9561867674d3',
				methodName: 'createResourceRequisitionForCostCode',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '128e05ad319a41b2af526efb13d97913',
				methodName: 'createResourceRequisitionFromScheduling',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'f669cdf521ff4bedb3b46f5d31ba9136',
				methodName: 'rescheduleUncompleteTask',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: '14ff83d272d94ea8aa7c7c132a343ff3',
				methodName: 'generateActivities',
				canActivate: true
			}, {
				serviceName: 'schedulingMainSidebarWizardService',
				wizardGuid: 'cf22bbb9070c49fdbeda856ce3132692',
				methodName: 'synchronizeSchedules',
				canActivate: true
			},
				{
					serviceName: 'schedulingMainSidebarWizardService',
					wizardGuid: '47f32b5005c64d878c2392eb0ae6149c',
					methodName: 'createJobForImportMethod',
					canActivate: true
				}
			], platformSidebarWizardDefinitions.model.sets.default);
			wizardService.registerWizard(wizardData);
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('schedulingMainService').selectAfterNavigation(item, triggerField);
					}
				}
			);
		}]);

})(angular);

