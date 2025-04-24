/**
 * Created by sandu on 26.08.2015.
 */
(function (angular, globals) {
	'use strict';

	var moduleName = 'usermanagement.user';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'UserDto', moduleSubModule: 'UserManagement.Main'},
							{typeName: 'AccessUser2GroupDto', moduleSubModule: 'UserManagement.Main'},
							{typeName: 'JobDto', moduleSubModule: 'Services.Scheduler'}
						]);
					}],
					'loadTranslation': ['platformTranslateService', 'usermanagementUserStateValues', 'usermanagementUserLogStateValues', function (platformTranslateService, usermanagementUserStateValues, usermanagementUserLogStateValues) {
						return platformTranslateService.registerModule([moduleName, 'usermanagement.group','usermanagement.main', 'businesspartner.main','businesspartner.contact'], true)
							.then(function () {
								platformTranslateService.translateObject(usermanagementUserStateValues, ['description']);
								platformTranslateService.translateObject(usermanagementUserLogStateValues, ['description']);

								return true;
							});
					}],
					loadServiceFunc: ['basicsConfigWizardSidebarService', function (basicsConfigWizardSidebarService) {
						var wizards = [];
						var wizardData = new basicsConfigWizardSidebarService.WizardData('usermanagementPortalWizardService', 'caf0bdff175249f9b4f259976ed5aba7', 'unlinkPortalUsers', true
						);
						wizards.push(wizardData);
						// rei@27.3.18
						var portalInvitationWizard = new basicsConfigWizardSidebarService.WizardData('usermanagementPortalInvitationWizardService', '24477e6a4a244fab888fd3913acc2f2e', 'inviteSelectedBidder', true);
						wizards.push(portalInvitationWizard);

						// rei@08.nov.18
						var portalUserManagementWizard = new basicsConfigWizardSidebarService.WizardData('businesspartnerContactPortalUserManagementWizardService', '825af4a1bfc649e69cd2cb5f9581024c', 'portalUserManagement',
							true, false, {ContextType: 'user'});
						wizards.push(portalUserManagementWizard);

						// aljami@25.04.2022
						let disableUsersWizard = new basicsConfigWizardSidebarService.WizardData('usermanagementWizardService', '56904e526e174ad3a7bf9efdc75f6f93', 'showBulkDisableWizard', true);
						wizards.push(disableUsersWizard);

						basicsConfigWizardSidebarService.registerWizard(wizards);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}]);

})(angular, globals);
