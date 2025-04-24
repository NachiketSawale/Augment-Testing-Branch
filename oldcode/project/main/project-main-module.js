/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global angular */
	/* global globals */
	'use strict';

	var moduleName = 'project.main';

	angular.module(moduleName, ['ui.router', 'project.location', 'project.stock', 'scheduling.schedule', 'basics.clerk', 'basics.lookupdata', 'basics.currency', 'businesspartner.main', 'platform', 'basics.material', 'estimate.rule', 'estimate.parameter', 'model.viewer', 'model.project', 'model.main', 'model.simulation', 'model.evaluation', 'project.calendar', 'project.costcodes']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider', '_', 'platformSidebarWizardDefinitions',
		function (mainViewServiceProvider, _, platformSidebarWizardDefinitions) {

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformModuleInitialConfigurationService', 'platformSchemaService', 'projectMainConstantValues', function (platformModuleInitialConfigurationService, platformSchemaService, projectMainConstantValues) {
						var schemes = [
							// { typeName: 'ClerkInfoVDto', moduleSubModule: 'Project.Main' },
							{ typeName: 'ProjectDto', moduleSubModule: 'Project.Main' },
							{typeName: 'Project2ClerkDto', moduleSubModule: 'Project.Main'},
							{typeName: 'GeneralDto', moduleSubModule: 'Project.Main'},
							{typeName: 'TenderResultDto', moduleSubModule: 'Project.Main'},
							{typeName: 'ScheduleDto', moduleSubModule: 'Scheduling.Schedule'},
							{typeName: 'Schedule2ClerkDto', moduleSubModule: 'Scheduling.Schedule'},
							{typeName: 'BoqHeader2ClerkDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'TimelineDto', moduleSubModule: 'Scheduling.Schedule'},
							{typeName: 'LocationDto', moduleSubModule: 'Project.Location'},
							{typeName: 'CurrencyRateDto', moduleSubModule: 'Project.Main'},
							{typeName: 'CurrencyConversionDto', moduleSubModule: 'Basics.Currency'},
							{typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'BoqHeaderDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'EstHeaderDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'PrjCostCodesDto', moduleSubModule: 'Project.CostCodes'},
							{typeName: 'UpdatePriceFromPriceListDto', moduleSubModule: 'Project.CostCodes'},
							{typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'},
							{typeName: 'ProjectCostCodesJobRateDto', moduleSubModule: 'Project.CostCodes'},
							{typeName: 'PrjMaterialDto', moduleSubModule: 'Project.Material'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'MaterialPortionDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'PrjMaterialPriceConditionDto', moduleSubModule: 'Project.Material'},
							{typeName: 'Project2MdcMaterialPortionDto', moduleSubModule: 'Project.Material'},
							{typeName: 'Project2BusinessPartnerDto', moduleSubModule: 'Project.Main'},
							{typeName: 'Project2BusinessPartnerContactDto', moduleSubModule: 'Project.Main'},
							{typeName: 'SaleDto', moduleSubModule: 'Project.Main'},
							{typeName: 'KeyFigureDto', moduleSubModule: 'Project.Main'},
							{typeName: 'BidHeaderDto', moduleSubModule: 'Sales.Bid'},
							{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Bid'},
							{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Billing'},
							{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Contract'},
							{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'OrdHeaderDto', moduleSubModule: 'Sales.Contract'},
							{typeName: 'BilHeaderDto', moduleSubModule: 'Sales.Billing'},
							{typeName: 'WipHeaderDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'MaterialPriceConditionDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'ModelDto', moduleSubModule: 'Model.Project'},
							{typeName: 'ModelFileDto', moduleSubModule: 'Model.Project'},
							{typeName: 'ModelPartDto', moduleSubModule: 'Model.Project'},
							{typeName: 'PrjEstRuleDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'PrjEstRuleParamDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'EstPrjParamDto', moduleSubModule: 'Estimate.Parameter'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'InstanceHeaderDto', moduleSubModule: 'ConstructionSystem.Project'},
							{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
							{typeName: 'HeaderDto', moduleSubModule: 'Object.Project'},
							{typeName: 'LevelDto', moduleSubModule: 'Object.Project'},
							{typeName: 'SortCode01Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'SortCode02Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'SortCode03Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'SortCode04Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'SortCode05Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'SortCode06Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'SortCode07Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'SortCode08Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'SortCode09Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'SortCode10Dto', moduleSubModule: 'Project.Structures'},
							{typeName: 'EstRuleParamValueDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'HeaderDto', moduleSubModule: 'ProductionPlanning.Header'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'Header2ClerkDto', moduleSubModule: 'ProductionPlanning.Header'},
							{typeName: 'RequisitionDto', moduleSubModule: 'ProductionPlanning.Mounting'},
							{typeName: 'EngHeaderDto', moduleSubModule: 'ProductionPlanning.Engineering'},
							{typeName: 'ProjectPriceListDto', moduleSubModule: 'Project.CostCodes'},
							{typeName: 'ProjectStockDto', moduleSubModule: 'Project.Stock'},
							{typeName: 'ProjectStockLocationDto', moduleSubModule: 'Project.Stock'},
							{typeName: 'ProjectStock2MaterialDto', moduleSubModule: 'Project.Stock'},
							{typeName: 'BidBillingschemaDto', moduleSubModule: 'Sales.Bid'},
							{typeName: 'AccessObject2GrpRoleDto', moduleSubModule: 'Project.Main'},
							{typeName: 'OrdBillingschemaDto', moduleSubModule: 'Sales.Contract'},
							{typeName: 'ProjectAddressDto', moduleSubModule: 'Project.Main'},
							{typeName: 'Project2CertificateDto', moduleSubModule: 'Project.Main'},
							{typeName: 'EstLineItemSelStatementDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'RateBookDto', moduleSubModule: 'Project.Main'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'HeaderDocumentDto', moduleSubModule: 'Object.Project'},
							{typeName: 'Project2EstAssemblyDto', moduleSubModule: 'Project.Assembly'},
							{typeName: 'Prj2EstPltAssemblyDto', moduleSubModule: 'Project.Plantassembly'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Assemblies'},
							{typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'HeaderPparamDto', moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'ProjectExceptionDayDto', moduleSubModule: 'Project.Calendar'},
							{typeName: 'CostGroupCatDto', moduleSubModule: 'Basics.CostGroups'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							projectMainConstantValues.schemes.release,
							projectMainConstantValues.schemes.costGroup,
							projectMainConstantValues.schemes.costGroupCatalog,
							{typeName: 'DataTree2ModelDto', moduleSubModule: 'Model.Administration'},
							{typeName: 'ModelComparePropertykeyBlackListDto', moduleSubModule: 'Model.Administration'},
							{ typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower' },
							{ typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower' },
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{ typeName: 'EstCrewMixDto', moduleSubModule: 'Basics.EfbSheets'},
							{ typeName: 'EstAverageWageDto', moduleSubModule: 'Basics.EfbSheets'},
							{ typeName: 'EstCrewMixAfDto', moduleSubModule: 'Basics.EfbSheets'},
							{ typeName: 'EstCrewMixAfsnDto', moduleSubModule: 'Basics.EfbSheets'},
							{ typeName: 'PrjCrewMix2CostCodeDto', moduleSubModule: 'Basics.EfbSheets'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'ModelStakeholderDto', moduleSubModule: 'Model.Project'},
							projectMainConstantValues.schemes.billTo,
							projectMainConstantValues.schemes.action,
							projectMainConstantValues.schemes.actionEmployee,
							projectMainConstantValues.schemes.biddingConsortium,
							{typeName: 'EstAssemblyCatDto', moduleSubModule: 'Estimate.Assemblies'},
							{typeName: 'PrcConfiguration2Prj2TextTypeDto', moduleSubModule: 'Basics.ProcurementConfiguration'},
							{typeName: 'PrcConfigurationDto', moduleSubModule: 'Basics.ProcurementConfiguration'},
							{typeName: 'Project2SalesTaxCodeDto', moduleSubModule: 'Project.Main'},
							{typeName: 'SalesTaxMatrixDto', moduleSubModule: 'Project.Main'},
							{typeName: 'QtoHeaderDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'EstimateProjectHeader2ClerkDto', moduleSubModule: 'Estimate.Project'},
							{typeName: 'ModelClerkRoleDto',moduleSubModule: 'Model.Project'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'CertificateDto', moduleSubModule: 'BusinessPartner.Certificate'},
							projectMainConstantValues.schemes.clerkRole,
							{typeName: 'ProjectStockDownTimeDto', moduleSubModule: 'Project.Stock'},
							{typeName: 'ProjectStock2ClerkDto', moduleSubModule: 'Project.Stock'},
							projectMainConstantValues.schemes.clerkSite,
							projectMainConstantValues.schemes.bizPartnerSite,
							{typeName: 'ProjectHeaderblobDto', moduleSubModule: 'Project.Common'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							projectMainConstantValues.schemes.timekeeping2Clerk,
							projectMainConstantValues.schemes.managedPlantLoc,
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'TextModuleDto', moduleSubModule: 'Basics.TextModules'},
							projectMainConstantValues.schemes.projectPublishedCompany,
							projectMainConstantValues.schemes.company,
							{typeName: 'EstAllowanceAreaDto', moduleSubModule: 'Estimate.Main'},
							projectMainConstantValues.schemes.activity,
							projectMainConstantValues.schemes.picture
						];
						return platformModuleInitialConfigurationService.load('Project.Main').then(function (modData) {
							return platformSchemaService.getSchemas(schemes.concat(modData.schemes));
						});
					}],
					loadCompanyLoginContext: ['basicsCompanyLoginContextService', function (basicsCompanyLoginContextService) {
						return basicsCompanyLoginContextService.load();
					}],
					loadScheduleCodeGenerationSetttings: ['schedulingScheduleCodeGenerationService', function (codeGenerationService) {
						return codeGenerationService.load();
					}],
					loadProjectCodeGenerationSetttings: ['projectMainNumberGenerationSettingsService', function (codeGenerationService) {
						return codeGenerationService.load();
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'projectMainConstantValues', function (basicsCompanyNumberGenerationInfoService, projectMainConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService', projectMainConstantValues.values.locationRubricId).load();
					}],
					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'ppsMountingConstantValues', '$http', function (basicsCompanyNumberGenerationInfoService, ppsMountingConstantValues, $http) {
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId=3').then(function (response) {
							ppsMountingConstantValues.requsitionRubricCat = response.data;
						});
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsMountingNumberInfoService', ppsMountingConstantValues.mountingRubricId).load();
					}],
					loadCodeGenerationInfo3: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', '$http', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, $http) {
						var ppsEntityId = ppsCommonCodGeneratorConstantValue.PpsEntityConstant.PPSHeader;
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId=' + ppsEntityId).then(function (response) {
							ppsCommonCodGeneratorConstantValue.CategoryConstant.PpsHeaderCat = response.data;
						});
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsHeaderNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.ProductionPlanning).load();
					}],
					loadLookup: ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'estimateMainAssemblyTemplateLookup',
							'estimateRuleSequenceLookup',
							'boqMainCatalogAssignmentModeCombobox',
							'projectAutodeskServiceTypeLookup',
							'projectAutodeskProjectTypeLookup',
							'projectAutodeskLanguageLookup'
						]);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'usermanagement.group', 'usermanagement.right', 'basics.assetmaster', 'basics.efbsheets'], true);
					}],
					loadBillToNumberCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'projectMainConstantValues', function (basicsCompanyNumberGenerationInfoService, projectMainConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectBillToNumberInfoService', projectMainConstantValues.values.billToRubricId).load();
					}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'projectMainService',
						function (basicsCharacteristicDataServiceFactory, projectMainService) {
							basicsCharacteristicDataServiceFactory.getService(projectMainService, 40);
						}
					],
					'registerWizards': ['genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
						function registerWizards(layoutService, wizardService) {

							var wizardData = [
								{
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'b0a627bbcae04bc8a773d038f936a915',
									methodName: 'disableProject',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'f3555636d16e4400b6be2ccd6f6a3ac2',
									methodName: 'enableProject',
									canActivate: true
								}, {
									serviceName: 'modelProjectModelImportDialog',
									wizardGuid: '32d74e36a53143d993d2db7ff1a2e285',
									methodName: 'showDialogForCurrentProject',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'cebd8a2a1add4a1cb189118a1a73eccd',
									methodName: 'resetModelFileState',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '19c6a5e037fd4fb09c58a1c1ac0a439c',
									methodName: 'deleteCompleteModel',
									canActivate: true
								}, {
									serviceName: 'modelProjectModelCompositeUpdateWizardService',
									wizardGuid: '074d9aab99524f70a362ed6140cb9bac',
									methodName: 'showDialog',
									canActivate: true
								}, {
									serviceName: 'modelMainModelUpdateWizardService',
									wizardGuid: '7ff8d0763e96443589fbd743bc294169',
									methodName: 'showDialog',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '6a38848562a74f5fbddce4abc0c831ba',
									methodName: 'disableModel',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '5f58202689734b14961c14951e3d2976',
									methodName: 'enableModel',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'dad14b5891304aa4bd63feafaa220119',
									methodName: 'createProject',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'c831fe3e710449448149321bcbca5576',
									methodName: 'postProjectToAutodeskBim360',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '44893e9cb12a4e5dae90b4f09e4e51e2',
									methodName: 'createProjectAlternative',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '8321d22cd752416f8922f9bb9755bbd0',
									methodName: 'setActiveProjectAlternative',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '6039d1766dc74505968418cb699c0c5a',
									methodName: 'changeProjectStatus',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'a041c4f180c74d6fb1ac5ebef949a2d1',
									methodName: 'changeInstanceHeaderStatus',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '87DAB0BB2B604DA3B25FB3BF322C47A1',
									methodName: 'updateMaterialPrices',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '406208ef14fe41c59d194108b1340cbf',
									methodName: 'changeProjectNumber',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'afd921a3846840f49c9991c5a771e3f3',
									methodName: 'compareCosInsHeader',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'CC00D36F3B124A36A60CE4FEE703AB97',
									methodName: 'changeModel',
									canActivate: true
								}, {
									serviceName: 'estimateProjectWizardService',
									wizardGuid: '8981AAD8A8F241B8A18E5EBC12983BF8',
									methodName: 'changeEstimateStatus',
									canActivate: true
								}, {
									serviceName: 'estimateProjectWizardService',
									wizardGuid: '33E51015EC744506B7A5849C57DD3C2A',
									methodName: 'updateAssemblyStructure',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '002E6EE4867842B5A8F28045B803EDA7',
									methodName: 'updateEquipmentAssembly',
									canActivate: true
								},{
									serviceName: 'estimateProjectWizardService',
									wizardGuid: '1D956E198DA94C12A48DF0BAE82C4D19',
									methodName: 'updateAssemblies',
									canActivate: true
								}, {
									serviceName: 'estimateProjectWizardService',
									wizardGuid: '5454BBA72632453ABF71E46B424088D8',
									methodName: 'importAssemblies',
									canActivate: true
								}, {
									serviceName: 'estimateProjectWizardService',
									wizardGuid: '7d8ef2ac05064e6f9e9e73261fa2d821',
									methodName: 'createOrUpdateEstimateWizard',
									canActivate: true
								},{
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
									serviceName: 'modelProjectModelStatusWizardService',
									wizardGuid: '1b69cc700c1047938c12210a82d4c7cf',
									methodName: 'showDialog',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '68a17d3dc6044b2b8574bbbee12a219a',
									methodName: 'setCharacteristics',
									canActivate: true
								}, {
									serviceName: 'productionplanningCommonHeaderWizardService',
									wizardGuid: '3df41b6706dd47838542f8faa04504ae',
									methodName: 'disablePPSHeader',
									canActivate: true
								}, {
									serviceName: 'productionplanningCommonHeaderWizardService',
									wizardGuid: 'c8bee7a7008a4236b6ef8941b1e63543',
									methodName: 'enablePPSHeader',
									canActivate: true
								}, {
									serviceName: 'productionplanningCommonHeaderWizardService',
									wizardGuid: 'b758effa67924ec38190598e44f41209',
									methodName: 'changePPSHeaderStatus',
									canActivate: true
								}, {
									serviceName: 'productionplanningEngineeringHeaderWizardService',
									wizardGuid: 'adb82dc8628443e79482e71e1f71e50a',
									methodName: 'changeEngineeringHeaderStatus',
									canActivate: true
								}, {
									serviceName: 'productionplanningEngineeringHeaderWizardService',
									wizardGuid: 'c1f659433cba4323a73309e2aacbd90b',
									methodName: 'enableHeader',
									canActivate: true
								}, {
									serviceName: 'productionplanningEngineeringHeaderWizardService',
									wizardGuid: 'd316a97be25040b98f3dfae3bab561b8',
									methodName: 'disableHeader',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '7d62386026ce43c09ec144a8e0f7ed5d',
									methodName: 'updateCostCodesPriceByPriceList',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'fc93b5276c77427b87f6c0d27d0bfa22',
									methodName: 'makeTemplateProject',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '7c37111ee5b4411eba4cb59be39b260b',
									methodName: 'makeNormalProject',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '6923cec2833544b5b90c963c471cd3b7',
									methodName: 'useProjectPermission',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'e5e900e7c65d4156989a027f14dce3a3',
									methodName: 'dontUseProjectPermission',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '707dcde8aca24e35af72589e1cbd8877',
									methodName: 'updateMaterialPricesFromYtwo',
									canActivate: true
								}, {
									serviceName: 'productionplanningMountingWizardService',
									wizardGuid: 'baf0f93d2bdf4bbfa035ebed0534d3b1',
									methodName: 'changeMntRequisitionStatus',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '2cd0b934ad0e4cbdbd760f82a31a0686',
									methodName: 'ClearProjectStock',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '6620d30dcd5b4b189248cf0b9dd68b14',
									methodName: 'convertProjectTo5D',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '7014838602524384a7451c68680a14a5',
									methodName: 'convertProjectTo40',
									canActivate: true
								},
								{
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '955e94db00d24f99a2b60cc85a1622bd',
									methodName: 'generateProjectActions',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'd2601e1ab46940aeaa6842d4c39b9d68',
									methodName: 'make5DTemplateProject',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '6A65246E4E984A24906A51602666C737',
									methodName: 'changeStatusForProjectDocument',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '251b9f6b8b3b40d5be5064933cdde53f',
									methodName: 'changeStatusOfChange',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '1a39de6edaf847c1a91f4f1d10a30407',
									methodName: 'reScheduleAllProjects',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '7c63215cd71b4b8bab0e87292a775669',
									methodName: 'reScheduleAllSchedules',
									canActivate: true
								}, {
									serviceName: 'modelMainLocationHierarchyWizardService',
									wizardGuid: '511a3c8d28014fd0a8932f7d265c8eae',
									methodName: 'runWizard',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'b94b6e7468434e8d9dab70d81114a2bb',
									methodName: 'gaebImport',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '38d246875ff54e28a0e8a939923ddb8a',
									methodName: 'importCrbSia',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '6cbf0ef900e242028c46da3af06b06e5',
									methodName: 'setScheduleStatus',
									canActivate: true
								}, {
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '52e41c22df5a4de3b01a87dcaa73c25d',
									methodName: 'setCurrencyExchangeRates',
									canActivate: true
								}, {
									serviceName: 'projectCalendarWizardService',
									wizardGuid: '89870926cb9348a3b369d5d16e7fb129',
									methodName: 'changeCalendarType',
									canActivate: true
								}, {
									serviceName: 'projectCalendarWizardService',
									wizardGuid: 'ad6de931acfc4208b9a8d4dc5a954fc7',
									methodName: 'calendarUpdate',
									canActivate: true
								},
								{
									serviceName: 'basicsUserFormFormDataWizardService',
									wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
									methodName: 'changeFormDataStatus',
									canActivate: true
								},
								{
									serviceName: 'basicsUserFormFormDataWizardService',
									wizardGuid: '1cac76c21a8f460f82c8041cd9692226',
									methodName: 'changeFormDataStatus',
									canActivate: true
								}, {
									serviceName: 'modelProjectCreateHololensModelService',
									wizardGuid: '142f2fc70e73425c8673178b790c3fc5',
									methodName: 'createHololensModel',
									canActivate: true
								},
								{
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '791e39436c4a44b99469ec38f84f433d',
									methodName: 'changeBoqHeaderStatus',
									canActivate: true
								},
								{
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '75a49e3e8eb243018df6b6603af37396',
									methodName: 'makeItwoProject',
									canActivate: true
								},
								{
									serviceName: 'projectCalendarWizardService',
									wizardGuid: '85a816be84f3486ab550724df82bf6db',
									methodName: 'createExceptionDays',
									canActivate: true
								},
								{
									serviceName: 'projectCalendarWizardService',
									wizardGuid: '1d3fb4fec48f4cf38e066dbb6e052b6a',
									methodName: 'enableCalendar',
									canActivate: true
								},
								{
									serviceName: 'projectCalendarWizardService',
									wizardGuid: 'b830cfbcb47c4947a8d4d39597791726',
									methodName: 'disableCalendar',
									canActivate: true
								},
								{
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: 'b50a2432717246be8c0b0e5c33b774e3',
									methodName: 'changeProjectGroup',
									canActivate: true
								},
								{
									serviceName: 'documentsCentralQueryWizardService',
									wizardGuid: '1db192a34c234076a849a955ed787e51',
									methodName: 'syncBim360Document2itwo40',
									canActivate: true
								},
								{
									serviceName: 'documentsCentralQueryWizardService',
									wizardGuid: 'c6d1233e576e45f4bfa81e582152858c',
									methodName: 'syncItwo40Document2bim360',
									canActivate: true
								},
								{
									serviceName: 'controllingRevenueRecognitionWizardService',
									wizardGuid: 'b010117e602649b4bfc0b802fce5b7ec',
									methodName: 'createRevenueRecognition',
									canActivate: true
								},
								{
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '98561975d34b487c9930a5d6f3c06224',
									methodName: 'convertAddressGeoCoordinate',
									canActivate: true
								},
								{
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '9b48e4ca03aa4b1dbdc30c5e694dc04d',
									methodName: 'changeProjectPhase',
									canActivate: true
								},
								{
									serviceName: 'projectMainCardChangeWOTOfAssignedPlantWizardService',
									wizardGuid: 'bf53b19d8be248769b88c89a60bd8ag3',
									methodName: 'changeWOTOfAssignedPlant',
									canActivate: true
								},
								{
									serviceName: 'documentsCentralQueryWizardService',
									wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
									methodName: 'changeRubricCategory',
									canActivate: true,
									userParam: {
										'moduleName': moduleName
									},

								},
								{
									serviceName: 'projectMainSidebarWizardService',
									wizardGuid: '2fab9cfd14504a73aa7c7a85bad9b53a',
									methodName: 'generateActionEmployees',
									canActivate: true
								},
								{
									serviceName: 'projectLocationWizardService',
									wizardGuid: '4cff75f4021c45b6b27dfd94e69c9b7e',
									methodName: 'importProjectLocationsInBaselineFormat',
									canActivate: true
								},
								{
									serviceName: 'projectStockMaterialWizardService',
									wizardGuid: '595db7585c9147d488f7b5c793377c05',
									methodName: 'changeProjectStockStatus',
									canActivate: true
								},
								{
									serviceName: 'projectLocationWizardService',
									wizardGuid: '48d7da341c9d4290a4591c8002ace263',
									methodName: 'importProjectLocationsIn40Format',
									canActivate: true
								},
								{
									serviceName: 'projectLocationWizardService',
									wizardGuid: 'c478673ee7f14c699f76b762091f5026',
									methodName: 'exportProjectLocationsIn40Format',
									canActivate: true
								},
								{
									serviceName: 'basicsEfbSheetsSideBarWizardService',
									wizardGuid: '24445C267D634118B49D748331D9BE9F',
									methodName: 'updateWagesFromMaster',
									canActivate: true
								}
							];
							wizardService.registerWizard(wizardData);

						}]

				},
				permissions: [
					'4c869d7b2ee44830991ffd57cf3db23c'
				]
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService','$timeout','basicsWorkflowEventService',
		function ($injector, naviService, $timeout,basicsWorkflowEventService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-sale',
					navFunc: function (item, triggerField) {
						$injector.get('projectMainSaleService').doNavi(item, triggerField);
					}
				}
			);

			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('projectMainService').navigateTo(item, triggerField);
					}
				}
			);

			naviService.registerNavigationEndpoint(
				{
					moduleName: 'iTWO 5D',
					externalEntityParam: 'ProjectNo',
					interfaceId: 'project.main.project',

					hide: function (entity) {
						return entity.TypeFk !== 4;
					}
					// navFunc not needed, call goes to the server which opens a new process
				}
			);

			_.times(5, function (index) {
				var newIndex = index + 1;
				naviService.registerNavigationEndpoint(
					{
						moduleName: moduleName + '-costgroup' + newIndex,
						navFunc: function (item, triggerField) {
							$injector.get('projectMainService').navigateToCostGroup(item, triggerField, newIndex);
						}
					}
				);
			});

			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-estimate-rule-script',
					navFunc: function (item, triggerField) {
						var ruleService = $injector.get('estimateProjectEstimateRulesService');
						// navigate to estimateProjectEstimateRulesService
						var rules = ruleService.getList();
						if (_.isEmpty(rules)){
							// some problems here, this navigator from comboRule or outputRule, and the nav function has the project data
							// but here not get the project data, reload the project data here
							var projectMainService = $injector.get('projectMainService');

							if (_.isEmpty(projectMainService.getList())) {
								projectMainService.deselect();
								projectMainService.load().then(function () {
									// if nav from estimate.main module
									var projectToSelect = projectMainService.getItemById($injector.get('estimateMainService').getSelectedProjectId());
									projectMainService.setSelected(projectToSelect);
									$timeout(function () {
										ruleService.load().then(navToRule);
									}, 251);
								});
							} else {
								if (projectMainService.getSelected() && projectMainService.getSelected().Id === $injector.get('estimateMainService').getSelectedProjectId()) {
									ruleService.load().then(navToRule);
								} else {
									$injector.get('estimateProjectEstRuleScriptService').clear();
									projectMainService.clearCache();
									projectMainService.deselect();
									projectMainService.load().then(function () {
										// if nav from estimate.main module
										var projectToSelect = projectMainService.getItemById($injector.get('estimateMainService').getSelectedProjectId());
										projectMainService.setSelected(projectToSelect);
										$timeout(function () {
											ruleService.load().then(navToRule);
										}, 251);
									});
								}
							}
						}else{
							navToRule(item, triggerField);
						}

						function navToRule(){
							var ruleSelected = _.find(rules, { Code: triggerField.Code });
							ruleService.setSelected(ruleSelected);

							if (ruleService.isSelection(ruleSelected)){
								$timeout(function () {
									var mainViewService = $injector.get('mainViewService');
									var estTabIndex = _.findIndex(mainViewService.getTabs(), {'Id': 'project.main.est.rules'});
									if (estTabIndex > -1 && mainViewService.getActiveTab() !== estTabIndex) {
										$timeout(function () {
											mainViewService.setActiveTab(estTabIndex);
										}, 0);
									}

									if (triggerField.ReloadScript) {
										$injector.get('estimateProjectEstRuleScriptService').load();
									}

									ruleService.navigateToEstimateRule(item, triggerField);
								}, 0);

							}
						}
					}
				}
			);

			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-estimate-header',
					navFunc: function (item, triggerField) {
						var projectEstHeaderService = $injector.get('estimateProjectService');
						projectEstHeaderService.navigateToEstHeader(triggerField);
					}
				}
			);

			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-assembly',
					navFunc: function (entity, triggerFieldOption) {
						let estimateProjectService = $injector.get('estimateProjectService');
						if (triggerFieldOption.triggerModule === 'project.main') {
							estimateProjectService.navigateToAssemblyFromPrj(entity, triggerFieldOption);
						}
						else {
							estimateProjectService.navigateToAssembly(entity, triggerFieldOption);
						}
					}
				}
			);

			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-assembly.structure',
					navFunc: function (entity, triggerFieldOption) {
						let estimateProjectService = $injector.get('estimateProjectService');
						estimateProjectService.navigateToAssemblyCategory(entity, triggerFieldOption);
					}
				}
			);

			basicsWorkflowEventService.registerEvent('3819677C443E482789F928175775E59A', 'New Project Created');
			basicsWorkflowEventService.registerEvent('111e63afdbde48b89a00e662127c0839', 'Project will be deleted');
			basicsWorkflowEventService.registerEvent('838b6d6949e64b9296896802cdab236b', 'Project Status will be changed to inactive');
		}]);

})(angular);
