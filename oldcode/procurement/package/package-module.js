// / <reference path='../help/10_angular/angular.js' />

(function (angular) {
	'use strict';
	/* global _ */

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/*
	 ** procurement.package module is created.
	 */
	var moduleName = 'procurement.package';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'platform', 'procurement.common',
		'model.main', 'model.evaluation']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', 'boqMainSchemaService', function (platformSchemaService, boqMainSchemaService) {

						platformSchemaService.initialize();
						var moduleSubModule = 'Procurement.Package';
						var schemas = _.concat([
							{typeName: 'PrcPackageDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcPackageEventDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcPackage2HeaderDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcPackage2ExtBpContactDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ConTotalDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstHeaderDto', moduleSubModule: 'Estimate.Main'},
							// { typeName: 'ReqHeaderDto', moduleSubModule: 'Procurement.Requisition'}, // where are all the schemas gone... ?
							{typeName: 'PrcMilestoneDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcPaymentScheduleDto', moduleSubModule: 'Procurement.Common'},// todo:the paymentSchedule in package will be implemented latter
							{typeName: 'PrcGeneralsDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcCertificateDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcBoqDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemdeliveryDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemblobDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'MaterialPriceConditionDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'PrcPackageImportDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcHeaderblobDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemblobDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcDocumentDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcContactDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcSubreferenceDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
							// { typeName: 'ProjectDto', moduleSubModule: 'Project.Main'}
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'CashProjectionDetailDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'AssetMasterDto', moduleSubModule: 'Basics.AssetMaster'},
							{typeName: 'PrcSuggestedBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'PrcItemAssignmentDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PrcItemAIMappingDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'AIUpdateMaterialDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'MaterialScopeDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'MaterialScopeDetailDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'MaterialScopeDtlBlobDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'PrcItemInfoBLDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'HeaderPparamDto', moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'ControllingGrpSetDTLDto', moduleSubModule: 'Controlling.Structure'},
							{typeName: 'PrcWarrantyDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
							{typeName: 'QtoDetailDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'PrcPacMasterRestrictionDto', moduleSubModule: moduleSubModule},
							{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'PrcPackage2ExtBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'StatusHistoryDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PrcItemScopeDetailDto', moduleSubModule: 'Procurement.Common'}
						], boqMainSchemaService.getSchemas());

						return platformSchemaService.getSchemas(schemas);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'boqMainTextComplementCombobox',
							'boqMainCatalogAssignmentModeCombobox',
							'prcCommonUpdatePriceListLookup',
							'procurementPackageBaselinePhaseLookup',
							'businessPartnerMainSupplierLookup']);
					}],
					'loadRoundingData': ['basicsCommonRoundingService',
						function (roundingService) {
							return roundingService.getService('basics.material').loadRounding();
						}],
					'loadSystemOption': ['procurementPackageDataService', '$q', function (procurementPackageDataService, $q) {
						var loadArray = [];
						loadArray.push(procurementPackageDataService.isShowPackageAutoUpdateMessagebox());
						loadArray.push(procurementPackageDataService.syncGetBudgetEditingInProcurement());
						loadArray.push(procurementPackageDataService.asyncProtectContractedPackageItemAssignment());
						return $q.all(loadArray).then(function () {
							return true;
						});
					}],
					'loadEvents': ['procurementPackageEventTypeDataCacheService', function (eventTypeDataCacheService) {
						// load all event types by default. also use for dynamic columns in package header
						eventTypeDataCacheService.load();
					}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'procurementPackageDataService',
						function (basicsCharacteristicDataServiceFactory, procurementPackageDataService) {
							basicsCharacteristicDataServiceFactory.getService(procurementPackageDataService, 18);
						}
					],
					'registerWizards': ['basicsConfigWizardSidebarService', '_', 'platformSidebarWizardDefinitions', '$injector',
						function (wizardService, _, platformSidebarWizardDefinitions, $injector) {

							function wizardIsActivate() {
								var packageService = $injector.get('procurementPackageDataService');
								return packageService.wizardIsActivate();
							}

							var wizardData = _.concat([{
								serviceName: 'procurementPackageWizardService',
								wizardGuid: '4402C87F9A4241668790348E622EFE0A',
								methodName: 'changePackageStatus',
								canActivate: true
							},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'AC5977DA40644F7983C412C940A30FA4',
									methodName: 'changeStatusForItem',
									canActivate: wizardIsActivate

								},
								{
									serviceName: 'basicsUserFormFormDataWizardService',
									wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
									methodName: 'changeFormDataStatus',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '1B5247705BFF4AE2861DA35CE8C85DA9',
									methodName: 'changeStatusForProjectDocument',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'C9A74A2D880A4AEAA0F8D3E20EA717F8',
									methodName: 'changePackageCode',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '649DA26570884F7BB05185F30DEE3803',
									methodName: 'disableRecord',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '35BA6203DDCC4C66A4B22745735CF831',
									methodName: 'enableRecord',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'RT87K87TKBC643E5A57E9AFE3B5D92F0',
									methodName: 'packageItemMaterialAiAddition',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '8C6580ACD7B847799E9C328134C20092',
									methodName: 'gaebImport',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '37b726a2ed9442f4ad3b39a858fe1509',
									methodName: 'BoqExcelExport',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'ed5100547c6349e68b7cf92f4030ff37',
									methodName: 'BoqExcelImport',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '31A60545113340C2A65279E6D320F79F',
									methodName: 'findBidderFull',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'B56A6F8B92EC4C8CAA2F1969C2B31A2E',
									methodName: 'enhanceBidderSearch',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'C9DC41BC1C9042D4AFAE866D1AE3BAC0',
									methodName: 'gaebExport',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '4b0b8a7e48dc468e85544d938892cc08',
									methodName: 'importCrbSia',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'dc1f30673d25402f8791e854962aef72',
									methodName: 'importOenOnlv',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '244e3ab2210a4f55a10f9561b8a63b89',
									methodName: 'exportOenOnlv',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '47f9fee2310f4ad6849dbde1846ac968',
									methodName: 'changeBoqHeaderStatus',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '825379499fb143fba4ebb74785cab2ff',
									methodName: 'changeProjectChangeStatus',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '91d0114072874929a8847b7e12be5ce9',
									methodName: 'changeItemProjectChangeStatus',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'AA306CFEACA045B7911A1E9FECE961F9',
									methodName: 'exportCrbSia',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '4DD99C7E9C624061B48A21092B2492D8',
									methodName: 'renumberBoq',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '1877D6FF14734192A8C08DF142B27BBF',
									methodName: 'generateItems',
									canActivate: wizardIsActivate,
									isHidden: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '30FB687E677240B0BF627A57B908381F',
									methodName: 'createRequisition',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '1318B8CDAC2348FDB75168138E67459E',
									methodName: 'createContract',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'F997D891A0CD4F70A258122CB1B9CE11',
									methodName: 'evaluateEvents',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '11C953BC997B485491E278D316AC3BDC',
									methodName: 'updateScheduling',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '7712428A4CF140868FDF7682E386E0C4',
									methodName: 'updateDate',
									canActivate: wizardIsActivate
								},/* {
								 serviceName: 'procurementPackageWizardService',
								 wizardGuid: 'CED661A3042A4376A02EC07643F54921',
								 methodName: 'changeStructure',
								 canActivate: true
								 }, */{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'BF6E907287014CD58117C2215136FD55',
									methodName: 'createPackage',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '254C1C7B5CDF4B69836D328CD5BF75ED',
									methodName: 'updateEstimate',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '232D6F1C4064443381C20C0ABB7B0159',
									methodName: 'packageImport',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '06DF485C64004B658E417488EA8A64B8',
									methodName: 'renumberFreeBoq',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '5CD6D6953FFF45B0BEB1C212ACD50C8D',
									methodName: 'updateCashFlowProjection',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '32D9BB1FBA3F4C3E9E122672F3B65904',
									methodName: 'removeItemQuantityValidation',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '74C83273787F45B5A96D6E492531C15B',
									methodName: 'validateAndUpdateItemQuantity',
									canActivate: wizardIsActivate
								}, {
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
									serviceName: 'basicsCharacteristicBulkEditorService',
									wizardGuid: '12f9d13b74d54c438dc7cc660743141e',
									methodName: 'showEditor',
									canActivate: wizardIsActivate,
									userParam: {
										'parentService': 'procurementPackageDataService',
										'sectionId': 18,
										'moduleName': moduleName
									}
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'F7840514CE1C42D0BB0448B404E1AE25',
									methodName: 'createBusinessPartner',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'a63da5e93d0e46a096e282fe35f41357',
									methodName: 'selectGroups',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '6ba4aacb4e234d5ab5eaffca1b8141bf',
									methodName: 'selectPrcItemGroups',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '66c358a92af74007af06325899ed5d08',
									methodName: 'selectItemScopeReplacement',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'aeffc96eb4a0440e8fd410272123bcbe',
									methodName: 'replaceNeutralMaterail',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '512025851bc24e14b42148d6c518725d',
									methodName: 'updateItemPrice',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '64f10026e7ad407c9a929a0703e2ddce',
									methodName: 'generateItemDeliverySchedule',
									canActivate: wizardIsActivate

								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '0DE63C4D7910476E87A522AA0C3D3669',
									methodName: 'sendPackagetoYtwo',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '7e3ce3d2620c4686a6028c571c06eae1',
									methodName: 'changeProcurementConfiguration',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '9D1A371828C14B06954F6AAFA4DAFCD4',
									methodName: 'prcItemExcelImport',
									canActivate: true
								},

								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'c909f50aab334f40a93f1ace51719835',
									methodName: 'prcItemExcelExport',
									canActivate: true
								},

								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '2D8338391BC643E5A57E9AFE3B5D92F0',
									methodName: 'packageItemMaterialAiAlternatives',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '4626490160134270b69962eee026e817',
									methodName: 'scanBoq',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'b94b6e7468434e8d9dab70d81114a2bb',
									methodName: 'createAndImportBoqs',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'D900F95910B946AC9BED7B70B477FC27',
									methodName: 'updateBoq',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '8747E866890448B495422D1887554C25',
									methodName: 'eraseEmptyDivisions',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'D189FB8DB8E14B559AE332BF121D0006',
									methodName: 'exportMaterial',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '6763C5F340CE4AE6BAEDE306A550DA37',
									methodName: 'importMaterial',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '04d2c4698ca44fe5894270b7e5d250a1',
									methodName: 'resetServiceCatalogNo',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'C29DD6F35A014C23ACE7468264A86469',
									methodName: 'formatBoQSpecification',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'fddb6c0113804137aeee684560dc2f5f',
									methodName: 'splitOverallDiscount',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '4f7c3463682c48e9bd91c2212a61cad8',
									methodName: 'copyUnitRateToBudgetUnit',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'a21dff2ca09546f9aa967ebef2d1d569',
									methodName: 'updateVersionBoq',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '73a3fb7368404722af2a05eb34ced437',
									methodName: 'createRfq',
									canActivate: true
								},
								{
									serviceName: 'procurementPackageWizardService',
									wizardGuid: 'a8a481250b7d4897abac5dd1375ac338',
									methodName: 'boqScopeReplacement',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'documentsCentralQueryWizardService',
									wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
									methodName: 'changeRubricCategory',
									canActivate: true,
									userParam: {
										'moduleName': moduleName
									}
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '5a614609167649ba98426b3067bdfc3f',
									methodName: 'generatePaymentSchedule',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '73eaa0d7e3ec46b5ac08dc6ca38db5bc',
									methodName: 'maintainPaymentScheduleVersion',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '7ac5c6fee61e42248804b77bfd1660ca',
									methodName: 'changePaymentScheduleStatus',
									canActivate: true
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '79714877d45b42a6b9cbbbd8ea7bb23d',
									methodName: 'renumberItem',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '49dcd95b05e34f3fa3260d8cedfbbb32',
									methodName: 'editBudget',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementPackageWizardService',
									wizardGuid: '367902d82fab4f42b6393382f4600271',
									methodName: 'materialItem',
									canActivate: wizardIsActivate
								}
							], platformSidebarWizardDefinitions.model.sets.default);
							wizardService.registerWizard(wizardData);
						}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'f86aa473785b4625adcabc18dfde57ac', '961ec511c2be495fbf227474555a240e'
						]);
					}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
				},
				'permissions': [  // preload all special permission
					'40af135e208349168b8ac5f330a09500'  // export right
				]
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService', 'basicsWorkflowEventService', 'platformTranslateService',
		function ($injector, naviService, layoutService, wizardService, basicsWorkflowEventService, platformTranslateService) {

			naviService.registerNavigationEndpoint(
				{
					moduleName: 'procurement.package',
					navFunc: function () {
						// use injector because Data-Services can not initialized in Run Phase -> too early
						// $injector.get('procurementPackageDataService');
						naviService.getNavFunctionByModule('procurement.package').apply(this, arguments);
					}

				}
			);

			naviService.registerNavigationEndpoint(
				{
					moduleName: 'iTWO 5D Material Purchase or Subcontractor Package',
					externalEntityParam: 'Code',
					interfaceId: 'procurement.package',
					hide: function (entity) {
						return !entity.BaselinePath;
					}
				}
			);

			platformTranslateService.registerModule(moduleName);
			basicsWorkflowEventService.registerEvent('B6CF8D63992A4F56B1EEB7B2C48AA142', 'Send Packages to YTWO');
			basicsWorkflowEventService.registerEvent('5d7491e33e9142f08534286a558185b2', 'New Package Created');
		}]);
})(angular);