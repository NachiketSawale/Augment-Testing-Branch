/**
 * Created by lvy on 11/13/2018.
 */
(function (angular) {

	'use strict';
	let moduleName = 'businesspartner.contact';
	angular.module(moduleName).factory('businesspartnerContactPortalUserManagementWizardService', businesspartnerContactPortalUserManagementWizardService);

	businesspartnerContactPortalUserManagementWizardService.$inject = ['businesspartnerContactPortalUserManagementService', 'platformTranslateService', 'platformPermissionService', 'platformModalService'];

	function businesspartnerContactPortalUserManagementWizardService(businesspartnerContactPortalUserManagementService, platformTranslateService, platformPermissionService, platformModalService) {

		let service = {};
		service.portalUserManagement = portalUserManagement;

		platformTranslateService.registerModule(['businesspartner.contact', 'businesspartner.main']);

		return service;

		function portalUserManagement(param, userParam) {
			let portalUserManGuid = '825af4a1bfc649e69cd2cb5f9581024c';
			platformPermissionService.loadPermissions([portalUserManGuid]).then(function () {
				if (!platformPermissionService.hasWrite(portalUserManGuid) ||
					!platformPermissionService.hasRead(portalUserManGuid)) {
					platformModalService.showMsgBox('businesspartner.contact.noPermissionOfManagementPortalUser ', 'businesspartner.contact.noPermission', 'ico-info');
				} else {
					businesspartnerContactPortalUserManagementService.portalUserManagement(param, userParam);
				}

			});
		}
	}

})(angular);