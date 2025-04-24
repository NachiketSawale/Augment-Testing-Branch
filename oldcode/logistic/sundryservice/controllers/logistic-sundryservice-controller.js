/**
 * Created by baf on 02.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc controller
	 * @name logisticSundryserviceController
	 * @function
	 *
	 * @description
	 * Main controller of logistic sundryservice module.
	 **/

	angular.module(moduleName).controller('logisticSundryserviceController', LogisticSundryServiceController);

	LogisticSundryServiceController.$inject = ['$scope', 'platformMainControllerService', 'platformNavBarService', 'logisticSundryServiceDataService', 'logisticSundryServiceTranslationService'];

	function LogisticSundryServiceController($scope, platformMainControllerService, platformNavBarService, logisticSundryServiceDataService, logisticSundryServiceTranslationService) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticSundryServiceDataService, configObject, logisticSundryServiceTranslationService, 'logistic.sundryservice', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = logisticSundryServiceTranslationService.getTranslate();
		}

		// register translation changed event
		logisticSundryServiceTranslationService.registerUpdates(loadTranslations);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			logisticSundryServiceTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(logisticSundryServiceDataService, sidebarReports, logisticSundryServiceTranslationService, options);
		});
	}

})(angular);