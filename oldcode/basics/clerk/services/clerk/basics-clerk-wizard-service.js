(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name basics.clerk.services:basicsClerkSidebarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of clerk module
	 */
	angular.module('basics.clerk').factory('basicsClerkSidebarWizardService', ['platformSidebarWizardConfigService','basicsClerkMainService','platformSidebarWizardCommonTasksService',

		function (platformSidebarWizardConfigService, basicsClerkMainService, platformSidebarWizardCommonTasksService) {

			var service = {};

			var disableClerk;
			disableClerk = function disableClerk() {
				return platformSidebarWizardCommonTasksService.provideDisableInstance(basicsClerkMainService, 'Disable Clerk', 'basics.clerk.disableClerkTitle', 'FamilyName',
					'basics.clerk.disableClerkDone', 'basics.clerk.clerkAlreadyDisabled', 'clrk', 11);
			};
			service.disableClerk = disableClerk().fn;

			var enableClerk;
			enableClerk = function enableClerk() {
				return platformSidebarWizardCommonTasksService.provideEnableInstance(basicsClerkMainService, 'Enable Clerk', 'basics.clerk.enableClerkTitle', 'FamilyName',
					'basics.clerk.enableClerkDone', 'basics.clerk.clerkAlreadyEnabled', 'clrk', 12);
			};
			service.enableClerk = enableClerk().fn;

			var basicsWizardID = 'basicsClerkSidebarWizards';

			var basicsWizardConfig = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				cssClass: 'sidebarWizard',
				items: [{
					id: 1,
					text: 'Groupname',
					text$tr$: 'basics.clerk.wizardGroupname1',
					groupIconClass: 'sidebar-icons ico-wiz-change-status',
					visible: true,
					subitems: [
						disableClerk(),
						enableClerk()
					]
				}]
			};

			service.activate = function activate() {
				platformSidebarWizardConfigService.activateConfig(basicsWizardID, basicsWizardConfig);
			};

			service.deactivate = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(basicsWizardID);
			};

			return service;
		}

	]);
})(angular);
