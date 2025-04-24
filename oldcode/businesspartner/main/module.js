(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'businesspartner.main';

	angular.module(moduleName, ['basics.workflow']);
	globals.modules.push(moduleName);

	let crefoPermissionDescriptorAddUpdateSingle = 'db75fac8500a42e185261eaf95ae946e';
	let crefoPermissionDescriptorUpdateMultiple = '55d7d07357f34cf18fb7b9d87b5e2181';

	/*
	 ** Business Partner Main states are defined in this config block.
	 */
	angular.module(moduleName)
		.config(['mainViewServiceProvider', '$compileProvider',
			function (mainViewServiceProvider, $compileProvider) {
				if ($compileProvider.aHrefSanitizationWhitelist) {
					$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|webcal|local|file|data|blob|callto|skype):/);
				}
				let options = {
					moduleName: moduleName,
					resolve: {
						loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
							return platformModuleEntityCreationConfigurationService.load(moduleName);
						}],
						loadDomains: ['platformSchemaService', function (platformSchemaService) {
							return platformSchemaService.getSchemas(
								[{typeName: 'RealEstateDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'BankDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
									{typeName: 'BusinessPartner2CompanyDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'CustomerDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'CustomerCompanyDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'SupplierCompanyDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'SupplierDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'ActivityDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'AgreementDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'CertificateDto', moduleSubModule: 'BusinessPartner.Certificate'},
									{typeName: 'Certificate2subsidiaryDto', moduleSubModule: 'BusinessPartner.Certificate'},
									{typeName: 'EvaluationDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'EvaluationItemDataDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'EvaluationGroupDataDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'EvaluationDocumentDto', moduleSubModule: 'BusinessPartner.Main'},
									{
										typeName: 'BusinessPartner2PrcStructureDto',
										moduleSubModule: 'BusinessPartner.Main'
									},
									{typeName: 'BusinessPartnerRelationDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
									{typeName: 'GuarantorDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'Bp2externalDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'GeneralsDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'Bp2controllinggroupDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'UpdaterequestDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower'},
									{typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower'},
									{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
									{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'CommunityDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'BusinessPartner2ExtRoleDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
									{typeName: 'RegionDto', moduleSubModule: 'BusinessPartner.Main'}
								]
							);
						}],
						loadLookup: ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'businessPartnerEvaluationSchemaIconCombobox'
							]);
						}],
						loadtranslation: ['platformTranslateService', function (platformTranslateService) {
							return platformTranslateService.registerModule([moduleName, 'usermanagement.user', 'businesspartner.contact'], true);
						}],
						loadBpDuplicateCheckEmail: ['businesspartnerMainHeaderDataService', function (businesspartnerMainHeaderDataService) {

							return businesspartnerMainHeaderDataService.getBpDuplicateCheckEmail();
						}],
						initDependentServices: ['basicsConfigWizardSidebarService', 'businesspartnerMainBeserveService', 'businesspartnerMainHeaderDataService',
							function (wizardSidebarService, businesspartnerMainBeserveService, businesspartnerMainHeaderDataService) {
								return businesspartnerMainBeserveService.initService().then(function () {

									let hasUpdateAcc = !businesspartnerMainBeserveService.hasAddUpdateAccess();
									let hasMultipleUpdateAcc = !businesspartnerMainBeserveService.hasMultipleUpdateAccess();

									let wizardData;
									let bpwizards = [];

									// function openBeDirectCreate(action, mainservice, singleSelection) {

									wizardData = new wizardSidebarService.WizardData('businesspartnerMainBeserveService',
										'6ae98efa1e6c4c1c9af9918b3eba1d4e', // beserve Create new Business Partner
										'openByWizard', true, hasUpdateAcc,
										new businesspartnerMainBeserveService.WizardConfigParams('add', businesspartnerMainHeaderDataService)
									);
									bpwizards.push(wizardData);

									wizardData = new wizardSidebarService.WizardData('businesspartnerMainBeserveService',
										'10453e3fb69747bd8739123bb763e9cc', // beserve Update selected Business Partner
										'openByWizard', true, hasUpdateAcc,
										new businesspartnerMainBeserveService.WizardConfigParams('update', businesspartnerMainHeaderDataService, true)
									);
									bpwizards.push(wizardData);

									wizardData = new wizardSidebarService.WizardData('businesspartnerMainBeserveService',
										'deb1a1aeb15e4b70bd196f966a5c2c31', // beserve Update all Business Partners
										'openByWizard', true, hasMultipleUpdateAcc,
										new businesspartnerMainBeserveService.WizardConfigParams('update', businesspartnerMainHeaderDataService, false)
									);

									bpwizards.push(wizardData);

									wizardData = new wizardSidebarService.WizardData('businesspartnerMainWizardService',
										'12f9d13b74d54c438dc7cc660743141e',
										'setCharacteristics', true, false, null
									);
									bpwizards.push(wizardData);

									wizardData = new wizardSidebarService.WizardData('basicsUserFormFormDataWizardService',
										'756badc830b74fdcbf6b6ddc3f92f7bd',
										'changeFormDataStatus', true, false, null
									);
									// not enabled bpwizards.push(wizardData);

									wizardData = new wizardSidebarService.WizardData('usermanagementPortalWizardService',
										'caf0bdff175249f9b4f259976ed5aba7',
										'unlinkPortalUsers', true
									);
									bpwizards.push(wizardData);

									// rei@27.3.18
									let portalInvitationWizard = new wizardSidebarService.WizardData('usermanagementPortalInvitationWizardService', '24477e6a4a244fab888fd3913acc2f2e', 'inviteSelectedBidder', true);
									bpwizards.push(portalInvitationWizard);

									// rei@08.nov.18
									let portalUserManagementWizard = new wizardSidebarService.WizardData('businesspartnerContactPortalUserManagementWizardService', '825af4a1bfc649e69cd2cb5f9581024c', 'portalUserManagement', true, false, {ContextType: 'bp'});
									bpwizards.push(portalUserManagementWizard);

									if (bpwizards.length > 0) { // completely disabled....??
										wizardSidebarService.registerWizard(bpwizards);
									}
								});
							}],

						// needed to install listener for parent-service create event (even when characteristic container ist not activated)
						initCharacteristicDataService: ['basicsCharacteristicDataServiceFactory', 'businesspartnerMainHeaderDataService',
							function (basicsCharacteristicDataServiceFactory, businesspartnerMainHeaderDataService) {
								basicsCharacteristicDataServiceFactory.getService(businesspartnerMainHeaderDataService, 2);
							}
						],
						'registerWizards': ['genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
							function registerWizards(layoutService, wizardService) {

								let wizardData = [{
									serviceName: 'businesspartnerMainWizardService',
									wizardGuid: '98561975d34b487c9930a5d6f3c06224',
									methodName: 'convertAddressGeoCoordinate',
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
								},
								{
									serviceName: 'businesspartnerMainWizardService',
									wizardGuid: '99c227deadf041468f18cea2bc28d626',
									methodName: 'disableContactRecord',
									canActivate: true
								},
								{
									serviceName: 'businesspartnerMainWizardService',
									wizardGuid: '538325604B524F328FDF436FB14F1FC8',
									methodName: 'changeCertificateStatus',
									canActivate: true
								},
								];
								wizardService.registerWizard(wizardData);

							}]
					},
					controller: 'businesspartnerMainController',
					permissions: [  // preload all special permission
						'3c5513a31ebd49c7a9e5ae0832b05ea0',
						'3dc98cfebf2f4540be90a255e6eb8b26',
						crefoPermissionDescriptorAddUpdateSingle,
						crefoPermissionDescriptorUpdateMultiple,
						'dcf7db231fd14eb085244f685e6a1fec'
					]
				};
				mainViewServiceProvider.registerModule(options);
			}
		]).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService', 'basicsWorkflowEventService',
			function ($injector, naviService, layoutService, wizardService, basicsWorkflowEventService) {
				naviService.registerNavigationEndpoint(
					{
						moduleName: moduleName,
						navFunc: function (item, triggerField) {
							$injector.get('businesspartnerMainHeaderDataService').registerNavi();
							naviService.getNavFunctionByModule(moduleName)(item, triggerField);
						},
						hide: function (entity) {
							if (!entity) {
								return true;
							}

							if (entity.IsHideBpNavWhenNull) {
								return !entity.BusinessPartnerFk;
							}

							return false;
						}
					}
				);

				let wizardData = [{
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '6955CBE78E4D4C82BF05C5E02E724975',
					methodName: 'disableRecord',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '4DAF5107170844148662915918557A29',
					methodName: 'enableRecord',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '882FA2CD388A48A6959A57EFA46BF0D8',
					methodName: 'changeBusinessPartnerStatus',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: 'E223080E105242DAA26AC5D82F74EC51',
					methodName: 'changeBusinessPartnerStatus2',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '68ea49dabf0940308445a6e61b00dd2b',
					methodName: 'changeEvaluationStatus',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '7BC7BEA27BAC4CD7AFE34B0225815820',
					methodName: 'changeSupplierStatus',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '630721CEFE87445D997B70BF88141489',
					methodName: 'changeCustomerStatus',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '6B38F8558C5B4E82BB200CF32B1B4906',
					methodName: 'changeStatusForProjectDocument',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '0263AC0B43CC49BDB5FAB95AD0A0ECBD',
					methodName: 'createRequests',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: 'D16588E4BECA49DD8CE69AAAB98DEF6C',
					methodName: 'importBusinessPartner',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '5D54F25179594897B0AF59765163DCB2',
					methodName: 'importBusinessPartnerContacts',
					canActivate: true
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
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '3edd8d7491ea4dc0b5cb3d135a17a55a',
					methodName: 'synContacts2ExService',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: 'b080e68aad044ffe88c21c112c8f4a51',
					methodName: 'reactivateOrInactivatePortalUser',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: 'ed0e1adf474740be938ca3ce183f1371',
					methodName: 'maintainingOrphanedPortalRequest',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '8c8066ad189742d8b5cd1f65f1891615',
					methodName: 'changeBpdBankStatus',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '16dcf3ac93a246539de9536aa3a207dc',
					methodName: 'checkVatNo',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: 'e647d7d0aa4e42a5a6306cbcc404d628',
					methodName: 'udpatePrcStructureFromQtnAndContract',
					canActivate: true
				}, {
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: 'e90013d33ed04a1a8c3d904f1a78a1c4',
					methodName: 'changeSubsidiaryStatus',
					canActivate: true
				},{
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '2453fc2e00964aed9e3680b3148e1e2a',
					methodName: 'changeBpCode',
					canActivate: true
				},
				{
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '5692c3d374d94244bd872d6559e038d2',
					methodName: 'importVCF',
					canActivate: true
				},
				{
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '2d3a529369454d1e9e06bd057705737a',
					methodName: 'exportVCF',
					canActivate: true
				},
				{
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '56d5fa5f8b464875bbe10c47736e1a16',
					methodName: 'changeCustomerCode',
					canActivate: true
				},
				{
					serviceName: 'businesspartnerMainWizardService',
					wizardGuid: '0fc27e104da243af9323d1c99edf56d2',
					methodName: 'changeSupplierCode',
					canActivate: true
				}
				];
				wizardService.registerWizard(wizardData);
				basicsWorkflowEventService.registerEvent('d31a06ce3d0c4ed9a1a861e017391f1c', 'New Business Partner Created');
			}]);

})(angular, globals);
