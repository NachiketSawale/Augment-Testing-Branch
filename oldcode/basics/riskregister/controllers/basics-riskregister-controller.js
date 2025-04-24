/*
 * Created by salopek on 26.09.2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.riskregister';
	/*global globals,angular,_*/
	/**
     * @ngdoc controller
     * @name basicsRiskregisterController
     * @function
     *
     * @description
     * Main controller for the basics.riskregister module
     **/

	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsRiskregisterController',
		['$scope', 'platformMainControllerService', 'platformNavBarService', 'basicsRiskRegisterDataService',  'basicsRiskRegisterTranslationService',
			function ($scope, platformMainControllerService, platformNavBarService, basicsRiskRegisterDataService, basicsRiskRegisterTranslationService) {
				$scope.path = globals.appBaseUrl;
				var options = { search: false, reports: false };
				var configObject = {};

				var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsRiskRegisterDataService, configObject, basicsRiskRegisterTranslationService, moduleName, options);

				// loads or updates translated strings
				function loadTranslations() {
					$scope.translate = basicsRiskRegisterTranslationService.getTranslate();
				}

				// register translation changed event
				basicsRiskRegisterTranslationService.registerUpdates(loadTranslations);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					basicsRiskRegisterTranslationService.unregisterUpdates();
					//platformNavBarService.clearActions();
					platformMainControllerService.unregisterCompletely(basicsRiskRegisterDataService, sidebarReports, basicsRiskRegisterTranslationService, options);
				});
			}
		]);
})(angular);
