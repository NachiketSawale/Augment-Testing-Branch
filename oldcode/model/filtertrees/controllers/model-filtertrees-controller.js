/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.filtertrees';

	angular.module(moduleName).controller('modelFiltertreesController',
		['$scope', 'platformMainControllerService', 'modelFiltertreesMainEntityNameDataService',
			'modelFiltertreesTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, modelFiltertreesMainEntityNameDataService,
			          modelFiltertreesTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: false, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, modelFiltertreesMainEntityNameDataService, mc, modelFiltertreesTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(modelFiltertreesMainEntityNameDataService, sidebarReports, modelFiltertreesTranslationService, opt);
				});
			}]);
})();
