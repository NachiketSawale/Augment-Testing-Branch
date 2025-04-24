(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.invoice';
	angular.module(moduleName, ['documents.project', 'model.main', 'model.evaluation']);
	globals.modules.push(moduleName);
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'InvHeaderDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'Inv2PESDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'InvOtherDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'InvRejectDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'Inv2ContractDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'InvGeneralsDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'InvHeader2InvHeaderDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'InvBillingSchemaDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'InvCertificateDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							// todo:modify to import invoice dto
							{typeName: 'InvInvoiceImportDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'InvPaymentDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'PrcPackageEventDto', moduleSubModule: 'Procurement.Package'},
							{typeName: 'InvValidationDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'InvTransactionDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'CertificateDto', moduleSubModule: 'BusinessPartner.Certificate'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'InvAccountAssignmentDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'EvaluationDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ControllingGrpSetDTLDto', moduleSubModule: 'Controlling.Structure'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'PrcPostconHistoryDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'StockTotalVDto', moduleSubModule: 'Procurement.Stock'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'PrcPackage2ExtBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'InvAccrualDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'InvSalesTaxCodeDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'InvSalesTaxDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'GuarantorDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ApprovalDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'InvTransactionIcDto', moduleSubModule: 'Procurement.Invoice'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PrcPackage2ExtBpContactDto', moduleSubModule:  'Procurement.Common'},
						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load(['businessPartnerMainSupplierLookup']);
					}],
					'loadRoundingData': ['basicsCommonRoundingService',
						function (roundingService) {
							return roundingService.getService('basics.material').loadRounding();
						}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'procurementInvoiceHeaderDataService',
						function (basicsCharacteristicDataServiceFactory, procurementInvoiceHeaderDataService) {
							basicsCharacteristicDataServiceFactory.getService(procurementInvoiceHeaderDataService, 21);
						}
					],
					'registerWizards': ['genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
						function registerWizards(layoutService, wizardService) {
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
						}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
				},
				'permissions': [  // preload all special permission
					'588c3f33c4914b3684e114cd9107b1c2',  // export right
					'fff687c5e6504738aeb9210177f8b495',
					'4eaa47c530984b87853c6f2e4e4fc67e'
				]
			};

			platformLayoutService.registerModule(options);
		}
	]
	).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
		'platformTranslateService', 'basicsWorkflowEventService', '_', 'platformSidebarWizardDefinitions',
		function ($injector, naviService, layoutService, wizardService, platformTranslateService, basicsWorkflowEventService,
			_, platformSidebarWizardDefinitions) {

			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (entity, triggerField) {
						// use injector because Data-Services can not initialized in Run Phase -> too early
						var invoiceService = $injector.get('procurementInvoiceHeaderDataService');
						invoiceService.readAndSelectHdr(entity, triggerField);
					}

				}
			);

			function wizardIsActivate() {
				var invoiceService = $injector.get('procurementInvoiceHeaderDataService');
				return invoiceService.wizardIsActivate();
			}

			var wizardData = _.concat([{
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: '6bfc42be60cf4609b7bd49241e8620ca',
				methodName: 'changeInvoiceStatus',
				canActivate: true
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: '5836A150CBC44FEA866796252E31A0A7',
				methodName: 'changeInvoiceCode',
				canActivate: wizardIsActivate
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: 'ffa084af1e144161b881781652d598e5',
				methodName: 'documentProjectDocumentsStatusChange',
				canActivate: wizardIsActivate
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: '7f778f251821476195b3afca4dc42a46',
				methodName: 'createRequests',
				canActivate: true
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: '90511f2c92e74fd48d7f8940ff066a13',
				methodName: 'businessPartnerEvaluation',
				canActivate: true
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: '02e8536a4f4c421ebf745c47a2cc9144',
				methodName: 'importInvoice',
				canActivate: true
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: 'BF121A948CE84727A09DC24C44FA5FB2',
				methodName: 'importXInvoice',
				canActivate: true
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: '2712084cd8154116a92182130659ee4e',
				methodName: 'changeProcurementConfiguration',
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
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: 'a9684f1e49f949118c739699723787bb',
				methodName: 'prepareTransaction',
				canActivate: true
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: 'e44ce0bd995a4ccda53f4a4c54992b7f',
				methodName: 'prepareTransactionForAll',
				canActivate: true
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: '2271ce3b69964321828ca0c6c201f312',
				methodName: 'createAccrualTransaction',
				canActivate: true
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: '997f83dac6e647a8a63197e8dcbc9457',
				methodName: 'forwardPeriousTotals',
				canActivate: true
			}, {
				serviceName: 'modelMainPropkeysBulkAssignmentWizardService',
				wizardGuid: '0232e6e17d9a447db41bd0d18eb91dbb',
				methodName: 'runWizard',
				canActivate: true
			},
			{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			}, {
				serviceName: 'procurementInvoiceWizardsService',
				wizardGuid: 'b97e0cc20bf648dd89786027260d4af6',
				methodName: 'createInterCompanyBill',
				canActivate: true
			}
			], platformSidebarWizardDefinitions.model.sets.default);
			wizardService.registerWizard(wizardData);

			platformTranslateService.registerModule([
				moduleName,
				'model.main',
				'model.simulation',
				'model.viewer',
				'model.wdeviewer'
			]);
			basicsWorkflowEventService.registerEvent('D266BEC80CC84F6FA0CDEDFB0E85926E', 'Receive Invoice');
			basicsWorkflowEventService.registerEvent('33d4c1fdfa7d4f27a32fc20004749e6c', 'New Invoice Created');
		}]);
})(angular);