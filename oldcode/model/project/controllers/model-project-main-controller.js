/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'model.project';

	angular.module(moduleName).controller('modelProjecttMainController',
		['$scope', 'platformMainControllerService', 'modelProjectModelDataService', 'modelProjectMainTranslationService',
			function ($scope, platformMainControllerService, modelProjectModelDataService, modelProjectMainTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: true, reports: true};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, modelProjectModelDataService, mc, modelProjectMainTranslationService, moduleName, opt);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(modelProjectModelDataService, sidebarReports, modelProjectMainTranslationService, opt);
				});
			}
		]);
})(angular);
