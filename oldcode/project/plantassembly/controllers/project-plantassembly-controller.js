/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'project.plantassembly';
	/* global globals */

	angular.module(moduleName).controller('projectPlantAssemblyController',
		['$scope', 'platformMainControllerService', 'projectPlantAssemblyTranslationService',

			function ($scope, projectPlantAssemblyMainService, platformNavBarService, projectPlantAssemblyTranslationService, platformMainControllerService) {

				$scope.path = globals.appBaseUrl;

				let options = { search: true, reports: false };
				let sidebarReports = platformMainControllerService.registerCompletely($scope, projectPlantAssemblyMainService, {}, projectPlantAssemblyTranslationService, globals.appBaseUrl + moduleName, options);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(projectPlantAssemblyMainService, sidebarReports, projectPlantAssemblyTranslationService, options);
				});
			}
		]);
})(angular);