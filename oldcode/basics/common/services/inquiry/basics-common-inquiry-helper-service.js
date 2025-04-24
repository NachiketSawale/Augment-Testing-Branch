/**
 * Created by wed on 05/27/2022.
 */

((angular) => {

	'use strict';

	angular.module('basics.common').factory('basicsCommonInquiryHelperService', [
		'mainViewService',
		'cloudDesktopSidebarService',
		'cloudDesktopSidebarInquiryService',
		(
			mainViewService,
			cloudDesktopSidebarService,
			cloudDesktopSidebarInquiryService
		) => {

			const activateProvider = (scope, includeAllButtons) => {
				cloudDesktopSidebarInquiryService.activateSidebarInquiryProvider(true);
				cloudDesktopSidebarInquiryService.handleInquiryToolbarButtons(scope, includeAllButtons);
			};

			const registerEnableInspector = (guid, dataService) => {

				if (mainViewService.getCurrentModuleName() !== dataService.getModule().name) {
					return;
				}

				cloudDesktopSidebarService.onOpenSidebar.register(cmd => {
					if (cmd === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().inquiry)) {
						cloudDesktopSidebarInquiryService.activateSidebarInquiryProvider(dataService.hasUsingContainer(guid));
					}
				});

				cloudDesktopSidebarService.onClosingSidebar.register(cmd => {
					if (cmd === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().inquiry)) {
						cloudDesktopSidebarInquiryService.activateSidebarInquiryProvider(true);
					}
				});

			};

			return {
				registerEnableInspector: registerEnableInspector,
				activateProvider: activateProvider
			};

		}]);
})(angular);