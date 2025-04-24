/**
 * Created by sandu on 09.06.2015.
 */
(function () {

	'use strict';

	var moduleName = 'basics.reporting';

	/**
	 * @ngdoc controller
	 * @name basicsReportingController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.reporting module
	 **/

	angular.module(moduleName).controller('basicsReportingController', basicsReportingController);

	basicsReportingController.$inject = ['$scope', 'basicsReportingMainReportService', 'platformMainControllerService', 'basicsReportingTranslationService', 'cloudDesktopSidebarService'];

	function basicsReportingController($scope, basicsReportingMainService, platformMainControllerService, basicsReportingTranslationService, sidebarService) {

		var opt = {search: true, reports: false};
		var ctrlProxy = {};
		var environment = platformMainControllerService.registerCompletely($scope, basicsReportingMainService, ctrlProxy, basicsReportingTranslationService, moduleName, opt);

		var loadReportList = function (){
			basicsReportingMainService.load();
		};
		sidebarService.onAutoFilterLoaded.register(loadReportList);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = basicsReportingTranslationService.getTranslate();
		}

		// register translation changed event
		basicsReportingTranslationService.registerUpdates(loadTranslations);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			basicsReportingTranslationService.unregisterUpdates(loadTranslations);
			platformMainControllerService.unregisterCompletely(basicsReportingMainService, environment, basicsReportingTranslationService, opt);
			sidebarService.onAutoFilterLoaded.unregister(loadReportList);

		});
	}
})();
