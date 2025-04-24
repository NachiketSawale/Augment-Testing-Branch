/**
 * Created by anl on 4/25/2017.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name resourceMasterSideBarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of resourceMaster module
	 */

	var moduleName = 'resource.master';
	angular.module(moduleName).factory('resourceMasterSideBarWizardService', ResourceMasterWizardService);

	ResourceMasterWizardService.$inject = ['platformSidebarWizardConfigService', 'resourceMasterMainService',
		'platformSidebarWizardCommonTasksService'];

	function ResourceMasterWizardService(platformSidebarWizardConfigService, resourceMasterMainService,
	                                     platformSidebarWizardCommonTasksService) {

		var service = {};

		var disableResource = function disableResource() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(resourceMasterMainService, 'Disable Resource',
				'resource.master.disableResourceTitle', 'Code',
				'resource.master.disableResourceDone', 'resource.master.resourceAlreadyDisabled', 'res', 11);
		};
		service.disableResource = disableResource().fn;

		var enableResource = function enableResource() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(resourceMasterMainService, 'Enable Resource',
				'resource.master.enableResourceTitle', 'Code',
				'resource.master.enableResourceDone', 'resource.master.resourceAlreadyEnabled', 'res', 12);
		};
		service.enableResource = enableResource().fn;

		var basicsWizardID = 'resourceMasterSidebarWizards';

		var basicsWizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'resource.master.wizardGroupname1',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: [
					disableResource(),
					enableResource()
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

})(angular);
