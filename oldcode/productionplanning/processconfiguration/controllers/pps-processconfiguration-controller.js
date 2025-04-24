
(function () {
	'use strict';
	const moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('productionplanningProcessconfigurationController', ProcessConfigurationMainController);

	ProcessConfigurationMainController.$inject = [
		'$scope', 'platformMainControllerService',
		'productionplanningProcessConfigurationProcessTemplateDataService',
		'productionplanningProcessConfigurationTranslationService'];

	function ProcessConfigurationMainController(
		$scope, platformMainControllerService,
		processTemplateDataService,
		translationService) {
		let options = { search: true, reports: true };
		let sidebarReports = platformMainControllerService.registerCompletely($scope, processTemplateDataService, {}, translationService, moduleName, options);

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(processTemplateDataService, sidebarReports, translationService, options);
		});
	}
})();
