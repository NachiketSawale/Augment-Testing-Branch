/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'mtwo.chatbot';

	angular.module(moduleName).controller('mtwoChatbotController',
		['$scope', 'platformMainControllerService', 'mtwoChatBotHeaderDataService', 'mtwoChatBotTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, mtwoChatBotHeaderDataService, mtwoChatBotTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: true, reports: true, wizards: true};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, mtwoChatBotHeaderDataService, mc, mtwoChatBotTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(mtwoChatBotHeaderDataService, sidebarReports, mtwoChatBotTranslationService, opt);
				});
			}]);
})();
