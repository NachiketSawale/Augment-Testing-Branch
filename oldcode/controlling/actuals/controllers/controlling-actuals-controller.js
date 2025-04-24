/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.actuals';

	/**
	 * @ngdoc controller
	 * @name controllingActualsController
	 * @function
	 *
	 * @description
	 * Main controller for the controlling.actuals module
	 **/
	angular.module(moduleName).controller('controllingActualsController',
		['$scope', 'globals', 'platformMainControllerService', 'controllingActualsCostHeaderListService','controllingActualsTranslationService', 'platformNavBarService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, globals, platformMainControllerService, controllingActualsCostHeaderListService,controllingActualsTranslationService, platformNavBarService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: true, reports: false, auditTrail: '262cd0c067d8480e94ea07acf0fafbb5'};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, controllingActualsCostHeaderListService,
					{}, controllingActualsTranslationService, moduleName, opt);
				// loads or updates translated strings
				function loadTranslations() {
					$scope.translate = controllingActualsTranslationService.getTranslate();
				}

				// register translation changed event
				controllingActualsTranslationService.registerUpdates(loadTranslations);

				$scope.$on('$destroy', function () {
					controllingActualsTranslationService.unregisterUpdates();
					platformNavBarService.clearActions();

					platformMainControllerService.unregisterCompletely(controllingActualsCostHeaderListService,
						sidebarReports, controllingActualsTranslationService, opt);
				});
			}]);
})();
