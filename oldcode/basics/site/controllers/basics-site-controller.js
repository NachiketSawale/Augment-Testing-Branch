(function () {
	'use strict';

	var moduleName = 'basics.site';

	angular.module(moduleName).controller('basicsSiteController', BasicsSiteController);

	BasicsSiteController.$inject = ['$scope', 'platformMainControllerService', 'basicsSiteMainService',
		'basicsSiteTranslationService'];

	function BasicsSiteController($scope, platformMainControllerService, basicsSiteMainService, basicsSiteTranslationService) {
		var options = {search: true, reports: false, auditTrail: 'a0b5cea0981f4424a2d779d2b985d3a7'};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsSiteMainService,
			{}, basicsSiteTranslationService, moduleName, options);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(basicsSiteMainService, sidebarReports, basicsSiteTranslationService, options);
		});
	}
})();
