/**
 * Created by anl on 6/5/2019.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).controller('productionplanningEventconfigurationController', EventConfigurationMainController);

	EventConfigurationMainController.$inject = ['$scope', 'platformMainControllerService',
		'productionplanningEventconfigurationTranslationService', 'productionplanningEventconfigurationSequenceDataService'];

	function EventConfigurationMainController($scope, platformMainControllerService,
									  translationService, eventconfigurationDataService) {
		var options = {search: true, reports: false};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, eventconfigurationDataService,
			{}, translationService, moduleName, options);

		//wizardService.activate();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			//wizardService.deactivate();
			eventconfigurationDataService.unRegisterFilter();
			platformMainControllerService.unregisterCompletely(eventconfigurationDataService, sidebarReports,
				translationService, options);
		});
	}
})();
