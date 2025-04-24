(function (angular) {
	'use strict';

	/*
	 ** productionplanning.engineering module is created.
	 */
	var moduleName = 'productionplanning.engineering';

	var moduleSubModule = 'ProductionPlanning.Engineering';
	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [{
				serviceName: 'productionplanningEngineeringTaskWizardService',
				wizardGuid: 'b454a7ec751c4ff389d97151c3dce7bb',
				methodName: 'changeEngineeringTaskStatus',
				canActivate: true
			/*
			 * Remark: At the moment, because wizard “Import Product Description” is discarded, so the following code will not be used any more.
 			 * But here we will still keep the code, in case we will reuse it in the future(e.g. reuse to patch CAD data in DB without accounting).(by zwz 2019/11/12)
			}, {
				serviceName: 'productionplanningEngineeringTaskWizardService',
				wizardGuid: '99c8669c7e2d44ecad11dd2a25fc6527',
				methodName: 'uploadFiles',
				canActivate: true
			*/
			}, {
				serviceName: 'productionplanningEngineeringTaskWizardService',
				wizardGuid: 'ac57e25c1fd5456599a86f36ecdcef4d',
				methodName: 'enableTask',
				canActivate: true
			}, {
				serviceName: 'productionplanningEngineeringTaskWizardService',
				wizardGuid: 'beb395e1c60e4734a1d3bd16b795f707',
				methodName: 'disableTask',
				canActivate: true
			}, {
				serviceName: 'productionplanningEngineeringTaskWizardService',
				wizardGuid: 'f4dd67b93f074dfb9cbfd81b1548066e',
				methodName: 'changeResRequisitionStatus',
				canActivate: true
			}, {
				serviceName: 'productionplanningEngineeringTaskWizardService',
				wizardGuid: '9ff0793b581f4a29b0b404b218b58930',
				methodName: 'changeResReservationStatus',
				canActivate: true
			}, {
				serviceName: 'resourceReservationSidebarWizardService',
				wizardGuid: '12f22d52a15045db9d78eb0a793aedb3',
				methodName: 'createDispatchNodesFromEngineering',
				canActivate: true
			},{
				serviceName: 'productionplanningEngineeringTaskWizardService',
				wizardGuid: '890c2e234020490cacf1678921f75e09',
				methodName: 'createUpstreamPackages',
				canActivate: true
			},{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			}, {
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '7b0fb8993f56434f99368ec9875ee4fd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '2d1bababfa40410ca725cb16c4d77304',
				methodName: 'changeUpStreamFormDataStatus',
				canActivate: true
				// serviceName: 'basicsUserFormFormDataWizardService',
				// wizardGuid: '2d1bababfa40410ca725cb16c4d77304',
				// methodName: 'changeFormDataStatus',
				// canActivate: true
			},{
				serviceName: 'productionplanningEngineeringTaskWizardService',
				wizardGuid: '9065e7dd71ab49eba2b6adc4f4001724',
				methodName: 'changeUpstreamStatus',
				canActivate: true
			},{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '587cc46a2dc94ede90afec4137542f9d',
				methodName: 'changeFormDataStatus',
				canActivate: true
			},{
				serviceName: 'productionplanningEngineeringTaskWizardService',
				wizardGuid: '6f6d5c81d4a64d6684eb993029329656',
				methodName: 'changeStatusForProjectDocument',
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
			}];

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', 'ppsCommonLoggingHelper', function (platformSchemaService, basicsConfigWizardSidebarService, ppsCommonLoggingHelper) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						var schemas = [
							{typeName: 'EngHeaderDto', moduleSubModule: moduleSubModule},
							{typeName: 'EngTaskDto', moduleSubModule: moduleSubModule},
							{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
							{typeName: 'ReservationDto', moduleSubModule: 'Resource.Reservation'},
							{typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'},
							{typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
							{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'LocationDto', moduleSubModule: 'Project.Location'},
							{typeName: 'ActivityDto', moduleSubModule: 'Scheduling.Main'},
							{typeName: 'EngDrwProgReportDto', moduleSubModule: moduleSubModule},
							{typeName: 'PPSItem2ClerkDto', moduleSubModule: 'ProductionPlanning.Item'},
							{typeName: 'Project2BusinessPartnerDto', moduleSubModule: 'Project.Main'},
							{typeName: 'Project2BusinessPartnerContactDto', moduleSubModule: 'Project.Main'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'GenericDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'CostGroupCatDto', moduleSubModule: 'Basics.CostGroups'},
							{typeName: 'PpsUpstreamItemDto', moduleSubModule: 'ProductionPlanning.Item'},
							{typeName: 'PpsItem2MdcMaterialDto', moduleSubModule: 'ProductionPlanning.Item'},
							{typeName: 'MdcProductDescriptionDto', moduleSubModule: 'ProductionPlanning.PpsMaterial'},
							{typeName: 'MdcProductDescParamDto', moduleSubModule: 'ProductionPlanning.PpsMaterial'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PpsLogReportVDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PPSItemEventDto', moduleSubModule: 'ProductionPlanning.Item'},
							{typeName: 'EngTask2ClerkDto', moduleSubModule: moduleSubModule},
							{typeName: 'CommonBizPartnerDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'CommonBizPartnerContactDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'FormDataDto', moduleSubModule: 'Basics.UserForm'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'EngDrawingDto', moduleSubModule: 'ProductionPlanning.Drawing'},
							{typeName: 'EngDrawingComponentDto', moduleSubModule: 'ProductionPlanning.Drawing'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
						];
						return ppsCommonLoggingHelper.initLoggingNecessity(schemas).then(function () {
							return platformSchemaService.getSchemas(schemas);
						});
					}],
					'loadTranslation': ['platformTranslateService','basicsMaterialTranslationService', function (platformTranslateService,basicsMaterialTranslationService) {
						basicsMaterialTranslationService.loadTranslations();
						return platformTranslateService.registerModule([moduleName, 'productionplanning.common', 'resource.requisition']);
						// remark: wiki of platformTranslateService is http://rib-s-wiki01.rib-software.com/cloud/wiki/54/angular-translation#Platform-Translation-Service
					}],
					'loadEngTaskCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningEngineeringTranslationService', function (customColumnsServiceFactory, translationServ) {
						var customColumnsService = customColumnsServiceFactory.getService(moduleName);
						return customColumnsService.init('productionplanning/engineering/task/customcolumn').then(function () {
							// for fixing error of failure of translating customColumns when navigating to current module from other module(such as Project module),
							// here we need to do customColumns translation in callback function. (by zwz 2019/8/20)
							translationServ.setTranslationForCustomColumns();
						});
					}],
					'loadItemCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningItemTranslationService', function (customColumnsServiceFactory, translationServ) {
						var customColumnsService = customColumnsServiceFactory.getService('productionplanning.item');
						return customColumnsService.init('productionplanning/item/customcolumn').then(function () {
							translationServ.setTranslationForCustomColumns();
						});
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'projectMainConstantValues', function (basicsCompanyNumberGenerationInfoService, projectMainConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService', projectMainConstantValues.values.locationRubricId).load();
					}],
					loadEventType: ['ppsCommonCodGeneratorConstantValue', function (ppsCommonCodGeneratorConstantValue) {
						return ppsCommonCodGeneratorConstantValue.loadEventType(); // eventType is indirectly referenced by ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType() in processItem() of productionplanningEngineeringTaskProcessor
					}],
					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsEngineeringTaskNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.Engineering).load();
					}],
					// needed to install listener for parent-service create event (even when characteristic container is not activated)
					initCharacteristicDataService: ['basicsCharacteristicDataServiceFactory', 'productionplanningEngineeringMainService',
						function (basicsCharacteristicDataServiceFactory, productionplanningEngineeringMainService) {
							basicsCharacteristicDataServiceFactory.getService(productionplanningEngineeringMainService, 70);
							basicsCharacteristicDataServiceFactory.getService(productionplanningEngineeringMainService, 71);
						}],
					loadResourcesStatus: ['productionplanningCommonRequisitionProcessor','productionplanningCommonResReservationProcessor',
						function (productionplanningCommonRequisitionProcessor,productionplanningCommonResReservationProcessor) {
							productionplanningCommonRequisitionProcessor.loadData();
							productionplanningCommonResReservationProcessor.loadData();
						}],
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
						var serv = $injector.get('productionplanningEngineeringMainService');
						serv.navigateTo(item, triggerField);
					}
				}
			);
		}]);

})(angular);