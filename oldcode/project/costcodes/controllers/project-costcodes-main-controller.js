/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'project.costcodes';
	/**
	 * @ngdoc controller
	 * @name projectCostCodesMainController
	 * @description main controller for the project costcodes
	 */

	angular.module(moduleName).controller('projectCostCodesMainController', ['$scope', 'projectCostCodesMainService', 'platformNavBarService', 'projectCostCodesTranslationService', 'platformMainControllerService',

		function ($scope, projectCostCodesMainService, platformNavBarService, projectCostCodesTranslationService, platformMainControllerService) {

			$scope.path = globals.appBaseUrl;

			let options = { search: true, reports: false };
			let sidebarReports = platformMainControllerService.registerCompletely($scope, projectCostCodesMainService, {}, projectCostCodesTranslationService, globals.appBaseUrl + moduleName, options);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(projectCostCodesMainService, sidebarReports, projectCostCodesTranslationService, options);
			});
		}
	]);
})(angular);