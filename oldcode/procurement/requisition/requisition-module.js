// / <reference path='../help/10_angular/angular.js' />

(function (angular) {
	'use strict';
	/* global _ */

	/*
	 ** procurement.requisition module is created.
	 */
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'procurement.requisition';
	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'platform', 'procurement.common',
		'model.main', 'model.evaluation']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			let options = {
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', 'boqMainSchemaService', function (platformSchemaService, boqMainSchemaService) {

						platformSchemaService.initialize();

						let schemas = _.concat([
							{typeName: 'ReqHeaderDto', moduleSubModule: 'Procurement.Requisition'}, // where are all the schemas gone... ?
							{typeName: 'PrcMilestoneDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcPaymentScheduleDto', moduleSubModule: 'Procurement.Common'},// todo:implement payment schedule
							{typeName: 'PrcGeneralsDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcCertificateDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcContactDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcSubreferenceDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcBoqDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemdeliveryDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ConTotalDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'PrcDocumentDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcHeaderblobDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemblobDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'MaterialPriceConditionDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ProjectDto', moduleSubModule: 'Project.Main'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'PrcPackageEventDto', moduleSubModule: 'Procurement.Package'},
							{typeName: 'PrcSuggestedBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'MaterialScopeDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'MaterialScopeDetailDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'MaterialScopeDtlBlobDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'HeaderPparamDto', moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'ControllingGrpSetDTLDto', moduleSubModule: 'Controlling.Structure'},
							{typeName: 'PrcWarrantyDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'PrcPackage2ExtBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ReqVariantDto', moduleSubModule: 'Procurement.Requisition'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PrcItemScopeDetailDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcPackage2ExtBpContactDto', moduleSubModule: 'Procurement.Common'},
						], boqMainSchemaService.getSchemas());

						return platformSchemaService.getSchemas(schemas);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'boqMainTextComplementCombobox',
							'boqMainCatalogAssignmentModeCombobox',
							'businessPartnerMainSupplierLookup',
							'prcCommonWicCatBoqLookup'
						]);
					}],
					'loadRoundingData': ['basicsCommonRoundingService',
						function (roundingService) {
							return roundingService.getService('basics.material').loadRounding();
						}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'procurementRequisitionHeaderDataService',
						function (basicsCharacteristicDataServiceFactory, procurementRequisitionHeaderDataService) {
							basicsCharacteristicDataServiceFactory.getService(procurementRequisitionHeaderDataService, 6);
						}
					],
					'registerWizards': ['basicsConfigWizardSidebarService', '_', 'platformSidebarWizardDefinitions', '$injector',
						function (wizardService, _, platformSidebarWizardDefinitions, $injector) {

							function wizardIsActivate() {
								let requisitionService = $injector.get('procurementRequisitionHeaderDataService');
								return requisitionService.wizardIsActivate();
							}

							let wizardData = _.concat([{
								serviceName: 'procurementRequisitionWizardService',
								wizardGuid: '73183DADB1CC42DE86E5096FCAA104D9',
								methodName: 'changeRequisitionStatus',
								canActivate: true
							}, {
								serviceName: 'procurementRequisitionWizardService',
								wizardGuid: '00E73BA3C4FF4A0EA3937E0A3A23557E',
								methodName: 'changeRequisitionCode',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementRequisitionWizardService',
								wizardGuid: 'D720F84B4F3B4E6C8857114579F4B87C',
								methodName: 'changeStatusForItem',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementRequisitionWizardService',
								wizardGuid: 'FFA3E8AA383B4545BB009E21BDE4E093',
								methodName: 'changeStatusForProjectDocument',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementRequisitionWizardService',
								wizardGuid: '265F575B21F44CF795D9981726CA2C4E',
								methodName: 'copyRequisition',
								canActivate: true
							}, {
								serviceName: 'procurementRequisitionWizardService',
								wizardGuid: 'B2362BEAF55143DA854DE65183C96008',
								methodName: 'createRequestForQuote',
								canActivate: true
							}, {
								serviceName: 'procurementRequisitionWizardService',
								wizardGuid: '768FA25553964048A02506EF8633C753',
								methodName: 'createContract',
								canActivate: true
							}, {
								serviceName: 'procurementRequisitionWizardService',
								wizardGuid: '8088A4A5339C47F98A5141C6FD825263',
								methodName: 'gaebImport',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementRequisitionWizardService',
								wizardGuid: '33a1b232b8a043108a0cdc6aadb4c8ef',
								methodName: 'changeProjectChangeStatus',
								canActivate: wizardIsActivate
							},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '93450fe8b46f44619a07dbdd3cebbaaa',
									methodName: 'changeItemProjectChangeStatus',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '2E7AA52E86994088859FCC7C6EA8E473',
									methodName: 'gaebExport',
									canActivate: true
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '7311c62101bf4b5d8fbcc127c9687409',
									methodName: 'importCrbSia',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '2A6FDB2D4CBA4959BAE6633AFEF819A2',
									methodName: 'exportCrbSia',
									canActivate: true
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'dc1f30673d25402f8791e854962aef72',
									methodName: 'importOenOnlv',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '244e3ab2210a4f55a10f9561b8a63b89',
									methodName: 'exportOenOnlv',
									canActivate: true
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '37b726a2ed9442f4ad3b39a858fe1509',
									methodName: 'BoqExcelExport',
									canActivate: true
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'ed5100547c6349e68b7cf92f4030ff37',
									methodName: 'BoqExcelImport',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '419D075767B54081A16AEFE4DEDDAE51',
									methodName: 'renumberBoQ',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '8C47CF6BBCDC4DE1B41036AA62D6FB16',
									methodName: 'renumberFreeBoq',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '6A1C3F09C9C749D485DA37EFC75E28C1',
									methodName: 'removeItemQuantityValidation',
									canActivate: true
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '9D4E158ABD704EE5A7C2F5F785F7C154',
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
										'parentService': 'procurementRequisitionHeaderDataService',
										'sectionId': 6,
										'moduleName': moduleName
									}
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '98FF979B631148FF95C7AB219CEA64FB',
									methodName: 'createBusinessPartner',
									canActivate: true
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'a63da5e93d0e46a096e282fe35f41357',
									methodName: 'selectGroups',
									canActivate: true
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '6ba4aacb4e234d5ab5eaffca1b8141bf',
									methodName: 'selectPrcItemGroups',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'aeffc96eb4a0440e8fd410272123bcbe',
									methodName: 'replaceNeutralMaterail',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '512025851bc24e14b42148d6c518725d',
									methodName: 'updateItemPrice',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'F34C028552F444929C25E0FC26B438E5',
									methodName: 'updateEstimate',
									canActivate: true
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'da93f00c36254d2b8894ebcae6eb8ecc',
									methodName: 'generateItemDeliverySchedule',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'f477bae385fb4ecb88e159fb741d2e95',
									methodName: 'changeProcurementConfiguration',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '4F82FC6E659C463F9376AA590E5B83F5',
									methodName: 'prcItemExcelImport',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'c909f50aab334f40a93f1ace51719835',
									methodName: 'prcItemExcelExport',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '4626490160134270b69962eee026e817',
									methodName: 'scanBoq',
									canActivate: true
								}, {
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'b94b6e7468434e8d9dab70d81114a2bb',
									methodName: 'createAndImportBoqs',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '21D8E45AB39E48278E85F88C252F354A',
									methodName: 'updateBoq',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '99079f5874eb440d960910870994e0e4',
									methodName: 'changeBoqHeaderStatus',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'basicsUserFormFormDataWizardService',
									wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
									methodName: 'changeFormDataStatus',
									canActivate: true
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '04d2c4698ca44fe5894270b7e5d250a1',
									methodName: 'resetServiceCatalogNo',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '30f788841b294de2964ba0c6875fa724',
									methodName: 'updatePackageBoq',
									canActivate: true
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'ae52d5d1062740ea8ce8877f9852ed01',
									methodName: 'updatePackageMaterial',
									canActivate: true
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '07935F935D7C47ED924047AE542C2743',
									methodName: 'exportMaterial',
									canActivate: true
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '6041BC98B68C46A69E8CCFC485B3D08E',
									methodName: 'importMaterial',
									canActivate: true
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'fddb6c0113804137aeee684560dc2f5f',
									methodName: 'splitOverallDiscount',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: 'B56A6F8B92EC4C8CAA2F1969C2B31A2E',
									methodName: 'enhanceBidderSearch',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'documentsCentralQueryWizardService',
									wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
									methodName: 'changeRubricCategory',
									canActivate: true,
									userParam: {
										'moduleName': moduleName
									}
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '8fbbd3a6337640a89a1535ec55704f96',
									methodName: 'changePaymentScheduleStatus',
									canActivate: true
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '49dcd95b05e34f3fa3260d8cedfbbb33',
									methodName: 'editBudget',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRequisitionWizardService',
									wizardGuid: '5fc75509bf6a46958ef583b5d2b69bef',
									methodName: 'materialItem',
									canActivate: wizardIsActivate
								}
							], platformSidebarWizardDefinitions.model.sets.default);
							wizardService.registerWizard(wizardData);
						}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'f86aa473785b4625adcabc18dfde57ac', 'c58d860ef43642c689c78986463557c1'
						]);
					}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
					'loadSystemOption': ['procurementRequisitionHeaderDataService', '$q', function (procurementRequisitionHeaderDataService, $q) {
						let loadArray = [];
						loadArray.push(procurementRequisitionHeaderDataService.syncGetBudgetEditingInProcurement());
						return $q.all(loadArray).then(function () {
							return true;
						});
					}]
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsWorkflowEventService', 'platformTranslateService',
		function ($injector, naviService, basicsWorkflowEventService, platformTranslateService) {

			naviService.registerNavigationEndpoint(
				{
					moduleName: 'procurement.requisition',
					navFunc: function (item, triggerField) {
						// use injector because Data-Services can not initialized in Run Phase -> too early
						$injector.get('procurementRequisitionHeaderDataService').navigationCompleted(item, triggerField);
					}
				}
			);

			platformTranslateService.registerModule(moduleName);
			basicsWorkflowEventService.registerEvent('eaf52741fbc245d48e9f5e889d8b0bbc', 'New Requisition Created');

		}]);
})(angular);
