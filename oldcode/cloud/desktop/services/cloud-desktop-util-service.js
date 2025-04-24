(function () {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopUtilService', cloudDesktopUtilService);

	cloudDesktopUtilService.$inject = ['$state', 'cloudDesktopSidebarService'];

	function cloudDesktopUtilService($state, cloudDesktopSidebarService) {

		/**
		 * The function calls a URL for the HOME link.
		 */
		function goHomeLink() {
			// close sidebar
			cloudDesktopSidebarService.onCloseSidebar.fire(false);
			// forward to HOME link
			$state.transitionTo(globals.defaultState + '.desktop');
		}

		return {
			goHomeLink: goHomeLink
		};
	}
})();