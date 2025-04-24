/**
 * Created by baf on 29.01.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingController
	 * @function
	 *
	 * @description
	 * Main controller of logistic dispatching module.
	 **/

	angular.module(moduleName).controller('logisticDispatchingController', LogisticDispatchingController);

	LogisticDispatchingController.$inject = ['$scope', 'platformMainControllerService', 'platformNavBarService', 'logisticDispatchingHeaderDataService',
		'logisticDispatchingTranslationService', 'logisticDispatchingDocumentsProjectService', 'logisticDispatchingHeaderPoolVerification'];

	function LogisticDispatchingController($scope, platformMainControllerService, platformNavBarService, logisticDispatchingHeaderDataService,
		logisticDispatchingTranslationService, logisticDispatchingDocumentsProjectService, logisticDispatchingHeaderPoolVerification) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticDispatchingHeaderDataService, configObject, logisticDispatchingTranslationService, 'logistic.dispatching', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = logisticDispatchingTranslationService.getTranslate();
		}

		// register translation changed event
		logisticDispatchingTranslationService.registerUpdates(loadTranslations);
		logisticDispatchingHeaderPoolVerification.startVerification(logisticDispatchingHeaderDataService);

		// register documents project
		logisticDispatchingDocumentsProjectService.register();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			logisticDispatchingHeaderPoolVerification.stopVerification(logisticDispatchingHeaderDataService);
			logisticDispatchingTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			logisticDispatchingDocumentsProjectService.unRegister();
			platformMainControllerService.unregisterCompletely(logisticDispatchingHeaderDataService, sidebarReports, logisticDispatchingTranslationService, options);
		});
	}

})(angular);