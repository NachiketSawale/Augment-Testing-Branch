/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'project.material';
	/**
	 * @ngdoc controller
	 * @name projectMaterialMainController
	 * @description main controller for the project material
	 */

	angular.module(moduleName).controller('projectMaterialMainController', ['$scope', 'projectMaterialMainService', 'platformNavBarService', 'projectMaterialTranslationService', 'platformMainControllerService', 'projectMaterialPriceConditionServiceNew',

		function ($scope, projectMaterialMainService, platformNavBarService, projectMaterialTranslationService, platformMainControllerService, projectMaterialPriceConditionService) {

			$scope.path = globals.appBaseUrl;

			let options = { search: true, reports: false };
			let sidebarReports = platformMainControllerService.registerCompletely($scope, projectMaterialMainService, {}, projectMaterialTranslationService, globals.appBaseUrl + moduleName, options);

			projectMaterialPriceConditionService.doInit();

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(projectMaterialMainService, sidebarReports, projectMaterialTranslationService, options);
			});
		}
	]);
})(angular);