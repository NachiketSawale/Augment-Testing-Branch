(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'businesspartner.contact';

	angular.module(moduleName, []); // define a module.
	globals.modules.push(moduleName);

	/*
	 ** BusinessPartner Contact states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas(
							[
								{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
								{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
								{typeName: 'BusinessPartnerAssignmentDto', moduleSubModule: 'BusinessPartner.Contact'},
								{typeName: 'Contact2BasCompanyDto', moduleSubModule: 'BusinessPartner.Contact'},
								{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'Contact2ExtRoleDto', moduleSubModule: 'BusinessPartner.Contact'},
								{typeName: 'Contact2ExternalDto', moduleSubModule: 'BusinessPartner.Contact'}
							]
						);
					}],
					loadtranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'usermanagement.user'], true);
					}],
					loadServiceFunc: ['basicsConfigWizardSidebarService', function (basicsConfigWizardSidebarService) {
						let wizards = [];
						let wizardData = new basicsConfigWizardSidebarService.WizardData('usermanagementPortalWizardService', 'caf0bdff175249f9b4f259976ed5aba7', 'unlinkPortalUsers', true);
						wizards.push(wizardData);

						// rei@27.3.18
						let portalInvitationWizard = new basicsConfigWizardSidebarService.WizardData('usermanagementPortalInvitationWizardService', '24477e6a4a244fab888fd3913acc2f2e', 'inviteSelectedBidder', true);
						wizards.push(portalInvitationWizard);

						let portalUserManagementWizard = new basicsConfigWizardSidebarService.WizardData('businesspartnerContactPortalUserManagementWizardService', '825af4a1bfc649e69cd2cb5f9581024c', 'portalUserManagement', true, false ,{ContextType: 'contact'});
						wizards.push(portalUserManagementWizard);

						basicsConfigWizardSidebarService.registerWizard(wizards);
					}],
					'registerWizards': ['basicsConfigWizardSidebarService', function (wizardService) {
						let wizardData = [
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
								serviceName: 'businesspartnerContactWizardService',
								wizardGuid: '99c227deadf041468f18cea2bc28d626',
								methodName: 'disableRecord',
								canActivate: true
							}
						];
						wizardService.registerWizard(wizardData);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService',
		function ($injector, platformModuleNavigationService, basicsConfigWizardSidebarService) {
			platformModuleNavigationService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('businesspartnerContactDataService').registerNavi();
					platformModuleNavigationService.getNavFunctionByModule(moduleName)(item, triggerField);
				}
			});

			function wizardIsActivate(){
				let bpMainHeaderDataService=$injector.get('businesspartnerMainHeaderDataService');
				return bpMainHeaderDataService.wizardIsActivate();
			}
			let wizardData = [
				{
					serviceName: 'businesspartnerContactWizardService',
					wizardGuid: '23f1588d3b6e4840b9b374f6936521a5',
					methodName: 'enableRecord',
					canActivate: true
				}, {
					serviceName: 'businesspartnerContactWizardService',
					wizardGuid: '4366e141e4504e4da8c22ebede223232',
					methodName: 'reactivateOrInactivatePortalUser',
					canActivate: true
				}, {
					serviceName: 'businesspartnerContactWizardService',
					wizardGuid: 'ee14dbca8db34d0b9ea5b0575d46a1d6',
					methodName: 'maintainingOrphanedPortalRequest',
					canActivate: true
				},
				{
					serviceName: 'businesspartnerContactWizardService',
					wizardGuid: '2c476a42747548d6b7642e426d7a79cb',
					methodName: 'changeBpAssignmentStatus',
					canActivate: true
				},
				{
					serviceName: 'basicsUserFormFormDataWizardService',
					wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
					methodName: 'changeFormDataStatus',
					canActivate: true
				},
				{
					serviceName: 'businesspartnerContactWizardService',
					wizardGuid: '5692c3d374d94244bd872d6559e038d2',
					methodName: 'importVCF',
					canActivate: wizardIsActivate
				},
				{
					serviceName: 'businesspartnerContactWizardService',
					wizardGuid: '2d3a529369454d1e9e06bd057705737a',
					methodName: 'exportVCF',
					canActivate: wizardIsActivate
				}
			];
			basicsConfigWizardSidebarService.registerWizard(wizardData);
		}
	]);
})(angular, globals);