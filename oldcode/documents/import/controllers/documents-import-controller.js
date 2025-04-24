(function (angular) {
	'use strict';

	var moduleName = 'documents.import';

	/**
	 *
	 */
	angular.module(moduleName).controller('documentsImportController',
		[
			'$scope',
			'platformMainControllerService',
			'documentsImportTranslationService',
			'documentImportDataService',
			'documentsImportWizardService',
			function (
				$scope,
				platformMainControllerService,
				documentImportTranslationService,
				documentImportDataService,
				documentsImportWizardService) {

				var opt = {search: false, reports: false};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, documentImportDataService, {}, documentImportTranslationService, moduleName, opt);

				documentsImportWizardService.active();
				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(documentImportDataService, sidebarReports, documentImportTranslationService, opt);
				});
			}
		]);
})(angular);
