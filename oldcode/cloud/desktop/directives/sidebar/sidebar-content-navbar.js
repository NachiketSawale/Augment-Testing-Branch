(function (angular) {
	'use strict';

	function cloudDesktopSidebarContentNavbar($templateCache) {
		return {
			restrict: 'A',
			// scope: true,
			scope: {
				option: '='
			},
			template: $templateCache.get('sidebar-content-navbar')
		};
	}

	cloudDesktopSidebarContentNavbar.$inject = ['$templateCache'];

	angular.module('cloud.desktop').directive('cloudDesktopSidebarContentNavbar', cloudDesktopSidebarContentNavbar);
})(angular);