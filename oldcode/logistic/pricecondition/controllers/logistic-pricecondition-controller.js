/**
 * Created by baf on 28.02.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceconditionController
	 * @function
	 *
	 * @description
	 * Main controller of logistic pricecondition module.
	 **/

	angular.module(moduleName).controller('logisticPriceconditionController', LogisticPriceconditionController);

	LogisticPriceconditionController.$inject = ['$scope', 'platformMainControllerService', 'platformNavBarService', 'logisticPriceConditionDataService', 'logisticPriceConditionTranslationService'];

	function LogisticPriceconditionController($scope, platformMainControllerService, platformNavBarService, logisticPriceConditionDataService, logisticPriceConditionTranslationService) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticPriceConditionDataService, configObject, logisticPriceConditionTranslationService, 'logistic.pricecondition', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = logisticPriceConditionTranslationService.getTranslate();
		}

		// register translation changed event
		logisticPriceConditionTranslationService.registerUpdates(loadTranslations);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			logisticPriceConditionTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(logisticPriceConditionDataService, sidebarReports, logisticPriceConditionTranslationService, options);
		});
	}

})(angular);