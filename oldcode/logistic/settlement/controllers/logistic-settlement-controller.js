/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementController
	 * @function
	 *
	 * @description
	 * Main controller of logistic settlement module.
	 **/

	angular.module(moduleName).controller('logisticSettlementController', LogisticSettlementController);

	LogisticSettlementController.$inject = ['$scope', 'platformMainControllerService', 'platformNavBarService', 'logisticSettlementDataService', 'logisticSettlementTranslationService', 'logisticSettlementDocumentsProjectService'];

	function LogisticSettlementController($scope, platformMainControllerService, platformNavBarService, logisticSettlementDataService, logisticSettlementTranslationService, logisticSettlementDocumentsProjectService) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticSettlementDataService, configObject, logisticSettlementTranslationService, 'logistic.settlement', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = logisticSettlementTranslationService.getTranslate();
		}

		// register translation changed event
		logisticSettlementTranslationService.registerUpdates(loadTranslations);

		//register documents project
		logisticSettlementDocumentsProjectService.register();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			logisticSettlementTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			logisticSettlementDocumentsProjectService.unRegister();
			platformMainControllerService.unregisterCompletely(logisticSettlementDataService, sidebarReports, logisticSettlementTranslationService, options);
		});
	}

})(angular);