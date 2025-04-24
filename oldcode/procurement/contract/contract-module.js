// / <reference path='../help/10_angular/angular.js' />

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/*
	 ** procurement.contract module is created.
	 */
	var moduleName = 'procurement.contract';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'platform', 'procurement.common',
		'basics.userform', 'model.main', 'model.evaluation']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider', // 'procurementContractHeaderDataService', 'reportingCloudService',
		function (platformLayoutService) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', 'boqMainSchemaService', function (platformSchemaService, boqMainSchemaService) {

						platformSchemaService.initialize();

						var schemas = _.concat([ // where are all the schemas gone... ?
							{typeName: 'ConHeaderDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'WorkflowApproversDto', moduleSubModule: 'Basics.Workflow'},
							{typeName: 'PesBoqDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'PrcMilestoneDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcPaymentScheduleDto', moduleSubModule: 'Procurement.Common'},
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
							{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'CertificateDto', moduleSubModule: 'BusinessPartner.Certificate'},
							{typeName: 'ProjectDto', moduleSubModule: 'Project.Main'},
							{typeName: 'MaterialPriceConditionDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'PrcPackageEventDto', moduleSubModule: 'Procurement.Package'},
							{typeName: 'PrcCallOffAgreementDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcMandatoryDeadlineDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'CommonBillingSchemaDto', moduleSubModule: 'Basics.BillingSchema'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ConAccountAssignmentDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'MaterialScopeDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'MaterialScopeDetailDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'MaterialScopeDtlBlobDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'EvaluationDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ConCrewDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'ConMasterRestrictionDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'PrcItemInfoBLDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'HeaderPparamDto', moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'ControllingGrpSetDTLDto', moduleSubModule: 'Controlling.Structure'},
							{typeName: 'EquipmentPlantDto', moduleSubModule: 'Resource.Equipment'},
							{typeName: 'PesHeaderDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'PesItemDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'ConAdvanceDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'PrcPostconHistoryDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcWarrantyDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'ConTransactionDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'ConHeaderApprovalDto', moduleSubModule: 'Procurement.Contract'},
							{typeName: 'Document2BasClerkDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'PrcPackage2ExtBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'MaterialCatalogDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'GuarantorDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'PrcItem2PlantDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PrcItemScopeDetailDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcPackage2ExtBpContactDto', moduleSubModule: 'Procurement.Common'},
						], boqMainSchemaService.getSchemas());

						return platformSchemaService.getSchemas(schemas);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load(['contractHeaderPurchaseOrdersCombobox',
							'boqMainTextComplementCombobox',
							'boqMainCatalogAssignmentModeCombobox',
							'businessPartnerMainSupplierLookup',
							'prcCommonWicCatBoqLookup']);
					}],
					'loadRoundingData': ['basicsCommonRoundingService',
						function (roundingService) {
							return roundingService.getService('basics.material').loadRounding();
						}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'procurementContractHeaderDataService',
						function (basicsCharacteristicDataServiceFactory, procurementContractHeaderDataService) {
							basicsCharacteristicDataServiceFactory.getService(procurementContractHeaderDataService, 8);
						}
					],
					'registerWizards': ['platformModalService', 'basicsConfigWizardSidebarService', '_', 'platformSidebarWizardDefinitions', '$injector', 'procurementContractHeaderDataService', 'basicsLookupdataLookupDescriptorService',
						function (platformModalService, wizardService, _, platformSidebarWizardDefinitions, $injector, headerDataService, basicsLookupdataLookupDescriptorService) {

							function wizardIsActivate() {
								var contractService = $injector.get('procurementContractHeaderDataService');
								return contractService.wizardIsActivate();
							}

							function checkHeaderSelected(isPopupWarning) {
								var hasSelection = headerDataService.hasSelection();
								if (!hasSelection && isPopupWarning) {
									platformModalService.showErrorBox('procurement.contract.selectedConract', 'procurement.contract.wizard.isActivateCaption');
								}
								return hasSelection;
							}

							function checkHeaderIsNotFramewrok(isPopupWarning) {
								var selection = headerDataService.getSelected();
								if (selection && selection.IsFramework && isPopupWarning) {
									platformModalService.showErrorBox('procurement.contract.frameworkContractNotSupported', 'procurement.contract.wizard.isActivateCaption');
								}
								return !selection.IsFramework;
							}

							function checkItemsOrBoQSelected() {
								var contractService = $injector.get('procurementContractHeaderDataService');
								var prcItemService = $injector.get('procurementCommonPrcItemDataService');
								var itemSel = prcItemService.getService().getSelected();

								var prcBoqMainService = $injector.get('prcBoqMainService');
								var procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
								prcBoqMainService = prcBoqMainService.getService(contractService);
								procurementCommonPrcBoqService = procurementCommonPrcBoqService.getService(contractService, prcBoqMainService);

								var boqSel = procurementCommonPrcBoqService.getSelected();
								if (!itemSel && !boqSel) {
									platformModalService.showErrorBox('procurement.contract.selectedItemOrBoq', 'procurement.contract.wizard.isActivateCaption');
								}
								return true;
							}

							function checkHeaderStatus(predicate, warningTpl) {
								var headers = headerDataService.getSelectedEntities(),
									result = true;
								_.each(headers, function (header) {
									result = result && predicate(header.ConStatusFk, header);
								});

								if (!result && warningTpl) {
									platformModalService.showErrorBox(warningTpl, 'procurement.contract.wizard.isActivateCaption');
								}

								return result;
							}

							var wizardData = _.concat([{
								serviceName: 'procurementContractWizardService',
								wizardGuid: '64B6DC1D061642B5B4BF088E5D3FFEB3',
								methodName: 'changeContractStatus',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '7C9F4FB2FE004BC79BD4923D6602FADB',
								methodName: 'changeContractCode',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '0F8F3825B6C54A779989FE3322865FA3',
								methodName: 'purchaseOrderChange',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'F5C4035971C74C4C87D2F5782F330308',
								methodName: 'rollBackPOChange',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'C6545D680F1B4647962B56F64CF69F57',
								methodName: 'changeStatusForItem',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '223B11196DA94407AE393291EB483F11',
								methodName: 'changeStatusForProjectDocument',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'CD057DAAC4584B22AFFDB7C6274CA7DD',
								methodName: 'createRequests',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'E3A1552CFE9F44B8B0E704306E0C6D66',
								methodName: 'setReportingDate',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'B594DBDE204F43DCA17B74CB8A0D7CD6',
								methodName: 'changeReportingDate',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'AB0B9C77BF454E99BDE3841E37E68246',
								methodName: 'gaebImport',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'CDF414586A8040A88DD47C1587A9ACC1',
								methodName: 'gaebExport',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'dc1f30673d25402f8791e854962aef72',
								methodName: 'importOenOnlv',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '244e3ab2210a4f55a10f9561b8a63b89',
								methodName: 'exportOenOnlv',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '4245B459FE9F46B18A278C3D59267F5F',
								methodName: 'importCrbSia',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '5FD4221E9CCD420D9F5A72240788BD6C',
								methodName: 'exportCrbSia',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '37b726a2ed9442f4ad3b39a858fe1509',
								methodName: 'boqExcelExport',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'ed5100547c6349e68b7cf92f4030ff37',
								methodName: 'BoqExcelImport',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'B2E3DB9E9B4E44DFBD1084C7B47B8239',
								methodName: 'renumberBoQ',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'C16819EBE1F64B68BAFC0AFF9998A604',
								methodName: 'updateBoq',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '7A891E16B8664B8EA0797EFC04859B6A',
								methodName: 'renumberFreeBoq',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '528a30ba026942ceba03f747566baa50',
								methodName: 'changeBoqHeaderStatus',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'D5E340E57C40456F87CA8E2618F54985',
								methodName: 'createBusinesspartnerEvaluation',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'E534A4395D434900901E96173638A3D5',
								methodName: 'exportMaterial',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '67CE23789D8D46DDA00D436F4FF41E38',
								methodName: 'insertMaterial',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '0868DD713BC149D69E70DE85D0500852',
								methodName: 'updateMaterial',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '207FCDAE9EAB4F6FA273C7B9E31241A7',
								methodName: 'removeItemQuantityValidation',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '5A4FC426E84843FBA130F3CB0944FFF2',
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
								serviceName: 'basicsUserFormFormDataWizardService',
								wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
								methodName: 'changeFormDataStatus',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'aeffc96eb4a0440e8fd410272123bcbe',
								methodName: 'replaceNeutralMaterail',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '512025851bc24e14b42148d6c518725d',
								methodName: 'updateItemPrice',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '6db2b9e49b124bed8be55ddf851fc06c',
								methodName: 'editCallOffPrice',
								canActivate: checkItemsOrBoQSelected
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '7216F38E41BB4822A341D9181931A635',
								methodName: 'updateEstimate',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'fd308c3dd8494cbabee281e8fa2d81c6',
								methodName: 'generateItemDeliverySchedule',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'd8007b5825b747d8af23eb7f6c339a4c',
								methodName: 'changeProcurementConfiguration',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '49D766E311424E2180DA755183535BFB',
								methodName: 'prcItemExcelImport',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '2664f8902215459988cf49ca2fe27f6e',
								methodName: 'splitUrbItems',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractPlantWizardService',
								wizardGuid: '0396f7865af14408a11c3a64ce4b3c5a',
								methodName: 'createPlantContract',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'c5433e7bc87f44239d68f54e2b2a0366',
								methodName: 'createPES',
								canActivate: function () {
									var conStatus = basicsLookupdataLookupDescriptorService.getData('ConStatus');
									var selectedEntity = headerDataService.getSelected();
									return checkHeaderSelected(true) && checkHeaderIsNotFramewrok(true) && checkHeaderStatus(function (status) {
										var statusInfo = conStatus[status];
										let configHeaderIsConsolidateChange = headerDataService.isConsolidateChange(selectedEntity);

										if (configHeaderIsConsolidateChange) {
											return true;
										} else {
											return statusInfo.IsInvoiced === false && statusInfo.Iscanceled === false && statusInfo.IsVirtual === false && statusInfo.IsDelivered === false && statusInfo.IsOrdered;
										}
									}, 'procurement.contract.wizard.isActiveMessage');
								}
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '5d038199d29d41b4be0ba27956824e10',
								methodName: 'generatePaymentSchedule',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '04cf1b2cd29141a1bb7ff885d0ab3f8f',
								methodName: 'maintainPaymentScheduleVersion',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'c0ce3e30b54e429b9995f8ecdf94f654',
								methodName: 'updatePaymentScheduleDOC',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '435b57201a4f41e799e0e2f2c93b641e',
								methodName: 'createWicFromBoq',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '4675ac1affdd46f98f1bc2a633cc16e1',
								methodName: 'createWicFromContract',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '05EE9CEA8E2241DDB670DFE187829770',
								methodName: 'sendOrder2Sgtwo',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'f6bb793bef1194a885df4f38df824b6a',
								methodName: 'generateTransactions',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'C29DD6F35A014C23ACE7468264A86469',
								methodName: 'formatBoQSpecification',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'a614b22000d14e01af5ffd6e4b3d9c5e',
								methodName: 'updatePackageBoq',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '5bc822ff12234ed69696fa438376643b',
								methodName: 'addIndexToBoqStructure',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: 'fddb6c0113804137aeee684560dc2f5f',
								methodName: 'splitOverallDiscount',
								canActivate: wizardIsActivate
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '00ee6a2d1c9f44ee992c8cac6ed8dcc1',
								methodName: 'contractTerminate',
								canActivate: true
							}, {
								serviceName: 'procurementContractWizardService',
								wizardGuid: '72d6de72869649b8b13c9b1c3123de8b',
								methodName: 'updateFrameworkMaterialCatalog',
								canActivate: true
							}, {
								serviceName: 'documentsCentralQueryWizardService',
								wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
								methodName: 'changeRubricCategory',
								canActivate: true,
								userParam: {
									'moduleName': moduleName
								}
							},
								{
									serviceName: 'procurementContractWizardService',
									wizardGuid: '93999c1751f246579476776ce1a92c27',
									methodName: 'changePaymentScheduleStatus',
									canActivate: true
								},
								{
									serviceName: 'procurementContractWizardService',
									wizardGuid: '6ba4aacb4e234d5ab5eaffca1b8141bf',
									methodName: 'selectPrcItemGroups',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementContractWizardService',
									wizardGuid: 'f8472d3a2a914d9fb0539f24cd9c2078',
									methodName: 'createContract',
									canActivate: true
								},
								{
									serviceName: 'procurementContractWizardService',
									wizardGuid: '43cfae8aab8e43948ada02bfa2757c4b',
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
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'4eaa47c530984b87853c6f2e4e4fc67e',
							'f86aa473785b4625adcabc18dfde57ac',
							'349f4683cd194ebb9af98026ec9a2126'
						]);
					}]

				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
		'platformTranslateService', 'basicsWorkflowEventService',
		function ($injector, naviService, layoutService, wizardService, platformTranslateService, basicsWorkflowEventService) {

			naviService.registerNavigationEndpoint(
				{
					moduleName: 'procurement.contract',
					navFunc: function () {
						// use injector because Data-Services can not initialized in Run Phase -> too early
						$injector.get('procurementContractHeaderDataService');
						naviService.getNavFunctionByModule('procurement.contract').apply(this, arguments);
					}
				}
			);

			platformTranslateService.registerModule(moduleName);
			basicsWorkflowEventService.registerEvent('A3A7509264C945EF9026FCD15A2B42BE', 'Receive PO response');
			basicsWorkflowEventService.registerEvent('E75FF701D8FE42A3BA7D130D072282CD', 'Send PO Change to YTWO');
			basicsWorkflowEventService.registerEvent('1c7afed033ef40f5b19c3b0f538e0b29', 'New Procurement-Contract Created');
		}]);
})(angular);

// trigger cruise test
