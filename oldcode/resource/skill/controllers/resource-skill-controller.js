/*
 * $Id: resource-skill-controller.js 532661 2019-02-05 14:26:28Z henkel $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'resource.skill';

	angular.module(moduleName).controller('resourceSkillController',
		['$scope', 'platformMainControllerService', 'resourceSkillDataService',
			'resourceSkillTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, resourceSkillDataService,
				resourceSkillTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceSkillDataService, mc, resourceSkillTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(resourceSkillDataService, sidebarReports, resourceSkillTranslationService, opt);
				});
			}]);
})();
