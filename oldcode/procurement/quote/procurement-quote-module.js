(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.quote';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'procurement.common',
		'procurement.requisition', 'basics.material', 'model.main', 'model.evaluation']);

	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'boqMainSchemaService', function (platformSchemaService, boqMainSchemaService) {

						platformSchemaService.initialize();

						var schemas = _.concat([ // where are all the schemas gone... ?
							{typeName: 'QuoteHeaderDto', moduleSubModule: 'Procurement.Quote'},
							{typeName: 'QuoteRequisitionDto', moduleSubModule: 'Procurement.Quote'},
							{typeName: 'PrcItemDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ReqTotalDto', moduleSubModule: 'Procurement.Requisition'},
							{typeName: 'PrcMilestoneDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcCertificateDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcGeneralsDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'MaterialPriceConditionDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'PrcHeaderblobDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcSubreferenceDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcContactDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcDocumentDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcBoqDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemdeliveryDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemblobDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
							// about Evaluation Dialog Editor
							{typeName: 'EvaluationDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'EvaluationItemDataDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'EvaluationGroupDataDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'EvaluationDocumentDto', moduleSubModule: 'BusinessPartner.Main'},
							// swith 'quote' to 'contract' module correctly after creating a contract (using wizard 'create contract') ,
							// we should load the dto schemas of contract module before search the eaxct new created 'contract'.
							{typeName: 'ConHeaderDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'ConTotalDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'ProjectDto', moduleSubModule: 'Project.Main'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'PrcPackageEventDto', moduleSubModule: 'Procurement.Package'},
							{typeName: 'PrcCallOffAgreementDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcMandatoryDeadlineDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'CertificateDto', moduleSubModule: 'BusinessPartner.Certificate'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'CommonBillingSchemaDto', moduleSubModule: 'Basics.BillingSchema'},
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
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'PrcWarrantyDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'HeaderPparamDto', moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower'},
							{typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'PrcPackage2ExtBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'GuarantorDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'MtgHeaderDto', moduleSubModule: 'Basics.Meeting'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PrcItemScopeDetailDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcPackage2ExtBpContactDto', moduleSubModule: 'Procurement.Common'},
						], boqMainSchemaService.getSchemas());

						return platformSchemaService.getSchemas(schemas);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'basics.import', 'basics.export'], true); // Excel-Import/Export
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'boqMainTextComplementCombobox',
							'boqMainCatalogAssignmentModeCombobox',
							'businessPartnerEvaluationSchemaIconCombobox',
							'businessPartnerMainSupplierLookup'
						]);
					}],
					'loadRoundingData': ['basicsCommonRoundingService',
						function (roundingService) {
							return roundingService.getService('basics.material').loadRounding();
						}],
					'registerWizards': ['basicsConfigWizardSidebarService', '_', 'platformSidebarWizardDefinitions', '$injector',
						function (wizardService, _, platformSidebarWizardDefinitions, $injector) {

							function wizardIsActivate() {
								var quoteService = $injector.get('procurementQuoteHeaderDataService');
								return quoteService.wizardIsActivate() && quoteService.wizardIsActivateForBidderStatus();
							}

							function wizardIsActivateForBidderStatus() {
								var quoteService = $injector.get('procurementQuoteHeaderDataService');
								return quoteService.wizardIsActivateForBidderStatus();
							}

							// warning for developer, if add new wizards. Should check wizardIsActivateForBidderStatus. It's for portal user limitation.defect 117246
							var wizardData = _.concat([{
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '9EE2683AFCAD489DB7759D5729115995',
								methodName: 'changeQuoteStatus',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'F0C6D8C3E9134353B7D666B975768844',
								methodName: 'changeQuoteCode',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '6CB200F83E68453588940F62A5D159CD',
								methodName: 'changeStatusForProjectDocument',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '0E863EAD7A404025A4ECF33E70D32FE1',
								methodName: 'increaseVersion',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'A00E0EBA926E45E89F22D6FE3EE8EC16',
								methodName: 'createContract',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '17497CA643DB4816A89431DC5F4E84F8',
								methodName: 'gaebImport',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'c7d8a77324014f9884189e1b5204d55d',
								methodName: 'gaebExport',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'dc1f30673d25402f8791e854962aef72',
								methodName: 'importOenOnlv',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '244e3ab2210a4f55a10f9561b8a63b89',
								methodName: 'exportOenOnlv',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '9D081876F42443F7974F6B3AD87C750D',
								methodName: 'importCrbSia',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'EC699403C11D4187BD0276E664E79FA5',
								methodName: 'exportCrbSia',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'a85708b3bbde4bdf91672a7236fa57ad',
								methodName: 'splitBoqDiscount',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '37b726a2ed9442f4ad3b39a858fe1509',
								methodName: 'BoqExcelExport',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'ed5100547c6349e68b7cf92f4030ff37',
								methodName: 'BoqExcelImport',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '9FBC7B786DFA48C48D35F447D4C62AB4',
								methodName: 'updateBoq',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'DA74A1A787914051982588B73F1A7AEE',
								methodName: 'insertMaterial',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '7AD20E1460C549A6BA0E958DE3365E7E',
								methodName: 'updateMaterial',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'aeffc96eb4a0440e8fd410272123bcbe',
								methodName: 'replaceNeutralMaterail',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '2E68C7D290D14A33A7B8067B1282A51B',
								methodName: 'removeItemQuantityValidation',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'C81A7F1742C94782BA871AB835C116CD',
								methodName: 'validateAndUpdateItemQuantity',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'documentsProjectWizardService',
								wizardGuid: '906F29A4FFCD4856B97CC8395EE39B21',
								methodName: 'linkCx',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'documentsProjectWizardService',
								wizardGuid: '17F3EDBD264C47D78312B5DE24EDF37A',
								methodName: 'uploadCx',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '99367140711048cb8bcdcb9863137fb3',
								methodName: 'createRequests',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: 'a63da5e93d0e46a096e282fe35f41357',
								methodName: 'selectGroups',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '6ba4aacb4e234d5ab5eaffca1b8141bf',
								methodName: 'selectPrcItemGroups',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '2f37b7e837914b2ba32084494ea270c5',
								methodName: 'createQuoteByMaterials',
								canActivate: wizardIsActivateForBidderStatus
							}, {
								serviceName: 'procurementQuoteWizardsService',
								wizardGuid: '47E5AD6FE05E4CC08D811F959C245F7B',
								methodName: 'updatePackage',
								canActivate: wizardIsActivateForBidderStatus
							},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'E2F10A34A19E48AC92581D28490FFFDB',
									methodName: 'updateEstimate',
									canActivate: wizardIsActivateForBidderStatus
								}, {
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: '36870396169B44618A70F2D55F7225F4',
									methodName: 'exportMaterial',
									canActivate: wizardIsActivateForBidderStatus
								}, {
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'E40F1327105C42B1AFBCAC543299246C',
									methodName: 'qtoExcelImport',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'd184de8c85954f739fa7f434963ad894',
									methodName: 'copyNewBoqItem',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'A635AA183C23407DBAEEA1329AFC782E',
									methodName: 'importMaterial',
									canActivate: wizardIsActivateForBidderStatus
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: '4626490160134270b69962eee026e817',
									methodName: 'scanBoq',
									canActivate: wizardIsActivateForBidderStatus
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: '1b7e4b0aa5be4618a7ae434c8a71c5c3',
									methodName: 'copyMaterialItem',
									canActivate: wizardIsActivateForBidderStatus
								}, {
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'b94b6e7468434e8d9dab70d81114a2bb',
									methodName: 'createAndImportBoqs',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'e53f5f7953154a6ea59f0bdd51b521f9',
									methodName: 'changeBoqHeaderStatus',
									canActivate: wizardIsActivate
								},

								{
									serviceName: 'basicsUserFormFormDataWizardService',
									wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
									methodName: 'changeFormDataStatus',
									canActivate: wizardIsActivateForBidderStatus
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: '8ce7655b8232447386ba0dcf8bcb3568',
									methodName: 'updateItemPrice',
									canActivate: wizardIsActivateForBidderStatus
								}, {
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'c9140fd45af64836812eaf1652e575c6',
									methodName: 'qtoItemExcelExport',
									canActivate: wizardIsActivateForBidderStatus
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'b92077cb28c3436aa8d5e0e584142f31',
									methodName: 'updateBoqPriceFromWic',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: '435b57201a4f41e799e0e2f2c93b641e',
									methodName: 'createWicFromBoq',
									canActivate: wizardIsActivateForBidderStatus
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: '9025c6ca12b749c98c62dbbf2a471ca6',
									methodName: 'updatePackageBoq',
									canActivate: true
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'fddb6c0113804137aeee684560dc2f5f',
									methodName: 'splitOverallDiscount',
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
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: 'c8a8844f626c45c0a8f095e1583168c3',
									methodName: 'changeProcurementConfiguration',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: '9ab20aeed39a4a7fa3f75f3bb3f56b22',
									methodName: 'createContact',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementQuoteWizardsService',
									wizardGuid: '574efbbd0cae4601b1eacca03373ebfa',
									methodName: 'materialItem',
									canActivate: wizardIsActivate
								}
							], platformSidebarWizardDefinitions.model.sets.default);
							wizardService.registerWizard(wizardData);

						}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],

				},
				permissions: [  // preload all special permission
					'66d294825531498283703efc92b84f6b'
				]
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsWorkflowEventService',
		function ($injector, naviService, basicsWorkflowEventService) {

			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					// use injector because Data-Services can not initialized in Run Phase -> too early
					$injector.get('procurementQuoteHeaderDataService').navigationCompleted(item, triggerField);
				}
			});

			basicsWorkflowEventService.registerEvent('131376ffbd344a41ae48b23262895b74', 'New Quote Created');

		}]);
})(angular);
