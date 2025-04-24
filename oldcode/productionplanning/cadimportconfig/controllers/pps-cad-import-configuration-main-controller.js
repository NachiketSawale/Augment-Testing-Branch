(function () {
	'use strict';

	var moduleName = 'productionplanning.cadimportconfig';

	angular.module(moduleName).controller('productionplanningCadimportconfigController', MainController);

	MainController.$inject = ['$scope', 'platformMainControllerService',
		'ppsCadImportConfigurationTranslationService', 'ppsEngineeringCadImportConfigDataService'];

	function MainController($scope, platformMainControllerService,
							translationService, dataService) {
		var options = {search: true, reports: false};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, dataService,
			{}, translationService, moduleName, options);

		//wizardService.activate();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			//wizardService.deactivate();
			platformMainControllerService.unregisterCompletely(dataService, sidebarReports,
				translationService, options);
		});
	}
})();
