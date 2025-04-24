(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'procurement.pes';
	angular.module(moduleName, ['model.main', 'model.evaluation']);
	globals.modules.push(moduleName);
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', 'resourceEquipmentConstantValues', 'boqMainSchemaService', function (platformSchemaService, resourceEquipmentConstantValues, boqMainSchemaService) {

						var schemas = _.concat([
							{typeName: 'PesHeaderDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'PesItemDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'PesShipmentinfoDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'PesBoqDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'PrcPackageEventDto', moduleSubModule: 'Procurement.Package'},
							{typeName: 'PesAccrualDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'PesSelfBillingDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'CommonBillingSchemaDto', moduleSubModule: 'Basics.BillingSchema'},
							{typeName: 'MaterialPriceConditionDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ActivityProgressReportDto', moduleSubModule: 'Scheduling.Main'},
							{typeName: 'HeaderPparamDto', moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'ControllingGrpSetDTLDto', moduleSubModule: 'Controlling.Structure'},
							{typeName: 'PrcPostconHistoryDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcItemdeliveryDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
							resourceEquipmentConstantValues.schemes.plantAllocation,
							{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
							{typeName: 'StockTotalVDto', moduleSubModule: 'Procurement.Stock'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'QtoDetailDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'PesTransactionDto', moduleSubModule: 'Procurement.Pes'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'PrcPackage2ExtBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PrcPackage2ExtBpContactDto', moduleSubModule:  'Procurement.Common'},
							{typeName: 'PrcItemDto', moduleSubModule: 'Procurement.Common'},
						], boqMainSchemaService.getSchemas());

						return platformSchemaService.getSchemas(schemas);
					}],

					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'businessPartnerMainSupplierLookup',
							'businessPartnerMainSupplierDialog']);
					}],
					'loadRoundingData': ['basicsCommonRoundingService',
						function (roundingService) {
							return roundingService.getService('basics.material').loadRounding();
						}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'procurementPesHeaderService',
						function (basicsCharacteristicDataServiceFactory, procurementPesHeaderService) {
							basicsCharacteristicDataServiceFactory.getService(procurementPesHeaderService, 20);
						}
					],
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
					}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'4eaa47c530984b87853c6f2e4e4fc67e',
							'f86aa473785b4625adcabc18dfde57ac'
						]);
					}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
				}
			};

			platformLayoutService.registerModule(options);
		}
	]
	).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
		'platformTranslateService', 'basicsWorkflowEventService', '_', 'platformSidebarWizardDefinitions',
		function ($injector, naviService, layoutService, wizardService, platformTranslateService, basicsWorkflowEventService,
			_, platformSidebarWizardDefinitions) {
			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('procurementPesHeaderService').doNavigate(item, triggerField);
				}
			});

			function wizardIsActivate() {
				var pesService = $injector.get('procurementPesHeaderService');
				return pesService.wizardIsActivate();
			}

			var wizardData = _.concat([{
				serviceName: 'procurementPesWizardService',
				wizardGuid: '2664f8902215459988cf49ca2fe27f6e',
				methodName: 'splitUrbItems',
				canActivate: wizardIsActivate
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: '9B77B8CA1A7044278A3E84FD95B8E2AF',
				methodName: 'changePesStatus',
				canActivate: true
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: '1126981C1F094D1591541DDA83F9874A',
				methodName: 'changeStatusForProjectDocument',
				canActivate: true
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: '9F7870C1CD524B9499A88EF7890A2239',
				methodName: 'changePesCode',
				canActivate: wizardIsActivate
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: 'B6714EF14F61412392F9361C2CFF79AD',
				methodName: 'editItemPrice',
				canActivate: true
			}, {
				serviceName: 'documentsProjectWizardService',
				wizardGuid: '17F3EDBD264C47D78312B5DE24EDF37A',
				methodName: 'uploadCx',
				canActivate: true
			}, {
				serviceName: 'documentsProjectWizardService',
				wizardGuid: '906F29A4FFCD4856B97CC8395EE39B21',
				methodName: 'linkCx',
				canActivate: true
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: '040B48CF1C1048EB8C610B96B1669D01',
				methodName: 'createTransaction',
				canActivate: true
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: '5d10029e6a6947caa6207b6f91f0e14a',
				methodName: 'updateQuantity',
				canActivate: true
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: '278289DCEB6241F18C2BDAA399C320EC',
				methodName: 'updateEstimate',
				canActivate: true
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: '397a4360629c4a098b131a751ad9e46d',
				methodName: 'createChangeOrderContract',
				canActivate: true
			},
			{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: 'c4bc7bbda6be430f8fbd607aaa02b820',
				methodName: 'createInvoice',
				canActivate: true
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: '7143b60f28a642eaae7f8acac57d2b2e',
				methodName: 'changeSelfBillingStatus',
				canActivate: true
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: 'ff24cc6ee5db424f983f49a5972aaf23',
				methodName: 'changeBoqHeaderStatus',
				canActivate: wizardIsActivate
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: '000114380A2F48D8B03075E758834F33',
				methodName: 'updateBoq',
				canActivate: wizardIsActivate
			}, {
					serviceName: 'procurementPesWizardService',
					wizardGuid: '4b90e4d28cc54009931fbfcc1fd4e42a',
					methodName: 'changeProjectChangeStatus',
					canActivate: wizardIsActivate
			},
			{
				serviceName: 'procurementPesWizardService',
				wizardGuid: '7b01d23693a6429fac42ee96245e8967',
				methodName: 'changeItemProjectChangeStatus',
				canActivate: wizardIsActivate
			},
			{
				serviceName: 'procurementPesWizardService',
				wizardGuid: '4a4782313679455595822a1ed0fffd9f', // bre: Does not work with '37b726a2ed9442f4ad3b39a858fe1509' as in all other modules. No idea why.
				methodName: 'boqExcelExport',
				canActivate: true
			},
			{
				serviceName: 'procurementPesWizardService',
				wizardGuid: '47f97220dda448f88e06e4ca0132aab5', // bre: Does not work with 'ed5100547c6349e68b7cf92f4030ff37' as in all other modules. No idea why.
				methodName: 'boqExcelImport',
				canActivate: wizardIsActivate
			}, {
				serviceName: 'procurementPesWizardService',
				wizardGuid: 'edf9d1e5bb0147e98e2d8a52bf44210f',
				methodName: 'updateTaxCode4Contract',
				canActivate: true
			},
			{
				serviceName: 'procurementPesWizardService',
				wizardGuid: '0f4ce29c449c441a8ee3598c1c03ad7a',
				methodName: 'createDeltaPes',
				canActivate: true
			},
			{
				serviceName: 'procurementPesWizardService',
				wizardGuid: '3b4102b88a177bdb6b1983b401ebbfc1',
				methodName: 'generateTransactions',
				canActivate: true
			},
			{
				serviceName: 'procurementPesWizardService',
				wizardGuid: 'dc502d4ddce94e778605377250053bdc',
				methodName: 'changeProcurementConfiguration',
				canActivate: true
			},
			{
				serviceName: 'procurementPesWizardService',
				wizardGuid: '71431bef70014b51b986e955d09c871e',
				methodName: 'pesItemExcelImport',
				canActivate: true
			}
			], platformSidebarWizardDefinitions.model.sets.default);
			wizardService.registerWizard(wizardData);

			platformTranslateService.registerModule(moduleName);
			basicsWorkflowEventService.registerEvent('26CB97B1DC2B49209828E9D01DE933F6', 'Receive Shipment');
			basicsWorkflowEventService.registerEvent('0F0173E0AF9946CBA3028000F9F3EB9F', 'iTWO Update PES Status');
			basicsWorkflowEventService.registerEvent('3324ffef53af4562bea5d1011e06d388', 'New Pes Created');
		}]);
})(angular);
