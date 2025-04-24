/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	let moduleName = 'estimate.main';
	angular.module(moduleName, ['ui.router', 'estimate.project', 'project.main', 'project.costcodes', 'basics.costcodes', 'basics.lookupdata', 'basics.currency', 'basics.material', 'platform', 'project.material', 'model.evaluation', 'project.structures']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name estimate.main
	 * @description
	 * Module definition of the estimate module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformModuleInitialConfigurationService','platformSchemaService', function (platformModuleInitialConfigurationService,platformSchemaService) {

						var schemes = [
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'PrjEstRuleDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'EstColumnConfigDetailDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstLineItem2MdlObjectDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Bid'},
							{typeName: 'EstLineItemQuantityDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'BoqWic2assemblyDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'WicGroupDto', moduleSubModule: 'Boq.Wic'},
							{typeName: 'BoqHeaderDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'WicBoqDto', moduleSubModule: 'Boq.Wic'},
							{typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'BoqSplitQuantityDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'CrbBoqVariableDto', moduleSubModule: 'Boq.Main'},
							{typeName: 'EstLineItemSelStatementDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'ProjectPriceListDto', moduleSubModule: 'Project.CostCodes'},
							{typeName: 'ActivityDto', moduleSubModule: 'Scheduling.Main'},
							{typeName: 'EstLineItem2BoqMappingDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'CostGroupCatDto', moduleSubModule: 'Basics.CostGroups'},
							{typeName: 'EstRuleParamValueDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'InstanceHeaderDto', moduleSubModule: 'ConstructionSystem.Project'},
							{typeName: 'ModelDto', moduleSubModule: 'Model.Project'},
							{typeName: 'RiskRegisterDto', moduleSubModule: 'Basics.RiskRegister'},
							{typeName: 'RiskResourcesDto', moduleSubModule: 'Basics.RiskRegister'},
							{typeName: 'RiskRegisterImpactDto', moduleSubModule: 'Basics.RiskRegister'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower'},
							{typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower'},
							{typeName: 'EstLineItem2ActivityMappingDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstEscalationAmountDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Assemblies'},
							{typeName: 'EstLineItem2CostGroupMappingDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'PrjCostCodesDto', moduleSubModule: 'Project.CostCodes'},
							{typeName: 'UpdatePriceFromPriceListDto', moduleSubModule: 'Project.CostCodes'},
							{typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'},
							{typeName: 'ProjectCostCodesJobRateDto', moduleSubModule: 'Project.CostCodes'},
							{typeName: 'EstAllowanceDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstAllMarkup2costcodeDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'PrcItemAssignmentDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'Project2MdcMaterialPortionDto', moduleSubModule: 'Project.Material'},
							{typeName: 'MaterialPortionDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'EstPriceAdjustmentItemDataDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'EstAllowanceAreaDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstAllAreaBoqRangeDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstPlantListDto', moduleSubModule: 'Estimate.Main'}
						];
						return platformModuleInitialConfigurationService.load('Estimate.Main').then(function (modData) {
							return platformSchemaService.getSchemas(schemes.concat(modData.schemes));
						});
					}],
					'loadLookup': ['$injector', 'basicsLookupdataLookupDefinitionService',
						function ($injector, basicsLookupdataLookupDefinitionService) {
							$injector.get('basicsEstimateQuantityRelationIconService');
							return basicsLookupdataLookupDefinitionService.load([
								'estimateMainAssemblyTemplateLookup',
								'estimateRuleSequenceLookup',
								'estimateMainRiskCalculatorDistributionLookupCombobox',
								'estimateMainCostRiskLookup',
								'estimateMainPlantAssemblyDialog'
							]);
						}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'basics.userform'], true);
					}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'1dccc95e20e34480b54f0b345002eb59',
							'f86aa473785b4625adcabc18dfde57ac',
							'9eaa7843becc49f1af5b4b11e8fa09ee'
						]);
					}],
					'loadMasterDataFilter': ['estimateProjectRateBookConfigDataService', function (estimateProjectRateBookConfigDataService) {
						estimateProjectRateBookConfigDataService.setClearDataFlag(false);
						return estimateProjectRateBookConfigDataService.initData();
					}],
					'loadCharacteristics': ['estimateMainResourceCharacteristicsService', function (estimateMainResourceCharacteristicsService) {
						return estimateMainResourceCharacteristicsService.init();
					}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'estimateMainService',
						function (basicsCharacteristicDataServiceFactory, estimateMainService) {
							basicsCharacteristicDataServiceFactory.getService(estimateMainService, 27, null, 'EstHeaderFk');
						}
					],
					'initResCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'estimateMainResourceService',
						function (basicsCharacteristicDataServiceFactory, estimateMainResourceService) {
							basicsCharacteristicDataServiceFactory.getService(estimateMainResourceService, 33, null, 'EstHeaderFk', 'EstLineItemFk');
						}
					],
					'LoadEstLineItemPermission': ['estimateMainService', function (estimateMainService) {
						estimateMainService.loadPermissionByEstHeader();
					}],
					'initContext': ['salesCommonContextService',
						function (salesCommonContextService) {
							return salesCommonContextService.init();
						}
					],
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService', '_', 'platformSidebarWizardDefinitions',
		function ($injector, naviService, wizardService, _, platformSidebarWizardDefinitions) {
			// todo : d5bdb25a620f4688bef0be2b988e6f1e calculate rule/parameter
			let CreateWD = wizardService.WizardData;
			let wizardData = _.concat([
				new CreateWD('estimateMainSidebarWizardService', 'c950da1a3c504033b835dc19121d3d9d', 'updateBaseCost'),
				new CreateWD('estimateMainSidebarWizardService', '15BFD1DCCD0047D192974EE898608B63', 'updateCompositeAssemblyFromMasterData'),
				new CreateWD('estimateMainSidebarWizardService', '5F88640DD81E47FB8B8E39AB85F91007', 'updateItemsFromProject'),
				new CreateWD('estimateMainSidebarWizardService', 'EC55444CD68B4AE4ABDEE830C75E39AF', 'generateItemFromLeadingStructure'),
				new CreateWD('estimateMainSidebarWizardService', 'FA88384E41874AF58F335579051B75B5', 'updateLineItemQuantity'),
				new CreateWD('estimateMainSidebarWizardService', '58B2368111EA4F02A905C00A424E7CA9', 'createBidFromEstimate'),
				new CreateWD('estimateMainSidebarWizardService', 'c393bd3cedd84cbba9426adef4f52331', 'searchLineItems'),
				new CreateWD('estimateMainSidebarWizardService', '6e47e8abb9e74e1988f3db2129159c6a', 'updateActiviesQuantity'),
				new CreateWD('estimateMainSidebarWizardService', '47b13c6b62cc4d098e3d9ff9e0f3b453', 'generateSchedule'),
				new CreateWD('estimateMainSidebarWizardService', '693D1CF60AF842DA89F512F5DA7385F6', 'createMaterialPackage'),
				new CreateWD('estimateMainSidebarWizardService', 'A8DCD6350A4D4FBE98D6C7C424DBD17C', 'updateMaterialPackage'),
				new CreateWD('estimateMainCreateBoQPackageWizardService', 'DDB858E117F94087949479D18A6BEC72', 'createProcurementPackage'),
				new CreateWD('estimateMainSidebarWizardService', '56b028c6a72d4a43b454f0266e34529b', 'searchAssemblies'),
				new CreateWD('estimateMainSidebarWizardService', 'db5726f33a0b45e080e3c09f135865b7', 'replaceResource'),
				new CreateWD('estimateMainSidebarWizardService', 'ca387bd0f04649998784eb8735e388d5', 'modifyResource'),
				new CreateWD('estimateMainSidebarWizardService', '9c282d014cd243679fdb8d67a24972ec', 'splitBudget'),
				new CreateWD('estimateMainSidebarWizardService', 'd30595bb1fdb49549836fe84e95858db', 'generateBudget'),
				new CreateWD('estimateMainSidebarWizardService', 'b58fa6433a394d8eb4bd0fea311aeb9e', 'updateControllingBudget'),
				new CreateWD('estimateMainSplitLineItemWizardDialogService', '47b311cd62ae496095acdddaa0af2554', 'splitLineItem'),
				new CreateWD('estimateMainSidebarWizardService', '6688b1c3bc22441e9331bf212874438e', 'exportBc3'),
				new CreateWD('estimateMainSidebarWizardService', '89E7BF217FA243F5823C261999F104B8', 'generatePrjBoqFromLI'),
				new CreateWD('estimateMainSidebarWizardService', 'b6e18be8dc2d42959af05054e13a9a6d', 'removePackage'),
				new CreateWD('estimateMainAiWizardService', '89905325BDC44EDF92A4290A414FF098', 'lineItemsBoQAiMapping'),
				new CreateWD('estimateMainSidebarWizardService', '991fbe11918a45619223d8218f38e61d', 'updateRevenue'),
				new CreateWD('estimateMainSidebarWizardService', 'b30b50f0e1e14090af5f5f52e885d431', 'convertLineItemIntoAssembly'),
				new CreateWD('estimateMainSidebarWizardService', 'dd6de86e4193472987a98513b112fd32', 'removeEstimateRuleAssignments'),
				new CreateWD('estimateMainSidebarWizardService', '031654EF7031437393CF23F72AA5D904', 'GenerateBudgetsFromBM'),
				new CreateWD('estimateMainSidebarWizardService', 'F6723C3720A04822A824C059F274D5AC', 'uploadEstimateToBenchmark'),
				new CreateWD('estimateMainAiWizardService', 'F1072DEC2F134CF9866F318062C8B6BC', 'lineItemsActivityAiMapping'),
				new CreateWD('estimateMainSidebarWizardService', '7c1759d4e65c45ed845d799eb0a1ed34', 'updatePackageBoq'),
				new CreateWD('estimateMainSidebarWizardService', 'bc2b5d99cbd84a5f87d885007a4a125d', 'importRisks'),
				new CreateWD('estimateMainSidebarWizardService', 'c6644fd983b745cba1a38c7708877548', 'updateProjectBoqBudget'),
				new CreateWD('estimateMainAiWizardService', '3F9B5138794F4F6F7EB93E2A3A4DC478', 'lineItemsCostGroupAiMapping'),
				new CreateWD('estimateMainSidebarWizardService', '423b424a0a034fe781bb9dc550216f4e', 'generateEstimateFromBoq'),
				new CreateWD('estimateMainSidebarWizardService', 'afc51d1798fa42f8bd20d28e2c50ddb5', 'createResRequisitionFromLineItems'),
				new CreateWD('estimateMainSidebarWizardService', 'acc390c370c34fbbbfe02e393aea45fc', 'dissolveAssembly'),
				new CreateWD('estimateMainSidebarWizardService', '62d464354bf24d9dbb60a77c3d140f10', 'backWordCalculate'),
				new CreateWD('estimateMainSidebarWizardService', '38BB15491CE54B4E891115904F8E22B4', 'updateRulesDefinitionMaster'),
				new CreateWD('estimateMainSidebarWizardService', 'c76a6ff55e8749f0846d38ab3d6670fa', 'excelImport'),
				new CreateWD('estimateMainSidebarWizardService', '924f28e5218e4897b150a2e8f80eb426', 'excelExport')
			], platformSidebarWizardDefinitions.model.sets.default);

			wizardService.registerWizard(wizardData);

			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					let estimateMainService = $injector.get('estimateMainService');
					if (_.has(item, 'BidHeaderFk') && _.has(item, 'BidStatusFk')) {
						estimateMainService.navigateToLineItemFromBid(item, triggerField);
					} else if (triggerField === 'Ids' && typeof item.Ids === 'string'){
						$injector.get('estimateMainService').navigateToLineItemFromEstimate(item, triggerField);
					} else{
						estimateMainService.setSelectedPrjEstHeader (item);
						estimateMainService.navigateTo(item, triggerField);
					}
				}
			});

			naviService.registerNavigationEndpoint({
				moduleName: moduleName + '-line-item',
				navFunc: function (item, triggerField) {
					$injector.get('estimateMainService').navigateToLineItem(item, triggerField);
				}
			});

			naviService.registerNavigationEndpoint({
				moduleName: moduleName + '-line-item-from-scheduling',
				navFunc: function (item, triggerField) {
					$injector.get('estimateMainService').navigateToLineItemFromScheduling(item, triggerField);
				}
			});

			naviService.registerNavigationEndpoint({
				moduleName: moduleName + '-line-item-from-estimate',
				navFunc: function (item, triggerField) {
					$injector.get('estimateMainService').navigateToLineItemFromEstimate(item, triggerField);
				}
			});

			naviService.registerNavigationEndpoint({
				moduleName: moduleName + '-internal',
				navFunc: function (item, triggerField) {
					$injector.get('estimateMainService').navigateToInternalLineItem(item, triggerField);
				}
			});

			naviService.registerNavigationEndpoint({
				moduleName: moduleName + '-line-item-from-boq',
				navFunc: function (boqItem, projectId) {
					$injector.get('estimateMainService').navigateToLineItemFromBoq(boqItem, projectId);
				}
			});

		}]);



})();
