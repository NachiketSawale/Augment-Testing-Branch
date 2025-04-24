/*
 * $Id: logistic-cardtemplate-controller.js 538155 2019-03-20 14:37:05Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	angular.module(moduleName).controller('logisticCardtemplateController',
		['$scope', 'platformMainControllerService', 'logisticCardTemplateDataService',
			'logisticCardTemplateTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, logisticCardTemplateDataService,
				logisticCardTemplateTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticCardTemplateDataService, mc, logisticCardTemplateTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(logisticCardTemplateDataService, sidebarReports, logisticCardTemplateTranslationService, opt);
				});
			}]);
})();
