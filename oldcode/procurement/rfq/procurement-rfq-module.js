(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.rfq';

	angular.module(moduleName, ['ui.router', 'cloud.common', 'procurement.requisition', 'model.main',
		'model.evaluation']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'RfqHeaderDto', moduleSubModule: 'Procurement.RfQ'},
							{typeName: 'WorkflowApproversDto', moduleSubModule: 'Basics.Workflow' },
							{typeName: 'RfqBusinessPartnerDto', moduleSubModule: 'Procurement.RfQ'},
							{typeName: 'RfqRequisitionDto', moduleSubModule: 'Procurement.RfQ'},
							{typeName: 'RfqHeaderblobDto', moduleSubModule: 'Procurement.RfQ'},
							{typeName: 'PrcDocumentDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ReqTotalDto', moduleSubModule: 'Procurement.Requisition'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},

							{typeName: 'QuoteHeaderDto', moduleSubModule: 'Procurement.Quote'},
							{typeName: 'PrcPackageEventDto', moduleSubModule: 'Procurement.Package'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'RfqSendHistoryDto', moduleSubModule: 'Procurement.RfQ'},
							{typeName: 'PrcSuggestedBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'PrcHeaderblobDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'RfqBidderSettingDto', moduleSubModule: 'Procurement.RfQ'},
							{typeName: 'DataFormatDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.RfQ'},
							{typeName: 'SendRfqBoqInfoDto', moduleSubModule: 'Procurement.RfQ'},
							{typeName: 'RfqBusinessPartner2ContactDto', moduleSubModule: 'Procurement.RfQ'},
							{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'PrcPackage2ExtBidderDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'MtgHeaderDto', moduleSubModule: 'Basics.Meeting' },
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PrcPackage2ExtBpContactDto', moduleSubModule:  'Procurement.Common'},
						]);
					}],
					loadLookup: ['basicsLookupdataLookupDescriptorService',
						function (basicsLookupdataLookupDescriptorService) {
							return basicsLookupdataLookupDescriptorService.loadData('prcconfiguration');
						}],
					loadDirective: ['basicsLookupdataLookupDefinitionService',
						function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'businessPartnerMainSupplierLookup',
								'businessPartnerMainSupplierDialog'
							]);
						}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'procurementRfqMainService',
						function (basicsCharacteristicDataServiceFactory, procurementRfqMainService) {
							basicsCharacteristicDataServiceFactory.getService(procurementRfqMainService, 19);
						}
					],
					'registerWizards': ['basicsConfigWizardSidebarService', '_', 'platformSidebarWizardDefinitions', '$injector',
						function (wizardService, _, platformSidebarWizardDefinitions, $injector) {

							function wizardIsActivate() {
								var rfqService = $injector.get('procurementRfqMainService');
								return rfqService.wizardIsActivate();
							}

							var wizardData = _.concat([
								{ // added wizard rei@27.4.18
									serviceName: 'usermanagementPortalInvitationWizardService',
									wizardGuid: '24477e6a4a244fab888fd3913acc2f2e',
									methodName: 'inviteSelectedBidder',
									canActivate: true
								},
								{
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '8C835F6C71584346922221EB754B7944',
									methodName: 'changeRfqStatus',
									canActivate: true
								}, {
									serviceName: 'procurementRfqWizardService',
									wizardGuid: 'CF87FCC54D994DC686335BE18BF11140',
									methodName: 'changeRfqCode',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '6EF1C38241B942EF87323FA2FF4D9A60',
									methodName: 'changeBiddersStatus',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '939178BF1667474099A1144B0EB7912C',
									methodName: 'changeStatusForProjectDocument',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRfqWizardService',
									wizardGuid: 'B56A6F8B92EC4C8CAA2F1969C2B31A2E',
									methodName: 'enhanceBidderSearch',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '31A60545113340C2A65279E6D320F79F',
									methodName: 'findBidderFull',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '671FAA84A48F4358AC746B6151FFC7C2',
									methodName: 'sendEmail',
									canActivate: true
								}, {
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '7139324429664F87894621DE96B44F00',
									methodName: 'sendFax',
									canActivate: true
								}, {
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '44DFF0CAFB0649128B2A4717CF95FC20',
									methodName: 'createQuote',
									canActivate: true
								},
								{
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '4ECEB23126A642C99628D869243E3DE9',
									methodName: 'publishRfQ',
									canActivate: true
								},
								{
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '299E3BAB0A6D49E585F8F5EF00BE1972',
									methodName: 'importBidderQuote',
									canActivate: wizardIsActivate
								},
								{
									serviceName: 'procurementRfqWizardService',
									wizardGuid: 'e286c7686d82411eb5e65a1aefb4bb62',
									methodName: 'importBusinessPartner',
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
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '99d1567c83754ee9b178a4dc998fd225',
									methodName: 'changeBillingSchema',
									canActivate: wizardIsActivate
								}, {
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '2088a47f55f74e0982f7a6fbb5481273',
									methodName: 'changeProcurementConfiguration',
									canActivate: true
								},
								{
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '56cade6fdbff4f06a1cc8f6875358e6b',
									methodName: 'createBusinessPartner',
									canActivate: true
								},
								{
									serviceName: 'basicsUserFormFormDataWizardService',
									wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
									methodName: 'changeFormDataStatus',
									canActivate: true
								},
								{
									serviceName: 'procurementRfqWizardService',
									wizardGuid: '4CA70480D7DB495DB69C3AA13CFE91C7',
									methodName: 'sendRfqToSGTWO',
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
								}
							], platformSidebarWizardDefinitions.model.sets.default);
							wizardService.registerWizard(wizardData);

						}],
					'loadPermission': ['platformPermissionService', (platformPermissionService) => {
						const permissions = [
							'75dcd826c28746bf9b8bbbf80a1168e8',  // create bp in UI
							'a87a85389a804c92bdc67cd325ab0974'    // excute
						];
						return platformPermissionService.loadPermissions(permissions);
					}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService', 'basicsWorkflowEventService',
		'_', 'platformSidebarWizardDefinitions', 'platformTranslateService',
		function ($injector, naviService, layoutService, wizardService, basicsWorkflowEventService, _,
			platformSidebarWizardDefinitions, platformTranslateService) {
			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('procurementRfqMainService').navigationCompleted(item, triggerField);
				}
			});
			platformTranslateService.registerModule(moduleName);
			basicsWorkflowEventService.registerEvent('ad3efc9a802f41f79e974e3660865ed3', 'New Rfq Created');
		}]);

})(angular);
