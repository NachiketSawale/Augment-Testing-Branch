(function () {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';

	angular.module(moduleName).controller('productionplanningProducttemplateController', Controller);

	Controller.$inject = ['$scope',
		'platformMainControllerService',
		'productionplanningProducttemplateMainService',
		'productionplanningProducttemplateTranslationService',
		'ppsDocumentReportService'];

	function Controller($scope,
						platformMainControllerService,
						dataServ,
						translationServ,
						ppsDocumentReportService) {
		var options = {search: true, reports: false};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, dataServ, {}, translationServ, moduleName, options);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			platformMainControllerService.unregisterCompletely(dataServ, sidebarReports, translationServ, options);
		});
	}
})();
