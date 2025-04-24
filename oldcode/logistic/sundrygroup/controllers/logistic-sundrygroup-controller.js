/**
 * Created by baf on 08.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc controller
	 * @name sundryServicegroupController
	 * @function
	 *
	 * @description
	 * Main controller of sundry servicegroup module.
	 **/

	angular.module(moduleName).controller('logisticSundrygroupController', LogisticSundrygroupController);

	LogisticSundrygroupController.$inject = ['$scope', 'platformMainControllerService', 'platformNavBarService', 'logisticSundryLookupService', 'logisticSundryServiceGroupDataService', 'logisticSundryServiceGroupTranslationService'];

	function LogisticSundrygroupController($scope, platformMainControllerService, platformNavBarService, logisticSundryLookupService, logisticSundryServiceGroupDataService, logisticSundryServiceGroupTranslationService) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticSundryServiceGroupDataService, configObject, logisticSundryServiceGroupTranslationService, 'logistic.sundrygroup', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = logisticSundryServiceGroupTranslationService.getTranslate();
		}

		// reload lookup data when user enters the module
		logisticSundryLookupService.reload();

		// register translation changed event
		logisticSundryServiceGroupTranslationService.registerUpdates(loadTranslations);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			logisticSundryServiceGroupTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(logisticSundryServiceGroupDataService, sidebarReports, logisticSundryServiceGroupTranslationService, options);
		});
	}

})(angular);